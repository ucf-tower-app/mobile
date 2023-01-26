import {
  Button,
  Center,
  HStack,
  Spinner,
  useColorModeValue,
  VStack,
} from 'native-base';
import { useState, useEffect } from 'react';
import { ProfileScreenNavigationProp } from '../../utils/types';
import SearchBar from '../../components/searchbar/SearchBar';
import { ArrayCursor, QueryCursor, User } from '../../xplat/types/types';
import { getUserByUsername } from '../../xplat/api';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../../utils/atoms';
import FollowList from '../../components/profile/FollowList';

type UserTab = 'followers' | 'following';

const Follows = ({
  route,
  navigation,
}: ProfileScreenNavigationProp<'Follows'>) => {
  const username = route.params.username;
  const [user, setUser] = useState<User | undefined>(undefined);
  const [tabViewed, setTabViewed] = useState<UserTab>('followers');
  const [chosenCursor, setChosenCursor] = useState<
    ArrayCursor<User> | QueryCursor<User> | undefined
  >(undefined);

  const signedInUser = useRecoilValue(userAtom);
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  useEffect(() => {
    getUserByUsername(username).then(setUser);
  }, [username]);

  useEffect(() => {
    const updateCursor = async () => {
      if (user === undefined) return;
      setChosenCursor(
        tabViewed === 'followers'
          ? user?.getFollowersCursor()
          : await user?.getFollowingCursor()
      );
    };
    updateCursor();
  }, [user, tabViewed]);

  return (
    <Center w="full" bgColor={baseBgColor} p="2">
      <VStack w="full">
        <SearchBar />
        <HStack space="1" p={1} mt={1}>
          <Button
            onPress={() => setTabViewed('followers')}
            variant={tabViewed === 'followers' ? 'solid' : 'outline'}
            rounded="full"
          >
            Followers
          </Button>
          <Button
            onPress={() => setTabViewed('following')}
            variant={tabViewed === 'following' ? 'solid' : 'outline'}
            rounded="full"
          >
            Following
          </Button>
        </HStack>
        {chosenCursor !== undefined ? (
          <FollowList userCursor={chosenCursor} />
        ) : (
          <Center pt={4}>
            <Spinner size="lg" />
          </Center>
        )}
      </VStack>
    </Center>
  );
};

export default Follows;
