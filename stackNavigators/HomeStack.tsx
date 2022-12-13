import { ParamList as HomeParamList } from '../utils/routes/home/paramList';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { routes as homeRoutes } from '../utils/routes/home/routes';
import { Route } from '../utils/routes/home/routes';

const Stack = createNativeStackNavigator<HomeParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName={homeRoutes[0].name}>
      {homeRoutes.map((route: Route) => (
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
