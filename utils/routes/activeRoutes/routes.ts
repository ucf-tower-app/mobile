// Route metadata for the activeRoutes tab
import { Name } from './names';
import { View } from 'react-native';

export type Route = {
  name: Name;
  component: any;
};

export const routes: Array<Route> = [
  {
    name: 'ActiveRoutes',
    component: View,
  },
];
