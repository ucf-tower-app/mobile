import { useNavigation } from '@react-navigation/native';
import {
  Avatar,
  Box,
  HStack,
  Pressable,
  Skeleton,
  Text,
  useColorModeValue,
  VStack,
} from 'native-base';
import { User } from '../../xplat/types/user';
import Tintable from '../util/Tintable';
import { TabGlobalNavigationProp } from '../../utils/types';
import { userAtom } from '../../utils/atoms';
import { useRecoilValue } from 'recoil';
import { navigateToUserProfile } from '../../utils/nav';
import { useQuery } from 'react-query';
import { buildUserFetcher } from '../../utils/queries';

type Size = 'sm' | 'md' | 'lg';
const sizedStyles = {
  sm: {
    avatarSize: 8,
    preloadTextWidth: 18,
    displayNameSize: 'sm',
    usernameSize: 'xs',
  },
  md: {
    avatarSize: 12,
    preloadTextWidth: 24,
    displayNameSize: 'md',
    usernameSize: 'sm',
  },
  lg: {
    avatarSize: 16,
    preloadTextWidth: 32,
    displayNameSize: 'lg',
    usernameSize: 'md',
  },
};

type Props = {
  user: User;
  size?: Size;
};
const UserTag = ({ user, size = 'md' }: Props) => {
  const navigation = useNavigation<TabGlobalNavigationProp>();

  const signedInUser = useRecoilValue(userAtom);

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  const { isLoading, isError, data, error } = useQuery(
    user.docRef?.id!,
    buildUserFetcher(user)
  );

  if (isLoading) {
    return (
      <Box rounded="full" bg={baseBgColor}>
        <HStack alignItems="center" pr={3}>
          <Skeleton
            w={sizedStyles[size].avatarSize}
            h={sizedStyles[size].avatarSize}
            rounded="full"
          />
          <Skeleton.Text
            fontSize={sizedStyles[size].displayNameSize}
            lines={2}
            pl={2}
            w={sizedStyles[size].preloadTextWidth}
          />
        </HStack>
      </Box>
    );
  }

  if (isError || data === undefined) {
    console.error(error);
    return null;
  }

  const tryNavigate = async () => {
    // Can't navigate to an unfetched user
    const signedInUsername = await signedInUser?.getUsername();
    if (signedInUsername === undefined) return;

    const targetProfileUsername = data.username;
    if (targetProfileUsername !== undefined) {
      navigateToUserProfile(
        signedInUsername,
        targetProfileUsername,
        navigation
      );
    }
  };

  return (
    <Pressable onPress={tryNavigate}>
      {({ isHovered, isPressed }) => {
        return (
          <Box rounded="full" bg={baseBgColor}>
            <Tintable tinted={isHovered || isPressed} rounded />
            <HStack alignItems="center" pr={3}>
              <Avatar
                w={sizedStyles[size].avatarSize}
                h={sizedStyles[size].avatarSize}
                source={{ uri: data.avatarUrl }}
              />
              <VStack pl={2}>
                <Text
                  fontSize={sizedStyles[size].displayNameSize}
                  fontWeight="bold"
                >
                  {data.displayName}
                </Text>
                <Text fontSize={sizedStyles[size].usernameSize} color="grey">
                  @{data.username}
                </Text>
              </VStack>
            </HStack>
          </Box>
        );
      }}
    </Pressable>
  );
};

export default UserTag;
