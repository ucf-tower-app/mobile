import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Flex, Spinner } from 'native-base';
import { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import { ParamList as RootTabParamList } from '../../utils/routes/tabs/paramList';
import { routes as tabRoutes } from '../../utils/routes/tabs/routes';
import { auth } from '../../xplat/Firebase';
import SignInOrRegister from './SignInOrRegister';
import VerifyEmail from './VerifyEmail';
import { signedInState, userState } from '../../utils/atoms';
import { useRecoilState, useSetRecoilState } from 'recoil';

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
  const [initializing, setInitializing] = useState<boolean>(true);
  const [signedIn, setSignedIn] = useRecoilState(signedInState);
  const setUser = useSetRecoilState(userState);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(
    auth.currentUser?.emailVerified ?? false
  );

  // Listen to firebase authentication changes
  useEffect(() => {
    const updateUserStatus = (user: any) => {
      setUser(user);
      if (user !== null) {
        setSignedIn(true);
        setIsEmailVerified(user.emailVerified);
      } else {
        setSignedIn(false);
        setIsEmailVerified(false);
      }
      setInitializing(false);
    };
    return auth.onAuthStateChanged(updateUserStatus);
  }, [setSignedIn, setUser]);

  if (initializing)
    return (
      <Flex w="full" h="full" justifyContent="center" alignItems="center">
        <Spinner size="lg" />
      </Flex>
    );

  if (!signedIn) {
    return <SignInOrRegister />;
  }

  if (!isEmailVerified) {
    return <VerifyEmail setIsEmailVerified={setIsEmailVerified} />;
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
