// Route metadata for the home tab
import { View } from 'native-base';
import { Name } from './names';

export type Route = {
  name: Name;
  component: any;
};

export const routes: Array<Route> = [
  {
    name: 'Home',
    component: View,
  },
];
