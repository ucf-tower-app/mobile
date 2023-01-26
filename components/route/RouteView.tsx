import { ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Text,
  Flex,
  Heading,
  useToken,
  ScrollView,
  Divider,
  HStack,
  VStack,
  Box,
  Button,
  Center,
  Spinner,
} from 'native-base';
import { useEffect, useState } from 'react';
import { Dimensions, ImageBackground, StyleSheet } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import { useRecoilState } from 'recoil';
import { focusedRouteAtom, userAtom } from '../../utils/atoms';
import LikeButton from '../misc/LikeButton';
import UserTag from '../profile/UserTag';
import RatingModal from './RatingModal';
import Feed from '../media/Feed';
import {
  RouteStatus,
  User,
  Forum,
  QueryCursor,
  Post,
} from '../../xplat/types/types';

const FORCED_THUMBNAIL_HEIGHT = 200;
const windowHeight = Dimensions.get('window').height;

const RouteView = () => {
  const [route] = useRecoilState(focusedRouteAtom);
  const [user] = useRecoilState(userAtom);

  // Guaranteed to exist
  const [postsCursor, setPostsCursor] = useState<QueryCursor<Post> | undefined>(
    undefined
  );
  const [name, setName] = useState<string>('');
  const [grade, setGrade] = useState<string>('');
  const [likes, setLikes] = useState<User[]>([]);
  const [stringifiedTags, setStringifiedTags] = useState<string>('');
  const [status, setStatus] = useState<RouteStatus>(RouteStatus.Active);
  const [description, setDescription] = useState<string>('');

  // Potentially undefined
  const [setter, setSetter] = useState<User | undefined>(undefined);
  // TODO: Replace with a more fitting placeholder image once procured.
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(
    'https://wallpaperaccess.com/full/317501.jpg'
  );
  const [rope, setRope] = useState<number | undefined>(undefined);

  // TODO: Replace with backend query when available
  const [rating] = useState<number>(4.5);
  const [userHasRated, setUserHasRated] = useState<boolean>(false);
  const [isRating, setIsRating] = useState<boolean>(false);

  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [userHasSent, setUserHasSent] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(true);

  const onToggleIsLiked = async () => {
    if (route === undefined || user === null) return;
    setIsLiked(!isLiked);
    if (!isLiked) {
      route.addLike(user);
    } else {
      route.removeLike(user);
    }
  };

  const send = async () => {
    if (route !== undefined && user !== null) {
      setIsSending(true);
      await route.FUCKINSENDIT(user);
      setUserHasSent(true);
      setIsSending(false);
    }
  };

  const post = () => {
    // TODO: impl
  };

  const backgroundHex = useToken('colors', 'lightMode.base');

  useEffect(() => {
    const fetchData = async () => {
      if (route === undefined) return;
      await route.getData();

      route.getForum().then((forum) => {
        setPostsCursor(forum.getPostsCursor());
      });
      route.getName().then(setName);
      route.getGradeDisplayString().then(setGrade);
      route.getLikes().then(setLikes);
      route.getTags().then(async (tags) => {
        let tagStringBuilder = '';
        for (const tag of tags) {
          const tagName = await tag.getName();
          tagStringBuilder = tagStringBuilder + tagName + ', ';
        }
        // Remove trailing comma
        if (tagStringBuilder.length > 2 && tagStringBuilder.endsWith(', '))
          tagStringBuilder = tagStringBuilder.slice(0, -2);
        setStringifiedTags(tagStringBuilder);
      });
      route.getStatus().then(setStatus);
      route.getDescription().then(setDescription);

      route.hasSetter().then((hasSetter) => {
        if (hasSetter) route.getSetter().then(setSetter);
      });
      route.hasThumbnail().then((hasThumbnail) => {
        if (hasThumbnail) route.getThumbnailUrl().then(setThumbnailUrl);
      });
      route.hasRope().then((hasRope) => {
        if (hasRope) route.getRope().then(setRope);
      });

      if (user !== null) {
        route.likedBy(user).then(setIsLiked);
        route
          .getSendByUser(user)
          .then((send) => {
            if (send !== undefined) {
              setUserHasSent(true);
            }
          })
          .finally(() => setIsSending(false));
      }
    };

    fetchData();
  }, [route, user]);

  const routeViewComponent = (
    <Box w="full" h={600} bg={backgroundHex}>
      <ImageBackground
        style={styles.thumbnail}
        resizeMode={ResizeMode.COVER}
        source={{ uri: thumbnailUrl }}
      >
        <LinearGradient
          style={styles.gradient}
          colors={[backgroundHex + '00', backgroundHex]}
        />
        <Flex direction="column" h="full" w="full" mt={4}>
          <HStack flexWrap="wrap" justifyContent="space-between" mx={4}>
            <Heading size="2xl">{name}</Heading>
            <Heading size="2xl" color="grey">
              {grade}
            </Heading>
          </HStack>
          <Text fontSize="2xl" color="grey" mx={4}>
            {stringifiedTags}
          </Text>
          <HStack flexWrap="wrap" justifyContent="space-between" mx={4} mt={2}>
            {setter !== undefined ? (
              <VStack justifyContent="flex-start" flexGrow="unset">
                <Text fontSize="lg" color="grey" fontWeight="bold" mb={2}>
                  Setter
                </Text>
                <UserTag user={setter} size="sm" />
              </VStack>
            ) : null}
            <VStack
              justifyContent="flex-start"
              alignItems="flex-start"
              flexGrow="unset"
            >
              <Text fontSize="lg" color="grey" fontWeight="bold" mb={2}>
                Rating
              </Text>
              <StarRating
                rating={rating}
                onChange={() => {}}
                starStyle={styles.star}
                animationConfig={{ scale: 1 }}
              />
              {!userHasRated ? (
                <Button
                  variant="link"
                  py={1}
                  px={0}
                  onPress={() => setIsRating(true)}
                  isLoading={isRating}
                >
                  Rate this route
                </Button>
              ) : null}
            </VStack>
          </HStack>
          <Text fontSize="lg" mx={4} mt={2}>
            {description}
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
                {RouteStatus[status]}
              </Text>
              {rope !== undefined ? (
                <Text fontSize="md">Rope {rope}</Text>
              ) : null}
            </Box>
            <LikeButton
              isLiked={isLiked}
              onToggleLike={onToggleIsLiked}
              numLikes={likes.length}
            />
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
        <Feed postsCursor={postsCursor} topComponent={routeViewComponent} />
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
  // Bring stars closer together
  star: {
    marginLeft: -4,
  },
});

export default RouteView;
