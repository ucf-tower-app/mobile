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
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../../utils/atoms';
import { navigateToUserProfile } from '../../utils/nav';
import { useUserCacheMap } from '../../utils/queries';
import { TabGlobalNavigationProp } from '../../utils/types';
import { getAvatarUrl } from '../../xplat/api';
import Timestamp from '../media/Timestamp';
import Tintable from '../util/Tintable';

type Size = 'xs' | 'sm' | 'md' | 'lg';
const sizedStyles = {
  xs: {
    avatarSize: 8,
    displayNameSize: 'xs',
    usernameSize: 'xs',
  },
  sm: {
    avatarSize: 8,
    displayNameSize: 'sm',
    usernameSize: 'xs',
  },
  md: {
    avatarSize: 12,
    displayNameSize: 'md',
    usernameSize: 'sm',
  },
  lg: {
    avatarSize: 16,
    displayNameSize: 'lg',
    usernameSize: 'md',
  },
};

type SkeletonProps = {
  size?: Size;
};
export const UserTagSkeleton = ({ size = 'md' }: SkeletonProps) => {
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');
  return (
    <Box rounded="full" bg={baseBgColor}>
      <HStack alignItems="center" pr={3}>
        <Skeleton
          w={sizedStyles[size].avatarSize}
          h={sizedStyles[size].avatarSize}
          rounded="full"
        />
        <Box pl={2} w={24}>
          <Skeleton.Text
            fontSize={sizedStyles[size].displayNameSize}
            lines={2}
          />
        </Box>
      </HStack>
    </Box>
  );
};

type Props = {
  userDocRefId: string;
  size?: Size;
  mini?: boolean;
  timestamp?: Date;
  isNavigationDisabled?: boolean;
};
const UserTag = ({
  userDocRefId,
  size = 'md',
  mini = false,
  timestamp,
  isNavigationDisabled = false,
}: Props) => {
  const userCacheResult = useUserCacheMap();
  const navigation = useNavigation<TabGlobalNavigationProp>();
  const signedInUser = useRecoilValue(userAtom);
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');
  const avatarUrlResult = useQuery(['avatar', userDocRefId], () =>
    getAvatarUrl(userDocRefId)
  );

  if (userCacheResult.isLoading || userCacheResult.data === undefined) {
    return <UserTagSkeleton size={size} />;
  }

  if (userCacheResult.isError) {
    console.error(userCacheResult.error);
    return null;
  }

  const userEntry = userCacheResult.data.get(userDocRefId);
  if (userEntry === undefined) {
    console.error(
      'Failed to find user in cache',
      userDocRefId,
      userCacheResult.data.keys
    );
    return null;
  }
  const displayName = userEntry.displayName;
  const username = userEntry.username;

  const tryNavigate = () => {
    const signedInUserId = signedInUser?.getId();
    if (signedInUserId === undefined) return;
    navigateToUserProfile(signedInUserId, userDocRefId, navigation);
  };

  if (mini) {
    return (
      <Pressable onPress={tryNavigate} disabled={isNavigationDisabled}>
        {({ isHovered, isPressed }) => (
          <HStack alignItems="center" justifyContent={'center'}>
            <Tintable tinted={isHovered || isPressed} rounded />
            <Text
              numberOfLines={1}
              fontSize={sizedStyles.sm.displayNameSize}
              fontWeight="bold"
            >
              {displayName}
            </Text>
            {timestamp !== undefined ? (
              <Box ml={2}>
                <Timestamp relative date={timestamp} />
              </Box>
            ) : null}
          </HStack>
        )}
      </Pressable>
    );
  }

  return (
    <Pressable onPress={tryNavigate} disabled={isNavigationDisabled}>
      {({ isHovered, isPressed }) => (
        <Box rounded="full" bg={baseBgColor}>
          <Tintable tinted={isHovered || isPressed} rounded />
          <HStack alignItems="center" pr={3}>
            <Avatar
              w={sizedStyles[size].avatarSize}
              h={sizedStyles[size].avatarSize}
              source={
                avatarUrlResult.data !== undefined
                  ? { uri: avatarUrlResult.data }
                  : require('../../assets/default_avatar.png')
              }
            />
            <VStack pl={2}>
              <Text
                fontSize={sizedStyles[size].displayNameSize}
                fontWeight="bold"
              >
                {displayName}
              </Text>
              <HStack alignItems="center">
                <Text fontSize={sizedStyles[size].usernameSize} color="grey">
                  @{username}
                </Text>
                {timestamp !== undefined ? (
                  <Box ml={2}>
                    <Timestamp relative date={timestamp} />
                  </Box>
                ) : null}
              </HStack>
            </VStack>
          </HStack>
        </Box>
      )}
    </Pressable>
  );
};

export default UserTag;
