import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { ParamList as LeaderboardsParamList } from '../leaderboards/paramList';

export type ParamList = {
  HomeTab: undefined;
  LeaderboardsTab: BottomTabScreenProps<LeaderboardsParamList>;
  ActiveRoutesTab: undefined;
  SearchTab: undefined;
  ProfileTab: undefined;
  SandboxTab: undefined;
};
