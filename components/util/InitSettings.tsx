import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSetRecoilState } from 'recoil';
import { isAmoledEnabledAtom } from '../../utils/atoms';

const InitSettings = () => {
  const setIsAmoledEnabled = useSetRecoilState(isAmoledEnabledAtom);

  useEffect(() => {
    AsyncStorage.getItem('isAmoledEnabled').then((val) => {
      if (val !== null) setIsAmoledEnabled(val === 'true');
    });
  }, [setIsAmoledEnabled]);

  return null;
};

export default InitSettings;
