import { Box, Divider, ScrollView, Spinner, VStack } from 'native-base';
import { useEffect, useState } from 'react';
import { DebounceSession } from '../../utils/utils';
import { Route } from '../../xplat/types';
import SearchBar from '../searchbar/SearchBar';
import RouteRow from './RouteRow';

/**
 * The SearchableRouteContainer provides a list of active routes
 * that is searchable via a 500ms debounced text search. It searches on
 * a corpus that is generated from each route's metadata
 */
type Props = {
  routes: Route[];
};
const SearchableRouteContainer = ({ routes }: Props) => {
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
      await Promise.all(
        routes.map(async (route, index) => {
          // Here we build a corpus. This is the search text that we should query on
          // For now, we are simply asynchonously concatenating the name, rating, and all tags
          const tags = await Promise.all(
            (await route.getTags()).map((tag) => tag.getName())
          );
          const corpus = (
            await Promise.all([route.getName(), route.getGradeDisplayString()])
          )
            .concat(tags)
            .join('$')
            .toLowerCase();

          if (corpus.includes(query)) newDisplayedRouteIndices.push(index);
        })
      );
      setDisplayedRouteIndices(newDisplayedRouteIndices);
      setIsLoading(false);
    };

    processQuery();
  }, [routes, query]);

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
              <RouteRow route={routes[index]} />
              <Divider />
            </Box>
          ))}
        </ScrollView>
      )}
    </VStack>
  );
};

export default SearchableRouteContainer;
