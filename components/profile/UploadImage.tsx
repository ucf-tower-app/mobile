import * as ImagePicker from 'expo-image-picker';
import {
  Alert,
  Avatar,
  Box,
  Center,
  CloseIcon,
  Collapse,
  HStack,
  IconButton,
  Pressable,
  Text,
  VStack,
} from 'native-base';
import { useState } from 'react';
import Tintable from '../util/Tintable';

/**
 * Uses expo's Image Picker to choose an image from the device.
 */
type Props = {
  editAvatar: string;
  setEditAvatar: any;
};
const UploadImage = ({ editAvatar, setEditAvatar }: Props) => {
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  const addImage = async () => {
    if (!status?.granted) {
      requestPermission().then((response) => {
        if (!response.granted) setShowAlert(true);
      });
    } else {
      const _image = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0,
      });
      if (!_image.cancelled) {
        setEditAvatar(_image.uri);
      }
    }
  };

  return (
    <Box>
      {showAlert ? ( // Gets rid of the weird red line
        <Collapse isOpen={showAlert}>
          <Alert maxW="400" status={showAlert ? 'error' : undefined}>
            <HStack
              flexShrink={1}
              space={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <HStack flexShrink={1} space={2} alignItems="center">
                <Alert.Icon />
                <Text
                  fontSize="md"
                  fontWeight="medium"
                  _dark={{
                    color: 'coolGray.800',
                  }}
                >
                  Please grant camera roll permissions inside your system's
                  settings
                </Text>
              </HStack>
              <IconButton
                variant="unstyled"
                _focus={{
                  borderWidth: 0,
                }}
                icon={<CloseIcon size="3" />}
                _icon={{
                  color: 'coolGray.600',
                }}
                onPress={() => setShowAlert(false)}
              />
            </HStack>
          </Alert>
        </Collapse>
      ) : (
        <></>
      )}
      <Center>
        <VStack pt="2">
          <Pressable onPress={addImage}>
            {({ isHovered, isPressed }) => {
              return (
                <Box>
                  <Tintable tinted={isHovered || isPressed} rounded />
                  <Avatar
                    source={{ uri: editAvatar }}
                    bg="gray.300"
                    size="2xl"
                    mb={3}
                  />
                </Box>
              );
            }}
          </Pressable>

          <Text>Change profile picture</Text>
        </VStack>
      </Center>
    </Box>
  );
};

export default UploadImage;
