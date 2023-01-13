import { NavigatorScreenParams } from '@react-navigation/native';
import { ParamList as TabParamList } from '../tabs/paramList';

export type ParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  Settings: undefined;
  LostAndFound: undefined;
  Tutorial: undefined;
};
