import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Flex, Spinner } from 'native-base';
import 'react-native-gesture-handler';
import { useRecoilValue } from 'recoil';
import { isSignedInAtom, userPermissionLevelAtom } from '../../utils/atoms';
import { ParamList as TabParamList } from '../../utils/routes/tabs/paramList';
import { routes as tabRoutes } from '../../utils/routes/tabs/routes';
import { UserStatus } from '../../xplat/types';
import SignInOrRegister from './SignInOrRegister';
import VerifyEmail from './VerifyEmail';
import NotifyBanned from './NotifyBanned';

// Style for tab bar
const tabBarStyle = {
  backgroundColor: 'white',
};

// Tabs used for bottom tray, stack for in-tab nav
const Tabs = createBottomTabNavigator<TabParamList>();

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

  if (isSignedIn && userPermissionLevel === undefined)
    return (
      <Flex w="full" h="full" justifyContent="center" alignItems="center">
        <Spinner size="lg" />
      </Flex>
    );

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

export default EnsureAuth;
