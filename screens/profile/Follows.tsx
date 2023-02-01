import {
  Button,
  Center,
  HStack,
  Spinner,
  useColorModeValue,
  VStack,
} from 'native-base';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import FollowList from '../../components/profile/FollowList';
import SearchBar from '../../components/searchbar/SearchBar';
import { buildUserFetcherFromDocRefId } from '../../utils/queries';
import { TabGlobalScreenProps } from '../../utils/types';
import { ArrayCursor, QueryCursor, User } from '../../xplat/types/types';

type UserTab = 'followers' | 'following';

/**
 * This screen displays the followers and following lists of
 * a user.
 */
const Follows = ({ route }: TabGlobalScreenProps<'Follows'>) => {
  const userDocRefId = route.params.userDocRefId;

  const [user, setUser] = useState<User | undefined>(undefined);
  const [tabViewed, setTabViewed] = useState<UserTab>('followers');
  const [chosenCursor, setChosenCursor] = useState<
    ArrayCursor<User> | QueryCursor<User> | undefined
  >(undefined);

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  const { isError, data, error } = useQuery(
    userDocRefId,
    buildUserFetcherFromDocRefId(userDocRefId),
    {
      staleTime: 600000,
    }
  );

  useEffect(() => {
    if (data) setUser(data.__userObject);
  }, [data]);

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

  if (isError) {
    console.error(error);
    return null;
  }

  const followsComponent = (
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
      </VStack>
    </Center>
  );

  return chosenCursor !== undefined ? (
    <FollowList userCursor={chosenCursor} topComponent={followsComponent} />
  ) : (
    <Center pt={4}>
      <Spinner size="lg" />
    </Center>
  );
};

export default Follows;
