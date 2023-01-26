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
import { User } from '../../xplat/types/types';
import { getUserByUsername } from '../../xplat/api';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../../utils/atoms';

const Follows = ({
  route,
  navigation,
}: ProfileScreenNavigationProp<'Follow'>) => {
  const username = route.params.username;
  const [user, setUser] = useState<User | undefined>(undefined);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [viewFollowers, setViewFollowers] = useState<boolean>(true);
  const signedInUser = useRecoilValue(userAtom);
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  // This will cause an infinite rerender
  useEffect(() => {
    const getData = async () => {
      await getUserByUsername(username).then(setUser);
      await user?.getFollowers().then(console.log);
      await user?.getFollowing().then(console.log);
    };
    getData();
    console.log('Followers screen');
  }, [username, user, followers, following]);

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

      <FlatList
        px="3"
        w="full"
        data={viewFollowers ? followers : following}
        renderItem={({ item }) => (
          <Box py="3">
            <UserRow user={item} navigate={navigationFunction} />
          </Box>
        )}
        keyExtractor={(item, index) =>
          item.docRef ? item.docRef.id : index.toString()
        }
      />
    </Center>
  );
};

export default Follows;
