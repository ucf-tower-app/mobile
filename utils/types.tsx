import { CompositeScreenProps } from '@react-navigation/native';
import { ParamList as LeaderboardsTabParamList } from './routes/leaderboards/paramList';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { ParamList as TabParamList } from './routes/tabs/paramList';
import { ParamList as RootStackParamList } from './routes/root/paramList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type LeaderboardsScreenNavigationProp<
  T extends keyof LeaderboardsTabParamList
> = CompositeScreenProps<
  NativeStackScreenProps<LeaderboardsTabParamList, T>,
  CompositeScreenProps<
    BottomTabScreenProps<TabParamList>,
    NativeStackScreenProps<RootStackParamList>
  >
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
