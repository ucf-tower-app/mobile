// Route metadata for tabs
import { Name } from './names';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Icon } from 'native-base';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ParamList as ActiveRoutesParamList } from '../activeRoutes/paramList';
import { ParamList as LeaderboardsParamList } from '../leaderboards/paramList';
import { ParamList as HomeParamList } from '../home/paramList';
import { ParamList as SearchParamList } from '../search/paramList';
import { ParamList as ProfileParamList } from '../profile/paramList';
import { ParamList as SandboxParamList } from '../sandbox/paramList';

export type Route = {
  name: Name;
  focusedIcon: any;
  unfocusedIcon: any;
  stack: any;
};

export const routes: Array<Route> = [
  {
    name: 'HomeTab',
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
    stack: createNativeStackNavigator<HomeParamList>(),
  },
  {
    name: 'LeaderboardsTab',
    focusedIcon: (
      <Icon as={<Ionicons name="trophy" />} color="black" size="xl" />
    ),
    unfocusedIcon: (
      <Icon as={<Ionicons name="trophy-outline" />} color="black" size="xl" />
    ),
    stack: createNativeStackNavigator<LeaderboardsParamList>(),
  },
  {
    name: 'ActiveRoutesTab',
    focusedIcon: (
      <Icon as={<AntDesign name="questioncircle" />} color="black" size="xl" />
    ),
    unfocusedIcon: (
      <Icon as={<AntDesign name="questioncircleo" />} color="black" size="xl" />
    ),
    stack: createNativeStackNavigator<ActiveRoutesParamList>(),
  },
  {
    name: 'SearchTab',
    focusedIcon: (
      <Icon as={<Ionicons name="search" />} color="black" size="xl" />
    ),
    unfocusedIcon: (
      <Icon as={<Ionicons name="search-outline" />} color="black" size="xl" />
    ),
    stack: createNativeStackNavigator<SearchParamList>(),
  },
  {
    name: 'ProfileTab',
    focusedIcon: (
      <Icon as={<Ionicons name="person" />} color="black" size="xl" />
    ),
    unfocusedIcon: (
      <Icon as={<Ionicons name="person-outline" />} color="black" size="xl" />
    ),
    stack: createNativeStackNavigator<ProfileParamList>(),
  },
  {
    name: 'SandboxTab',
    focusedIcon: (
      <Icon as={<Feather name="codesandbox" />} color="black" size="xl" />
    ),
    unfocusedIcon: (
      <Icon as={<Feather name="codesandbox" />} color="black" size="xl" />
    ),
    stack: createNativeStackNavigator<SandboxParamList>(),
  },
];
