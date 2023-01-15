import { ResizeMode, Video } from 'expo-av';
import { Flex } from 'native-base';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import VideoThumbnail from './VideoThumbnail';

type Props = {
  thumbnailUrl: string;
  videoUrl: string;
  width: number;
  height: number;
};
const VideoWithThumbnail = ({
  thumbnailUrl,
  videoUrl,
  width,
  height,
}: Props) => {
  const [tappedThumbnail, setTappedThumbnail] = useState<boolean>(false);

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
