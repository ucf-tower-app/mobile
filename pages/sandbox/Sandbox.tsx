import { Button, Text, ScrollView, Box } from 'native-base';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  names as routeNames,
  Name as RouteName,
} from '../../utils/routes/sandbox/names';

// List of buttons that navigate directly to test components in a dry environment
type Props = {
  navigation: NativeStackNavigationProp<any, any>;
};
export default function Sandbox({ navigation }: Props) {
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
}
