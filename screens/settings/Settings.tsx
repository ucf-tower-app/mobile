import {
  Text,
  VStack,
  HStack,
  Switch,
  useColorMode,
  useColorModeValue,
} from 'native-base';

const Settings = () => {
  const colorMode = useColorMode();
  const backgroundColor = useColorModeValue('lightMode.base', 'darkMode.base');

  return (
    <VStack p={4} bg={backgroundColor} h="full">
      <HStack w="full" justifyContent="space-between">
        <Text>Dark mode</Text>
        <Switch
          value={colorMode.colorMode === 'dark'}
          onToggle={colorMode.toggleColorMode}
        />
      </HStack>
    </VStack>
  );
};

export default Settings;
