import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Flex, Spinner } from 'native-base';
import 'react-native-gesture-handler';
import { useRecoilState } from 'recoil';
import {
  isEmailVerifiedAtom,
  isInitializingAtom,
  isSignedInAtom,
} from '../../utils/atoms';
import { ParamList as RootTabParamList } from '../../utils/routes/tabs/paramList';
import { routes as tabRoutes } from '../../utils/routes/tabs/routes';
import SignInOrRegister from './SignInOrRegister';
import VerifyEmail from './VerifyEmail';

// Style for tab bar
const tabBarStyle = {
  backgroundColor: 'white',
};

// Tabs used for bottom tray, stack for in-tab nav
const Tabs = createMaterialBottomTabNavigator<RootTabParamList>();

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
  const [isInitializing] = useRecoilState(isInitializingAtom);
  const [isSignedIn] = useRecoilState(isSignedInAtom);
  const [isEmailVerified] = useRecoilState(isEmailVerifiedAtom);

  if (isInitializing)
    return (
      <Flex w="full" h="full" justifyContent="center" alignItems="center">
        <Spinner size="lg" />
      </Flex>
    );

  if (!isSignedIn) {
    return <SignInOrRegister />;
  }

  if (!isEmailVerified) {
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
