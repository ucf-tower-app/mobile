import {
  Box,
  Button,
  Center,
  FlatList,
  HStack,
  useColorModeValue,
  VStack,
} from 'native-base';
import { useState, useEffect } from 'react';
import { ProfileScreenNavigationProp } from '../../utils/types';
import UserRow from '../../components/profile/UserRow';
import SearchBar from '../../components/searchbar/SearchBar';
import { ArrayCursor, QueryCursor, User } from '../../xplat/types/types';
import { getUserByUsername } from '../../xplat/api';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../../utils/atoms';
import FollowList from '../../components/profile/FollowList';

const Follows = ({
  route,
  navigation,
}: ProfileScreenNavigationProp<'Follows'>) => {
  const username = route.params.username;
  const [user, setUser] = useState<User | undefined>(undefined);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [viewFollowers, setViewFollowers] = useState<boolean>(true);
  const signedInUser = useRecoilValue(userAtom);
  const [followingCursor, setFollowingCursor] = useState<
    ArrayCursor<User> | undefined
  >(undefined);
  const [followersCursor, setFollowersCursor] = useState<
    QueryCursor<User> | undefined
  >(undefined);
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  useEffect(() => {
    const getData = async () => {
      await getUserByUsername(username).then(setUser);
      const cursor = user?.getFollowersCursor();
      setFollowersCursor(cursor);
      await user?.getFollowingCursor().then(setFollowingCursor);
    };
    getData();
    console.log('Followers screen');
  }, [username]);

  const navigationFunction = () => {
    if (signedInUser?.username === user?.username) {
      navigation.push('MyProfile');
    } else {
    }
  };

  return (
    <Center w="full" bgColor={baseBgColor} p="2">
      <VStack w="full">
        <SearchBar />
        <HStack space="1" p="1">
          <Button
            onPress={() => setViewFollowers(true)}
            variant={viewFollowers ? 'solid' : 'outline'}
            rounded="full"
          >
            Followers
          </Button>
          <Button
            onPress={() => setViewFollowers(false)}
            variant={viewFollowers ? 'outline' : 'solid'}
            rounded="full"
          >
            Following
          </Button>
        </HStack>
      </VStack>
      <FollowList userCursor={followingCursor} />
    </Center>
  );
};

export default Follows;
