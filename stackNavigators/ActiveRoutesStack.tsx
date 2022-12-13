import { ParamList as ActiveRoutesParamList } from '../utils/routes/activeRoutes/paramList';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { routes as activeRoutesRoutes } from '../utils/routes/activeRoutes/routes';
import { Route } from '../utils/routes/activeRoutes/routes';

const Stack = createNativeStackNavigator<ActiveRoutesParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName={activeRoutesRoutes[0].name}>
      {activeRoutesRoutes.map((route: Route) => (
        <Stack.Screen
          name={route.name}
          component={route.component}
          key={route.name}
        />
      ))}
    </Stack.Navigator>
  );
};

export default HomeStack;
