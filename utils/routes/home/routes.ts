// Route metadata for the home tab
import { Name } from './names';
import { View } from 'react-native';

export type Route = {
  name: Name;
  component: any;
};

export const routes: Array<Route> = [
  {
    name: 'All',
    component: View,
  },
  {
    name: 'Following',
    component: View,
  },
  {
    name: 'Leaderboards',
    component: View,
  },
  {
    name: 'Lost and Found',
    component: View,
  },
];
