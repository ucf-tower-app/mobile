// Combine useful route datas, and map tabs to their routes
import { routes as defaultRoutes } from './default/routes';
import { routes as sandboxRoutes } from './sandbox/routes';

import { Name as DefaultName } from './default/names';
import { Name as SandboxName } from './sandbox/names';
import { Name as TabName } from './tabs/names';

export type RouteName = DefaultName | SandboxName | TabName;
export type Route = {
  name: RouteName;
  component: any;
};

type RouteData = {
  initialRouteName: RouteName;
  routes: Array<Route>;
};
const tabNameToRouteData: { [tabName in TabName]: RouteData } = {
  DefaultTab: {
    initialRouteName: 'Null',
    routes: defaultRoutes,
  },
  SandboxTab: {
    initialRouteName: 'Sandbox',
    routes: sandboxRoutes,
  },
};

export default tabNameToRouteData;
