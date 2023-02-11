import { Ionicons } from '@expo/vector-icons';
import {
  Box,
  Center,
  HStack,
  Icon,
  Text,
  useColorModeValue,
  VStack,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { FetchedSend, Send as SendObj } from '../../xplat/types';
import UserTag from '../profile/UserTag';

type Props = {
  send: SendObj;
};
const Send = ({ send }: Props) => {
  //const navigation = useNavigation<TabGlobalNavigationProp>();

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  const [sendData, setSendData] = useState<FetchedSend>();
  const [routeName, setRouteName] = useState<string>();

  const realQR = useQuery(send.getId(), send.buildFetcher(), {
    enabled: !send.isMock(),
  });

  useEffect(() => {
    if (realQR.data) {
      const getRouteName = async () => {
        setRouteName(await realQR.data.route.getName());
      };
      setSendData(realQR.data);
      getRouteName();
    }
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
    <HStack w="full" bg={baseBgColor} space="3" p="2">
      <Center>
        <Icon
          as={<Ionicons name="trending-up" />}
          color="black"
          opacity={75}
          size="xl"
        />
      </Center>

      <VStack>
        <Box>
          <UserTag user={sendData.user} mini />
        </Box>
        <HStack>
          <Text>{routeName}</Text>
          <Text bold>{sendData.classifier.displayString}</Text>
        </HStack>
        <Text>{'Sent it on ' + sendData.timestamp.toLocaleDateString()}</Text>
      </VStack>
    </HStack>
  );
};

export default Send;
