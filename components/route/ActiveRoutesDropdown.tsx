import { Select, Skeleton } from 'native-base';
import { useEffect, useState } from 'react';
import { useActiveRoutes } from '../../utils/queries';
import { FetchedRoute, Route } from '../../xplat/types';

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

  const { isLoading, isError, data, error } = useActiveRoutes();

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
          label={route.name + ' (' + route.gradeDisplayString + ')'}
          value={route.name}
          key={route.routeObject.getId()}
        />
      ))}
    </Select>
  );
};

export default ActiveRoutesDropdown;
