import { useNavigation } from '@react-navigation/native';
import { ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  HStack,
  Heading,
  Spinner,
  Text,
  VStack,
  useToken,
} from 'native-base';
import { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import Feed from '../../components/media/Feed';
import LikeButton from '../../components/misc/LikeButton';
import UserTag from '../../components/profile/UserTag';
import RatingModal from '../../components/route/RatingModal';
import { userAtom, userPermissionLevelAtom } from '../../utils/atoms';
import { permissionLevelCanWrite } from '../../utils/permissions';
import {
  TabGlobalNavigationProp,
  TabGlobalScreenProps,
} from '../../utils/types';
import { Route, RouteStatus } from '../../xplat/types';

const FORCED_THUMBNAIL_HEIGHT = 200;

const RouteView = ({ route }: TabGlobalScreenProps<'RouteView'>) => {
  const routeDocRefId = route.params.routeDocRefId;

  const navigation = useNavigation<TabGlobalNavigationProp>();

  const user = useRecoilValue(userAtom);
  const userPermissionLevel = useRecoilValue(userPermissionLevelAtom);

  const [_userHasRated, setUserHasRated] = useState<boolean>(false);
  const [isRating, setIsRating] = useState<boolean>(false);

  const [userHasSent, setUserHasSent] = useState<boolean>(false);

  // Start as true so that the send button is disabled until the route is loaded
  const [isSending, setIsSending] = useState<boolean>(true);

  const backgroundHex = useToken('colors', 'lightMode.base');

  const { isLoading, isError, data, error } = useQuery(
    routeDocRefId,
    Route.buildFetcherFromDocRefId(routeDocRefId)
  );

  useEffect(() => {
    if (user === undefined || data === undefined) return;

    data.routeObject.getSendByUser(user).then((send) => {
      setIsSending(false);
      if (send === undefined) return;
      setUserHasSent(true);
    });
  }, [data, user]);

  if (isLoading) {
    return (
      <Center>
        <Spinner size="lg" />
      </Center>
    );
  }

  if (isError || data === undefined) {
    console.error(error);
    return null;
  }

  const onSetIsLiked = (isLiked: boolean) => {
    if (user === undefined) return;

    if (isLiked) data.routeObject.addLike(user);
    else data.routeObject.removeLike(user);
  };

  const send = async () => {
    if (data !== undefined && user !== undefined) {
      setIsSending(true);
      // TODO: Prompt the user for a rating if they haven't rated
      await data.routeObject.FUCKINSENDIT(user, undefined);
      setUserHasSent(true);
      setIsSending(false);
    }
  };

  const post = () => {
    navigation.push('CreatePost', {
      routeDocRefId: data.routeObject.getId(),
    });
  };

  const routeViewComponent = (
    <Box w="full" bg={backgroundHex} key="routeview">
      <ImageBackground
        key="thumbnail"
        style={styles.thumbnail}
        resizeMode={ResizeMode.COVER}
        source={{ uri: data.thumbnailUrl }}
      >
        <LinearGradient
          key="blend"
          style={styles.gradient}
          colors={[backgroundHex + '00', backgroundHex]}
        />
        <Flex direction="column" h="full" w="full" bg={backgroundHex} key="top">
          <HStack
            flexWrap="wrap"
            justifyContent="space-between"
            mx={4}
            key="headings"
          >
            <Heading size="2xl" key="name">
              {data.name}
            </Heading>
            <Heading size="2xl" color="grey" key="grade">
              {data.gradeDisplayString}
            </Heading>
          </HStack>
          <Text fontSize="2xl" color="grey" mx={4} key="tags">
            {data.stringifiedTags}
          </Text>
          <HStack
            flexWrap="wrap"
            justifyContent="space-between"
            mx={4}
            mt={2}
            key="setter"
          >
            {data.setter !== undefined ? (
              <VStack justifyContent="flex-start" flexGrow={0} key="setterdisp">
                <Text
                  fontSize="lg"
                  color="grey"
                  fontWeight="bold"
                  mb={2}
                  key="setter"
                >
                  Setter
                </Text>
                <UserTag user={data.setter} size="sm" key="settag" />
              </VStack>
            ) : null}
          </HStack>
          <Text fontSize="lg" mx={4} mt={2} key="desc">
            {data.description}
          </Text>
          <HStack
            flexWrap="wrap"
            justifyContent="space-between"
            alignItems="flex-end"
            mx={4}
            mt={4}
            key="statstack"
          >
            <Box key="status">
              <Text fontSize="lg" italic bold>
                {RouteStatus[data.status]}
              </Text>
              {data.rope !== undefined ? (
                <Text fontSize="md">Rope {data.rope}</Text>
              ) : null}
            </Box>
            {permissionLevelCanWrite(userPermissionLevel) ? (
              <LikeButton
                likes={data.likes}
                onSetIsLiked={onSetIsLiked}
                key="like"
              />
            ) : null}
          </HStack>
          {permissionLevelCanWrite(userPermissionLevel) ? (
            <VStack key="buttons">
              <Button
                mx={4}
                mt={4}
                onPress={send}
                isDisabled={userHasSent}
                isLoading={isSending}
                key="send"
              >
                {userHasSent ? 'Sent!' : 'Send it!'}
              </Button>
              <Button mx={4} mt={4} onPress={post} key="post">
                Post to this route
              </Button>
            </VStack>
          ) : null}
          <Center mt={4} mb={2} key="postshead">
            <Heading key="posts">Posts</Heading>
          </Center>
          <Divider key="divid" />
        </Flex>
      </ImageBackground>
    </Box>
  );

  return (
    <>
      <RatingModal
        isOpen={isRating}
        close={() => {
          setIsRating(false);
          setUserHasRated(true);
        }}
      />
      <Feed
        forumDocRefId={data.forumDocRefID}
        topComponent={routeViewComponent}
        isInRouteView
      />
    </>
  );
};

const styles = StyleSheet.create({
  thumbnail: {
    flex: 1,
    width: '100%',
    minHeight: FORCED_THUMBNAIL_HEIGHT,
  },
  gradient: {
    minHeight: FORCED_THUMBNAIL_HEIGHT,
  },
});

export default RouteView;
