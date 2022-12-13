import { ParamList as ProfileParamList } from '../utils/routes/profile/paramList';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { routes as profileRoutes } from '../utils/routes/profile/routes';
import { Route } from '../utils/routes/profile/routes';

const Stack = createNativeStackNavigator<ProfileParamList>();

const ProfileStack = () => {
  return (
    <Stack.Navigator initialRouteName={profileRoutes[0].name}>
      {profileRoutes.map((route: Route) => (
        <Stack.Screen
          name={route.name}
          component={route.component}
          key={route.name}
        />
      ))}
    </Stack.Navigator>
  );
};

export default ProfileStack;
