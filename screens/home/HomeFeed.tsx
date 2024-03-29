import { useNavigation } from '@react-navigation/native';
import {
  Box,
  Button,
  Divider,
  FlatList,
  VStack,
  useColorModeValue,
  Center,
  Text,
  Spinner,
  Select,
} from 'native-base';
import { useCallback, useEffect, useState } from 'react';
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
import LightDarkIcon from '../../components/util/LightDarkIcon';
import { HeaderWithPostOption } from '../../components/header/HeaderMenu';
import { useFindShouldBeFilteredIndices } from '../../utils/hooks';

type ActiveFeed = 'none' | 'all' | 'following';

type FeedSelectorProps = {
  activeFeed: ActiveFeed;
  setActiveFeed: (newActiveFeed: ActiveFeed) => void;
};
const FeedSelector = ({ activeFeed, setActiveFeed }: FeedSelectorProps) => {
  if (activeFeed === 'none')
    return (
      <Box>
        <Button onPress={() => setActiveFeed('following')}>Enable</Button>
      </Box>
    );

  return (
    <Box w={125}>
      <Select
        selectedValue={activeFeed}
        onValueChange={(_activeFeed) => {
          if (_activeFeed === activeFeed) return;
          setActiveFeed(_activeFeed as ActiveFeed);
        }}
      >
        <Select.Item label="Anyone" value="all" />
        <Select.Item label="Following" value="following" />
      </Select>
    </Box>
  );
};

type EmptyListProps = {
  isLoading?: boolean;
};
const EmptyList = ({ isLoading = false }: EmptyListProps) => {
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
            <LightDarkIcon name="home-sharp" size="6xl" />
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

  const navigation = useNavigation();

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
  const findShouldBeFilteredIndices = useFindShouldBeFilteredIndices();

  const FeedSelectorMemo = useCallback(
    () => (
      <FeedSelector
        activeFeed={activeFeed}
        setActiveFeed={(_activeFeed) => {
          setActiveFeed(_activeFeed);
          setJustSwitchedActiveFeed(true);
        }}
      />
    ),
    [activeFeed, setActiveFeed, setJustSwitchedActiveFeed]
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: HeaderWithPostOption,
      headerLeft: FeedSelectorMemo,
      headerTitleAlign: 'center',
    });
  }, [navigation, FeedSelectorMemo]);

  useEffect(() => {
    if (allPostsIQ.data !== undefined) {
      const _posts = allPostsIQ.data.pages.flatMap((page) =>
        constructPageData(PostObj, page)
      );
      findShouldBeFilteredIndices(_posts).then((shouldBeFilteredIndices) =>
        setAllPosts(
          _posts.filter((_, index) => !shouldBeFilteredIndices[index])
        )
      );
    } else setAllPosts([]);
  }, [allPostsIQ.data, findShouldBeFilteredIndices]);

  useEffect(() => {
    if (followingPostsIQ.data !== undefined) {
      const _posts = followingPostsIQ.data.pages.flatMap((page) => page.result);
      findShouldBeFilteredIndices(_posts).then((shouldBeFilteredIndices) =>
        setFollowingPosts(
          _posts.filter((_, index) => !shouldBeFilteredIndices[index])
        )
      );
    } else setFollowingPosts([]);
  }, [followingPostsIQ.data, findShouldBeFilteredIndices]);

  // Keep track of if we've *just* switched the feed, so that we can intercept the render to show
  // a loading symbol while loading
  useEffect(() => {
    if (justSwitchedActiveFeed) {
      const timeout = setTimeout(() => setJustSwitchedActiveFeed(false), 80);
      return () => clearTimeout(timeout);
    }
  }, [justSwitchedActiveFeed]);

  if (activeFeed === 'none') return <EmptyList />;
  if (justSwitchedActiveFeed) return <EmptyList isLoading />;

  const getNextPosts = () => {
    if (activeFeed === 'all') {
      if (allPostsIQ.hasNextPage) allPostsIQ.fetchNextPage();
    } else if (activeFeed === 'following') {
      if (followingPostsIQ.hasNextPage) followingPostsIQ.fetchNextPage();
    }
  };

  const renderSpinner = () => {
    if (activeFeed === 'all' && allPostsIQ.hasNextPage)
      return <Spinner size="lg" />;
    if (activeFeed === 'following' && followingPostsIQ.hasNextPage)
      return <Spinner size="lg" />;
    else return null;
  };

  return (
    <FlatList
      bgColor={baseBgColor}
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
      ListFooterComponent={renderSpinner}
      onEndReached={getNextPosts}
      ItemSeparatorComponent={Divider}
      renderItem={Item}
      keyExtractor={(item) => item.getId()}
    />
  );
};

export default HomeFeed;
