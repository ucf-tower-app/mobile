import { useNavigation } from '@react-navigation/native';
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
  Spinner,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import Post from '../../components/media/Post';
import { useSignedInUserQuery } from '../../utils/hooks';
import { constructPageData } from '../../xplat/queries';
import {
  extractNext,
  getIQParams_AllPosts,
  getInitialPageParam,
} from '../../xplat/queries/feed';
import { Post as PostObj } from '../../xplat/types';

type ActiveFeed = 'none' | 'all' | 'following';

type HeaderProps = {
  activeFeed: ActiveFeed;
  setActiveFeed: (newActiveFeed: ActiveFeed) => void;
};
const Header = ({ activeFeed, setActiveFeed }: HeaderProps) => {
  const navigation = useNavigation();

  if (activeFeed === 'none')
    return (
      <Box>
        <Button onPress={() => setActiveFeed('following')}>Enable</Button>
      </Box>
    );

  return (
    <VStack>
      <View mt={1} />
      <HStack w="full" alignContent={'center'} justifyContent={'center'}>
        <Button
          variant={activeFeed === 'all' ? 'solid' : 'outline'}
          rounded="full"
          onPress={() => setActiveFeed('all')}
        >
          Anyone
        </Button>
        <Button
          variant={activeFeed === 'following' ? 'solid' : 'outline'}
          rounded="full"
          ml={3}
          onPress={() => setActiveFeed('following')}
        >
          Following
        </Button>
        <Button
          variant="outline"
          rounded="full"
          ml={3}
          onPress={() =>
            navigation.navigate('Tabs', {
              screen: 'HomeTab',
              params: {
                screen: 'CreatePost',
                params: {},
              },
            })
          }
        >
          Post
        </Button>
      </HStack>
      <Divider mt={1} mb={1} orientation="horizontal" />
    </VStack>
  );
};

type EmptyListProps = {
  isLoading: boolean;
};
const EmptyList = ({ isLoading }: EmptyListProps) => {
  if (isLoading) {
    return (
      <Center w="full" mt="1/2">
        <Spinner size="lg" />
      </Center>
    );
  } else {
    return (
      <Center w="full" mt="1/2">
        <VStack>
          <Center>
            <Icon as={Ionicons} name="home-sharp" size="6xl" />
          </Center>
          <Text fontSize="lg">No posts.</Text>
        </VStack>
      </Center>
    );
  }
};

type ItemProps = {
  item: PostObj;
};
const Item = ({ item }: ItemProps) => {
  return (
    <Box my={2}>
      <Post post={item} />
    </Box>
  );
};

const HomeFeed = () => {
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');
  const userQuery = useSignedInUserQuery();

  const [activeFeed, setActiveFeed] = useState<ActiveFeed>(
    process.env.NODE_ENV === 'development' ? 'none' : 'all'
  );

  const allPostsIQ = useInfiniteQuery({
    ...getIQParams_AllPosts(),
    enabled: activeFeed === 'all',
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
    enabled: activeFeed === 'following',
  });

  const [allPosts, setAllPosts] = useState<PostObj[]>([]);
  const [followingPosts, setFollowingPosts] = useState<PostObj[]>([]);

  useEffect(() => {
    if (allPostsIQ.data !== undefined)
      setAllPosts(
        allPostsIQ.data.pages.flatMap((page) =>
          constructPageData(PostObj, page)
        )
      );
    else setAllPosts([]);
  }, [allPostsIQ.data]);

  useEffect(() => {
    if (followingPostsIQ.data !== undefined)
      setFollowingPosts(
        followingPostsIQ.data.pages.flatMap((page) => page.result)
      );
    else setFollowingPosts([]);
  }, [followingPostsIQ.data]);

  const getNextPosts = () => {
    if (activeFeed === 'all') {
      if (allPostsIQ.hasNextPage) allPostsIQ.fetchNextPage();
    } else if (activeFeed === 'following') {
      if (followingPostsIQ.hasNextPage) followingPostsIQ.fetchNextPage();
    }
  };

  if (activeFeed === 'none')
    return (
      <Box>
        <Button onPress={() => setActiveFeed('following')}>Enable</Button>
      </Box>
    );

  return (
    <FlatList
      bgColor={baseBgColor}
      ListHeaderComponent={
        <Header activeFeed={activeFeed} setActiveFeed={setActiveFeed} />
      }
      initialNumToRender={1}
      data={activeFeed === 'all' ? allPosts : followingPosts}
      ListEmptyComponent={
        <EmptyList
          isLoading={
            activeFeed === 'all'
              ? allPostsIQ.isLoading
              : followingPostsIQ.isLoading
          }
        />
      }
      onEndReached={getNextPosts}
      ItemSeparatorComponent={Divider}
      renderItem={Item}
      keyExtractor={(item) => item.getId()}
    />
  );
};

export default HomeFeed;
