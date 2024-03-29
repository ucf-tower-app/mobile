import {
  Box,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  Pressable,
  useColorModeValue,
  VStack,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { queryClient } from '../../App';
import Blockable from '../../components/media/actions/Blockable';
import Reportable from '../../components/media/actions/Reportable';
import ContextMenu, {
  ContextOptions,
} from '../../components/media/ContextMenu';
import Feed from '../../components/media/Feed';
import BestSend from '../../components/profile/BestSend';
import DeletableAccount from '../../components/profile/DeletableAccount';
import EditProfileModal from '../../components/profile/EditProfileModal';
import LoadingProfile from '../../components/profile/LoadingProfile';
import ProfileBanner from '../../components/profile/ProfileBanner';
import StatBox from '../../components/profile/StatBox';
import LightDarkIcon from '../../components/util/LightDarkIcon';
import Tintable from '../../components/util/Tintable';
import { userAtom, userPermissionLevelAtom } from '../../utils/atoms';
import { useEarlyLoad, useSignedInUserQuery } from '../../utils/hooks';
import { permissionLevelCanWrite } from '../../utils/permissions';
import { TabGlobalScreenProps } from '../../utils/types';
import {
  containsRef,
  invalidateDocRefId,
  RouteType,
  User,
  UserStatus,
} from '../../xplat/types';

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
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isBlocking, setIsBlocking] = useState<boolean>(false);

  const [showModal, setShowModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [isBlockedBy, setIsBlockedBy] = useState<boolean>(false);

  const signedInUserQuery = useSignedInUserQuery();
  const profileUserQuery = useQuery(
    userDocRefId !== undefined ? userDocRefId : 'nullQuery',
    userDocRefId !== undefined
      ? User.buildFetcherFromDocRefId(userDocRefId)
      : () => undefined,
    { enabled: userDocRefId !== undefined }
  );

  // Set up blocked and blocked by values
  useEffect(() => {
    const checkedBlocked = async () => {
      const me = signedInUserQuery.data;
      const prof = profileUserQuery.data;

      if (me === undefined || prof === undefined) return;

      setIsBlocked((await me.userObject.isBlocked(prof.userObject)) === true);
      setIsBlockedBy((await prof.userObject.isBlocked(me.userObject)) === true);
    };

    checkedBlocked();
  }, [signedInUserQuery.data, profileUserQuery.data]);

  // Setup the context options
  useEffect(() => {
    if (signedInUser === undefined || profileUserQuery.data === undefined) {
      return;
    }

    const _contextOptions: ContextOptions = {};

    if (permissionLevelCanWrite(userPermissionLevel)) {
      if (!profileIsMine) {
        // If the profile isn't mine, and is not an employee's, allow reporting
        if (profileUserQuery.data.status < UserStatus.Employee) {
          _contextOptions.Report = () => {
            setIsReporting(true);
          };
        }

        if (isBlocked) {
          _contextOptions.Unblock = () => {
            setIsBlocking(true);
          };
        } else {
          _contextOptions.Block = () => {
            setIsBlocking(true);
          };
        }
      } else {
        // The profile is mine
        _contextOptions.Post = () => {
          navigation.navigate('Create Post', {});
        };
        _contextOptions.Edit = () => {
          setShowModal(true);
        };
        _contextOptions.Delete = () => {
          setIsDeleting(true);
        };
        _contextOptions['Blocked List'] = () => {
          navigation.navigate('Blocked List');
        };
      }
    }

    setContextOptions(_contextOptions);
  }, [
    signedInUser,
    profileIsMine,
    navigation,
    profileUserQuery.data,
    userPermissionLevel,
    isBlocked,
  ]);

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
          close={() => setIsReporting(false)}
        />
        <Blockable
          isConfirming={isBlocking}
          user={profileUserQuery.data.userObject}
          isBlocked={isBlocked}
          close={() => setIsBlocking(false)}
        />
        <DeletableAccount
          isConfirming={isDeleting}
          user={profileUserQuery.data.userObject}
          close={() => setIsDeleting(false)}
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
                !profileIsMine &&
                !isBlocked ? (
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
                          <LightDarkIcon name="md-people" size="lg" />
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
              <BestSend
                type={RouteType.Boulder}
                fetchedUser={profileUserQuery.data}
              />
              <BestSend
                type={RouteType.Toprope}
                fetchedUser={profileUserQuery.data}
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

  if (!permissionLevelCanWrite(userPermissionLevel)) {
    return (
      <>
        {profileComponent()}
          <HStack w="full" mt={12} justifyContent="center">
            <Heading size="md">Verify a Knights Email to make a post.</Heading>
          </HStack>
      </>
    );
  }

  // Don't show content if they are blocked or blocked by
  // But only let the user know that the reason for not showing content
  // if they are the one who blocked the other user
  if (isBlocked || isBlockedBy) {
    return (
      <>
        {profileComponent()}
        {isBlocked ? (
          <HStack w="full" mt={12} justifyContent="center">
            <Heading size="md">Unblock this user to see their content.</Heading>
          </HStack>
        ) : null}
      </>
    );
  }

  return <Feed topComponent={profileComponent} userDocRefId={userDocRefId} />;
};

export default Profile;
