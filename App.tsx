import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, useColorMode } from 'native-base';
import {
  ColorMode,
  extendTheme,
  NativeBaseProvider,
  StorageManager,
  useColorModeValue,
  useToken,
} from 'native-base';
import { LogBox, StyleSheet } from 'react-native';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import AuthProvider from './components/util/AuthProvider';
import { ParamList as RootStackParamList } from './utils/routes/root/paramList';
import { routes as rootStackRoutes } from './utils/routes/root/routes';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const nativeBaseTheme = extendTheme({
  colors: {
    lightMode: {
      base: '#fff',
      primary: '#e5e5e5',
      secondary: '#a855f7',
    },
    darkMode: {
      base: '#0D1821',
      primary: '#344966',
      secondary: '#B4CDED',
    },
  },
  useSystemColorMode: false,
  initialColorMode: 'dark',
});

// Build a color mode manager to persist chosen theme across sessions
const colorModeManager: StorageManager = {
  get: async () => {
    try {
      let val = await AsyncStorage.getItem('@color-mode');
      return val === 'dark' ? 'dark' : 'light';
    } catch (e) {
      return 'light';
    }
  },
  set: async (value: ColorMode) => {
    try {
      if (value !== undefined && value !== null)
        await AsyncStorage.setItem('@color-mode', value);
    } catch (e) {
      console.log(e);
    }
  },
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * (60 * 1000), // 10 mins
      cacheTime: 10 * (60 * 1000), // 10 mins
    },
  },
});
LogBox.ignoreLogs(['Require cycle:', 'AsyncStorage has been extracted']);

const RootStackProvider = () => {
  const { colorMode } = useColorMode();
  const backgroundColorKey = useColorModeValue(
    'lightMode.base',
    'darkMode.base'
  );
  const backgroundColorHex = useToken('colors', backgroundColorKey);

  return (
    <>
      <StatusBar
        barStyle={colorMode === 'light' ? 'dark-content' : 'light-content'}
      />
      <NavigationContainer
        theme={{
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: backgroundColorHex,
          },
        }}
      >
        <RootStack.Navigator
          initialRouteName="Tabs"
          screenOptions={{
            headerStyle: {
              backgroundColor: backgroundColorHex,
            },
          }}
        >
          {rootStackRoutes.map((route) => (
            <RootStack.Screen
              name={route.name}
              component={route.component}
              key={route.name}
              options={{
                headerShown: route.name === 'Tabs' ? false : true,
              }}
            />
          ))}
        </RootStack.Navigator>
      </NavigationContainer>
    </>
  );
};

// Construct tabs and their subtrees
export default function App() {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <GestureHandlerRootView style={styles.gestureHandler}>
            <NativeBaseProvider
              theme={nativeBaseTheme}
              colorModeManager={colorModeManager}
            >
              <RootStackProvider />
            </NativeBaseProvider>
          </GestureHandlerRootView>
        </AuthProvider>
      </QueryClientProvider>
    </RecoilRoot>
  );
}

const styles = StyleSheet.create({
  gestureHandler: {
    flex: 1,
  },
});
