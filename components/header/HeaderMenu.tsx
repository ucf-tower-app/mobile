import { useNavigation } from '@react-navigation/native';
import { Menu, Pressable } from 'native-base';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userPermissionLevelAtom } from '../../utils/atoms';
import { auth } from '../../xplat/Firebase';
import { UserStatus } from '../../xplat/types';
import ChangeEmailModal from '../profile/ChangeEmailModal';
import LightDarkIcon from '../util/LightDarkIcon';

export const PressableDots = (triggerProps: any) => {
  return (
    <Pressable {...triggerProps}>
      <LightDarkIcon name="ellipsis-horizontal" size="lg" />
    </Pressable>
  );
};

type Props = {
  hasPostOption?: boolean;
};
const HeaderMenu = ({ hasPostOption = false }: Props) => {
  const navigation = useNavigation();

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
        <Menu.Item onPress={() => navigation.navigate('Settings')}>
          Settings
        </Menu.Item>
        {hasPostOption ? (
          <Menu.Item
            onPress={() =>
              navigation.navigate('Tabs', {
                screen: 'HomeTab',
                params: {
                  screen: 'CreatePost',
                  params: {},
                },
              })
            }
          >
            Post
          </Menu.Item>
        ) : null}
      </Menu>
    </>
  );
};

export default HeaderMenu;

export const HeaderWithPostOption = () => <HeaderMenu hasPostOption />;
