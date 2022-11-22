import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Box, Button, ScrollView, Text } from 'native-base';
import { PropMap } from '../../utils/routes/routes';
import {
  Name as RouteName,
  names as routeNames,
} from '../../utils/routes/sandbox/names';
import { PropMap as SandboxPropMap } from '../../utils/routes/sandbox/routes';

// Sandbox test data
const propMap: SandboxPropMap = {
  Sandbox: undefined,

  RouteRow: {
    thumbnail: 'https://wallpaperaccess.com/full/317501.jpg',
    name: 'Example route',
    grade: '10.9',
    tags: ['Solid, Dyno'],
  },

  ProfileBanner: {
    avatarUrl: 'https://tinyurl.com/498kzhpy',
    userName: 'Tyler Hostler-Mathis',
    userHandle: 'tylerhm',
  },
};

// List of buttons that navigate directly to test components in a dry environment
type Props = NativeStackScreenProps<PropMap, 'Sandbox'>;
export default function Sandbox({ navigation }: Props) {
  const buildEntryButton = (routeName: RouteName) => {
    return (
      <Button
        mx="2"
        my="1"
        onPress={() => navigation.push(routeName, propMap[routeName])}
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
