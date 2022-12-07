// Route metadata for tabs
import { View } from 'react-native';
import Sandbox from '../../../screens/sandbox/Sandbox';
import { Name } from './names';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

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
    focusedIcon: <MaterialCommunityIcons name="home" size={26} color="black" />,
    unfocusedIcon: (
      <MaterialCommunityIcons name="home-outline" size={26} color="black" />
    ),
  },
  {
    name: 'LeaderboardsTab',
    component: View,
    focusedIcon: <Ionicons name="trophy" size={26} color="black" />,
    unfocusedIcon: <Ionicons name="trophy-outline" size={26} color="black" />,
  },
  {
    name: 'ActiveRoutesTab',
    component: View,
    focusedIcon: <AntDesign name="questioncircle" size={26} color="black" />,
    unfocusedIcon: <AntDesign name="questioncircleo" size={26} color="black" />,
  },
  {
    name: 'SearchTab',
    component: View,
    focusedIcon: <Ionicons name="search" size={26} color="black" />,
    unfocusedIcon: <Ionicons name="search-outline" size={26} color="black" />,
  },
  {
    name: 'ProfileTab',
    component: View,
    focusedIcon: <Ionicons name="person" size={26} color="black" />,
    unfocusedIcon: <Ionicons name="person-outline" size={26} color="black" />,
  },
  {
    name: 'SandboxTab',
    component: Sandbox,
    focusedIcon: <Feather name="codesandbox" size={26} color="black" />,
    unfocusedIcon: <Feather name="codesandbox" size={26} color="black" />,
  },
];
