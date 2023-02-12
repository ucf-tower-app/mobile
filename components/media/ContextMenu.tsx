import { Menu } from 'native-base';
import { PressableDots } from '../header/HeaderMenu';

export type ContextOptions = {
  [name: string]: () => void;
};
type Props = {
  contextOptions: ContextOptions;
};
const ContextMenu = ({ contextOptions }: Props) => {
  return Object.keys(contextOptions).length > 0 ? (
    <Menu
      trigger={(triggerProps) => {
        return PressableDots(triggerProps);
      }}
    >
      {Object.keys(contextOptions).map((key) => (
        <Menu.Item key={key} onPress={contextOptions[key]}>
          {key}
        </Menu.Item>
      ))}
    </Menu>
  ) : null;
};

export default ContextMenu;
