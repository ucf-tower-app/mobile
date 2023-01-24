import { NavigatorScreenParams } from '@react-navigation/native';
import { ParamList as LeaderboardsParamList } from '../leaderboards/paramList';
import { ParamList as ActiveRoutesParamList } from '../activeRoutes/paramList';
import { ParamList as ProfileParamList } from '../profile/paramList';

export type ParamList = {
  HomeTab: undefined;
  LeaderboardsTab: NavigatorScreenParams<LeaderboardsParamList>;
  ActiveRoutesTab: NavigatorScreenParams<ActiveRoutesParamList>;
  SearchTab: undefined;
  ProfileTab: NavigatorScreenParams<ProfileParamList>;
  SandboxTab: undefined;
};
