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
import { useIconColor, useSignedInUserQuery } from '../../utils/hooks';
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
  const iconColor = useIconColor();

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
            <Icon as={Ionicons} name="home-sharp" size="6xl" bg={iconColor} />
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
  const [justSwitchedActiveFeed, setJustSwitchedActiveFeed] =
    useState<boolean>(false);

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

  // Keep track of if we've *just* switched the feed, so that we can intercept the render to show
  // a loading symbol while loading
  useEffect(() => {
    if (justSwitchedActiveFeed) {
      const timeout = setTimeout(() => setJustSwitchedActiveFeed(false), 80);
      return () => clearTimeout(timeout);
    }
  }, [justSwitchedActiveFeed]);

  if (activeFeed === 'none')
    return (
      <Box>
        <Button onPress={() => setActiveFeed('following')}>Enable</Button>
      </Box>
    );

  if (justSwitchedActiveFeed)
    return (
      <VStack>
        <Header activeFeed={activeFeed} setActiveFeed={setActiveFeed} />
        <EmptyList isLoading={true} />
      </VStack>
    );

  const getNextPosts = () => {
    if (activeFeed === 'all') {
      if (allPostsIQ.hasNextPage) allPostsIQ.fetchNextPage();
    } else if (activeFeed === 'following') {
      if (followingPostsIQ.hasNextPage) followingPostsIQ.fetchNextPage();
    }
  };

  return (
    <FlatList
      bgColor={baseBgColor}
      ListHeaderComponent={
        <Header
          activeFeed={activeFeed}
          setActiveFeed={(_activeFeed: ActiveFeed) => {
            setActiveFeed(_activeFeed);
            setJustSwitchedActiveFeed(true);
          }}
        />
      }
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
