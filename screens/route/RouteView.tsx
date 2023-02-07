import { useNavigation } from '@react-navigation/native';
import { ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Heading,
  Spinner,
  Text,
  VStack,
  useToken,
  Divider,
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
import { Post, QueryCursor, Route, RouteStatus } from '../../xplat/types';

const FORCED_THUMBNAIL_HEIGHT = 200;

const RouteView = ({ route }: TabGlobalScreenProps<'RouteView'>) => {
  const routeDocRefId = route.params.routeDocRefId;

  const navigation = useNavigation<TabGlobalNavigationProp>();

  const user = useRecoilValue(userAtom);
  const userPermissionLevel = useRecoilValue(userPermissionLevelAtom);

  const [postsCursor, setPostsCursor] = useState<QueryCursor<Post> | undefined>(
    undefined
  );

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

    data.routeObject.getForum().then((forum) => {
      setPostsCursor(forum.getPostsCursor());
    });
  }, [data, user]);

  if (isLoading) {
    return null;
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
      routeName: data.name,
    });
  };

  const routeViewComponent = (
    <Box w="full" bg={backgroundHex}>
      <ImageBackground
        style={styles.thumbnail}
        resizeMode={ResizeMode.COVER}
        source={{ uri: data.thumbnailUrl }}
      >
        <LinearGradient
          style={styles.gradient}
          colors={[backgroundHex + '00', backgroundHex]}
        />
        <Flex direction="column" h="full" w="full" bg={backgroundHex}>
          <HStack flexWrap="wrap" justifyContent="space-between" mx={4}>
            <Heading size="2xl">{data.name}</Heading>
            <Heading size="2xl" color="grey">
              {data.gradeDisplayString}
            </Heading>
          </HStack>
          <Text fontSize="2xl" color="grey" mx={4}>
            {data.stringifiedTags}
          </Text>
          <HStack flexWrap="wrap" justifyContent="space-between" mx={4} mt={2}>
            {data.setter !== undefined ? (
              <VStack justifyContent="flex-start" flexGrow="unset">
                <Text fontSize="lg" color="grey" fontWeight="bold" mb={2}>
                  Setter
                </Text>
                <UserTag user={data.setter} size="sm" />
              </VStack>
            ) : null}
          </HStack>
          <Text fontSize="lg" mx={4} mt={2}>
            {data.description}
          </Text>
          <HStack
            flexWrap="wrap"
            justifyContent="space-between"
            alignItems="flex-end"
            mx={4}
            mt={4}
          >
            <Box>
              <Text fontSize="lg" italic bold>
                {RouteStatus[data.status]}
              </Text>
              {data.rope !== undefined ? (
                <Text fontSize="md">Rope {data.rope}</Text>
              ) : null}
            </Box>
            {permissionLevelCanWrite(userPermissionLevel) ? (
              <LikeButton likes={data.likes} onSetIsLiked={onSetIsLiked} />
            ) : null}
          </HStack>
          {permissionLevelCanWrite(userPermissionLevel) ? (
            <>
              <Button
                mx={4}
                mt={4}
                onPress={send}
                isDisabled={userHasSent}
                isLoading={isSending}
              >
                {userHasSent ? 'Sent!' : 'Send it!'}
              </Button>
              <Button mx={4} mt={4} onPress={post}>
                Post to this route
              </Button>
            </>
          ) : null}
          <Center mt={4} mb={2}>
            <Heading>Posts</Heading>
          </Center>
          <Divider />
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
      {postsCursor !== undefined ? (
        <Feed
          forumDocRefId={data.forumDocRefID}
          topComponent={routeViewComponent}
        />
      ) : (
        <Center>
          <Spinner size="lg" />
        </Center>
      )}
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
