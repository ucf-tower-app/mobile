import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Box, Text, VStack } from 'native-base';
import { PropMap } from '../../../../utils/routes/routes';

type Props = NativeStackScreenProps<PropMap, 'StatBox'>;
const StatBox = ({ route }: Props) => {
  return (
    <Box>
      <VStack>
        <Text>{route.params.stat}</Text>
        <Text>{route.params.value}</Text>
      </VStack>
    </Box>
  );
};

export default StatBox;
