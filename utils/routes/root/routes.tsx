// Route metadata for the profile tab
import { Name } from './names';
import { ParamList as TabParamList } from '../tabs/paramList';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { routes as tabRoutes } from '../tabs/routes';
import { View } from 'react-native';

export type Route = {
  name: Name;
  component: any;
};

// Style for tab bar
const tabBarStyle = {
  backgroundColor: 'white',
};

const TabsNavigator = () => {
  // Tabs used for bottom tray, stack for in-tab nav
  const Tabs = createMaterialBottomTabNavigator<TabParamList>();

  return (
    <Tabs.Navigator
      initialRouteName="HomeTab"
      barStyle={tabBarStyle}
      labeled={false}
    >
      {tabRoutes.map((route) => (
        <Tabs.Screen
          name={route.name}
          component={route.stack}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? route.focusedIcon : route.unfocusedIcon,
          }}
          key={route.name}
        />
      ))}
    </Tabs.Navigator>
  );
};

export const routes: Array<Route> = [
  {
    name: 'Tabs',
    component: TabsNavigator,
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
