import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { extendTheme, NativeBaseProvider } from 'native-base';
import { StyleSheet } from 'react-native';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import AuthProvider from './components/util/AuthProvider';
import { ParamList as RootStackParamList } from './utils/routes/root/paramList';
import { routes as rootStackRoutes } from './utils/routes/root/routes';

export const theme = extendTheme({
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

const queryClient = new QueryClient();

// Construct tabs and their subtrees
export default function App() {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <GestureHandlerRootView style={styles.gestureHandler}>
            <NativeBaseProvider theme={theme}>
              <StatusBar style="auto" />
              <NavigationContainer>
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
