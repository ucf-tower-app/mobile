import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';

type Props = {
  status: boolean;
  onToggle: () => void;
  onIcon: JSX.Element;
  offIcon: JSX.Element;
};
const IconToggle = ({ status, onToggle, onIcon, offIcon }: Props) => {
  const [statusLocal, setStatusLocal] = useState<boolean>(status);

  useEffect(() => {
    setStatusLocal(status);
  }, [status]);

  const toggle = async () => {
    setStatusLocal(!statusLocal);
    onToggle();
  };

  return (
    <TouchableOpacity onPress={toggle}>
      {statusLocal ? onIcon : offIcon}
    </TouchableOpacity>
  );
};

export default IconToggle;
