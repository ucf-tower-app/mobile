// Route metadata for the profile tab
import { View } from 'react-native';
import EnsureAuth from '../../../screens/account/EnsureAuth';
import Settings from '../../../screens/settings/Settings';
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
    component: Settings,
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
