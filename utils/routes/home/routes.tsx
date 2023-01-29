// Route metadata for the home tab
import { View } from 'native-base';
import { Name } from './names';
import { routes as tabGlobalRoutes } from '../tabGlobal/routes';

export type Route = {
  name: Name;
  component: any;
};

export const routes: Route[] = [
  {
    name: 'Home',
    component: View,
  },
  ...tabGlobalRoutes,
];
