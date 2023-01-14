import { ResizeMode, Video } from 'expo-av';
import { Flex } from 'native-base';
import { useEffect, useState } from 'react';
import { Dimensions, Image as ImageRN, StyleSheet } from 'react-native';
import VideoThumbnail from './VideoThumbnail';

type Props = {
  thumbnailUrl: string;
  videoUrl: string;
};
const VideoWithThumbnail = ({ thumbnailUrl, videoUrl }: Props) => {
  const [tappedThumbnail, setTappedThumbnail] = useState<boolean>(false);

  const width = Dimensions.get('window').width;
  const [height, setHeight] = useState<number>(200);

  useEffect(() => {
    ImageRN.getSize(thumbnailUrl, (imageWidth, imageHeight) => {
      const aspectRatio = imageWidth / imageHeight;
      const calculatedHeight = width / aspectRatio;
      setHeight(calculatedHeight);
    });
  }, [thumbnailUrl, width]);

  return tappedThumbnail ? (
    <Flex w={width} h={height} justifyContent="center" alignItems="center">
      <Video
        resizeMode={ResizeMode.COVER}
        source={{ uri: videoUrl }}
        useNativeControls
        isLooping
        shouldPlay
        style={styles.video}
      />
    </Flex>
  ) : (
    <VideoThumbnail
      thumbnailUrl={thumbnailUrl}
      onPress={() => setTappedThumbnail(true)}
      width={width}
      height={height}
    />
  );
};

const styles = StyleSheet.create({
  video: {
    flex: 1,
    alignSelf: 'stretch',
  },
});

export default VideoWithThumbnail;
