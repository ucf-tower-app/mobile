import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { tabNameToRouteData } from './utils/routes/routes';
import { routes as tabRoutes } from './utils/routes/tabs/routes';
import { Name as TabName } from './utils/routes/tabs/names';
import { ParamList as RootTabParamList } from './utils/routes/tabs/paramList';
import 'react-native-gesture-handler';

// Style for tab bar
const tabBarStyle = {
  backgroundColor: 'white',
};

// Tabs used for bottom tray, stack for in-tab nav
const Tabs = createMaterialBottomTabNavigator<RootTabParamList>();

// Builds a navigator stack for a given tab
const buildStack = (tabName: TabName, stack: any) => {
  const routeData = tabNameToRouteData[tabName];
  const Stack = stack;
  return () => {
    return (
      <Stack.Navigator initialRouteName={routeData.initialRouteName}>
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

const theme = extendTheme({
  colors: {
    lightMode: {
      base: '#fafafa',
      primary: '#e5e5e5',
      secondary: '#a855f7',
    },
    darkMode: {
      base: '#e3f2f9',
      primary: '#c5e4f3',
      secondary: '#a2d4ec',
    },
  },
});

// Construct tabs and their subtrees
export default function App() {
  return (
    <NativeBaseProvider theme={theme}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Tabs.Navigator
          initialRouteName="HomeTab"
          barStyle={tabBarStyle}
          labeled={false}
        >
          {tabRoutes.map((route) => (
            <Tabs.Screen
              name={route.name}
              component={buildStack(route.name, route.stack)}
              options={{
                tabBarIcon: ({ focused }) =>
                  focused ? route.focusedIcon : route.unfocusedIcon,
              }}
              key={route.name}
            />
          ))}
        </Tabs.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
