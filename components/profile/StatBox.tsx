import { Pressable, Text, VStack, useColorModeValue } from 'native-base';

type Props = {
  stat: string;
  value: string;
  onPress: () => void;
};
const StatBox = ({ stat, value, onPress }: Props) => {
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');
  const primaryBgColor = useColorModeValue(
    'lightMode.primary',
    'darkMode.primary'
  );

  return (
    <Pressable p={2} bg={baseBgColor} onPress={onPress}>
      {({ isHovered, isPressed }) => {
        return (
          <VStack
            bg={isPressed || isHovered ? primaryBgColor : baseBgColor}
            justifyContent="center"
            alignItems="center"
          >
            <Text fontSize="xl" color="gray.400">
              {stat}
            </Text>
            <Text fontSize="2xl" bold>
              {value}
            </Text>
          </VStack>
        );
      }}
    </Pressable>
  );
};

export default StatBox;
