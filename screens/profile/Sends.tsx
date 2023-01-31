import { User } from '../../xplat/types/user';
import { useState } from 'react';
import { useEffect } from 'react';
import { Send } from '../../xplat/types/send';
import { View } from 'native-base';

const Sends = (user: User) => {
  const [sends, setSends] = useState<Send[]>();

  useEffect(() => {
    const getSends = async () => {
      await user.getSends().then(setSends);
    };
    getSends();
  }, [user]);

  return <View />;
};

export default Sends;
