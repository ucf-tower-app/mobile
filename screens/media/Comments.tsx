import {
  Box,
  Center,
  ScrollView,
  Spinner,
  useColorModeValue,
  Text,
  Divider,
} from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { NativeScrollEvent } from 'react-native';
import { useInfiniteQuery, useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { queryClient } from '../../App';
import Comment from '../../components/media/Comment';
import CommentTextInput from '../../components/media/CommentTextInput';
import { userAtom, userPermissionLevelAtom } from '../../utils/atoms';
import { permissionLevelCanWrite } from '../../utils/permissions';
import { TabGlobalScreenProps } from '../../utils/types';
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

    // Filters out media that shouldn't be shown and updates state
    const readAndFilterComments = async () => {
      let _comments = commentsQuery.data.pages.flatMap((page) =>
        constructPageData(CommentObj, page)
      );

      // Get the data, so that `exists` is properly mapped for cache-invalidated data
      await Promise.all(_comments.map((comment) => comment.getData()));

      // Filter out the bad data
      const shouldBeOmittedResults = await Promise.all(
        _comments.map(
          (comment) => !comment.exists || comment.checkShouldBeHidden()
        )
      );

      _comments = _comments.filter(
        (_, index) => !shouldBeOmittedResults[index]
      );

      setComments(_comments);
    };

    readAndFilterComments();
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
    if (user === undefined) return;

    setIsPostingComment(true);

    await postQuery.data.postObject.addComment(user, comment);

    queryClient.invalidateQueries({
      queryKey: ['comments', postDocRefId],
    });

    setIsPostingComment(false);
  };

  return (
    <Box w="full" h="full" bg={baseBgColor}>
      {permissionLevelCanWrite(userPermissionLevel) ? (
        <CommentTextInput
          onSubmitComment={postComment}
          isLoading={isPostingComment}
        />
      ) : null}
      <ScrollView
        onScroll={({ nativeEvent }) => {
          if (commentsQuery.hasNextPage && isCloseToBottom(nativeEvent)) {
            loadNextComments();
          }
        }}
        scrollEventThrottle={1000}
      >
        {comments.length === 0 ? (
          <Center mt={4}>
            <Text color="gray.500">Nothing here yet...!</Text>
          </Center>
        ) : (
          comments.map((commentObj, index) => (
            <Box key={commentObj.getId()}>
              <Comment comment={commentObj} />
              {index < comments.length - 1 ? <Divider /> : null}
            </Box>
          ))
        )}
        {commentsQuery.hasNextPage ? (
          <Center mt={4}>
            <Spinner size="lg" />
          </Center>
        ) : null}
      </ScrollView>
    </Box>
  );
};

export default Comments;
