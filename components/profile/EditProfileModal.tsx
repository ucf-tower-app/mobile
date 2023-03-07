import { manipulateAsync } from 'expo-image-manipulator';
import {
  Box,
  Button,
  Center,
  FormControl,
  HStack,
  Input,
  KeyboardAvoidingView,
  Modal,
  Switch,
  Text,
  useColorModeValue,
} from 'native-base';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { queryClient } from '../../App';
import { userAtom } from '../../utils/atoms';
import { USER_CACHE_KEY } from '../../utils/queries';
import { DebounceSession } from '../../utils/utils';
import { validBio, validDisplayname } from '../../xplat/api';
import { FetchedUser } from '../../xplat/types';
import ChangeEmailModal from './ChangeEmailModal';
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
  const [openModal, setOpenModal] = useState<boolean>(isOpen);

  const [oldPwd, setOldPwd] = useState<string>();
  const [newPwd, setNewPwd] = useState<string>();
  const [confirmPwd, setConfirmPwd] = useState<string>();

  const [hideSpoilers, setHideSpoilers] = useState(fetchedUser.hideSpoilers);

  const [bioSession] = useState<DebounceSession>(new DebounceSession(500));
  const [newBio, setNewBio] = useState<string>();
  const [dispNameSession] = useState<DebounceSession>(new DebounceSession(500));
  const [newDisplayName, setNewDisplayName] = useState<string>();

  const secondaryBgColor = useColorModeValue(
    'lightMode.secondary',
    'darkMode.secondary'
  );

  const handleCancel = () => {
    if (viewChangePassword) {
      setOldPwd(undefined);
      setNewPwd(undefined);
      setConfirmPwd(undefined);
      setViewChangePassword(false);
    } else if (viewChangeEmail) {
      setViewChangeEmail(false);
    } else {
      setNewBio(undefined);
      setNewDisplayName(undefined);
      setViewChangePassword(false);
      setViewChangeEmail(false);
      setEditAvatar(fetchedUser.avatarUrl);
      onClose();
    }
  };

  const invalidDisplayName =
    newDisplayName !== undefined && !validDisplayname(newDisplayName);

  const invalidBio = newBio !== undefined && !validBio(newBio);

  const handleSave = async () => {
    if (viewChangePassword) {
      if (signedInUser && oldPwd && newPwd) {
        await signedInUser
          .changePassword(oldPwd, newPwd)
          .catch(console.error)
          .then(() => handleCancel());
      }
      return;
    }
    const tasks = [];
    if (editAvatar !== fetchedUser.avatarUrl) {
      tasks.push(
        manipulateAsync(editAvatar, [{ resize: { height: 180, width: 180 } }])
          .then(async (imageRes) => fetch(imageRes.uri))
          .then((resp) => resp.blob())
          .then((blob) => fetchedUser.userObject.setAvatar(blob))
          .then(() =>
            queryClient.invalidateQueries({
              queryKey: ['avatar', fetchedUser.userObject.getId()],
            })
          )
          .catch(console.error)
      );
    }

    if (newBio && !invalidBio)
      tasks.push(fetchedUser.userObject.setBio(newBio).catch(console.error));

    if (newDisplayName && !invalidDisplayName)
      tasks.push(
        fetchedUser.userObject
          .setDisplayName(newDisplayName)
          .then(() =>
            queryClient.invalidateQueries({ queryKey: [USER_CACHE_KEY] })
          )
          .catch(console.error)
      );

    // Await all the updates, *then* force a re-fetch. Otherwise we'd just have some half-updated data :/
    if (tasks.length > 0)
      Promise.all(tasks).then(() =>
        queryClient
          .invalidateQueries({
            queryKey: [fetchedUser.userObject.docRef!.id],
          })
          .catch(console.error)
      );

    handleCancel();
  };

  return (
    <Center>
      <Modal isOpen={openModal} onClose={handleCancel}>
        <KeyboardAvoidingView behavior="padding" w="full" alignItems="center">
          <Modal.Content maxWidth="lg">
            <Modal.CloseButton />
            <Modal.Header>Edit Profile</Modal.Header>
            <Modal.Body>
              {viewChangePassword ? (
                <ChangePassword
                  setOldPwd={setOldPwd}
                  setNewPwd={setNewPwd}
                  setConfirmPwd={setConfirmPwd}
                  newPwd={newPwd}
                  confirmPwd={confirmPwd}
                />
              ) : (
                <Box>
                  <Center>
                    <UploadImage
                      editAvatar={editAvatar}
                      setEditAvatar={setEditAvatar}
                    />
                  </Center>
                  <FormControl isInvalid={invalidDisplayName}>
                    <FormControl.Label>Name</FormControl.Label>
                    <Input
                      placeholder={signedInUser?.displayName}
                      onChangeText={(e) =>
                        dispNameSession.trigger(() =>
                          setNewDisplayName(e.trim())
                        )
                      }
                    />
                    <FormControl.ErrorMessage>
                      Display Name must be 5-20 Upper/Lowercase letters, spaces,
                      and hyphens
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl mt="3" isInvalid={invalidBio}>
                    <FormControl.Label>Bio</FormControl.Label>
                    <Input
                      placeholder={signedInUser?.bio}
                      onChangeText={(e) =>
                        bioSession.trigger(() => setNewBio(e.trim()))
                      }
                    />
                    <FormControl.ErrorMessage>
                      Bio must be at most 200 characters
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <HStack mt={1} alignItems={'center'}>
                    <Text>Hide posts that contain beta spoilers</Text>
                    <Switch
                      defaultIsChecked={fetchedUser.hideSpoilers}
                      onValueChange={setHideSpoilers}
                      size="sm"
                    />
                  </HStack>

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
                        setOpenModal(false);
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
        </KeyboardAvoidingView>
      </Modal>
      <ChangeEmailModal
        isConfirming={viewChangeEmail}
        close={() => {
          setViewChangeEmail(false);
          setOpenModal(true);
        }}
        closeAllModals={() => {
          setViewChangeEmail(false);
          setOpenModal(false);
          handleCancel();
        }}
      />
    </Center>
  );
}

export default EditProfileModal;
