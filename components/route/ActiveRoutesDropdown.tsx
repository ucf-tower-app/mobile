import { Route } from '../../xplat/types/types';
import { Select, Skeleton } from 'native-base';
import { useQuery } from 'react-query';
import {
  ACTIVE_ROUTES_CACHE_KEY,
  fetchActiveRoutes,
  FetchedRoute,
} from '../../utils/queries';
import { useEffect, useState } from 'react';

type Props = {
  onSelectRoute: (route: Route) => void;
  preSelectedRouteName?: string;
};
const ActiveRoutesDropdown = ({
  onSelectRoute,
  preSelectedRouteName,
}: Props) => {
  const [routeNameToRoute, setRouteNameToRoute] = useState<
    Record<string, FetchedRoute>
  >({});

  const { isLoading, isError, data, error } = useQuery(
    ACTIVE_ROUTES_CACHE_KEY,
    fetchActiveRoutes,
    {
      staleTime: 600000,
    }
  );

  // Build the route name map
  useEffect(() => {
    if (data === undefined) return;

    const _routeNameToRoute: Record<string, FetchedRoute> = {};
    data.activeRoutes.forEach((route) => {
      _routeNameToRoute[route.name] = route;
    });

    setRouteNameToRoute(_routeNameToRoute);
  }, [data]);

  const onSelectRouteName = (routeName: string) => {
    onSelectRoute(routeNameToRoute[routeName].routeObject);
  };

  if (isLoading) {
    return <Skeleton w="full" h={25} rounded={5} />;
  }

  if (isError || data === undefined) {
    console.error(error);
    return null;
  }

  return (
    <Select
      onValueChange={onSelectRouteName}
      defaultValue={preSelectedRouteName}
    >
      {data.activeRoutes.map((route) => (
        <Select.Item
          label={route.name}
          value={route.name}
          key={route.routeObject.getId()}
        />
      ))}
    </Select>
  );
};

export default ActiveRoutesDropdown;
