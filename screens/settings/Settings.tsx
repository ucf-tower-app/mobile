import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  HStack,
  Switch,
  Text,
  VStack,
  useColorMode,
  useColorModeValue,
} from 'native-base';
import { useRecoilState } from 'recoil';
import { hideSpoilersAtom } from '../../utils/atoms';

const Settings = () => {
  const colorMode = useColorMode();
  const backgroundColor = useColorModeValue('lightMode.base', 'darkMode.base');
  const [hideSpoilers, setHideSpoilersAtom] = useRecoilState(hideSpoilersAtom);

  const toggleHideSpoilers = () => {
    AsyncStorage.setItem('@hideSpoilers', (!hideSpoilers).toString()).then(() =>
      setHideSpoilersAtom(!hideSpoilers)
    );
  };

  return (
    <VStack p={4} bg={backgroundColor} h="full">
      <HStack w="full" justifyContent="space-between">
        <Text>Dark mode</Text>
        <Switch
          value={colorMode.colorMode === 'dark'}
          onToggle={colorMode.toggleColorMode}
        />
      </HStack>
      <HStack pt={2} w="full" justifyContent="space-between">
        <Text>Hide posts w/ Beta Spoilers</Text>
        <Switch value={hideSpoilers} onToggle={toggleHideSpoilers} />
      </HStack>
    </VStack>
  );
};

export default Settings;
