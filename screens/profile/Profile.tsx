import { Ionicons } from '@expo/vector-icons';
import {
  Box,
  Button,
  Center,
  Divider,
  HStack,
  Icon,
  Pressable,
  VStack,
  useColorModeValue,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../../utils/atoms';
import { buildUserFetcherFromDocRefId } from '../../utils/queries';
import { TabGlobalScreenProps } from '../../utils/types';
import { containsRef } from '../../xplat/types';
import Feed from '../../components/media/Feed';
import Tintable from '../../components/util/Tintable';
import EditProfileModal from '../../components/profile/EditProfileModal';
import LoadingProfile from '../../components/profile/LoadingProfile';
import ProfileBanner from '../../components/profile/ProfileBanner';
import StatBox from '../../components/profile/StatBox';

/**
 * The profile component displays the profile banner, a statbox,
 * a button to see followers and the post's the user has posted.
 *
 * If the route param userDocRefId was not passed then the profile
 * will be rendered for the signed in user.
 */
const Profile = ({ route, navigation }: TabGlobalScreenProps<'Profile'>) => {
  const signedInUser = useRecoilValue(userAtom);
  const profileIsMine = route.params?.userDocRefId === undefined;
  const userDocRefId = route.params?.userDocRefId ?? signedInUser?.docRef!.id;

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');
  const secondaryBgColor = useColorModeValue(
    'lightMode.secondary',
    'darkMode.secondary'
  );
  const [showModal, setShowModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const { isLoading, isError, data, error } = useQuery(
    userDocRefId!,
    buildUserFetcherFromDocRefId(userDocRefId!),
    {
      staleTime: 600000,
    }
  );

  useEffect(() => {
    if (!data) return;
    if (signedInUser)
      setIsFollowing(containsRef(data.followingList, signedInUser) ?? false);
  }, [data, signedInUser]);

  if (isLoading) return <LoadingProfile />;
  if (isError || data === undefined) {
    console.error(error);
    return null;
  }

  // TODO: Use APIs to set stats

  const handleButtonPress = async () => {
    if (profileIsMine) {
      setShowModal(true);
    } else if (isFollowing && signedInUser !== undefined) {
      await signedInUser.unfollowUser(data.userObject);
      setIsFollowing(false);
    } else {
      if (data.userObject !== undefined && signedInUser !== undefined) {
        await signedInUser.followUser(data.userObject);
        setIsFollowing(true);
      }
    }
  };

  const onClose = () => {
    setShowModal(false);
  };

  const profileComponent = (
    <VStack space="xs" w="full" bg={baseBgColor}>
      <EditProfileModal
        isOpen={showModal}
        onClose={onClose}
        fetchedUser={data}
      />
      <Box>
        <Box p="5">
          <ProfileBanner fetchedUser={data} />
        </Box>
        <Center>
          <HStack space="md">
            <Button
              variant="subtle"
              size="md"
              bg={secondaryBgColor}
              rounded="2xl"
              _text={{ color: 'black' }}
              onPress={handleButtonPress}
            >
              {profileIsMine
                ? 'Edit Profile'
                : isFollowing
                ? 'Unfollow'
                : 'Follow'}
            </Button>
            <Center>
              <Pressable
                onPress={async () => {
                  navigation.push('Follows', {
                    userDocRefId: userDocRefId!,
                  });
                }}
              >
                {({ isHovered, isPressed }) => {
                  return (
                    <Box>
                      <Tintable tinted={isHovered || isPressed} rounded />
                      <Icon
                        as={<Ionicons name="md-people" />}
                        size="lg"
                        color="black"
                      />
                    </Box>
                  );
                }}
              </Pressable>
            </Center>
          </HStack>
        </Center>
      </Box>
      <Center w="full" pb={4}>
        <HStack space="md">
          <StatBox
            stat="Boulder"
            value={data.bestBoulder ? data.bestBoulder?.displayString : 'None'}
            onPress={() => {
              return;
            }}
          />
          <StatBox
            stat="Top-Rope"
            value={data.bestToprope ? data.bestToprope?.displayString : 'None'}
            onPress={() => {
              return;
            }}
          />
          <StatBox
            stat="Sends"
            value={data.totalSends.toString()}
            onPress={() => {
              return;
            }}
          />
        </HStack>
      </Center>
      <Divider width="full" />
    </VStack>
  );

  return <Feed topComponent={profileComponent} userDocRefId={userDocRefId} />;
};

export default Profile;