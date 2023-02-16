import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ResizeMode } from 'expo-av';
import { Center, Flex, Image, Spinner } from 'native-base';
import 'react-native-gesture-handler';
import { useRecoilValue } from 'recoil';
import {
  isInitializingAtom,
  isSignedInAtom,
  userPermissionLevelAtom,
} from '../../utils/atoms';
import { useEarlyLoad } from '../../utils/hooks';
import { ParamList as TabParamList } from '../../utils/routes/tabs/paramList';
import { routes as tabRoutes } from '../../utils/routes/tabs/routes';
import { UserStatus } from '../../xplat/types';
import NotifyBanned from './NotifyBanned';
import SignInOrRegister from './SignInOrRegister';
import VerifyEmail from './VerifyEmail';

// Tabs used for bottom tray, stack for in-tab nav
const Tabs = createBottomTabNavigator<TabParamList>();

const Loading = () => (
  <Center h="full" w="full">
    <Image
      w="full"
      h="full"
      resizeMode={ResizeMode.CONTAIN}
      source={require('../../assets/tower_logo.jpeg')}
      alt="Logo"
    />
  </Center>
);
/**
 * [EnsureAuth] is a wrapper component for the main tab navigator.
 * It listens to auth events from Firebase, and updates the UI accordingly.
 * There are three states
 *
 * 1. Not logged in --> Render SignInOrRegister
 * 2. Logged in, email not verified --> Render email verification
 * 3. Logged in, email verified --> Render tab navigator
 */
const EnsureAuth = () => {
  const isSignedIn = useRecoilValue(isSignedInAtom);
  const userPermissionLevel = useRecoilValue(userPermissionLevelAtom);
  const isInitializing = useRecoilValue(isInitializingAtom);

  if (isInitializing || (isSignedIn && userPermissionLevel === undefined)) {
    return <Loading />;
  }

  if (!isSignedIn) {
    return <SignInOrRegister />;
  }

  if (userPermissionLevel === UserStatus.Banned) {
    return <NotifyBanned />;
  }

  if (userPermissionLevel === UserStatus.Unverified) {
    return <VerifyEmail />;
  }

  return (
    <Tabs.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
      }}
    >
      {tabRoutes.map((route) => (
        <Tabs.Screen
          name={route.name}
          component={route.stack}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? route.focusedIcon : route.unfocusedIcon,
            tabBarShowLabel: false,
          }}
          key={route.name}
        />
      ))}
    </Tabs.Navigator>
  );
};

export default EnsureAuth;
