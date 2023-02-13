import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  Avatar,
  Badge,
  Box,
  Center,
  HStack,
  Icon,
  Pressable,
  Text,
  VStack,
  useColorModeValue,
} from 'native-base';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../../utils/atoms';
import { navigateToUserProfile } from '../../utils/nav';
import { TabGlobalNavigationProp } from '../../utils/types';
import { FetchedUser } from '../../xplat/types';

type Props = {
  ranking: number;
  fetchedUser: FetchedUser;
  numOfSends: number;
};
const LeaderboardRanking = ({ ranking, fetchedUser, numOfSends }: Props) => {
  const signedInUser = useRecoilValue(userAtom);
  const navigation = useNavigation<TabGlobalNavigationProp>();
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  const tryNavigate = () => {
    const signedInUserId = signedInUser?.docRef!.id;
    if (signedInUserId === undefined) return;

    const targetProfileUserId = fetchedUser.docRefId;
    if (targetProfileUserId !== undefined) {
      navigateToUserProfile(signedInUserId, targetProfileUserId, navigation);
    }
  };

  return (
    <Pressable onPress={() => {}}>
      {({ isHovered, isPressed }) => {
        return (
          <Box
            p="3"
            rounded="8px"
            shadow="1"
            bg={isPressed || isHovered ? 'coolGray.100' : baseBgColor}
          >
            <HStack justifyContent="space-between">
              <Pressable onPress={tryNavigate} pr={3}>
                <Center>
                  <Avatar
                    source={{ uri: fetchedUser.avatarUrl }}
                    size="xl"
                    mb={3}
                    borderWidth={2}
                  />
                  <Badge rounded="full" variant="solid" mt={-6} fontSize="lg">
                    {ranking}
                  </Badge>
                </Center>
              </Pressable>
              <VStack justifyContent="center">
                <Text fontSize="xl">{fetchedUser.displayName}</Text>
                <HStack space={3} justifyContent="center">
                  <Text fontSize="md">@{fetchedUser.username}</Text>
                  <Icon as={<Ionicons name="trending-up" />} size="2xl" />
                  <Text fontSize="xl" bold>
                    {numOfSends}
                  </Text>
                </HStack>
              </VStack>
            </HStack>
          </Box>
        );
      }}
    </Pressable>
  );
};

export default LeaderboardRanking;
