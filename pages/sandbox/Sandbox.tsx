import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
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
      <TouchableOpacity
        onPress={() => navigation.push(routeName)}
        style={styles.entryButton}
        key={routeName}
      >
        <Text style={styles.entryText}>{routeName}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>{routeNames.map(buildEntryButton)}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    padding: '10%',
  },
  entryButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 50,
    padding: 5,
    marginBottom: 5,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 2,
    backgroundColor: 'azure',
  },
  entryText: {
    fontSize: 30,
    fontWeight: '600',
  },
});
