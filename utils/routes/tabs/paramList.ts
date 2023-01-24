import { NavigatorScreenParams } from '@react-navigation/native';
import { ParamList as LeaderboardsParamList } from '../leaderboards/paramList';
import { ParamList as ProfileParamList } from '../profile/paramList';

export type ParamList = {
  HomeTab: undefined;
  LeaderboardsTab: NavigatorScreenParams<LeaderboardsParamList>;
  ActiveRoutesTab: undefined;
  SearchTab: undefined;
  ProfileTab: NavigatorScreenParams<ProfileParamList>;
  SandboxTab: undefined;
};
