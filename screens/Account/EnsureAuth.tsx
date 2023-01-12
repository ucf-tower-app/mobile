import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import { tabNameToRouteData } from '../../utils/routes/routes';
import { Name as TabName } from '../../utils/routes/tabs/names';
import { ParamList as RootTabParamList } from '../../utils/routes/tabs/paramList';
import { routes as tabRoutes } from '../../utils/routes/tabs/routes';
import SignInOrRegister from './SignInOrRegister';
import { auth } from '../../xplat/Firebase';
import VerifyEmail from './VerifyEmail';

// Style for tab bar
const tabBarStyle = {
  backgroundColor: 'white',
};

// Tabs used for bottom tray, stack for in-tab nav
const Tabs = createMaterialBottomTabNavigator<RootTabParamList>();

// Builds a navigator stack for a given tab
const buildStack = (tabName: TabName, Stack: any) => {
  const routeData = tabNameToRouteData[tabName];
  return () => {
    return (
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

const EnsureAuth = () => {
  const [initializing, setInitializing] = useState<boolean>(true);
  const [signedIn, setSignedIn] = useState<boolean>(false);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(
    auth.currentUser?.emailVerified ?? false
  );

  const onUserStateChanged = (user: any) => {
    if (user !== null) {
      setSignedIn(true);
      setIsEmailVerified(user.emailVerified);
    } else {
      setSignedIn(false);
      setIsEmailVerified(false);
    }
    setInitializing(false);
  };

  // Listen to firebase authentication changes
  useEffect(() => {
    const unsubscribers: Array<() => void> = [];
    unsubscribers.push(auth.onAuthStateChanged(onUserStateChanged));
    unsubscribers.push(auth.onIdTokenChanged(onUserStateChanged));
    return () => {
      unsubscribers.forEach((handle) => handle());
    };
  }, []);

  // TODO, render spinner
  if (initializing) return null;

  if (!signedIn) {
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
          component={buildStack(route.name, route.stack)}
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
