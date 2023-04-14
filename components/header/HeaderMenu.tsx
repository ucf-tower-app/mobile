import { useNavigation } from '@react-navigation/native';
import { Menu, Pressable } from 'native-base';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userPermissionLevelAtom } from '../../utils/atoms';
import { auth } from '../../xplat/Firebase';
import { UserStatus } from '../../xplat/types';
import ChangeEmailModal from '../profile/ChangeEmailModal';
import LightDarkIcon from '../util/LightDarkIcon';
import { openURL } from 'expo-linking';
import { permissionLevelCanWrite } from '../../utils/permissions';

export const TERMS_OF_SERVICE_URL = 'https://tylerhm.dev/tower-eula';

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

  const shouldDisplayPostOption =
    hasPostOption && permissionLevelCanWrite(userPermissionLevel);

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
        <Menu.Item onPress={() => openURL(TERMS_OF_SERVICE_URL)}>
          Term of Service
        </Menu.Item>
        {shouldDisplayPostOption ? (
          <Menu.Item
            onPress={() =>
              navigation.navigate('Tabs', {
                screen: 'HomeTab',
                params: {
                  screen: 'Create Post',
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
