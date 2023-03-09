import { Ionicons } from '@expo/vector-icons';
import { Box, Icon, IconButton, Image, Spinner } from 'native-base';
import React, { useState } from 'react';

type Props = {
  thumbnailUrl: string;
  onPress: () => void;
  width: number;
  height: number;
};
const VideoThumbnail = ({ thumbnailUrl, onPress, width, height }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <Box>
      <Image
        source={{ uri: thumbnailUrl }}
        w={width}
        h={height}
        alt="Pressable thumbnail"
        onLoad={() => setIsLoading(false)}
      />
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        justifyContent="center"
        alignItems="center"
      >
        {isLoading ? (
          <Spinner size="lg" />
        ) : (
          <IconButton
            icon={
              <Icon
                as={Ionicons}
                name="play-circle"
                color="white"
                opacity={75}
                size="6xl"
              />
            }
            onPress={onPress}
            _pressed={{
              bg: '#0000',
              _icon: {
                color: '#fff9',
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default VideoThumbnail;
