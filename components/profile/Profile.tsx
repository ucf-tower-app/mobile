import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
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
import { buildUserFetcher } from '../../utils/queries';
import { TabGlobalNavigationProp } from '../../utils/types';
import { Cursor, Post, User, containsRef } from '../../xplat/types/types';
import Feed from '../media/Feed';
import Tintable from '../util/Tintable';
import EditProfileModal from './EditProfileModal';
import LoadingProfile from './LoadingProfile';
import ProfileBanner from './ProfileBanner';
import StatBox from './StatBox';

/**
 * The profile component displays the profile banner, a statbox,
 * a button to see followers and the post's the user has posted.
 *
 * If the prop profileIsMine is true then there will be button
 * to edit the profile. If it's false then it will be a follow
 * button.
 */
type Props = {
  profileIsMine: boolean;
  userOfProfile: User;
};

const Profile = ({ profileIsMine, userOfProfile }: Props) => {
  const navigation = useNavigation<TabGlobalNavigationProp>();
  const signedInUser = useRecoilValue(userAtom);
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');
  const secondaryBgColor = useColorModeValue(
    'lightMode.secondary',
    'darkMode.secondary'
  );
  const [showModal, setShowModal] = useState(false);

  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [postsCursor, setPostsCursor] = useState<Cursor<Post> | undefined>();

  const { isLoading, isError, data, error } = useQuery(
    userOfProfile.docRef!.id,
    buildUserFetcher(userOfProfile),
    {
      staleTime: 600000,
    }
  );

  useEffect(() => {
    if (!data) return;
    setPostsCursor(data.postsCursor);
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
      await signedInUser.unfollowUser(userOfProfile);
      setIsFollowing(false);
    } else {
      if (userOfProfile !== undefined && signedInUser !== undefined) {
        await signedInUser.followUser(userOfProfile);
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
                    userDocRefId: userOfProfile.docRef?.id!,
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

  return postsCursor !== undefined ? (
    <Feed postsCursor={postsCursor} topComponent={profileComponent} />
  ) : (
    profileComponent
  );
};

export default Profile;
