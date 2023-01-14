import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ParamList as TabParamList } from '../tabs/paramList';

export type ParamList = {
  Tabs: NativeStackScreenProps<TabParamList>;
  Settings: undefined;
  LostAndFound: undefined;
  Tutorial: undefined;
};
