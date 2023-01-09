import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { extendTheme, NativeBaseProvider } from 'native-base';
import 'react-native-gesture-handler';
import { ParamList as RootTabParamList } from './utils/routes/tabs/paramList';
import { routes as tabRoutes } from './utils/routes/tabs/routes';

// Style for tab bar
const tabBarStyle = {
  backgroundColor: 'white',
};

// Tabs used for bottom tray, stack for in-tab nav
const Tabs = createMaterialBottomTabNavigator<RootTabParamList>();

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

const RootStack = createNativeStackNavigator();

const BuildTabs = () => {
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

// Construct tabs and their subtrees
export default function App() {
  return (
    <NativeBaseProvider theme={theme}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <RootStack.Navigator
          initialRouteName="root"
          screenOptions={{ headerShown: false }}
        >
          <RootStack.Screen name="root" component={BuildTabs} />
        </RootStack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
