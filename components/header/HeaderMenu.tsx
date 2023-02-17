import { Ionicons } from '@expo/vector-icons';
import { Box, HStack, Icon, Menu, Pressable } from 'native-base';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userPermissionLevelAtom } from '../../utils/atoms';
import { auth } from '../../xplat/Firebase';
import { UserStatus } from '../../xplat/types';
import ChangeEmailModal from '../profile/ChangeEmailModal';

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
  const userPermissionLevel = useRecoilValue(userPermissionLevelAtom);
  const [changeEmail, setChangeEmail] = useState<boolean>(false);

  return (
    <Box>
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
          {userPermissionLevel === UserStatus.Verified ? (
            <Menu.Item onPress={() => setChangeEmail(true)}>
              Verify Knights Email
            </Menu.Item>
          ) : null}
          <Menu.Item onPress={() => auth.signOut()}>Logout</Menu.Item>
        </Menu>
      </HStack>
      <ChangeEmailModal
        isConfirming={changeEmail}
        close={() => setChangeEmail(false)}
      />
    </Box>
  );
};

export default HeaderMenu;
