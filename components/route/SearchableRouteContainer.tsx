import { Box, Divider, ScrollView, Spinner, VStack } from 'native-base';
import { useEffect, useState } from 'react';
import { FetchedRoute } from '../../utils/queries';
import { DebounceSession } from '../../utils/utils';
import SearchBar from '../searchbar/SearchBar';
import RouteRow from './RouteRow';

/**
 * The SearchableRouteContainer provides a list of active routes
 * that is searchable via a 500ms debounced text search. It searches on
 * a corpus that is generated from each route's metadata
 */
type Props = {
  fetchedRoutes: FetchedRoute[];
};
const SearchableRouteContainer = ({ fetchedRoutes }: Props) => {
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [displayedRouteIndices, setDisplayedRouteIndices] = useState<number[]>(
    []
  );

  useEffect(() => {
    const processQuery = async () => {
      setIsLoading(true);
      const newDisplayedRouteIndices: number[] = [];

      // Here we check every route for it's status in the search results
      fetchedRoutes.forEach((route, index) => {
        // Here we build a corpus. This is the search text that we should query on
        // For now, we are simply concatenating the name, rating, and all tags
        const corpus = [route.name, route.grade, route.stringifiedTags]
          .join('$')
          .toLowerCase();
        if (corpus.includes(query)) newDisplayedRouteIndices.push(index);
      });
      setDisplayedRouteIndices(newDisplayedRouteIndices);
      setIsLoading(false);
    };

    processQuery();
  }, [fetchedRoutes, query]);

  return (
    <VStack w="full">
      <Box p={2}>
        <SearchBar
          queryHandler={{
            onChangeQuery: (newQuery: string) =>
              setQuery(newQuery.toLowerCase()),
            onChangeQueryDebounceSession: new DebounceSession(500),
          }}
        />
      </Box>
      {isLoading ? (
        <Spinner mt={8} size="lg" />
      ) : (
        <ScrollView>
          {displayedRouteIndices.map((index) => (
            <Box key={index}>
              <RouteRow route={fetchedRoutes[index].routeObject} />
              <Divider />
            </Box>
          ))}
        </ScrollView>
      )}
    </VStack>
  );
};

export default SearchableRouteContainer;
