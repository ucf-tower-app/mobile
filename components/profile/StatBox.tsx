import { Pressable, Text, VStack } from 'native-base';

type Props = {
  stat: string;
  value: string;
  onPress: () => void;
};
const StatBox = ({ stat, value, onPress }: Props) => {
  return (
    <Pressable p={2} bg="white" onPress={onPress}>
      {({ isHovered, isPressed }) => {
        return (
          <VStack
            bg={
              isPressed ? 'coolGray.100' : isHovered ? 'coolGray.100' : 'white'
            }
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
