import { Box, Flex, Spinner, useColorModeValue } from 'native-base';
import { useQuery } from 'react-query';
import RouteContainer from '../../components/route/SearchableRouteContainer';
import {
  ACTIVE_ROUTES_CACHE_KEY,
  fetchActiveRoutes,
} from '../../utils/queries';

const ActiveRoutes = () => {
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  const { isLoading, isError, data, error } = useQuery(
    ACTIVE_ROUTES_CACHE_KEY,
    fetchActiveRoutes
  );

  if (isLoading) {
    return (
      <Flex w="full" h="full" justifyContent="center" alignItems="center">
        <Spinner size="lg" />
      </Flex>
    );
  }

  if (isError || data === undefined) {
    console.error(error);
    return null;
  }

  return (
    <Box w="full" h="full" bg={baseBgColor}>
      <RouteContainer fetchedRoutes={data.activeRoutes} />
    </Box>
  );
};

export default ActiveRoutes;
