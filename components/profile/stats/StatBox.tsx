import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, Text, VStack, Center } from 'native-base';
import { DeviceEventEmitter } from 'react-native';
import { PropMap } from '../../../utils/routes/routes';

type Props = NativeStackScreenProps<PropMap, 'StatBox'>;
const StatBox = ({ route }: Props) => {
  return (
    <Pressable
      p={2}
      bg="white"
      onPress={() => {
        DeviceEventEmitter.emit(route.params.onPressEventName);
      }}
    >
      {({ isHovered, isPressed }) => {
        return (
          <VStack
            bg={
              isPressed ? 'coolGray.100' : isHovered ? 'coolGray.100' : 'white'
            }
          >
            <Center>
              <Text fontSize="xl" color="gray.400">
                {route.params.stat}
              </Text>
            </Center>
            <Center>
              <Text fontSize="2xl" bold>
                {route.params.value}
              </Text>
            </Center>
          </VStack>
        );
      }}
    </Pressable>
  );
};

export default StatBox;
