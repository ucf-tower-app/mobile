import {
  Center,
  ScrollView,
  Spinner,
  VStack,
  useColorModeValue,
} from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { NativeScrollEvent } from 'react-native';
import { useInfiniteQuery } from 'react-query';
import { FetchedUser } from '../../utils/queries';
import {
  constructPageData,
  getIQParams_UserFollowers,
  getIQParams_UserFollowing,
} from '../../xplat/queries';
import { User } from '../../xplat/types';
import UserRow from './UserRow';

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
 * Similar to a feed of posts. This displays a list of users for a Follow
 * list and is loaded with a stride of 5. Clicking a user will navigate
 * to the user's profile.
 */
type Props = {
  userTab: 'followers' | 'following';
  fetchedUser: FetchedUser;
  topComponent?: JSX.Element;
};
const FollowList = ({ userTab, fetchedUser, topComponent }: Props) => {
  const [users, setUsers] = useState<User[]>([]);

  const followersIQ = useInfiniteQuery(
    getIQParams_UserFollowers(fetchedUser.docRefId)
  );

  const followingIQ = useInfiniteQuery(
    getIQParams_UserFollowing(fetchedUser.followingList)
  );

  useEffect(() => {
    if (userTab === 'followers') {
      if (followersIQ.data)
        setUsers(
          followersIQ.data.pages.flatMap((page) =>
            constructPageData(User, page)
          )
        );
    } else {
      if (followingIQ.data) setUsers(followingIQ.data.pages.flat());
    }
  }, [followersIQ.data, followingIQ.data, userTab]);

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  const loadNextUsers = useCallback(async () => {
    if (userTab === 'followers') {
      if (followersIQ.hasNextPage && !followersIQ.isFetchingNextPage)
        await followersIQ.fetchNextPage();
    } else {
      if (followingIQ.hasNextPage && !followingIQ.isFetchingNextPage)
        await followingIQ.fetchNextPage();
    }
  }, [followersIQ, followingIQ, userTab]);

  const hasNextPage =
    userTab === 'followers' ? followersIQ.hasNextPage : followingIQ.hasNextPage;

  return (
    <ScrollView
      w="full"
      bg={baseBgColor}
      onScroll={({ nativeEvent }) => {
        if (hasNextPage && isCloseToBottom(nativeEvent)) {
          loadNextUsers();
        }
      }}
      scrollEventThrottle={1000}
    >
      <Center w="full">
        {topComponent}
        <VStack w="full">
          {users.map((user) => {
            return (
              <VStack key={user.getId()} py="3">
                <UserRow user={user} />
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

export default FollowList;
