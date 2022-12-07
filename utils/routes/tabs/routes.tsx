// Route metadata for tabs
import { View } from 'react-native';
import Sandbox from '../../../screens/sandbox/Sandbox';
import { Name } from './names';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Icon } from 'native-base';

export type Route = {
  name: Name;
  component: any;
  focusedIcon: any;
  unfocusedIcon: any;
};

export const routes: Array<Route> = [
  {
    name: 'HomeTab',
    component: View,
    focusedIcon: (
      <Icon
        as={<MaterialCommunityIcons name="home" />}
        color="black"
        size="xl"
      />
    ),
    unfocusedIcon: (
      <Icon
        as={<MaterialCommunityIcons name="home-outline" />}
        color="black"
        size="xl"
      />
    ),
  },
  {
    name: 'LeaderboardsTab',
    component: View,
    focusedIcon: (
      <Icon as={<Ionicons name="trophy" />} color="black" size="xl" />
    ),
    unfocusedIcon: (
      <Icon as={<Ionicons name="trophy-outline" />} color="black" size="xl" />
    ),
  },
  {
    name: 'ActiveRoutesTab',
    component: View,
    focusedIcon: (
      <Icon as={<AntDesign name="questioncircle" />} color="black" size="xl" />
    ),
    unfocusedIcon: (
      <Icon as={<AntDesign name="questioncircleo" />} color="black" size="xl" />
    ),
  },
  {
    name: 'SearchTab',
    component: View,
    focusedIcon: (
      <Icon as={<Ionicons name="search" />} color="black" size="xl" />
    ),
    unfocusedIcon: (
      <Icon as={<Ionicons name="search-outline" />} color="black" size="xl" />
    ),
  },
  {
    name: 'ProfileTab',
    component: View,
    focusedIcon: (
      <Icon as={<Ionicons name="person" />} color="black" size="xl" />
    ),
    unfocusedIcon: (
      <Icon as={<Ionicons name="person-outline" />} color="black" size="xl" />
    ),
  },
  {
    name: 'SandboxTab',
    component: Sandbox,
    focusedIcon: (
      <Icon as={<Feather name="codesandbox" />} color="black" size="xl" />
    ),
    unfocusedIcon: (
      <Icon as={<Feather name="codesandbox" />} color="black" size="xl" />
    ),
  },
];
