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
} from 'native-base';
import { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { useQuery } from 'react-query';
import { useRecoilState } from 'recoil';
import Feed from '../../components/media/Feed';
import LikeButton from '../../components/misc/LikeButton';
import UserTag from '../../components/profile/UserTag';
import RatingModal from '../../components/route/RatingModal';
import { userAtom } from '../../utils/atoms';
import { buildRouteFetcherFromDocRefId } from '../../utils/queries';
import {
  TabGlobalNavigationProp,
  TabGlobalScreenProps,
} from '../../utils/types';
import { Post, QueryCursor, RouteStatus } from '../../xplat/types';

const FORCED_THUMBNAIL_HEIGHT = 200;

const RouteView = ({ route }: TabGlobalScreenProps<'RouteView'>) => {
  const routeDocRefId = route.params.routeDocRefId;

  const navigation = useNavigation<TabGlobalNavigationProp>();

  const [user] = useRecoilState(userAtom);

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
    buildRouteFetcherFromDocRefId(routeDocRefId)
  );

  useEffect(() => {
    if (user === undefined || data === undefined) return;

    data.routeObject.getSendByUser(user).then((send) => {
      if (send === undefined) return;
      setUserHasSent(true);
      setIsSending(false);
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
    <Box w="full" h={600} bg={backgroundHex}>
      <ImageBackground
        style={styles.thumbnail}
        resizeMode={ResizeMode.COVER}
        source={{ uri: data.thumbnailUrl }}
      >
        <LinearGradient
          style={styles.gradient}
          colors={[backgroundHex + '00', backgroundHex]}
        />
        <Flex direction="column" h="full" w="full" mt={4}>
          <HStack flexWrap="wrap" justifyContent="space-between" mx={4}>
            <Heading size="2xl">{data.name}</Heading>
            <Heading size="2xl" color="grey">
              {data.grade}
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
            <LikeButton likes={data.likes} onSetIsLiked={onSetIsLiked} />
          </HStack>
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
    height: FORCED_THUMBNAIL_HEIGHT,
  },
  gradient: {
    height: FORCED_THUMBNAIL_HEIGHT,
  },
});

export default RouteView;
