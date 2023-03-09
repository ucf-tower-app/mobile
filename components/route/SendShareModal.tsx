import {
  Box,
  Button,
  HStack,
  Modal,
  Text,
  useColorModeValue,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { useSignedInUserQuery } from '../../utils/hooks';
import Timestamp from '../media/Timestamp';
import LightDarkIcon from '../util/LightDarkIcon';

type Props = {
  isOpen: boolean;
  close: () => void;
  onShare: () => void;
  routeInfo: {
    name: string;
    gradeDisplayString: string;
  };
};
const SendShareModal = ({ isOpen, close, onShare, routeInfo }: Props) => {
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');
  const userQuery = useSignedInUserQuery();

  const [preview, setPreview] = useState<JSX.Element>();

  useEffect(() => {
    if (userQuery.data)
      setPreview(
        <HStack w="full" alignItems="flex-start" bg={baseBgColor}>
          <Box pl="2">
            <Text fontSize="sm" fontWeight={'bold'}>
              {userQuery.data.displayName.length <= 18
                ? userQuery.data.displayName
                : userQuery.data.displayName.slice(0, 15) + '...'}
            </Text>
          </Box>
          <LightDarkIcon name="trending-up" size="lg" />
          <Text pl={1}>{routeInfo.name}</Text>
          <Box pl={2}>
            <Timestamp relative date={new Date(Date.now())} />
          </Box>
        </HStack>
      );
  }, [baseBgColor, userQuery.data, routeInfo]);

  return (
    <Modal isOpen={isOpen} onClose={close} size="xl">
      <Modal.Content>
        <Modal.Header>
          Awesome! Do you want to share this send with everyone?
        </Modal.Header>
        <Modal.Body>
          <Text>Preview</Text>
          {preview}
        </Modal.Body>
        <Modal.Footer>
          <Button.Group>
            <Button onPress={onShare}>Sure!</Button>
            <Button onPress={close}>No thanks.</Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default SendShareModal;
