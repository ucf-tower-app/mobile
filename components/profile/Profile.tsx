import ProfileBanner from '../../components/profile/ProfileBanner';
import {
  HStack,
  Center,
  VStack,
  useColorModeValue,
  Box,
  Button,
  Icon,
  ScrollView,
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

type Props = {
  user: User;
  profileIsMine: boolean;
  otherUser?: User;
};
const Profile = ({ user, profileIsMine, otherUser }: Props) => {
  const [boulderGrade, setBoulderGrade] = useState<string>('');
  const [topRopeGrade, setTopRopeGrade] = useState<string>('');
  const [numOfSends, setNumOfSends] = useState<string>('');
  const [posts, setPosts] = useState<PostObj[]>();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');
  const secondaryBgColor = useColorModeValue(
    'lightMode.secondary',
    'darkMode.secondary'
  );

  // TODO: Use APIs to set stats
  useEffect(() => {
    const getPosts = async () => {
      await user.getPosts().then(setPosts);
    };
    getPosts();
  }, [user]);

  const handleButtonPress = async () => {
    if (profileIsMine) {
      //TODO: Edit Profile
    } else if (isFollowing) {
      //TODO: Unfollow otherUser
    } else {
      if (otherUser !== undefined) {
        await user.followUser(otherUser);
        setIsFollowing(true);
      }
    }
  };

  return (
    <ScrollView bgColor={baseBgColor}>
      <VStack space="xs">
        <Box>
          <Box p="5">
            <ProfileBanner user={user} />
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
                <Pressable>
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
        <Center w="full">
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
        <Feed posts={posts} />
      </VStack>
    </ScrollView>
  );
};

export default Profile;
