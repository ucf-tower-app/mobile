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
import { TabGlobalNavigationProp } from '../../utils/types';
import { User } from '../../xplat/types/user';
import Timestamp from '../media/Timestamp';
import Tintable from '../util/Tintable';

type Size = 'xs' | 'sm' | 'md' | 'lg';
const sizedStyles = {
  xs: {
    avatarSize: 8,
    preloadTextWidth: 12,
    displayNameSize: 'xs',
    usernameSize: 'xs',
  },
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
        <Box pl={2} w={sizedStyles[size].preloadTextWidth}>
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
  user: User;
  size?: Size;
  mini?: boolean;
  timestamp?: Date;
};
const UserTag = ({ user, size = 'md', mini = false, timestamp }: Props) => {
  const navigation = useNavigation<TabGlobalNavigationProp>();

  const signedInUser = useRecoilValue(userAtom);

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  const { isLoading, isError, data, error } = useQuery(
    user.getId(),
    user.buildFetcher()
  );

  if (isLoading) {
    return <UserTagSkeleton size={size} />;
  }

  if (isError || data === undefined) {
    console.error(error);
    return null;
  }

  const tryNavigate = () => {
    const signedInUserId = signedInUser?.docRef!.id;
    if (signedInUserId === undefined) return;

    const targetProfileUserId = data.userObject.docRef!.id;
    if (targetProfileUserId !== undefined) {
      navigateToUserProfile(signedInUserId, targetProfileUserId, navigation);
    }
  };

  if (mini) {
    return (
      <Pressable onPress={tryNavigate}>
        <Text fontSize={sizedStyles[size].displayNameSize} fontWeight="bold">
          {data.displayName}
        </Text>
      </Pressable>
    );
  }

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
                <HStack alignItems="center">
                  <Text fontSize={sizedStyles[size].usernameSize} color="grey">
                    @{data.username}
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
        );
      }}
    </Pressable>
  );
};

export default UserTag;
