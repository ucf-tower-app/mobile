import { Ionicons } from '@expo/vector-icons';
import {
  Box,
  Button,
  HStack,
  Icon,
  Modal,
  Text,
  useColorModeValue,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../../utils/atoms';

type Props = {
  isOpen: boolean;
  close: () => void;
  onShare: () => void;
};
const SendShareModal = ({ isOpen, close, onShare }: Props) => {
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');
  const user = useRecoilValue(userAtom);
  const signedInUserRQResult = useQuery([user?.getId()], user!.buildFetcher(), {
    enabled: user !== undefined,
  });

  const [preview, setPreview] = useState<JSX.Element>();

  useEffect(() => {
    if (signedInUserRQResult.data)
      setPreview(
        <HStack w="full" alignItems="flex-start" bg={baseBgColor}>
          <Icon
            as={<Ionicons name="trending-up" />}
            color="black"
            opacity={75}
            size="lg"
          />
          <Box pl="2">
            <Text fontSize="sm" fontWeight={'bold'}>
              {signedInUserRQResult.data.displayName}
            </Text>
          </Box>
          <Text>{' sent it on ' + new Date().toLocaleDateString()}</Text>
        </HStack>
      );
  }, [baseBgColor, signedInUserRQResult.data]);

  return (
    <Modal isOpen={isOpen} onClose={close} size="xl">
      <Modal.Content>
        <Modal.CloseButton />
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
