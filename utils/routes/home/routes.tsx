// Route metadata for the home tab
import { Name } from './names';
import { View } from 'native-base';

export type Route = {
  name: Name;
  component: any;
};

export const routes: Array<Route> = [
  {
    name: 'MainFeed',
    component: View,
  },
];
