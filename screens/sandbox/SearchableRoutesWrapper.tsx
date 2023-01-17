import { Box, useColorModeValue } from 'native-base';
import React from 'react';
import SearchableRouteContainer from '../../components/route/SearchableRouteContainer';
import { routeMocks } from '../../utils/mocks';

const SearchableRoutesWrapper = () => {
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  return (
    <Box w="full" h="full" bg={baseBgColor}>
      <SearchableRouteContainer routes={routeMocks} />
    </Box>
  );
};
export default SearchableRoutesWrapper;
