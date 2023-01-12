import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { routes as rootStackRoutes } from './utils/routes/root/routes';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { extendTheme, NativeBaseProvider } from 'native-base';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import { ParamList as RootStackParamList } from './utils/routes/root/paramList';

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

const RootStack = createNativeStackNavigator<RootStackParamList>();

// Construct tabs and their subtrees
export default function App() {
  return (
    <NativeBaseProvider theme={theme}>
      <StatusBar style="auto" />
      <NavigationContainer>
        <RootStack.Navigator initialRouteName="Tabs">
          {rootStackRoutes.map((route) => (
            <RootStack.Screen
              name={route.name}
              component={route.component}
              key={route.name}
              options={{ headerShown: route.name === 'Tabs' ? false : true }}
            />
          ))}
        </RootStack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
