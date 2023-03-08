import { Ionicons } from '@expo/vector-icons';
import { Icon } from 'native-base';
import { ThemeComponentSizeType } from 'native-base/lib/typescript/components/types';

type Props = {
  name: string;
  size: ThemeComponentSizeType<'Icon'>;
  color?: string;
};
const LightDarkIcon = ({ name, size, color }: Props) => {
  return color === undefined ? (
    <Icon
      as={Ionicons}
      name={name}
      size={size}
      color="coolGray.800"
      _dark={{
        color: 'warmGray.50',
      }}
    />
  ) : (
    <Icon as={Ionicons} name={name} size={size} color={color} />
  );
};

export default LightDarkIcon;
