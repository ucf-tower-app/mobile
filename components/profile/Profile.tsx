import ProfileBanner from '../../components/profile/ProfileBanner';
import {
  HStack,
  Center,
  VStack,
  useColorModeValue,
  Box,
  Button,
  Icon,
  Divider,
} from 'native-base';
import { User } from '../../xplat/types/user';
import { useState } from 'react';
import { useEffect } from 'react';
import StatBox from '../../components/profile/StatBox';
import { Post as PostObj } from '../../xplat/types/post';
import { Ionicons } from '@expo/vector-icons';
import Tintable from '../../components/util/Tintable';
import { Pressable } from 'native-base';
import Feed from '../media/Feed';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../../utils/atoms';
import { QueryCursor } from '../../xplat/types/queryCursors';

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
  navigate: Function;
};
const Profile = ({ profileIsMine, userOfProfile, navigate }: Props) => {
  const [boulderGrade, setBoulderGrade] = useState<string>('');
  const [topRopeGrade, setTopRopeGrade] = useState<string>('');
  const [numOfSends, setNumOfSends] = useState<string>('');
  const signedInUser = useRecoilValue(userAtom);
  // TODO: Update default to check if signedInUser is following userOfProfile
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [postsCursor, setPostsCursor] = useState<
    QueryCursor<PostObj> | undefined
  >(undefined);

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');
  const secondaryBgColor = useColorModeValue(
    'lightMode.secondary',
    'darkMode.secondary'
  );

  // TODO: Use APIs to set stats
  useEffect(() => {
    setPostsCursor(userOfProfile.getPostsCursor());
  }, [userOfProfile]);

  const handleButtonPress = async () => {
    if (profileIsMine) {
      //TODO: Edit Profile
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

  const profileComponent = (
    <VStack space="xs" w="full" bg={baseBgColor}>
      <Box>
        <Box p="5">
          <ProfileBanner user={userOfProfile} />
        </Box>
        <Center>
          <HStack space="md">
            <Button
              variant="subtle"
              size="md"
              bgColor={secondaryBgColor}
              rounded="2xl"
              _text={{ color: 'black' }}
              onPress={() => handleButtonPress}
            >
              {profileIsMine
                ? 'Edit Profile'
                : isFollowing
                ? 'Unfollow'
                : 'Follow'}
            </Button>
            <Center>
              <Pressable
                onPress={() =>
                  navigate('Follows', { username: userOfProfile.username })
                }
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
            value="V5"
            onPress={() => {
              return;
            }}
          />
          <StatBox
            stat="Top-Rope"
            value="V2"
            onPress={() => {
              return;
            }}
          />
          <StatBox
            stat="Sends"
            value="23"
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
