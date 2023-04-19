import { useNavigation } from '@react-navigation/native';
import { manipulateAsync } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as VideoThumbnails from 'expo-video-thumbnails';
import {
  Box,
  Button,
  Divider,
  FormControl,
  Heading,
  HStack,
  Input,
  ScrollView,
  useColorModeValue,
  useToast,
  VStack,
} from 'native-base';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { queryClient } from '../../App';
import Post from '../../components/media/Post';
import ActiveRoutesDropdown from '../../components/route/ActiveRoutesDropdown';
import { userAtom } from '../../utils/atoms';
import {
  useGenericErrorToast,
  useOffensiveLanguageWarningToast,
  useRouteQuery,
} from '../../utils/hooks';
import { TabGlobalScreenProps } from '../../utils/types';
import { DebounceSession, wordFilter } from '../../utils/utils';
import { createPost, CreatePostError, getForumById } from '../../xplat/api';
import {
  FetchedRoute,
  LazyStaticImage,
  LazyStaticVideo,
  PostMock,
} from '../../xplat/types';

/**
 * The CreatePost screen is responsible for handling post creation from
 * several entry points. The only difference between entry points is whether
 * or not the Route field is pre-loaded.
 */
const CreatePost = ({ route }: TabGlobalScreenProps<'Create Post'>) => {
  const routeDocRefId = route.params.routeDocRefId;
  const maxVideoSize = 50;

  const navigation = useNavigation();
  const user = useRecoilValue(userAtom);

  const [textDebounceSession] = useState<DebounceSession>(
    new DebounceSession(250)
  );
  const [textContent, setTextContent] = useState<string>('');
  const [videoContent, setVideoContent] = useState<LazyStaticVideo>();
  const [isPickingVideo, setIsPickingVideo] = useState<boolean>(false);
  const [imageContent, setImageContent] = useState<LazyStaticImage[]>([]);
  const [isPickingImages, setIsPickingImages] = useState<boolean>(false);
  const [selectedRoute, setSelectedRoute] = useState<FetchedRoute>();
  const [isProcessingPost, setIsProcessingPost] = useState<boolean>(false);
  const [previewPost, setPreviewPost] = useState<PostMock>();
  const toast = useToast();

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  const showOffensiveLanguageWarningToast = useOffensiveLanguageWarningToast();
  const showGenericErrorToast = useGenericErrorToast();

  const routeQuery = useRouteQuery(routeDocRefId);

  useEffect(() => {
    if (routeQuery.data !== undefined && selectedRoute === undefined)
      setSelectedRoute(routeQuery.data);
  }, [routeQuery.data, selectedRoute]);

  // Build the preview post whenever relevant state changes
  useEffect(() => {
    if (user === undefined) return;
    setPreviewPost(
      new PostMock(
        user,
        new Date(Date.now()),
        textContent,
        [],
        [],
        imageContent,
        false,
        videoContent
      )
    );
  }, [textContent, videoContent, imageContent, user]);

  const isVideoTooBig = (fileInfo: FileSystem.FileInfo) => {
    const sizeInMb = fileInfo.size! / 1024 / 1024;
    return sizeInMb >= maxVideoSize;
  };

  // Opens up a video picker and updates state
  const pickVideo = async () => {
    try {
      setIsPickingVideo(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [4, 3],
        videoQuality: ImagePicker.UIImagePickerControllerQualityType.Low,
      });

      const asset = result.assets?.at(0);
      if (result.canceled || asset === undefined) return;

      const fileInfo = await FileSystem.getInfoAsync(asset.uri, { size: true });

      if (!fileInfo?.size) {
        toast.show({
          description: "Can't select this file as the size is unknown.",
          placement: 'top',
        });
        return;
      }

      if (isVideoTooBig(fileInfo)) {
        toast.show({
          description: `File size is too big. Max file size is ${maxVideoSize} MB.`,
          placement: 'top',
        });
        return;
      }

      // Get the first frame as a thumbnail
      const thumbnailResult = await VideoThumbnails.getThumbnailAsync(
        asset.uri
      );

      setVideoContent(
        new LazyStaticVideo(
          'mock/path',
          'mock/path',
          thumbnailResult.uri,
          asset.uri
        )
      );
    } finally {
      setIsPickingVideo(false);
    }
  };

  // Opens up an image picker and update state
  const pickImages = async () => {
    try {
      setIsPickingImages(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        aspect: [4, 3],
      });

      if (result.canceled) return;

      const imageURIs = await Promise.all(
        result.assets.map((asset) => {
          if (asset.width > 500) {
            return manipulateAsync(asset.uri, [{ resize: { width: 500 } }])
              .then((imageRes) => imageRes.uri)
              .catch(() => asset.uri);
          } else return asset.uri;
        })
      );

      setImageContent(
        imageURIs.map(
          (imageURI) => new LazyStaticImage('mock/path', imageURI)
        ) ?? []
      );
    } finally {
      setIsPickingImages(false);
    }
  };

  // Builds the blobs and sends it to the backend
  const post = async () => {
    if (user === undefined) return;

    try {
      setIsProcessingPost(true);

      // Make sure the content isn't profane
      if (wordFilter.isProfane(textContent)) {
        showOffensiveLanguageWarningToast();
        setIsProcessingPost(false);
        return;
      }

      // Get the videos in blob form
      const videoBlob =
        videoContent !== undefined
          ? {
              video: await (await fetch(videoContent.videoUrl!)).blob(),
              thumbnail: await (await fetch(videoContent.thumbnailUrl!)).blob(),
            }
          : undefined;

      // Get the images in blob form
      const imageBlobs = await Promise.all(
        imageContent.map(async (image) => (await fetch(image.imageUrl!)).blob())
      );

      // Derive the chosen forum
      const forum = selectedRoute && getForumById(selectedRoute.forumDocRefID);

      // Call create post!
      await createPost({
        author: user,
        textContent: textContent,
        forum: forum,
        imageContent: imageBlobs,
        videoContent: videoBlob,
        ...(selectedRoute && {
          routeInfo: {
            name: selectedRoute.name,
            grade: selectedRoute.gradeDisplayString,
          },
        }),
        isSend: false,
      });

      videoBlob?.video.close();
      videoBlob?.thumbnail.close();
      imageBlobs.forEach((blob) => blob.close());

      // Invalidate places where this post could show up locally
      queryClient.invalidateQueries({ queryKey: ['posts', user.getId()] });
      queryClient.invalidateQueries({ queryKey: 'all-posts' });
      if (forum)
        queryClient.invalidateQueries({ queryKey: ['posts', forum.getId()] });

      // Leave the "Posting" screen
      navigation.goBack();
      navigation.navigate('Tabs', {
        screen: 'ProfileTab',
        params: {
          screen: 'Profile',
          params: {},
        },
      });
    } catch (error: any) {
      var msg: string | undefined;
      if (error === CreatePostError.TooLarge) msg = error;
      else console.error(error);

      if (msg !== undefined)
        toast.show({
          description: msg,
          placement: 'top',
        });
      else showGenericErrorToast();
    } finally {
      setIsProcessingPost(false);
    }
  };

  const hasVideo = videoContent !== undefined;
  const hasImages = imageContent.length > 0;
  const isPostable = textContent !== '';

  return (
    <Box minH="full" bg={baseBgColor}>
      <ScrollView>
        <VStack py={2}>
          <FormControl mb={2} px={2}>
            <HStack flexBasis={0}>
              {hasVideo ? (
                <Button
                  onPress={() => setVideoContent(undefined)}
                  flexGrow={1}
                  mr={1}
                  variant="outline"
                >
                  Clear video
                </Button>
              ) : (
                <Button
                  onPress={pickVideo}
                  isLoading={isPickingVideo}
                  flexGrow={1}
                  mr={1}
                >
                  Select video
                </Button>
              )}

              {hasImages ? (
                <Button
                  onPress={() => setImageContent([])}
                  flexGrow={1}
                  ml={1}
                  variant="outline"
                >
                  Clear images
                </Button>
              ) : (
                <Button
                  onPress={pickImages}
                  isLoading={isPickingImages}
                  flexGrow={1}
                  ml={1}
                >
                  Select images
                </Button>
              )}
            </HStack>
          </FormControl>

          <FormControl px={2} pb={2}>
            <HStack>
              <FormControl.Label w={12} mr={2}>
                Body
              </FormControl.Label>
              <Box flexGrow={1}>
                <Input
                  multiline
                  placeholder="Find the right words"
                  onChangeText={(newText) =>
                    textDebounceSession.trigger(() => setTextContent(newText))
                  }
                />
              </Box>
            </HStack>
          </FormControl>

          <FormControl px={2} pb={2}>
            <HStack>
              <FormControl.Label w={12} mr={2}>
                Route
              </FormControl.Label>
              <Box flexGrow={1}>
                <ActiveRoutesDropdown
                  onSelectRoute={setSelectedRoute}
                  preSelectedRouteDocRefId={routeDocRefId}
                />
              </Box>
            </HStack>
          </FormControl>

          <Button
            mx={2}
            onPress={post}
            isLoading={isProcessingPost}
            isDisabled={!isPostable}
          >
            Post it!
          </Button>
        </VStack>
      </ScrollView>

      <Box mt="auto" pb={1}>
        <Heading mt={1} px={2}>
          Post preview
        </Heading>
        <Divider my={2} px={2} />
        {previewPost !== undefined ? (
          <Post post={previewPost} isPreview />
        ) : null}
      </Box>
    </Box>
  );
};

export default CreatePost;
