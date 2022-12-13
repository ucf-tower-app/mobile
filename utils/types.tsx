import { CompositeScreenProps } from '@react-navigation/native';
import { ParamList as LeaderboardsTabParamList } from './routes/leaderboards/paramList';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { ParamList as RootTabParamList } from './routes/tabs/paramList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type LeaderboardsScreenNavigationProp<
  T extends keyof LeaderboardsTabParamList
> = CompositeScreenProps<
  NativeStackScreenProps<LeaderboardsTabParamList, T>,
  BottomTabScreenProps<RootTabParamList>
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
