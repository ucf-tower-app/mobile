import {
  Box,
  Center,
  ScrollView,
  Spinner,
  useColorModeValue,
  Text,
  Divider,
  useToast,
  FlatList,
} from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { NativeScrollEvent } from 'react-native';
import { useInfiniteQuery, useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { queryClient } from '../../App';
import Comment from '../../components/media/Comment';
import CommentTextInput from '../../components/media/CommentTextInput';
import { userAtom, userPermissionLevelAtom } from '../../utils/atoms';
import { useGenericErrorToast } from '../../utils/hooks';
import { permissionLevelCanWrite } from '../../utils/permissions';
import { TabGlobalScreenProps } from '../../utils/types';
import { wordFilter } from '../../utils/utils';
import { constructPageData } from '../../xplat/queries';
import { getIQParams_PostComments } from '../../xplat/queries/post';
import { Comment as CommentObj, Post } from '../../xplat/types';

const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
}: NativeScrollEvent) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

const INITIAL_COMMENTS_LOADED = 15;

const Comments = ({ route }: TabGlobalScreenProps<'Comments'>) => {
  const postDocRefId = route.params.postDocRefId;

  const user = useRecoilValue(userAtom);
  const userPermissionLevel = useRecoilValue(userPermissionLevelAtom);

  const [isPostingComment, setIsPostingComment] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentObj[]>([]);

  const toast = useToast();
  const showGenericErrorToast = useGenericErrorToast();

  const postQuery = useQuery(
    postDocRefId,
    Post.buildFetcherFromDocRefId(postDocRefId)
  );
  const commentsQuery = useInfiniteQuery(
    getIQParams_PostComments(postDocRefId)
  );

  const loadNextComments = useCallback(async () => {
    if (commentsQuery.hasNextPage && !commentsQuery.isFetchingNextPage) {
      await commentsQuery.fetchNextPage();
    }
  }, [commentsQuery]);

  useEffect(() => {
    if (commentsQuery.data === undefined) return;
    setComments(
      commentsQuery.data.pages.flatMap((page) =>
        constructPageData(CommentObj, page)
      )
    );
  }, [commentsQuery.data]);

  useEffect(() => {
    if (comments.length !== 0 && comments.length < INITIAL_COMMENTS_LOADED)
      loadNextComments();
  }, [comments, loadNextComments]);

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  if (postQuery.isLoading || commentsQuery.isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (
    postQuery.isError ||
    commentsQuery.isError ||
    postQuery.data === undefined ||
    commentsQuery.data === undefined
  ) {
    console.error(postQuery.error);
    console.error(commentsQuery.error);
    return null;
  }

  const postComment = async (comment: string) => {
    if (user === undefined) return false;

    setIsPostingComment(true);

    // Don't allow profane comment through
    if (wordFilter.isProfane(comment)) {
      toast.show({ title: 'Please use inclusive language', placement: 'top' });
      setIsPostingComment(false);
      return false;
    }

    return postQuery.data.postObject
      .addComment(user, comment)
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: ['comments', postDocRefId],
        });

        setIsPostingComment(false);
        return true;
      })
      .catch(() => {
        showGenericErrorToast;
        return false;
      });
  };

  const renderSpinner = () => {
    if (commentsQuery.hasNextPage)
      return (
        <Center mt={2}>
          <Spinner size="lg" />
        </Center>
      );
    else return null;
  };

  return (
    <FlatList
      w="full"
      h="full"
      bg={baseBgColor}
      ListHeaderComponent={
        permissionLevelCanWrite(userPermissionLevel) ? (
          <CommentTextInput
            onSubmitComment={postComment}
            isLoading={isPostingComment}
          />
        ) : null
      }
      ListEmptyComponent={
        <Center mt={4}>
          <Text color="grey">Nothing here yet...</Text>
        </Center>
      }
      data={comments}
      onEndReached={loadNextComments}
      onEndReachedThreshold={0.1}
      ListFooterComponent={renderSpinner}
      ItemSeparatorComponent={Divider}
      keyExtractor={(item) => {
        return item.getId();
      }}
      renderItem={({ item }) => <Comment comment={item} />}
    />
  );
};

export default Comments;
