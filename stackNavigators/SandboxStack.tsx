import { ParamList as SandboxParamList } from '../utils/routes/sandbox/paramList';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { routes as sandboxRoutes } from '../utils/routes/sandbox/routes';
import { Route } from '../utils/routes/sandbox/routes';

const Stack = createNativeStackNavigator<SandboxParamList>();

const SearchStack = () => {
  return (
    <Stack.Navigator initialRouteName={sandboxRoutes[0].name}>
      {sandboxRoutes.map((route: Route) => (
        <Stack.Screen
          name={route.name}
          component={route.component}
          key={route.name}
        />
      ))}
    </Stack.Navigator>
  );
};

export default SearchStack;
