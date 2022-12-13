import { ParamList as SearchParamList } from '../utils/routes/search/paramList';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { routes as searchRoutes } from '../utils/routes/search/routes';
import { Route } from '../utils/routes/search/routes';

const Stack = createNativeStackNavigator<SearchParamList>();

const SearchStack = () => {
  return (
    <Stack.Navigator initialRouteName={searchRoutes[0].name}>
      {searchRoutes.map((route: Route) => (
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
