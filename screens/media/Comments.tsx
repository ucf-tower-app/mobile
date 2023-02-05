import { useInfiniteQuery, useQuery } from 'react-query';
import { buildPostFetcherFromDocRefId } from '../../utils/queries';
import { TabGlobalScreenProps } from '../../utils/types';
import {
  Center,
  Box,
  Input,
  Spinner,
  VStack,
  HStack,
  Button,
  useColorModeValue,
} from 'native-base';
import {
  KeyboardAvoidingView,
  NativeScrollEvent,
  ScrollView,
} from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { DebounceSession } from '../../utils/utils';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../../utils/atoms';
import { getIQParams_PostComments } from '../../xplat/queries/post';
import { queryClient } from '../../App';
import Comment from '../../components/media/Comment';
import { constructPageData } from '../../xplat/queries';
import { Comment as CommentObj } from '../../xplat/types';

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

const Comments = ({ route }: TabGlobalScreenProps<'Comments'>) => {
  const postDocRefId = route.params.postDocRefId;

  const user = useRecoilValue(userAtom);

  const [newCommentDebounceSession] = useState<DebounceSession>(
    new DebounceSession(200)
  );
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [isPostingComment, setIsPostingComment] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentObj[]>([]);

  const postQuery = useQuery(
    postDocRefId,
    buildPostFetcherFromDocRefId(postDocRefId)
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

  const comment = async () => {
    if (user === undefined) return;

    setIsPostingComment(true);

    await postQuery.data.postObject.addComment(user, newCommentText);

    queryClient.invalidateQueries({
      queryKey: ['comments', postDocRefId],
    });

    setIsPostingComment(false);
    setNewCommentText('');
  };

  return (
    <VStack w="full" h="full" bg={baseBgColor}>
      <ScrollView
        onScroll={({ nativeEvent }) => {
          if (commentsQuery.hasNextPage && isCloseToBottom(nativeEvent)) {
            loadNextComments();
          }
        }}
        scrollEventThrottle={1000}
      >
        {comments.map((commentObj) => (
          <Box key={commentObj.getId()}>
            <Comment comment={commentObj} />
          </Box>
        ))}
      </ScrollView>
      <KeyboardAvoidingView>
        <HStack mt="auto" p={2} w="full">
          <Input
            placeholder="Say what's on your mind"
            onChangeText={(text) =>
              newCommentDebounceSession.trigger(() => setNewCommentText(text))
            }
            flexGrow={1}
            mr={2}
          />
          <Button
            onPress={comment}
            isDisabled={newCommentText === ''}
            isLoading={isPostingComment}
            minW={24}
          >
            Comment
          </Button>
        </HStack>
      </KeyboardAvoidingView>
    </VStack>
  );
};

export default Comments;
