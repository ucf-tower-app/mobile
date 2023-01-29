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
import { useEffect, useState } from 'react';
import { User } from '../../xplat/types/user';
import Tintable from '../util/Tintable';
import { TabGlobalNavigationProp } from '../../utils/types';
import { userAtom } from '../../utils/atoms';
import { useRecoilValue } from 'recoil';
import { navigateToUserProfile } from '../../utils/nav';

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
  user: User | undefined;
  size?: Size;
};
const UserTag = ({ user, size = 'md' }: Props) => {
  const navigation = useNavigation<TabGlobalNavigationProp>();

  const signedInUser = useRecoilValue(userAtom);

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [displayName, setDisplayName] = useState<string>('');
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      if (user === undefined) return;

      await user.getData();

      user.getAvatarUrl().then(setAvatarUrl);
      user.getDisplayName().then(setDisplayName);
      user.getUsername().then(setUsername);
    };

    fetchData();
  }, [user]);

  const tryNavigate = async () => {
    if (username === '') return;

    const signedInUsername = await signedInUser?.getUsername();
    if (signedInUsername === undefined) return;

    navigateToUserProfile(signedInUsername, username, navigation);
  };

  const isLoaded =
    user !== undefined &&
    avatarUrl !== undefined &&
    displayName !== undefined &&
    username !== undefined;

  return (
    <Pressable onPress={tryNavigate}>
      {({ isHovered, isPressed }) => {
        return (
          <Box rounded="full" bg={baseBgColor}>
            <Tintable tinted={isHovered || isPressed} rounded />
            <HStack alignItems="center" pr={3}>
              <Skeleton
                w={sizedStyles[size].avatarSize}
                h={sizedStyles[size].avatarSize}
                rounded="full"
                isLoaded={isLoaded}
              >
                <Avatar
                  w={sizedStyles[size].avatarSize}
                  h={sizedStyles[size].avatarSize}
                  source={{ uri: avatarUrl }}
                />
              </Skeleton>
              <VStack pl={2}>
                <Skeleton.Text
                  fontSize={sizedStyles[size].displayNameSize}
                  lines={2}
                  w={sizedStyles[size].preloadTextWidth}
                  isLoaded={isLoaded}
                >
                  <Text
                    fontSize={sizedStyles[size].displayNameSize}
                    fontWeight="bold"
                  >
                    {displayName}
                  </Text>
                  <Text fontSize={sizedStyles[size].usernameSize} color="grey">
                    @{username}
                  </Text>
                </Skeleton.Text>
              </VStack>
            </HStack>
          </Box>
        );
      }}
    </Pressable>
  );
};

export default UserTag;
