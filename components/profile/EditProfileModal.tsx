import {
  FormControl,
  Input,
  Modal,
  Button,
  Center,
  HStack,
  useColorModeValue,
  Box,
} from 'native-base';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { userAtom } from '../../utils/atoms';
import ChangeEmail from './ChangeEmail';
import ChangePassword from './ChangePassword';
import UploadImage from './UploadImage';

export type AvatarUrlData = {
  oldAvatarUrl: string;
  newAvatarUrl: string;
};

type Props = {
  isOpen: any;
  onClose: any;
};

/**
 * Modal that allow's the user to edit their profile.
 */
function EditProfileModal({ isOpen, onClose }: Props) {
  const [avatarUrlData, setAvatarUrlData] = useState<AvatarUrlData>({
    oldAvatarUrl: '',
    newAvatarUrl: '',
  });
  const [signedInUser, setSignedInUser] = useRecoilState(userAtom);
  const [viewChangePassword, setViewChangePassword] = useState<boolean>(false);
  const [viewChangeEmail, setViewChangeEmail] = useState<boolean>(false);

  const secondaryBgColor = useColorModeValue(
    'lightMode.secondary',
    'darkMode.secondary'
  );

  useEffect(() => {
    const getData = async () => {
      const avatarUrl = await signedInUser?.getAvatarUrl();
      if (avatarUrl) {
        setAvatarUrlData({
          oldAvatarUrl: avatarUrl,
          newAvatarUrl: avatarUrl,
        });
      }
    };
    getData();
  }, [signedInUser]);

  const handleClose = () => {
    setViewChangePassword(false);
    setViewChangeEmail(false);
    setAvatarUrlData({
      oldAvatarUrl: avatarUrlData.oldAvatarUrl,
      newAvatarUrl: avatarUrlData.oldAvatarUrl,
    });
    onClose();
  };

  const handleCancel = () => {
    if (viewChangePassword) {
      setViewChangePassword(false);
    } else if (viewChangeEmail) {
      setViewChangeEmail(false);
    } else {
      handleClose();
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <Modal.Content maxWidth="lg">
          <Modal.CloseButton />
          <Modal.Header>Edit Profile</Modal.Header>
          <Modal.Body>
            {viewChangePassword ? (
              <ChangePassword />
            ) : viewChangeEmail ? (
              <ChangeEmail />
            ) : (
              <Box>
                <Center>
                  <UploadImage
                    avatarUrlData={avatarUrlData}
                    setAvatarUrlData={setAvatarUrlData}
                  />
                </Center>
                <FormControl>
                  <FormControl.Label>Name</FormControl.Label>
                  <Input placeholder={signedInUser?.displayName} />
                </FormControl>
                <FormControl mt="3">
                  <FormControl.Label>Bio</FormControl.Label>
                  <Input placeholder={signedInUser?.bio} />
                </FormControl>
                <HStack pt="3" space="xs" justifyContent="space-between">
                  <Button
                    onPress={() => {
                      setViewChangePassword(true);
                    }}
                    size="sm"
                    bg={secondaryBgColor}
                  >
                    Change Password
                  </Button>
                  <Button
                    onPress={() => {
                      setViewChangeEmail(true);
                    }}
                    size="sm"
                    bg={secondaryBgColor}
                  >
                    Change Email
                  </Button>
                </HStack>
              </Box>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={handleCancel}
              >
                Cancel
              </Button>
              <Button bg={secondaryBgColor} onPress={handleClose}>
                Save
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
}

export default EditProfileModal;
