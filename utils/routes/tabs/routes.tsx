// Route metadata for tabs
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon } from 'native-base';
import { ParamList as ActiveRoutesParamList } from '../activeRoutes/paramList';
import { ParamList as HomeParamList } from '../home/paramList';
import { ParamList as LeaderboardsParamList } from '../leaderboards/paramList';
import { ParamList as ProfileParamList } from '../profile/paramList';
import { tabNameToRouteData } from '../routes';
import { ParamList as SandboxParamList } from '../sandbox/paramList';
import { ParamList as SearchParamList } from '../search/paramList';
import { Name, Name as TabName } from './names';
import HeaderMenu from '../../../components/header/HeaderMenu';

export type Route = {
  name: Name;
  focusedIcon: any;
  unfocusedIcon: any;
  stack: any;
};

const headerRightButton = (navigation: any) => {
  return <HeaderMenu navigate={navigation.navigate} />;
};

// Builds a navigator stack for a given tab
const buildStack = (tabName: TabName, stack: any) => {
  const routeData = tabNameToRouteData[tabName];
  const Stack = stack;
  return () => {
    return (
      <Stack.Navigator
        initialRouteName={routeData.initialRouteName}
        screenOptions={({ navigation }: { navigation: any }) => ({
          headerRight: () => headerRightButton(navigation),
        })}
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
      <Icon as={<AntDesign name="questioncircle" />} color="black" size="xl" />
    ),
    unfocusedIcon: (
      <Icon as={<AntDesign name="questioncircleo" />} color="black" size="xl" />
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
  {
    name: 'SandboxTab',
    focusedIcon: (
      <Icon as={<Feather name="codesandbox" />} color="black" size="xl" />
    ),
    unfocusedIcon: (
      <Icon as={<Feather name="codesandbox" />} color="black" size="xl" />
    ),
    stack: buildStack(
      'SandboxTab',
      createNativeStackNavigator<SandboxParamList>()
    ),
  },
];
