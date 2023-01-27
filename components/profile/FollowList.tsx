import {
  ScrollView,
  VStack,
  Center,
  Spinner,
  useColorModeValue,
  Box,
  Divider,
} from 'native-base';
import { useEffect, useState } from 'react';
import { NativeScrollEvent } from 'react-native';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../../utils/atoms';
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
 * A feed of posts. The posts are pulled in strides of POST_STRIDE from the
 * postsCursor, and the callee can provide an optional component to place on top.
 * New feed items are only loaded when the user is within 20 pixels of the bottom of
 * the screen.
 */
type Props = {
  userCursor: QueryCursor<User> | ArrayCursor<User>;
  topComponent?: JSX.Element;
  navigation: any;
};
const FollowList = ({ userCursor, topComponent, navigation }: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isOutOfUsers, setIsOutOfUsers] = useState<boolean>(false);
  const signedInUser = useRecoilValue(userAtom);

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  const loadNextUsers = async (base: User[], outOfUsers: boolean) => {
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
  };

  useEffect(() => {
    setUsers([]);
    setIsOutOfUsers(false);
    loadNextUsers([], false);
  }, [userCursor]);

  const navigateToUserProfile = (
    signedInUsername: string | undefined,
    username: string | undefined
  ) => {
    if (signedInUsername !== undefined && signedInUsername === username) {
      navigation.push('MyProfile');
    } else {
      navigation.push('UserProfile', { username: username });
    }
  };

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
                <Box>
                  <Box py="3">
                    <UserRow
                      user={user}
                      navigate={() =>
                        navigateToUserProfile(
                          signedInUser?.username,
                          user.username
                        )
                      }
                    />
                  </Box>
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
