import {
  Box,
  Center,
  ScrollView,
  Spinner,
  useColorModeValue,
  Divider,
} from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { NativeScrollEvent } from 'react-native';
import { useInfiniteQuery, useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { queryClient } from '../../App';
import Comment from '../../components/media/Comment';
import CommentTextInput from '../../components/media/CommentTextInput';
import { userAtom } from '../../utils/atoms';
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
      <CommentTextInput
        onSubmitComment={postComment}
        isLoading={isPostingComment}
      />
      <ScrollView
        onScroll={({ nativeEvent }) => {
          if (commentsQuery.hasNextPage && isCloseToBottom(nativeEvent)) {
            loadNextComments();
          }
        }}
        scrollEventThrottle={1000}
      >
        {comments.map((commentObj, index) => (
          <Box key={commentObj.getId()}>
            <Comment comment={commentObj} />
            {index < comments.length - 1 ? <Divider /> : null}
          </Box>
        ))}
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
