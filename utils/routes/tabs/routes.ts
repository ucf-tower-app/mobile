// Route metadata for tabs
import { View } from 'react-native';
import Sandbox from '../../../screens/sandbox/Sandbox';
import { Name } from './names';

export type Route = {
  name: Name;
  component: any;
};

export const routes: Array<Route> = [
  {
    name: 'DefaultTab',
    component: View,
  },
  {
    name: 'SandboxTab',
    component: Sandbox,
  },
];
