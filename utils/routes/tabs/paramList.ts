import { NavigatorScreenParams } from '@react-navigation/native';
import { ParamList as LeaderboardsParamList } from '../leaderboards/paramList';

export type ParamList = {
  HomeTab: undefined;
  LeaderboardsTab: NavigatorScreenParams<LeaderboardsParamList>;
  ActiveRoutesTab: undefined;
  SearchTab: undefined;
  ProfileTab: undefined;
  SandboxTab: undefined;
};
