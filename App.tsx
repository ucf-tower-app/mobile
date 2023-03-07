import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { extendTheme, NativeBaseProvider } from 'native-base';
import { LogBox, StyleSheet } from 'react-native';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import AuthProvider from './components/util/AuthProvider';
import { ParamList as RootStackParamList } from './utils/routes/root/paramList';
import { routes as rootStackRoutes } from './utils/routes/root/routes';

export const nativeBaseTheme = extendTheme({
  colors: {
    lightMode: {
      base: '#fff',
      primary: '#e5e5e5',
      secondary: '#a855f7',
    },
    darkMode: {
      base: '#fff',
      primary: '#c5e4f3',
      secondary: '#a2d4ec',
    },
  },
});

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: nativeBaseTheme.colors.lightMode.base,
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

// Construct tabs and their subtrees
export default function App() {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <GestureHandlerRootView style={styles.gestureHandler}>
            <NativeBaseProvider theme={nativeBaseTheme}>
              <StatusBar style="auto" />
              <NavigationContainer theme={navigationTheme}>
                <RootStack.Navigator initialRouteName="Tabs">
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
