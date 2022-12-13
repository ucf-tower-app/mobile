import { ParamList as LeaderboardsParamList } from '../utils/routes/leaderboards/paramList';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { routes as leaderboardRoutes } from '../utils/routes/leaderboards/routes';
import { Route } from '../utils/routes/leaderboards/routes';

const Stack = createNativeStackNavigator<LeaderboardsParamList>();

const LeaderboardsStack = () => {
  return (
    <Stack.Navigator initialRouteName={leaderboardRoutes[0].name}>
      {leaderboardRoutes.map((route: Route) => (
        <Stack.Screen
          name={route.name}
          component={route.component}
          key={route.name}
        />
      ))}
    </Stack.Navigator>
  );
};

export default LeaderboardsStack;
