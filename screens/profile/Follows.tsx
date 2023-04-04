import { Center, HStack, Select, Spinner, Text, VStack } from 'native-base';
import { useState } from 'react';
import { useQuery } from 'react-query';
import FollowList from '../../components/profile/FollowList';
import SearchBar from '../../components/searchbar/SearchBar';
import { TabGlobalScreenProps } from '../../utils/types';
import { DebounceSession } from '../../utils/utils';
import { User } from '../../xplat/types';

type UserTab = 'followers' | 'following' | 'both';

type HeaderProps = {
  setSearchQuery: (q: string) => void;
  tabViewed: UserTab;
  setTabViewed: (tab: UserTab) => void;
};

const FollowsHeader = ({
  setSearchQuery,
  tabViewed,
  setTabViewed,
}: HeaderProps) => {
  return (
    <Center w="full" p="2">
      <VStack w="full">
        <SearchBar
          queryHandler={{
            onChangeQuery: (newQuery: string) =>
              setSearchQuery(newQuery.toLowerCase()),
            onChangeQueryDebounceSession: new DebounceSession(100),
          }}
        />
        <HStack
          space="1"
          p={1}
          mt={1}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Text>Show: </Text>
          <Select
            minWidth={'50%'}
            selectedValue={tabViewed}
            onValueChange={(value) => setTabViewed(value as UserTab)}
          >
            <Select.Item value="followers" label="Followers" />
            <Select.Item value="following" label="Following" />
            <Select.Item value="both" label="Followers + Following" />
          </Select>
        </HStack>
      </VStack>
    </Center>
  );
};

/**
 * This screen displays the followers and following lists of
 * a user.
 */
const Follows = ({ route }: TabGlobalScreenProps<'Follows'>) => {
  const userDocRefId = route.params.userDocRefId;

  const [searchQuery, setSearchQuery] = useState('');
  const [tabViewed, setTabViewed] = useState<UserTab>('followers');

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

  return (
    <FollowList
      searchQuery={searchQuery}
      userTab={tabViewed}
      fetchedUser={data}
      header={
        <FollowsHeader
          setSearchQuery={setSearchQuery}
          setTabViewed={setTabViewed}
          tabViewed={tabViewed}
        />
      }
    />
  );
};

export default Follows;
