import { NavigatorScreenParams } from '@react-navigation/native';
import { ParamList as LeaderboardsParamList } from '../leaderboards/paramList';
import { ParamList as ActiveRoutesParamList } from '../activeRoutes/paramList';

export type ParamList = {
  HomeTab: undefined;
  LeaderboardsTab: NavigatorScreenParams<LeaderboardsParamList>;
  ActiveRoutesTab: NavigatorScreenParams<ActiveRoutesParamList>;
  SearchTab: undefined;
  ProfileTab: undefined;
  SandboxTab: undefined;
};
