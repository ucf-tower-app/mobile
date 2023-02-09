import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Box, HStack, Icon, Text, useColorModeValue } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { TabGlobalNavigationProp } from '../../utils/types';
import { FetchedSend, Send as SendObj } from '../../xplat/types';
import UserTag from '../profile/UserTag';

type Props = {
  send: SendObj;
};
const Send = ({ send }: Props) => {
  //const navigation = useNavigation<TabGlobalNavigationProp>();

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  const [sendData, setSendData] = useState<FetchedSend>();

  const realQR = useQuery(send.getId(), send.buildFetcher(), {
    enabled: !send.isMock(),
  });

  useEffect(() => {
    if (realQR.data) setSendData(realQR.data);
  }, [realQR.data]);

  useEffect(() => {
    if (send.isMock()) {
      send.fetch().then(setSendData);
    }
  }, [send]);

  if (send.isMock()) {
    if (sendData === undefined) return null;
  } else {
    if (realQR.isError) {
      console.error(realQR.error);
      return null;
    }
    if (realQR.isLoading || sendData === undefined) return null;
  }

  return (
    <HStack w="full" alignItems="flex-start" bg={baseBgColor}>
      <Icon
        as={<Ionicons name="trending-up" />}
        color="black"
        opacity={75}
        size="xl"
      />
      <Box pl={2}>
        <UserTag user={sendData.user} mini />
      </Box>

      <Box pl={2}>
        <Text>{'Sent it on ' + sendData.timestamp.toLocaleDateString()}</Text>
      </Box>
    </HStack>
  );
};

export default Send;
