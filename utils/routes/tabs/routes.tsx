// Route metadata for tabs
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon } from 'native-base';
import HeaderMenu from '../../../components/header/HeaderMenu';
import { ParamList as ActiveRoutesParamList } from '../activeRoutes/paramList';
import { ParamList as HomeParamList } from '../home/paramList';
import { ParamList as LeaderboardsParamList } from '../leaderboards/paramList';
import { ParamList as ProfileParamList } from '../profile/paramList';
import { tabNameToRouteData } from '../routes';
import { ParamList as SearchParamList } from '../search/paramList';
import { Name as TabName } from './names';

export type Route = {
  name: TabName;
  focusedIcon: any;
  unfocusedIcon: any;
  stack: any;
};

// Builds a navigator stack for a given tab
const buildStack = (tabName: TabName, Stack: any) => {
  const routeData = tabNameToRouteData[tabName];
  return () => {
    return (
      <Stack.Navigator
        initialRouteName={routeData.initialRouteName}
        screenOptions={{
          headerRight: HeaderMenu,
        }}
      >
        {routeData.routes.map((route) => (
          <Stack.Screen
            name={route.name}
            component={route.component}
            key={route.name}
          />
        ))}
      </Stack.Navigator>
    );
  };
};

export const routes: Route[] = [
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
    stack: buildStack('HomeTab', createNativeStackNavigator<HomeParamList>()),
  },
  {
    name: 'LeaderboardsTab',
    focusedIcon: (
      <Icon as={<Ionicons name="trophy" />} color="black" size="xl" />
    ),
    unfocusedIcon: (
      <Icon as={<Ionicons name="trophy-outline" />} color="black" size="xl" />
    ),
    stack: buildStack(
      'LeaderboardsTab',
      createNativeStackNavigator<LeaderboardsParamList>()
    ),
  },
  {
    name: 'ActiveRoutesTab',
    focusedIcon: (
      <Icon as={<Ionicons name="analytics" />} color="black" size="xl" />
    ),
    unfocusedIcon: (
      <Icon
        as={<Ionicons name="analytics-outline" />}
        color="black"
        size="xl"
      />
    ),
    stack: buildStack(
      'ActiveRoutesTab',
      createNativeStackNavigator<ActiveRoutesParamList>()
    ),
  },
  {
    name: 'SearchTab',
    focusedIcon: (
      <Icon as={<Ionicons name="search" />} color="black" size="xl" />
    ),
    unfocusedIcon: (
      <Icon as={<Ionicons name="search-outline" />} color="black" size="xl" />
    ),
    stack: buildStack(
      'SearchTab',
      createNativeStackNavigator<SearchParamList>()
    ),
  },
  {
    name: 'ProfileTab',
    focusedIcon: (
      <Icon as={<Ionicons name="person" />} color="black" size="xl" />
    ),
    unfocusedIcon: (
      <Icon as={<Ionicons name="person-outline" />} color="black" size="xl" />
    ),
    stack: buildStack(
      'ProfileTab',
      createNativeStackNavigator<ProfileParamList>()
    ),
  },
];
