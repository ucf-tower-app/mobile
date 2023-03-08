import { Box, Center, HStack, Text, useColorModeValue } from 'native-base';
import React from 'react';
import { formatOrdinals } from '../../utils/utils';
import { LeaderboardEntry } from '../../xplat/queries';
import UserTag from '../profile/UserTag';
import LightDarkIcon from '../util/LightDarkIcon';

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
          <UserTag userDocRefId={data.user.getId()} />
        </Box>
        <Box width="13%">
          <LightDarkIcon name="trending-up" size="2xl" />
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
