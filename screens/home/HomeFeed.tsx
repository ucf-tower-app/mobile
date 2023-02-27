import {
  Box,
  Button,
  Divider,
  FlatList,
  HStack,
  useColorModeValue,
} from 'native-base';
import { useEffect, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import Post, { PostSkeleton } from '../../components/media/Post';
import { useSignedInUserQuery } from '../../utils/hooks';
import { constructPageData } from '../../xplat/queries';
import {
  extractNext,
  getIQParams_AllPosts,
  getInitialPageParam,
} from '../../xplat/queries/feed';
import { Post as PostObj } from '../../xplat/types';

type activeFeed = 'none' | 'all' | 'following';

const HomeFeed = () => {
  // const signedInUser = useRecoilValue(userAtom);
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');
  const userQuery = useSignedInUserQuery();
  const [feed, setFeed] = useState<activeFeed>(
    process.env.NODE_ENV === 'development' ? 'none' : 'all'
  );
  const allPostsIQ = useInfiniteQuery({
    ...getIQParams_AllPosts(),
    enabled: feed === 'all',
  });
  const followingPostsIQ = useInfiniteQuery({
    queryKey:
      userQuery.data !== undefined
        ? ['follow-posts', userQuery.data.docRefId]
        : ['nullQuery'],
    queryFn: async ({ pageParam }) => {
      if (pageParam === undefined)
        pageParam = await getInitialPageParam(userQuery.data);
      return extractNext(pageParam);
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.hasMoreData) return lastPage.param;
      else return undefined;
    },
    enabled: feed === 'following',
  });
  const [posts, setPosts] = useState<PostObj[]>([]);

  useEffect(() => {
    if (feed === 'all') {
      if (allPostsIQ.data !== undefined) {
        setPosts(
          allPostsIQ.data.pages.flatMap((page) =>
            constructPageData(PostObj, page)
          )
        );
      } else setPosts([]);
    } else if (feed === 'following') {
      if (followingPostsIQ.data !== undefined) {
        setPosts(followingPostsIQ.data.pages.flatMap((page) => page.result));
      } else setPosts([]);
    }
  }, [allPostsIQ.data, feed, followingPostsIQ.data]);

  const hasNextPage =
    feed === 'none'
      ? false
      : feed === 'all'
      ? allPostsIQ.hasNextPage
      : followingPostsIQ.hasNextPage;

  const getNextPosts = () => {
    console.log('I need more posts!');
    if (feed === 'all') {
      if (allPostsIQ.hasNextPage) allPostsIQ.fetchNextPage();
    } else if (feed === 'following') {
      if (followingPostsIQ.hasNextPage) followingPostsIQ.fetchNextPage();
    }
  };

  const header = () => {
    if (feed === 'none')
      return (
        <Box>
          <Button onPress={() => setFeed('following')}>Enable</Button>
        </Box>
      );
    else
      return (
        <HStack>
          <Button onPress={() => setFeed('all')}>Anyone</Button>
          <Button onPress={() => setFeed('following')}>Following</Button>
        </HStack>
      );
  };

  const renderSpinner = () => {
    if (hasNextPage) return <PostSkeleton />;
    else return null;
  };

  return (
    <FlatList
      bgColor={baseBgColor}
      ListHeaderComponent={header}
      data={posts}
      onEndReached={getNextPosts}
      ItemSeparatorComponent={Divider}
      ListFooterComponent={renderSpinner}
      renderItem={({ item }) => (
        <Box my={2}>
          <Post post={item} />
        </Box>
      )}
      keyExtractor={(item) => item.getId()}
    />
  );
};

export default HomeFeed;
