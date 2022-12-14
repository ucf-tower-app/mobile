import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { ParamList as LeaderboardsParamList } from '../leaderboards/paramList';

export type ParamList = {
  HomeTab: undefined;
  LeaderboardsTab: BottomTabScreenProps<LeaderboardsParamList>;
  ProfileTab: undefined;
  SearchTab: undefined;
  ActiveRoutesTab: undefined;
  SandboxTab: undefined;
};
