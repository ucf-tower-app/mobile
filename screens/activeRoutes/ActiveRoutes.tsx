import { Box, useColorModeValue } from 'native-base';
import { useEffect, useState } from 'react';
import RouteContainer from '../../components/route/SearchableRouteContainer';
import { getActiveRoutes } from '../../xplat/api';
import { Route } from '../../xplat/types/route';

const ActiveRoutes = () => {
  const [routes, setRoutes] = useState<Route[]>([]);

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  useEffect(() => {
    getActiveRoutes().then(setRoutes);
  }, []);

  return (
    <Box w="full" h="full" bg={baseBgColor}>
      <RouteContainer routes={routes} />
    </Box>
  );
};

export default ActiveRoutes;
