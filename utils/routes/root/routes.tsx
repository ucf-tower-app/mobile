// Route metadata for the profile tab
import { View } from 'react-native';
import EnsureAuth from '../../../screens/account/EnsureAuth';
import { Name } from './names';

export type Route = {
  name: Name;
  component: any;
};

export const routes: Route[] = [
  {
    name: 'Tabs',
    component: EnsureAuth,
  },
  {
    name: 'Settings',
    component: View,
  },
  {
    name: 'LostAndFound',
    component: View,
  },
  {
    name: 'Tutorial',
    component: View,
  },
];
