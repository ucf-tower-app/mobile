// Route metadata for the default tab
import { Name } from './names';
import { View } from 'react-native';

export type Route = {
  name: Name;
  component: any;
};

export const routes: Array<Route> = [
  {
    name: 'Default',
    component: View,
  },
];

export type PropMap = {
  Default: undefined;
};
