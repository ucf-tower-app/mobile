import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider } from 'native-base';
import { tabNameToRouteData } from './utils/routes/routes';
import { Name as TabName } from './utils/routes/tabs/names';
import { routes as tabRoutes } from './utils/routes/tabs/routes';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// Style for tab bar
const tabBarStyle = {
  backgroundColor: 'white',
};

// Tabs used for bottom tray, stack for in-tab nav
const Stack = createNativeStackNavigator();
const Tabs = createMaterialBottomTabNavigator();
const TopTabs = createMaterialTopTabNavigator();

// Builds a navigator stack for a given tab
const buildStack = (tabName: TabName) => {
  const routeData = tabNameToRouteData[tabName];

  return () => {
    return tabName === 'HomeTab' ? (
      <Stack.Navigator initialRouteName={routeData.initialRouteName}>
        <Stack.Screen name="Home" component={buildTopTab(tabName)} key="Home" />
      </Stack.Navigator>
    ) : (
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

const buildTopTab = (tabName: TabName) => {
  const routeData = tabNameToRouteData[tabName];
  return () => {
    return (
      <TopTabs.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: 'white',
          },
          tabBarIndicatorStyle: {
            backgroundColor: 'black',
          },
          tabBarLabelStyle: {
            fontSize: 5,
          },
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'grey',
        }}
      >
        {routeData.routes.map((route) => (
          <TopTabs.Screen
            name={route.name}
            component={route.component}
            key={route.name}
          />
        ))}
      </TopTabs.Navigator>
    );
  };
};

// Construct tabs and their subtrees
export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Tabs.Navigator
          initialRouteName="Home"
          barStyle={tabBarStyle}
          labeled={false}
        >
          {tabRoutes.map((route) => (
            <Tabs.Screen
              name={route.name}
              component={buildStack(route.name)}
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
