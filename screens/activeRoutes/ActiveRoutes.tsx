import { Box, Flex, Spinner, useColorModeValue } from 'native-base';
import { useEffect, useState } from 'react';
import RouteContainer from '../../components/route/SearchableRouteContainer';
import { getActiveRoutesCursor } from '../../xplat/api';
import { Route } from '../../xplat/types/route';

const ActiveRoutes = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  useEffect(() => {
    const getData = async () => {
      // There will never be many active routes, so pull them all for searchability
      const activeRoutesCursor = getActiveRoutesCursor();
      const newRoutes: Route[] = [];
      while (await activeRoutesCursor.hasNext()) {
        newRoutes.push((await activeRoutesCursor.pollNext())!);
      }
      setRoutes(newRoutes);
      setIsLoading(false);
    };

    getData();
  }, []);

  return isLoading ? (
    <Flex w="full" h="full" justifyContent="center" alignItems="center">
      <Spinner size="lg" />
    </Flex>
  ) : (
    <Box w="full" h="full" bg={baseBgColor}>
      <RouteContainer routes={routes} />
    </Box>
  );
};

export default ActiveRoutes;
