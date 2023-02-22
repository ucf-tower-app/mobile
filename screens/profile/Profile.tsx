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
import { queryClient } from '../../App';
import ContextMenu, {
  ContextOptions,
} from '../../components/media/ContextMenu';
import Feed from '../../components/media/Feed';
import Reportable from '../../components/media/actions/Reportable';
import EditProfileModal from '../../components/profile/EditProfileModal';
import LoadingProfile from '../../components/profile/LoadingProfile';
import ProfileBanner from '../../components/profile/ProfileBanner';
import StatBox from '../../components/profile/StatBox';
import Tintable from '../../components/util/Tintable';
import { userAtom, userPermissionLevelAtom } from '../../utils/atoms';
import { useEarlyLoad, useSignedInUserQuery } from '../../utils/hooks';
import { permissionLevelCanWrite } from '../../utils/permissions';
import { TabGlobalScreenProps } from '../../utils/types';
import { User, containsRef, invalidateDocRefId } from '../../xplat/types';

/**
 * The profile component displays the profile banner, a statbox,
 * a button to see followers and the post's the user has posted.
 *
 * If the route param userDocRefId was not passed then the profile
 * will be rendered for the signed in user.
 */
const Profile = ({ route, navigation }: TabGlobalScreenProps<'Profile'>) => {
  const isEarly = useEarlyLoad();

  const signedInUser = useRecoilValue(userAtom);
  const userPermissionLevel = useRecoilValue(userPermissionLevelAtom);

  const profileIsMine = route.params?.userDocRefId === undefined;
  const userDocRefId = route.params?.userDocRefId ?? signedInUser?.docRef!.id;

  const [isServerProcessing, setIsServerProcessing] = useState<boolean>(false);

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');
  const secondaryBgColor = useColorModeValue(
    'lightMode.secondary',
    'darkMode.secondary'
  );

  const [contextOptions, setContextOptions] = useState<ContextOptions>({});
  const [isReporting, setIsReporting] = useState<boolean>(false);

  const [showModal, setShowModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const signedInUserQuery = useSignedInUserQuery();
  const profileUserQuery = useQuery(
    userDocRefId !== undefined ? userDocRefId : 'nullQuery',
    userDocRefId !== undefined
      ? User.buildFetcherFromDocRefId(userDocRefId)
      : () => undefined,
    { enabled: userDocRefId !== undefined }
  );

  useEffect(() => {
    const _contextOptions: ContextOptions = {};
    if (signedInUser !== undefined && !profileIsMine)
      _contextOptions.Report = () => {
        setIsReporting(true);
      };
    else {
      _contextOptions.Post = () => {
        navigation.navigate('CreatePost', {});
      };
      _contextOptions.Edit = () => {
        setShowModal(true);
      };
    }

    setContextOptions(_contextOptions);
  }, [signedInUser, profileIsMine, navigation]);

  useEffect(() => {
    if (
      profileUserQuery.data !== undefined &&
      signedInUserQuery.data !== undefined
    ) {
      setIsFollowing(
        containsRef(
          signedInUserQuery.data.followingList,
          profileUserQuery.data.userObject
        ) ?? false
      );
    }
  }, [profileUserQuery.data, signedInUserQuery.data]);

  if (isEarly || profileUserQuery.isLoading) return <LoadingProfile />;
  if (profileUserQuery.isError || profileUserQuery.data === undefined) {
    console.error(profileUserQuery.error);
    return null;
  }

  if (userDocRefId === undefined) return null;

  const followOrUnfollow = async () => {
    if (profileUserQuery.data === undefined) return;

    if (isFollowing && signedInUser !== undefined) {
      setIsServerProcessing(true);
      setIsFollowing(false);
      await signedInUser
        .unfollowUser(profileUserQuery.data.userObject)
        .then(() => {
          invalidateDocRefId(signedInUser.getId());
          queryClient.invalidateQueries({ queryKey: [signedInUser.getId()] });
        })
        .finally(() => setIsServerProcessing(false));
    } else {
      setIsServerProcessing(true);
      setIsFollowing(true);
      if (
        profileUserQuery.data.userObject !== undefined &&
        signedInUser !== undefined
      ) {
        await signedInUser
          .followUser(profileUserQuery.data.userObject)
          .then(() => {
            invalidateDocRefId(signedInUser.getId());
            queryClient.invalidateQueries({ queryKey: [signedInUser.getId()] });
          })
          .finally(() => setIsServerProcessing(false));
      }
    }
  };

  const onClose = () => {
    setShowModal(false);
  };

  const profileComponent = () => {
    if (profileUserQuery.data === undefined) return <LoadingProfile />;
    return (
      <>
        <Reportable
          isConfirming={isReporting}
          media={profileUserQuery.data.userObject}
          close={() => {
            setIsReporting(false);
          }}
        />
        <VStack space="xs" w="full" bg={baseBgColor}>
          <EditProfileModal
            isOpen={showModal}
            onClose={onClose}
            fetchedUser={profileUserQuery.data}
          />
          <Box w="full">
            <HStack w="full" justifyContent="flex-end" px={4}>
              <ContextMenu contextOptions={contextOptions} />
            </HStack>
            <Box p={5} pt={2}>
              <ProfileBanner fetchedUser={profileUserQuery.data} />
            </Box>
            <Center>
              <HStack space="md">
                {permissionLevelCanWrite(userPermissionLevel) &&
                !profileIsMine ? (
                  <Button
                    variant="subtle"
                    size="md"
                    bg={secondaryBgColor}
                    rounded="2xl"
                    _text={{ color: 'black' }}
                    isLoading={isServerProcessing}
                    onPress={followOrUnfollow}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                ) : null}
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
                value={
                  profileUserQuery.data.bestBoulder
                    ? profileUserQuery.data.bestBoulder?.displayString
                    : 'None'
                }
                onPress={() => {
                  return;
                }}
              />
              <StatBox
                stat="Top-Rope"
                value={
                  profileUserQuery.data.bestToprope
                    ? profileUserQuery.data.bestToprope?.displayString
                    : 'None'
                }
                onPress={() => {
                  return;
                }}
              />
              <StatBox
                stat="Sends"
                value={profileUserQuery.data.totalSends.toString()}
                onPress={() => {
                  navigation.push('Sends', { userDocRefId: userDocRefId });
                }}
              />
            </HStack>
          </Center>
          <Divider width="full" />
        </VStack>
      </>
    );
  };

  return <Feed topComponent={profileComponent} userDocRefId={userDocRefId} />;
};

export default Profile;
