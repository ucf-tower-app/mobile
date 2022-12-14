import {
  VStack,
  Text,
  HStack,
  Avatar,
  Center,
  Icon,
  Badge,
  useColorModeValue,
} from 'native-base';
import { Entypo } from '@expo/vector-icons';

type Props = {
  leaderboardTitle: string;
  topNumOfSends: number;
  avatarUrl: string;
};
const LeaderboardCard = ({
  leaderboardTitle,
  topNumOfSends,
  avatarUrl,
}: Props) => {
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');
  const secondaryBgColor = useColorModeValue(
    'lightMode.secondary',
    'darkMode.secondary'
  );

  return (
    <Center width="95%" rounded="12px" bg={baseBgColor} p="2" shadow="1">
      <HStack justifyContent="center" width="full">
        <Center width="50%">
          <VStack space={2}>
            <Center>
              <Text fontSize="2xl">{leaderboardTitle}</Text>
            </Center>
            <VStack>
              <Center>
                <Text fontSize="xl">{topNumOfSends}</Text>
              </Center>
              <Center mt={-1}>
                <Icon
                  as={<Entypo name="line-graph" />}
                  size="4xl"
                  color="black"
                />
              </Center>
            </VStack>
          </VStack>
        </Center>
        <Center width="50%">
          <Avatar
            source={{ uri: avatarUrl }}
            size="2xl"
            mb={3}
            bg="cyan.500"
            borderColor={secondaryBgColor}
            borderWidth={2}
          />
          <Badge
            rounded="full"
            variant="solid"
            mt={-6}
            bg={secondaryBgColor}
            fontSize="md"
          >
            1
          </Badge>
        </Center>
      </HStack>
    </Center>
  );
};

export default LeaderboardCard;
