import { Ionicons } from '@expo/vector-icons';
import { Icon, Menu, Pressable } from 'native-base';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userPermissionLevelAtom } from '../../utils/atoms';
import { auth } from '../../xplat/Firebase';
import { UserStatus } from '../../xplat/types';
import ChangeEmailModal from '../profile/ChangeEmailModal';

export const PressableDots = (triggerProps: any) => {
  return (
    <Pressable {...triggerProps}>
      <Icon as={Ionicons} name="ellipsis-horizontal" color="black" size="lg" />
    </Pressable>
  );
};

const HeaderMenu = () => {
  const userPermissionLevel = useRecoilValue(userPermissionLevelAtom);
  const [changeEmail, setChangeEmail] = useState<boolean>(false);

  return (
    <>
      <ChangeEmailModal
        isConfirming={changeEmail}
        close={() => setChangeEmail(false)}
      />
      <Menu trigger={PressableDots}>
        {userPermissionLevel === UserStatus.Verified ? (
          <Menu.Item onPress={() => setChangeEmail(true)}>
            Verify Knights Email
          </Menu.Item>
        ) : null}
        <Menu.Item onPress={() => auth.signOut()}>Logout</Menu.Item>
      </Menu>
    </>
  );
};

export default HeaderMenu;
