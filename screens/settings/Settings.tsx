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

const Settings = () => {
  const colorMode = useColorMode();
  const backgroundColor = useColorModeValue('lightMode.base', 'darkMode.base');

  const [selectedColorMode, setSelectedColorMode] = useState<ColorMode>();

  useEffect(() => {
    setSelectedColorMode(colorMode.colorMode);
  }, [colorMode.colorMode]);

  return (
    <VStack p={4} bg={backgroundColor} h="full">
      <HStack w="full" justifyContent="space-between">
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
    </VStack>
  );
};

export default Settings;
