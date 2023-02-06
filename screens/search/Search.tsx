import {
  Button,
  Center,
  HStack,
  ScrollView,
  Text,
  useColorModeValue,
  VStack,
} from 'native-base';
import SearchBar from '../../components/searchbar/SearchBar';
import { useEffect, useState } from 'react';
import { DebounceSession } from '../../utils/utils';
import { UserSearchResult } from '../../xplat/api';
import { useSearchSubstringMatchers } from '../../utils/queries';
import UserRow from '../../components/profile/UserRow';

type SearchTab = 'routes' | 'users';

const Search = () => {
  const [query, setQuery] = useState<string>('');
  const [userSearchResults, setUserSearchResults] = useState<
    UserSearchResult[]
  >([]);
  const [archivedRoutesSearchResults, setArchivedRoutesSearchResults] =
    useState<String[]>([]);
  const [tabViewed, setTabViewed] = useState<SearchTab>('users');

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  const { isLoading, isError, data, error } = useSearchSubstringMatchers();

  useEffect(() => {
    if (!data) return;
    if (query === '') {
      setUserSearchResults([]);
      setArchivedRoutesSearchResults([]);
      return;
    }
    if (tabViewed === 'users') {
      setUserSearchResults(data.userSubstringMatcher.getMatches(query));
    } else {
      setArchivedRoutesSearchResults(
        data.archivedRoutesSubstringMatcher.getMatches(query)
      );
    }
  }, [data, query, tabViewed]);

  if (isLoading) {
    return;
  }

  if (isError || data === undefined) {
    console.error(error);
    return null;
  }

  return (
    <ScrollView w="full" bg={baseBgColor} p="2">
      <Center w="full">
        <VStack w="full">
          <SearchBar
            queryHandler={{
              onChangeQuery: (newQuery: string) =>
                setQuery(newQuery.toLowerCase()),
              onChangeQueryDebounceSession: new DebounceSession(500),
            }}
          />
          <HStack w="full" justifyContent="space-around" p="3" space="md">
            <Button
              onPress={() => setTabViewed('routes')}
              variant={tabViewed === 'routes' ? 'solid' : 'outline'}
              rounded="full"
              w="1/2"
            >
              Routes
            </Button>
            <Button
              onPress={() => setTabViewed('users')}
              variant={tabViewed === 'users' ? 'solid' : 'outline'}
              rounded="full"
              w="1/2"
            >
              People
            </Button>
          </HStack>
        </VStack>
        <VStack w="full">
          {tabViewed === 'users'
            ? userSearchResults.map((userSearchResult) => {
                return (
                  <VStack key={userSearchResult.user.getId()} py="3">
                    <UserRow user={userSearchResult.user} />
                  </VStack>
                );
              })
            : archivedRoutesSearchResults.map((routeSearchResult) => {
                return (
                  <VStack py="3">
                    <Text>{routeSearchResult}</Text>
                  </VStack>
                );
              })}
        </VStack>
      </Center>
    </ScrollView>
  );
};

export default Search;
