import { Menu, Box } from 'native-base';
import { PressableDots } from '../header/HeaderMenu';

export type ContextOptions = {
  [name: string]: () => void;
};
type Props = {
  contextOptions: ContextOptions;
};
const ContextMenu = ({ contextOptions }: Props) => {
  return Object.keys(contextOptions).length > 0 ? (
    <Box>
      <Menu trigger={PressableDots}>
        {Object.keys(contextOptions).map((key) => (
          <Menu.Item key={key} onPress={contextOptions[key]}>
            {key}
          </Menu.Item>
        ))}
      </Menu>
    </Box>
  ) : null;
};

export default ContextMenu;
