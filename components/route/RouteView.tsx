import { ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Box,
  Text,
  Flex,
  Heading,
  useToken,
  ScrollView,
  Divider,
  HStack,
  VStack,
} from 'native-base';
import { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import { getCurrentUser } from '../../xplat/api';
import { Route, RouteStatus } from '../../xplat/types/route';
import { User } from '../../xplat/types/user';
import LikeButton from '../misc/LikeButton';
import UserTag from '../profile/UserTag';

const FORCED_THUMBNAIL_HEIGHT = 200;

type Props = {
  route: Route;
};
const RouteView = ({ route }: Props) => {
  const [name, setName] = useState<string>('');
  const [grade, setGrade] = useState<string>('');
  const [likes, setLikes] = useState<User[]>([]);
  const [stringifiedTags, setStringifiedTags] = useState<string>('');
  const [status, setStatus] = useState<RouteStatus>(RouteStatus.Active);
  const [description, setDescription] = useState<string>('');

  // Potentially undefined data in the Route object
  const [setter, setSetter] = useState<User | undefined>(undefined);
  // TODO: Replace with a more fitting placeholder image once procured.
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(
    'https://wallpaperaccess.com/full/317501.jpg'
  );
  const [rope, setRope] = useState<number | undefined>(undefined);

  // TODO: Replace with actual rating once implemented in the backend.
  const [rating, setRating] = useState<number>(4.5);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const onToggleIsLiked = async () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      route.addLike(await getCurrentUser());
    } else {
      route.removeLike(await getCurrentUser());
    }
  };

  const backgroundHex = useToken('colors', 'lightMode.base');

  useEffect(() => {
    const fetchData = async () => {
      await route.getData();

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

      route.likedBy(await getCurrentUser()).then(setIsLiked);
    };

    fetchData();
  }, [route]);

  return (
    <ScrollView w="full" h="full" bg={backgroundHex}>
      <ImageBackground
        style={styles.thumbnail}
        resizeMode={ResizeMode.COVER}
        source={{ uri: thumbnailUrl }}
      >
        <LinearGradient
          style={styles.gradient}
          colors={[backgroundHex + '00', backgroundHex]}
        />
        <Flex direction="column" h="full" mt={4}>
          <HStack flexWrap="wrap" justifyContent="space-between" mx={4}>
            <Heading size="2xl">{name}</Heading>
            <Heading size="2xl" color="grey">
              {grade}
            </Heading>
          </HStack>
          <Text fontSize="2xl" color="grey" mx={4}>
            {stringifiedTags}
          </Text>
          <HStack flexWrap="wrap" justifyContent="space-between" mx={4} mt={6}>
            <VStack justifyContent="flex-start" flexGrow="unset">
              <Text fontSize="lg" color="grey" fontWeight="bold" mb={2}>
                Setter
              </Text>
              <UserTag user={setter} />
            </VStack>
            <VStack justifyContent="flex-start" flexGrow="unset">
              <Text fontSize="lg" color="grey" fontWeight="bold" mb={2}>
                Rating
              </Text>
              <StarRating
                rating={rating}
                onChange={() => {}}
                starStyle={styles.star}
              />
            </VStack>
          </HStack>
          <Text fontSize="lg" mx={4} mt={6}>
            {description}
          </Text>
          <HStack
            flexWrap="wrap"
            justifyContent="space-between"
            alignItems="flex-end"
            mx={4}
            mt={4}
          >
            <Text fontSize="lg" italic bold>
              {RouteStatus[status]}
            </Text>
            {/*

              TODO: Add a button to send the route

            */}
            <LikeButton
              isLiked={isLiked}
              onToggleLike={onToggleIsLiked}
              numLikes={likes.length}
            />
          </HStack>
          <Divider my={4} />
        </Flex>
      </ImageBackground>
    </ScrollView>
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
