// Route metadata for tabs
import { Name } from './names';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Icon } from 'native-base';
import HomeStack from '../../../stackNavigators/HomeStack';
import LeaderboardsStack from '../../../stackNavigators/LeaderboardsStack';
import ActiveRoutesStack from '../../../stackNavigators/ActiveRoutesStack';
import SearchStack from '../../../stackNavigators/SearchStack';
import ProfileStack from '../../../stackNavigators/ProfileStack';
import SandboxStack from '../../../stackNavigators/SandboxStack';

export type Route = {
  name: Name;
  component: any;
  focusedIcon: any;
  unfocusedIcon: any;
};

export const routes: Array<Route> = [
  {
    name: 'HomeTab',
    component: HomeStack,
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
    component: LeaderboardsStack,
    focusedIcon: (
      <Icon as={<Ionicons name="trophy" />} color="black" size="xl" />
    ),
    unfocusedIcon: (
      <Icon as={<Ionicons name="trophy-outline" />} color="black" size="xl" />
    ),
  },
  {
    name: 'ActiveRoutesTab',
    component: ActiveRoutesStack,
    focusedIcon: (
      <Icon as={<AntDesign name="questioncircle" />} color="black" size="xl" />
    ),
    unfocusedIcon: (
      <Icon as={<AntDesign name="questioncircleo" />} color="black" size="xl" />
    ),
  },
  {
    name: 'SearchTab',
    component: SearchStack,
    focusedIcon: (
      <Icon as={<Ionicons name="search" />} color="black" size="xl" />
    ),
    unfocusedIcon: (
      <Icon as={<Ionicons name="search-outline" />} color="black" size="xl" />
    ),
  },
  {
    name: 'ProfileTab',
    component: ProfileStack,
    focusedIcon: (
      <Icon as={<Ionicons name="person" />} color="black" size="xl" />
    ),
    unfocusedIcon: (
      <Icon as={<Ionicons name="person-outline" />} color="black" size="xl" />
    ),
  },
  {
    name: 'SandboxTab',
    component: SandboxStack,
    focusedIcon: (
      <Icon as={<Feather name="codesandbox" />} color="black" size="xl" />
    ),
    unfocusedIcon: (
      <Icon as={<Feather name="codesandbox" />} color="black" size="xl" />
    ),
  },
];
