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
import { useInfiniteQuery } from 'react-query';
import { constructPageData, getIQParams_UserPosts } from '../../xplat/queries';
import { getIQParams_ForumPosts } from '../../xplat/queries/forum';
import { Post as PostObj } from '../../xplat/types';
import Post from './Post';

// const POST_STRIDE = 3;

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
  topComponent?: JSX.Element;
  userDocRefId?: string;
  forumDocRefId?: string;
  isInRouteView?: boolean;
};
const Feed = ({
  topComponent,
  userDocRefId = undefined,
  forumDocRefId = undefined,
  isInRouteView = false,
}: Props) => {
  const [posts, setPosts] = useState<PostObj[]>([]);

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      userDocRefId !== undefined
        ? getIQParams_UserPosts(userDocRefId)
        : getIQParams_ForumPosts(forumDocRefId!)
    );

  useEffect(() => {
    if (data)
      setPosts(data.pages.flatMap((page) => constructPageData(PostObj, page)));
  }, [data]);

  const loadNextPosts = useCallback(async () => {
    if (hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <ScrollView
      w="full"
      bg={baseBgColor}
      onScroll={({ nativeEvent }) => {
        if (hasNextPage && isCloseToBottom(nativeEvent)) {
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
                <Post post={post} isInRouteView={isInRouteView} />
                {index < posts.length - 1 ? <Divider /> : null}
              </VStack>
            );
          })}
          {hasNextPage ? (
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
