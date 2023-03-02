import { Divider, FlatList, Text, useColorModeValue } from 'native-base';
import { useEffect, useState } from 'react';
import { useUserCacheMap } from '../../utils/queries';
import { FetchedUser, User } from '../../xplat/types';
import UserRow from './UserRow';

type Props = {
  searchQuery: string;
  userTab: 'followers' | 'following' | 'both';
  fetchedUser: FetchedUser;
  header?: JSX.Element;
};
const FollowList = ({ searchQuery, userTab, fetchedUser, header }: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const userCache = useUserCacheMap();

  useEffect(() => {
    let newUsers: User[] = [];
    if (userTab === 'followers') {
      newUsers = [...fetchedUser.followersList];
    } else if (userTab === 'following') {
      newUsers = [...fetchedUser.followingList];
    } else {
      newUsers = [...fetchedUser.followersList];
      const ids = new Set<string>(newUsers.map((user) => user.getId()));
      fetchedUser.followingList.forEach((user) => {
        if (!ids.has(user.getId())) newUsers.push(user);
      });
    }
    if (searchQuery === '' || userCache.data === undefined) setUsers(newUsers);
    else
      setUsers(
        newUsers.filter((user) => {
          const entry = userCache.data.get(user.getId());
          if (entry === undefined) return false;
          return entry.username.includes(searchQuery);
        })
      );
  }, [
    fetchedUser.followersList,
    fetchedUser.followingList,
    searchQuery,
    userCache.data,
    userTab,
  ]);

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  const renderDivider = () => <Divider mt={2} mb={2} />;
  const renderEmptyComponent = () => <Text>There's nothing here!</Text>;

  return (
    <FlatList
      bg={baseBgColor}
      data={users}
      ListHeaderComponent={header}
      ItemSeparatorComponent={renderDivider}
      renderItem={({ item }) => <UserRow userDocRefId={item.getId()} />}
      keyExtractor={(item) => item.getId()}
      ListEmptyComponent={renderEmptyComponent}
    />
  );
};

export default FollowList;
