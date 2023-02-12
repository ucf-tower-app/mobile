import { Select, Skeleton } from 'native-base';
import { useEffect, useState } from 'react';
import { useActiveRoutes } from '../../utils/queries';
import { FetchedRoute } from '../../xplat/types';

type Props = {
  onSelectRoute: (route: FetchedRoute) => void;
  preSelectedRouteDocRefId?: string;
};
const ActiveRoutesDropdown = ({
  onSelectRoute,
  preSelectedRouteDocRefId,
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
    onSelectRoute(routeNameToRoute[routeName]);
  };

  if (isLoading) {
    return <Skeleton w="full" h={25} rounded={5} />;
  }

  if (isError || data === undefined) {
    console.error(error);
    return null;
  }

  const preSelectedRouteName = data.activeRoutes.find(
    (fetchedRoute) =>
      fetchedRoute.routeObject.getId() === preSelectedRouteDocRefId
  )?.name;

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
