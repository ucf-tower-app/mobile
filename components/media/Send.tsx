import { Ionicons } from '@expo/vector-icons';
import {
  Center,
  HStack,
  Icon,
  Skeleton,
  Text,
  useColorModeValue,
  VStack,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useIconColor } from '../../utils/hooks';
import { FetchedSend, Send as SendObj } from '../../xplat/types';
import RouteLink from '../route/RouteLink';
import Timestamp from './Timestamp';

export const SendSkeleton = () => {
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  return (
    <HStack w="full" bg={baseBgColor} space="3" p="3">
      <Center>
        <Skeleton rounded="full" />
      </Center>
      <Skeleton.Text p={2} lines={3} />
    </HStack>
  );
};

type Props = {
  send: SendObj;
};
const Send = ({ send }: Props) => {
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');
  const iconColor = useIconColor();

  const [sendData, setSendData] = useState<FetchedSend>();

  const realQR = useQuery(send.getId(), send.buildFetcher(), {
    enabled: !send.isMock(),
  });

  useEffect(() => {
    if (realQR.data) {
      setSendData(realQR.data);
    }
  }, [realQR.data]);

  useEffect(() => {
    if (send.isMock()) {
      send.fetch().then(setSendData);
    }
  }, [send]);

  if (send.isMock()) {
    if (sendData === undefined) return <SendSkeleton />;
  } else {
    if (realQR.isError) {
      console.error(realQR.error);
      return null;
    }
    if (realQR.isLoading || sendData === undefined) return <SendSkeleton />;
  }

  return (
    <HStack w="full" bg={baseBgColor} space="3" p="3">
      <Center>
        <Icon as={Ionicons} name="trending-up" size="xl" bg={iconColor} />
      </Center>
      <VStack>
        <HStack>
          <RouteLink routeName={sendData.routeName} noPadding />
          <Text bold> {sendData.classifier.displayString}</Text>
        </HStack>
        <Timestamp relative date={sendData.timestamp} />
      </VStack>
    </HStack>
  );
};

export default Send;
