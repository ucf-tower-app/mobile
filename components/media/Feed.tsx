import {
  Center,
  Divider,
  ScrollView,
  Spinner,
  VStack,
  useColorModeValue,
} from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { NativeScrollEvent } from 'react-native';
import { Cursor, Post as PostObj } from '../../xplat/types/types';
import Post from './Post';

const POST_STRIDE = 3;

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

/**
 * A feed of posts. The posts are pulled in strides of POST_STRIDE from the
 * postsCursor, and the callee can provide an optional component to place on top.
 * New feed items are only loaded when the user is within 20 pixels of the bottom of
 * the screen.
 */
type Props = {
  postsCursor: Cursor<PostObj>;
  topComponent?: JSX.Element;
};
const Feed = ({ postsCursor, topComponent }: Props) => {
  const [posts, setPosts] = useState<PostObj[]>([]);
  const [isOutOfPosts, setIsOutOfPosts] = useState<boolean>(false);

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  const loadNextPosts = useCallback(async () => {
    if (isOutOfPosts) return;
    const newPosts = [];
    while (newPosts.length < POST_STRIDE) {
      if (await postsCursor.hasNext()) {
        newPosts.push(await postsCursor.pollNext());
      } else {
        setIsOutOfPosts(true);
        break;
      }
    }
    setPosts([...posts, ...newPosts]);
  }, [isOutOfPosts, posts, postsCursor]);

  useEffect(() => {
    loadNextPosts();
  }, [loadNextPosts]);

  return (
    <ScrollView
      w="full"
      bg={baseBgColor}
      onScroll={({ nativeEvent }) => {
        if (!isOutOfPosts && isCloseToBottom(nativeEvent)) {
          loadNextPosts();
        }
      }}
      scrollEventThrottle={1000}
    >
      <Center w="full">
        {topComponent}
        <VStack w="full">
          {posts?.map((post, index) => {
            return (
              <VStack key={post.getId()} pt={4}>
                <Post post={post} />
                {index < posts.length - 1 ? <Divider /> : null}
              </VStack>
            );
          })}
          {!isOutOfPosts ? (
            <Center pt={4}>
              <Spinner size="lg" />
            </Center>
          ) : null}
        </VStack>
      </Center>
    </ScrollView>
  );
};

export default Feed;
