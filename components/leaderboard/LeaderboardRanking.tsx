import {
  Text,
  HStack,
  Avatar,
  Center,
  Icon,
  VStack,
  Box,
  Pressable,
  Badge,
  useColorModeValue,
  Heading,
} from 'native-base';
import { Entypo } from '@expo/vector-icons';

//TODO: Change props once we know what leaderboard APIs will return
type Props = {
  ranking: number;
  avatarUrl: string;
  username: string;
  numOfSends: number;
  navigate: Function;
};
const LeaderboardRanking = ({
  ranking,
  avatarUrl,
  username,
  numOfSends,
  navigate,
}: Props) => {
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');
  const secondaryBgColor = useColorModeValue(
    'lightMode.secondary',
    'darkMode.secondary'
  );

  return (
    <Pressable onPress={() => navigate('LeaderboardUserProfile')}>
      {({ isHovered, isPressed }) => {
        return ranking !== 1 ? (
          <Box
            p="3"
            rounded="8px"
            shadow={1}
            //TODO: Use function to use percentage of color used when component is pressed
            bg={
              isPressed
                ? 'coolGray.100'
                : isHovered
                ? 'coolGray.100'
                : baseBgColor
            }
          >
            <HStack justifyContent="space-between">
              <HStack space={2}>
                <Center mr={3}>
                  <Text fontSize="xl">{ranking}</Text>
                </Center>
                <Center>
                  <Avatar
                    source={{
                      uri: avatarUrl,
                    }}
                    size="md"
                  />
                </Center>
                <Center>
                  <Text fontSize="xl">
                    {username.length >= 13
                      ? username.slice(0, 12) + '...'
                      : username}
                  </Text>
                </Center>
              </HStack>
              <HStack space={3}>
                <Center>
                  <Icon
                    as={<Entypo name="line-graph" />}
                    size="lg"
                    color="black"
                  />
                </Center>
                <Center>
                  <Text fontSize="xl" bold>
                    {numOfSends}
                  </Text>
                </Center>
              </HStack>
            </HStack>
          </Box>
        ) : (
          <Box
            p={3}
            //TODO: Use function to use percentage of color used when component is pressed
            bg={
              isPressed
                ? 'coolGray.100'
                : isHovered
                ? 'coolGray.100'
                : baseBgColor
            }
          >
            <VStack>
              <Center>
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
                <Heading>{username}</Heading>
                <Text>{numOfSends} Sends</Text>
              </Center>
            </VStack>
          </Box>
        );
      }}
    </Pressable>
  );
};

export default LeaderboardRanking;
