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
} from 'native-base';
import SearchBar from '../../components/searchbar/SearchBar';
import { useEffect, useState } from 'react';
import { DebounceSession } from '../../utils/utils';
import { UserSearchResult } from '../../xplat/api';
import {
  useActiveRoutes,
  useSearchSubstringMatchers,
} from '../../utils/queries';
import UserRow from '../../components/profile/UserRow';
import ArchivedRouteRow from '../../components/route/ArchivedRouteRow';
import RouteRow from '../../components/route/RouteRow';

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

  const substringMatcherQuery = useSearchSubstringMatchers();
  const activeRoutesQuery = useActiveRoutes();

  const subMatcherIsLoading = substringMatcherQuery.isLoading;
  const subMatcherIsError = substringMatcherQuery.isError;
  const subMatcherError = substringMatcherQuery.error;
  const subMatcherData = substringMatcherQuery.data;

  const activeRoutesIsLoading = activeRoutesQuery.isLoading;
  const activeRoutesIsError = activeRoutesQuery.isError;
  const activeRoutesError = activeRoutesQuery.error;
  const activeRoutesData = activeRoutesQuery.data;

  useEffect(() => {
    if (subMatcherData === undefined) return;
    if (query === '') {
      setArchivedRoutesSearchResults([]);
      return;
    }
    if (tabViewed === 'archived') {
      setIsLoadingResults(true);
      setArchivedRoutesSearchResults(
        subMatcherData.archivedRoutesSubstringMatcher.getMatches(query)
      );
      setIsLoadingResults(false);
    }
  }, [query, subMatcherData, tabViewed]);

  useEffect(() => {
    if (subMatcherData === undefined) return;
    if (query === '') {
      setUserSearchResults([]);
      return;
    }
    if (tabViewed === 'users') {
      setIsLoadingResults(true);
      setUserSearchResults(
        subMatcherData.userSubstringMatcher.getMatches(query)
      );
      setIsLoadingResults(false);
    }
  }, [query, subMatcherData, tabViewed]);

  useEffect(() => {
    if (activeRoutesData === undefined) return;
    if (query === '') {
      setDisplayedRouteIndices([]);
      return;
    }
    if (tabViewed === 'active') {
      setIsLoadingResults(true);
      const newDisplayedRouteIndices: number[] = [];
      activeRoutesData.activeRoutes.forEach((route, index) => {
        const corpus = [route.name, route.grade, route.stringifiedTags]
          .join('$')
          .toLowerCase();
        if (corpus.includes(query)) newDisplayedRouteIndices.push(index);
      });
      setDisplayedRouteIndices(newDisplayedRouteIndices);
      setIsLoadingResults(false);
    }
  }, [query, activeRoutesData, tabViewed]);

  if (subMatcherIsLoading || activeRoutesIsLoading) {
    return;
  }

  if (
    subMatcherIsError ||
    activeRoutesIsError ||
    subMatcherData === undefined ||
    activeRoutesData === undefined
  ) {
    console.error(activeRoutesError);
    console.error(subMatcherError);
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
            {tabViewed === 'users'
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
              : displayedRouteIndices.map((index) => {
                  return (
                    <Box key={index}>
                      <RouteRow
                        route={activeRoutesData.activeRoutes[index].routeObject}
                      />
                      <Divider />
                    </Box>
                  );
                })}
          </VStack>
        )}
      </Center>
    </ScrollView>
  );
};

export default Search;
