import { Divider, FlatList, Text, useColorModeValue } from 'native-base';
import { useEffect, useState } from 'react';
import { FetchedUser, User } from '../../xplat/types';
import UserTag from './UserTag';

/**
 * Similar to a feed of posts. This displays a list of users for a Follow
 * list and is loaded with a stride of 5. Clicking a user will navigate
 * to the user's profile.
 */
type Props = {
  userTab: 'followers' | 'following';
  fetchedUser: FetchedUser;
  getTopComponent?: () => JSX.Element;
};
const FollowList = ({ userTab, fetchedUser, getTopComponent }: Props) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (userTab === 'followers') {
      setUsers(fetchedUser.followersList);
    } else {
      setUsers(fetchedUser.followingList);
    }
  }, [fetchedUser.followersList, fetchedUser.followingList, userTab]);

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  const renderDivider = () => <Divider mt={2} mb={2} />;
  const renderEmptyComponent = () => <Text>There's nothing here!</Text>;

  return (
    <FlatList
      bg={baseBgColor}
      data={users}
      ListHeaderComponent={getTopComponent}
      ItemSeparatorComponent={renderDivider}
      renderItem={({ item }) => <UserTag userDocRefId={item.getId()} />}
      keyExtractor={(item) => item.getId()}
      ListEmptyComponent={renderEmptyComponent}
    />
  );
};

export default FollowList;
