import { Ionicons } from '@expo/vector-icons';
import {
  Box,
  Center,
  HStack,
  Icon,
  Text,
  useColorModeValue,
} from 'native-base';
import React from 'react';
import { LeaderboardEntry } from '../../xplat/queries';
import UserTag from '../profile/UserTag';

const suffixes = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'];
const formatOrdinals = (n: number) => {
  return `${n}${suffixes[n % 10]}`;
};

type Props = {
  ranking: number;
  data: LeaderboardEntry;
};
const LeaderboardRow = ({ ranking, data }: Props) => {
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  return (
    <Center>
      <HStack
        shadow="1"
        p={2}
        rounded="full"
        width="95%"
        bg={baseBgColor}
        alignItems="center"
      >
        <Box pl={2} width="15%">
          <Text fontSize="lg">{formatOrdinals(ranking)}</Text>
        </Box>
        <Box width="64%">
          <UserTag user={data.user} />
        </Box>
        <Box width="13%">
          <Icon as={<Ionicons name="trending-up" />} size="2xl" />
        </Box>
        <Box width="10%">
          <Text fontSize="lg" fontWeight="bold">
            {data.sends}
          </Text>
        </Box>
      </HStack>
    </Center>
  );
};

export default LeaderboardRow;
