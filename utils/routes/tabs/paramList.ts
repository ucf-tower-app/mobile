import { NavigatorScreenParams } from '@react-navigation/native';
import { ParamList as LeaderboardsParamList } from '../leaderboards/paramList';
import { ParamList as ActiveRoutesParamList } from '../activeRoutes/paramList';
import { ParamList as ProfileParamList } from '../profile/paramList';
import { ParamList as SearchParamList } from '../search/paramList';
import { ParamList as HomeParamList } from '../home/paramList';

export type ParamList = {
  HomeTab: NavigatorScreenParams<HomeParamList>;
  LeaderboardsTab: NavigatorScreenParams<LeaderboardsParamList>;
  ActiveRoutesTab: NavigatorScreenParams<ActiveRoutesParamList>;
  SearchTab: NavigatorScreenParams<SearchParamList>;
  ProfileTab: NavigatorScreenParams<ProfileParamList>;
};
