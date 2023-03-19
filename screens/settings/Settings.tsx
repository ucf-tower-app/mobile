import {
  Text,
  VStack,
  HStack,
  Switch,
  useColorMode,
  useColorModeValue,
  ColorMode,
} from 'native-base';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { isAmoledEnabledAtom } from '../../utils/atoms';

const Settings = () => {
  const colorMode = useColorMode();
  const backgroundColor = useColorModeValue('lightMode.base', 'darkMode.base');

  const [selectedColorMode, setSelectedColorMode] = useState<ColorMode>();

  const [isAmoledEnabled, setIsAmoledEnabled] =
    useRecoilState(isAmoledEnabledAtom);

  useEffect(() => {
    setSelectedColorMode(colorMode.colorMode);
  }, [colorMode.colorMode]);

  return (
    <VStack p={4} bg={backgroundColor} h="full" space={3}>
      <HStack w="full" justifyContent="space-between" alignItems="center">
        <Text>Dark mode</Text>

        {/* Don't allow the user to toggle the switch before it's done changing */}
        <Switch
          disabled={colorMode.colorMode !== selectedColorMode}
          value={selectedColorMode === 'dark'}
          onToggle={() => {
            setSelectedColorMode(
              selectedColorMode === 'light' ? 'dark' : 'light'
            );
            colorMode.toggleColorMode();
          }}
        />
      </HStack>

      {colorMode.colorMode === 'dark' ? (
        <HStack w="full" justifyContent="space-between" alignItems="center">
          <Text>AMOLED Dark</Text>
          <Switch
            value={isAmoledEnabled}
            onToggle={() => setIsAmoledEnabled(!isAmoledEnabled)}
          />
        </HStack>
      ) : null}
    </VStack>
  );
};

export default Settings;
