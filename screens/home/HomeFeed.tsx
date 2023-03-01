import {
  Box,
  Button,
  Divider,
  FlatList,
  HStack,
  VStack,
  View,
  useColorModeValue,
  Center,
  Icon,
  Text,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
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
  const [allPosts, setAllPosts] = useState<PostObj[]>([]);
  const [followingPosts, setFollowingPosts] = useState<PostObj[]>([]);

  useEffect(() => {
    if (feed === 'all') {
      if (allPostsIQ.data !== undefined) {
        setAllPosts(
          allPostsIQ.data.pages.flatMap((page) =>
            constructPageData(PostObj, page)
          )
        );
      } else setAllPosts([]);
    } else if (feed === 'following') {
      if (followingPostsIQ.data !== undefined) {
        setFollowingPosts(
          followingPostsIQ.data.pages.flatMap((page) => page.result)
        );
      } else setFollowingPosts([]);
    }
  }, [allPostsIQ.data, feed, followingPostsIQ.data]);

  const getNextPosts = () => {
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
        <VStack>
          <View mt={1} />
          <HStack w="full" alignContent={'center'} justifyContent={'center'}>
            <Button
              variant={feed === 'all' ? 'solid' : 'outline'}
              rounded="full"
              onPress={() => setFeed('all')}
            >
              Anyone
            </Button>
            <Button
              variant={feed === 'following' ? 'solid' : 'outline'}
              rounded="full"
              ml={3}
              onPress={() => setFeed('following')}
            >
              Following
            </Button>
          </HStack>
          <Divider mt={1} mb={1} orientation="horizontal" />
        </VStack>
      );
  };

  const renderEmptyList = () => {
    return (
      <Center w="full" mt="1/2">
        <VStack>
          <Center>
            <Icon as={<Ionicons name="home-sharp" />} size="6xl" />
          </Center>
          <Text fontSize="lg">No posts.</Text>
        </VStack>
      </Center>
    );
  };

  const allPostsFeed = (
    <FlatList
      bgColor={baseBgColor}
      ListHeaderComponent={header}
      data={allPosts}
      ListEmptyComponent={renderEmptyList}
      onEndReached={getNextPosts}
      ItemSeparatorComponent={Divider}
      ListFooterComponent={
        allPostsIQ.hasNextPage || allPosts.length === 0 ? (
          <PostSkeleton />
        ) : null
      }
      renderItem={({ item }) => (
        <Box my={2}>
          <Post post={item} />
        </Box>
      )}
      keyExtractor={(item) => item.getId()}
    />
  );

  const followingPostsFeed = (
    <FlatList
      bgColor={baseBgColor}
      ListHeaderComponent={header}
      data={followingPosts}
      ListEmptyComponent={renderEmptyList}
      onEndReached={getNextPosts}
      ItemSeparatorComponent={Divider}
      ListFooterComponent={
        followingPostsIQ.hasNextPage || followingPosts.length === 0 ? (
          <PostSkeleton />
        ) : null
      }
      renderItem={({ item }) => (
        <Box my={2}>
          <Post post={item} />
        </Box>
      )}
      keyExtractor={(item) => item.getId()}
    />
  );

  return feed === 'none'
    ? header()
    : feed === 'all'
    ? allPostsFeed
    : followingPostsFeed;
};

export default HomeFeed;
