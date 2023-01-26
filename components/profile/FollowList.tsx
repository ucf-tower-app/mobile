import {
  ScrollView,
  VStack,
  Center,
  Spinner,
  useColorModeValue,
  Box,
} from 'native-base';
import { useEffect, useState } from 'react';
import { NativeScrollEvent } from 'react-native';
import { QueryCursor } from '../../xplat/types/queryCursors';
import { ArrayCursor, User } from '../../xplat/types/types';
import UserRow from './UserRow';

const POST_STRIDE = 3;

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
  userCursor: QueryCursor<User> | ArrayCursor<User> | undefined;
  topComponent?: JSX.Element;
};
const FollowList = ({ userCursor, topComponent }: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isOutOfUsers, setIsOutOfUsers] = useState<boolean>(false);

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');
  console.log('in user list');

  const loadNextUsers = async () => {
    if (isOutOfUsers) return;
    const newUsers = [];
    while (newUsers.length < POST_STRIDE) {
      const newUser = await userCursor?.pollNext();
      if (newUser === undefined) {
        setIsOutOfUsers(true);
        break;
      }
      newUsers.push(newUser);
    }
    setUsers([...users, ...newUsers]);
  };

  useEffect(() => {
    console.log('in use effect');
    loadNextUsers();
  }, [userCursor]);

  return (
    <ScrollView
      w="full"
      bg={baseBgColor}
      onScroll={({ nativeEvent }) => {
        if (!isOutOfUsers && isCloseToBottom(nativeEvent)) {
          loadNextUsers();
        }
      }}
      scrollEventThrottle={1000}
    >
      <Center w="full">
        {topComponent}
        <VStack w="full">
          {users?.map((user, index) => {
            return (
              <VStack key={user.docRef!.id} pt={4}>
                <Box py="3">
                  <UserRow user={user} navigate={console.log} />
                </Box>
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
