import {
  Center,
  ScrollView,
  Spinner,
  VStack,
  useColorModeValue,
} from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { NativeScrollEvent } from 'react-native';
import { QueryCursor } from '../../xplat/types/queryCursors';
import { ArrayCursor, User } from '../../xplat/types/types';
import UserRow from './UserRow';

const USER_STRIDE = 5;

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
  userCursor: QueryCursor<User> | ArrayCursor<User>;
  topComponent?: JSX.Element;
};
const FollowList = ({ userCursor, topComponent }: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isOutOfUsers, setIsOutOfUsers] = useState<boolean>(false);

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  const loadNextUsers = useCallback(
    async (base: User[], outOfUsers: boolean) => {
      if (outOfUsers) return;
      const newUsers = [];
      while (newUsers.length < USER_STRIDE) {
        const newUser = await userCursor?.pollNext();
        if (newUser === undefined) {
          setIsOutOfUsers(true);
          break;
        }
        newUsers.push(newUser);
      }
      setUsers([...base, ...newUsers]);
    },
    [userCursor]
  );

  useEffect(() => {
    setUsers([]);
    setIsOutOfUsers(false);
    loadNextUsers([], false);
  }, [loadNextUsers, userCursor]);

  return (
    <ScrollView
      w="full"
      bg={baseBgColor}
      onScroll={({ nativeEvent }) => {
        if (!isOutOfUsers && isCloseToBottom(nativeEvent)) {
          loadNextUsers(users, isOutOfUsers);
        }
      }}
      scrollEventThrottle={1000}
    >
      <Center w="full">
        {topComponent}
        <VStack w="full">
          {users.map((user) => {
            return (
              <VStack key={user.docRef!.id} py="3">
                <UserRow user={user} />
              </VStack>
            );
          })}
          {!isOutOfUsers ? (
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
