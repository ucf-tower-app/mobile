import {
  Box,
  Button,
  Center,
  Divider,
  HStack,
  ScrollView,
  Spinner,
  useColorModeValue,
  VStack,
  Text,
} from 'native-base';
import { useEffect, useState } from 'react';
import UserRow from '../../components/profile/UserRow';
import ArchivedRouteRow from '../../components/route/ArchivedRouteRow';
import RouteRow from '../../components/route/RouteRow';
import SearchBar from '../../components/searchbar/SearchBar';
import {
  useActiveRoutes,
  useArchivedSubstringMatcher,
  useUserSubstringMatcher,
} from '../../utils/queries';
import { DebounceSession } from '../../utils/utils';
import { UserSearchResult } from '../../xplat/api';

type SearchTab = 'active' | 'users' | 'archived';

const Search = () => {
  const [query, setQuery] = useState<string>('');
  const [userSearchResults, setUserSearchResults] = useState<
    UserSearchResult[]
  >([]);
  const [archivedRoutesSearchResults, setArchivedRoutesSearchResults] =
    useState<String[]>([]);
  const [tabViewed, setTabViewed] = useState<SearchTab>('users');
  const [displayedRouteIndices, setDisplayedRouteIndices] = useState<number[]>(
    []
  );
  const [isLoadingResults, setIsLoadingResults] = useState<boolean>(false);

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  const userMatcherQuery = useUserSubstringMatcher();
  const archivedMatcherQuery = useArchivedSubstringMatcher();
  const activeRoutesQuery = useActiveRoutes();

  useEffect(() => {
    if (tabViewed === 'archived') {
      if (archivedMatcherQuery.data === undefined) {
        setIsLoadingResults(true);
        return;
      }
      if (query === '') {
        setArchivedRoutesSearchResults([]);
        return;
      }
      setIsLoadingResults(false);
      setArchivedRoutesSearchResults(
        archivedMatcherQuery.data.getMatches(query)
      );
    } else if (tabViewed === 'users') {
      if (userMatcherQuery.data === undefined) {
        setIsLoadingResults(true);
        return;
      }
      setIsLoadingResults(false);
      if (query === '') {
        setUserSearchResults([]);
        return;
      }
      setUserSearchResults(userMatcherQuery.data.getMatches(query));
    }
  }, [archivedMatcherQuery.data, query, tabViewed, userMatcherQuery.data]);

  useEffect(() => {
    if (tabViewed !== 'active') return;
    if (activeRoutesQuery.data === undefined) {
      setIsLoadingResults(true);
      return;
    }
    setIsLoadingResults(false);
    if (query === '') {
      setDisplayedRouteIndices([]);
      return;
    }
    const newDisplayedRouteIndices: number[] = [];
    activeRoutesQuery.data.activeRoutes.forEach((route, index) => {
      const corpus = [
        route.name,
        route.gradeDisplayString,
        route.stringifiedTags,
      ]
        .join('$')
        .toLowerCase();
      if (corpus.includes(query)) newDisplayedRouteIndices.push(index);
    });
    setDisplayedRouteIndices(newDisplayedRouteIndices);
  }, [activeRoutesQuery.data, query, tabViewed]);

  if (userMatcherQuery.isError) console.error(userMatcherQuery.error);
  if (archivedMatcherQuery.isError) console.error(archivedMatcherQuery.error);
  if (activeRoutesQuery.isError) console.error(activeRoutesQuery.error);

  const results =
    tabViewed === 'users'
      ? userSearchResults.map((userSearchResult) => {
          return (
            <Box key={userSearchResult.user.getId()}>
              <UserRow user={userSearchResult.user} />
              <Divider my="3" />
            </Box>
          );
        })
      : tabViewed === 'archived'
      ? archivedRoutesSearchResults.map((routeTitle) => {
          return (
            <Box key={routeTitle.toString()}>
              <ArchivedRouteRow title={routeTitle.toString()} />
              <Divider my="3" />
            </Box>
          );
        })
      : activeRoutesQuery.data !== undefined
      ? displayedRouteIndices.map((index) => {
          return (
            <Box key={index}>
              <RouteRow
                route={activeRoutesQuery.data.activeRoutes[index].routeObject}
              />
              <Divider />
            </Box>
          );
        })
      : null;
  return (
    <ScrollView w="full" bg={baseBgColor} p="2">
      <Center w="full">
        <VStack w="full">
          <SearchBar
            queryHandler={{
              onChangeQuery: (newQuery: string) =>
                setQuery(newQuery.toLowerCase()),
              onChangeQueryDebounceSession: new DebounceSession(100),
            }}
          />
          <HStack w="full" justifyContent="space-around" p="3" space="md">
            <Button
              onPress={() => setTabViewed('archived')}
              variant={tabViewed === 'archived' ? 'solid' : 'outline'}
              rounded="full"
            >
              Archived Routes
            </Button>
            <Button
              onPress={() => setTabViewed('active')}
              variant={tabViewed === 'active' ? 'solid' : 'outline'}
              rounded="full"
            >
              Active Routes
            </Button>
            <Button
              onPress={() => setTabViewed('users')}
              variant={tabViewed === 'users' ? 'solid' : 'outline'}
              rounded="full"
            >
              People
            </Button>
          </HStack>
        </VStack>
        {isLoadingResults ? (
          <Spinner mt={8} size="lg" />
        ) : (
          <VStack w="full">
            {results?.length === 0 ? (
              <Center>
                <Text mt={2} color="grey">
                  No results
                </Text>
              </Center>
            ) : (
              results
            )}
          </VStack>
        )}
      </Center>
    </ScrollView>
  );
};

export default Search;
