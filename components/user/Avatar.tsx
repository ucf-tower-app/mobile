import { Image, StyleSheet } from 'react-native';

type Props = {
  size?: number;
};
const Avatar = ({ size }: Props) => {
  const safeSize = size ?? 128;
  const styles = StyleSheet.create({
    roundedImage: {
      borderRadius: safeSize,
      width: safeSize,
      height: safeSize,
    },
  });
  return (
    <Image
      source={{
        uri: 'https://images.ctfassets.net/ub3bwfd53mwy/6PhlUjXZqaHqu6LqJ5G3X3/ee400fdfaf784e3d530a212ce3453c48/1_Image.jpg?w=750',
      }}
      accessibilityLabel="A cat"
      style={styles.roundedImage}
    />
  );
};

export default Avatar;
