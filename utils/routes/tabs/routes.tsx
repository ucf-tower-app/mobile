// Route metadata for tabs
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon } from 'native-base';
import HeaderMenu from '../../../components/header/HeaderMenu';
import LightDarkIcon from '../../../components/util/LightDarkIcon';
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
    focusedIcon: <LightDarkIcon name="home" size="xl" />,
    unfocusedIcon: <LightDarkIcon name="home-outline" size="xl" />,
    stack: buildStack('HomeTab', createNativeStackNavigator<HomeParamList>()),
  },
  {
    name: 'LeaderboardsTab',
    focusedIcon: <LightDarkIcon name="trophy" size="xl" />,
    unfocusedIcon: <LightDarkIcon name="trophy-outline" size="xl" />,
    stack: buildStack(
      'LeaderboardsTab',
      createNativeStackNavigator<LeaderboardsParamList>()
    ),
  },
  {
    name: 'ActiveRoutesTab',
    focusedIcon: <LightDarkIcon name="analytics" size="xl" />,
    unfocusedIcon: <LightDarkIcon name="analytics-outline" size="xl" />,
    stack: buildStack(
      'ActiveRoutesTab',
      createNativeStackNavigator<ActiveRoutesParamList>()
    ),
  },
  {
    name: 'SearchTab',
    focusedIcon: <LightDarkIcon name="search" size="xl" />,
    unfocusedIcon: <LightDarkIcon name="search-outline" size="xl" />,
    stack: buildStack(
      'SearchTab',
      createNativeStackNavigator<SearchParamList>()
    ),
  },
  {
    name: 'ProfileTab',
    focusedIcon: <LightDarkIcon name="person" size="xl" />,
    unfocusedIcon: <LightDarkIcon name="person-outline" size="xl" />,
    stack: buildStack(
      'ProfileTab',
      createNativeStackNavigator<ProfileParamList>()
    ),
  },
];
