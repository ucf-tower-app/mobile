import { manipulateAsync } from 'expo-image-manipulator';
import {
  Box,
  Button,
  Center,
  FormControl,
  HStack,
  Input,
  Modal,
  useColorModeValue,
} from 'native-base';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { queryClient } from '../../App';
import { userAtom } from '../../utils/atoms';
import { FetchedUser } from '../../utils/queries';
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
  fetchedUser: FetchedUser;
};

/**
 * Modal that allow's the user to edit their profile.
 */
function EditProfileModal({ isOpen, onClose, fetchedUser }: Props) {
  const [editAvatar, setEditAvatar] = useState(fetchedUser.avatarUrl);
  const [signedInUser] = useRecoilState(userAtom);
  const [viewChangePassword, setViewChangePassword] = useState<boolean>(false);
  const [viewChangeEmail, setViewChangeEmail] = useState<boolean>(false);

  const secondaryBgColor = useColorModeValue(
    'lightMode.secondary',
    'darkMode.secondary'
  );

  const handleCancel = () => {
    if (viewChangePassword) {
      setViewChangePassword(false);
    } else if (viewChangeEmail) {
      setViewChangeEmail(false);
    } else {
      setViewChangePassword(false);
      setViewChangeEmail(false);
      setEditAvatar(fetchedUser.avatarUrl);
      onClose();
    }
  };

  const handleSave = () => {
    // Save the stuff
    const tasks = [];
    if (editAvatar !== fetchedUser.avatarUrl) {
      tasks.push(
        manipulateAsync(editAvatar, [{ resize: { height: 180, width: 180 } }])
          .then(async (imageRes) => fetch(imageRes.uri))
          .then((resp) => resp.blob())
          .then((blob) => fetchedUser.__userObject.setAvatar(blob))
          .catch(console.error)
      );
    }

    // Await all the updates, *then* force a re-fetch. Otherwise we'd just have some half-updated data :/
    Promise.all(tasks).then(() =>
      queryClient
        .invalidateQueries({
          queryKey: [fetchedUser.__userObject.docRef!.id],
        })
        .catch(console.error)
    );

    handleCancel();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel}>
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
                  editAvatar={editAvatar}
                  setEditAvatar={setEditAvatar}
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
            <Button bg={secondaryBgColor} onPress={handleSave}>
              Save
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

export default EditProfileModal;
