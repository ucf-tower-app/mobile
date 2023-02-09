import { Ionicons } from '@expo/vector-icons';
import { HStack, Icon, Menu, Pressable } from 'native-base';
import { auth } from '../../xplat/Firebase';

type Props = {
  navigate: Function;
};

export const PressableDots = (triggerProps: any) => {
  return (
    <Pressable {...triggerProps}>
      <Icon as={Ionicons} name="ellipsis-horizontal" color="black" size="lg" />
    </Pressable>
  );
};

const HeaderMenu = ({ navigate }: Props) => {
  return (
    <HStack space={3}>
      <Menu
        trigger={(triggerProps) => {
          return PressableDots(triggerProps);
        }}
      >
        <Menu.Item onPress={() => navigate('Settings')}>Settings</Menu.Item>
        <Menu.Item onPress={() => navigate('Tutorial')}>Tutorial</Menu.Item>
        <Menu.Item onPress={() => navigate('LostAndFound')}>
          Lost and Found
        </Menu.Item>
        <Menu.Item onPress={() => auth.signOut()}>Logout</Menu.Item>
      </Menu>
    </HStack>
  );
};

export default HeaderMenu;
