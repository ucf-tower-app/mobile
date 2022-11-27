import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, Text, VStack } from 'native-base';
import { PropMap } from '../../utils/routes/routes';

type Props = NativeStackScreenProps<PropMap, 'StatBox'>;
const StatBox = ({ route }: Props) => {
  return (
    <Pressable p={2} bg="white" onPress={route.params.onPress}>
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
              {route.params.stat}
            </Text>
            <Text fontSize="2xl" bold>
              {route.params.value}
            </Text>
          </VStack>
        );
      }}
    </Pressable>
  );
};

export default StatBox;
