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
import Timestamp from '../media/Timestamp';

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
  const user = useRecoilValue(userAtom);
  const signedInUserRQResult = useQuery([user?.getId()], user!.buildFetcher(), {
    enabled: user !== undefined,
  });

  const [preview, setPreview] = useState<JSX.Element>();

  useEffect(() => {
    if (signedInUserRQResult.data)
      setPreview(
        <HStack w="full" alignItems="flex-start" bg={baseBgColor}>
          <Box pl="2">
            <Text fontSize="sm" fontWeight={'bold'}>
              {signedInUserRQResult.data.displayName.length <= 18
                ? signedInUserRQResult.data.displayName
                : signedInUserRQResult.data.displayName.slice(0, 15) + '...'}
            </Text>
          </Box>
          <Icon
            as={<Ionicons name="trending-up" />}
            color="black"
            opacity={75}
            size="lg"
          />
          <Text pl={1}>{routeInfo.name}</Text>
          <Box pl={2}>
            <Timestamp relative date={new Date(Date.now())} />
          </Box>
        </HStack>
      );
  }, [baseBgColor, signedInUserRQResult.data, routeInfo]);

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
