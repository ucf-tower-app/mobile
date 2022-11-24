import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Divider, Box, VStack } from 'native-base';
import { PropMap } from '../../utils/routes/routes';

type Props = NativeStackScreenProps<PropMap, 'LostAndFoundCard'>;
const LostAndFoundCard = ({ route }: Props) => {
  return (
    <Box borderRadius="md">
      <VStack space="4" divider={<Divider />}>
        <Box px="4" pt="4">
          {route.params.title}
        </Box>
        <Box px="4">
          {route.params.description}
        </Box>
      </VStack>
    </Box>
  );
};

export default LostAndFoundCard;