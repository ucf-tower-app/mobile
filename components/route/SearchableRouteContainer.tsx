import {
  Divider,
  FlatList,
  HStack,
  Select,
  Spinner,
  Text,
  VStack,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { DebounceSession } from '../../utils/utils';
import { FetchedRoute } from '../../xplat/types';
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

type Ordering = '' | 'None' | 'Date Posted' | 'Grade' | 'Rope';
type Filter = '' | 'None' | 'Boulder' | 'Top-Rope' | 'Traverse' | 'Lead-Climb';

type HeaderProps = {
  ordering: Ordering;
  setOrdering: (value: Ordering) => void;
  filter: Filter;
  setFilter: (value: Filter) => void;
  setQuery: (value: string) => void;
};

const RouteSearchHeader = ({
  ordering,
  setOrdering,
  filter,
  setFilter,
  setQuery,
}: HeaderProps) => {
  return (
    <VStack mt={1}>
      <SearchBar
        queryHandler={{
          onChangeQuery: (newQuery: string) => setQuery(newQuery.toLowerCase()),
          onChangeQueryDebounceSession: new DebounceSession(500),
        }}
      />
      <HStack mt={1} justifyContent={'center'}>
        <Select
          minWidth={'45%'}
          selectedValue={filter}
          placeholder="Filter"
          onValueChange={(value) =>
            setFilter(value === 'None' ? '' : (value as Filter))
          }
          mr={'2%'}
        >
          <Select.Item label="None" value="None" />
          <Select.Item label="Top-Rope" value="Top-Rope" />
          <Select.Item label="Boulder" value="Boulder" />
          <Select.Item label="Traverse" value="Traverse" />
          <Select.Item label="Lead-Climb" value="Lead-Climb" />
        </Select>

        <Select
          minWidth={'45%'}
          selectedValue={ordering}
          placeholder="Order By"
          onValueChange={(value) =>
            setOrdering(value === 'None' ? '' : (value as Ordering))
          }
        >
          <Select.Item label="None" value="None" />
          <Select.Item label="Date Posted" value="Date Posted" />
          <Select.Item label="Grade" value="Grade" />
          <Select.Item label="Rope" value="Rope" />
        </Select>
      </HStack>
    </VStack>
  );
};

const SearchableRouteContainer = ({ fetchedRoutes }: Props) => {
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [ordering, setOrdering] = useState<Ordering>('');
  const [filter, setFilter] = useState<Filter>('');
  const [displayedRoutes, setDisplayedRoutes] = useState<FetchedRoute[]>([]);

  useEffect(() => {
    const processQuery = async () => {
      setIsLoading(true);
      let newDisplay: FetchedRoute[] = [];

      // Here we check every route for it's status in the search results
      fetchedRoutes.forEach((route) => {
        // Here we build a corpus. This is the search text that we should query on
        // For now, we are simply concatenating the name, rating, and all tags
        const corpus = [
          route.name,
          route.gradeDisplayString,
          route.stringifiedTags,
        ]
          .join('$')
          .toLowerCase();
        if (corpus.includes(query)) newDisplay.push(route);
      });

      if (ordering === 'Date Posted')
        newDisplay.sort(
          (a, b) => b.timestamp!.valueOf() - a.timestamp!.valueOf()
        );
      else if (ordering === 'Grade')
        newDisplay.sort(
          (a, b) => a.classifier.rawgrade - b.classifier.rawgrade
        );
      else if (ordering === 'Rope')
        newDisplay.sort((a, b) => (a.rope ?? 100) - (b.rope ?? 100));

      if (
        filter === 'Boulder' ||
        filter === 'Lead-Climb' ||
        filter === 'Top-Rope' ||
        filter === 'Traverse'
      )
        newDisplay = newDisplay.filter(
          (route) => route.classifier.type === filter
        );

      setDisplayedRoutes(newDisplay);
      setIsLoading(false);
    };

    processQuery();
  }, [fetchedRoutes, filter, ordering, query]);

  return (
    <FlatList
      h="full"
      ListHeaderComponent={
        <RouteSearchHeader
          ordering={ordering}
          filter={filter}
          setOrdering={setOrdering}
          setFilter={setFilter}
          setQuery={setQuery}
        />
      }
      data={displayedRoutes}
      ItemSeparatorComponent={Divider}
      renderItem={({ item }) => <RouteRow route={item.routeObject} />}
      ListFooterComponent={
        isLoading ? (
          <Spinner mt={8} size="lg" />
        ) : displayedRoutes.length === 0 ? (
          <Text m={2} textAlign={'center'}>
            No routes seem to match your search. Consider removing your filter
            or changing your search terms?
          </Text>
        ) : null
      }
    />
  );
};

export default SearchableRouteContainer;
