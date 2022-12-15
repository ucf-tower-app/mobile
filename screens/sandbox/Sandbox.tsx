import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Box, Button, ScrollView, Text } from 'native-base';
import {
  Name as RouteName,
  names as routeNames,
} from '../../utils/routes/sandbox/names';

type Props = {
  navigation: NativeStackNavigationProp<any, any>;
};
// List of buttons that navigate directly to test components in a dry environment
const Sandbox = ({ navigation }: Props) => {
  const buildEntryButton = (routeName: RouteName) => {
    return (
      <Button
        mx="2"
        my="1"
        onPress={() => navigation.push(routeName)}
        key={routeName}
      >
        <Text>{routeName}</Text>
      </Button>
    );
  };

  return (
    <Box>
      <ScrollView>{routeNames.map(buildEntryButton)}</ScrollView>
    </Box>
  );
};

export default Sandbox;
