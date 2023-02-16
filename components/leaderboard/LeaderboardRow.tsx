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

const pr = new Intl.PluralRules('en-US', { type: 'ordinal' });

const suffixes = new Map([
  ['one', 'st'],
  ['two', 'nd'],
  ['few', 'rd'],
  ['other', 'th'],
]);
const formatOrdinals = (n: number) => {
  const rule = pr.select(n);
  const suffix = suffixes.get(rule);
  return `${n}${suffix}`;
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
        rounded="full"
        width="95%"
        bg={baseBgColor}
        alignItems="center"
        pt={2}
        pb={2}
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
