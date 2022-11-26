import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Box, Button, ScrollView, Text } from 'native-base';
import { useEffect } from 'react';
import { DeviceEventEmitter } from 'react-native';
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
  
  StatBox: {
    stat: 'Boulder',
    value: 'V5',
    onPressEventName: 'statBox.testEvent',
  },

  LostAndFoundCard: {
    title: 'Title',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quis leo turpis. Nullam rutrum tellus quis nisi luctus egestas. Ut tempor nibh fringilla lorem aliquet, nec vehicula mi volutpat. Quisque sagittis diam in tortor eleifend laoreet. In imperdiet nisl sit amet eros convallis pretium. Pellentesque in euismod dolor. Donec non quam sit amet dolor posuere dapibus. Duis dapibus est ullamcorper pellentesque pulvinar. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed turpis felis, maximus eget massa vel, accumsan pulvinar purus. Curabitur eleifend nibh quis ex venenatis, sit amet euismod nunc euismod. Sed efficitur enim eu quam eleifend, ut porttitor diam lobortis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent sit amet tempor nunc, eget posuere ipsum. Nulla facilisi.',
  },
};

// List of buttons that navigate directly to test components in a dry environment
type Props = NativeStackScreenProps<PropMap, 'Sandbox'>;
export default function Sandbox({ navigation }: Props) {
  useEffect(() => {
    DeviceEventEmitter.addListener('statBox.testEvent', () => {
      console.log('Statbox was pressed!');
    });

    return () => {
      DeviceEventEmitter.removeAllListeners('statBox.testEvent');
    };
  }, []);

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
