import {
  Button,
  Center,
  HStack,
  Spinner,
  useColorModeValue,
  VStack,
} from 'native-base';
import { useState } from 'react';
import { useQuery } from 'react-query';
import FollowList from '../../components/profile/FollowList';
import { TabGlobalScreenProps } from '../../utils/types';
import { User } from '../../xplat/types';

type UserTab = 'followers' | 'following';

/**
 * This screen displays the followers and following lists of
 * a user.
 */
const Follows = ({ route }: TabGlobalScreenProps<'Follows'>) => {
  const userDocRefId = route.params.userDocRefId;

  const [tabViewed, setTabViewed] = useState<UserTab>('followers');

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  const { isLoading, isError, data, error } = useQuery(
    userDocRefId,
    User.buildFetcherFromDocRefId(userDocRefId)
  );

  if (isLoading) {
    return (
      <Center pt={4}>
        <Spinner size="lg" />
      </Center>
    );
  }

  if (isError || data === undefined) {
    console.error(error);
    return null;
  }

  const getFollowsComponent = () => (
    <Center w="full" bgColor={baseBgColor} p="2">
      <VStack w="full">
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

  return (
    <FollowList
      userTab={tabViewed}
      fetchedUser={data}
      getTopComponent={getFollowsComponent}
    />
  );
};

export default Follows;
