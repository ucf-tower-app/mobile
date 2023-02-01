import {
  CompositeNavigationProp,
  CompositeScreenProps,
} from '@react-navigation/native';
import { ParamList as LeaderboardsTabParamList } from './routes/leaderboards/paramList';
import {
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import { ParamList as TabParamList } from './routes/tabs/paramList';
import { ParamList as RootStackParamList } from './routes/root/paramList';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { ParamList as TabGlobalParamList } from './routes/tabGlobal/paramList';

export type LeaderboardsScreenProps<T extends keyof LeaderboardsTabParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<LeaderboardsTabParamList, T>,
    CompositeScreenProps<
      BottomTabScreenProps<TabParamList>,
      NativeStackScreenProps<RootStackParamList>
    >
  >;

export type TabGlobalScreenProps<T extends keyof TabGlobalParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<TabGlobalParamList, T>,
    CompositeScreenProps<
      BottomTabScreenProps<TabParamList>,
      NativeStackScreenProps<RootStackParamList>
    >
  >;

export type TabGlobalNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<TabGlobalParamList>,
  CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList>,
    NativeStackNavigationProp<RootStackParamList>
  >
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
