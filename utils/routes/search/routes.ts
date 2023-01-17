// Route metadata for the profile tab
import { View } from 'react-native';
import { Name } from './names';

export type Route = {
  name: Name;
  component: any;
};

export const routes: Route[] = [
  {
    name: 'Search',
    component: View,
  },
];
