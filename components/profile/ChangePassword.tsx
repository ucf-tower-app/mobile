import { Center, FormControl, Input, VStack } from 'native-base';
import { useState } from 'react';
import { DebounceSession } from '../../utils/utils';

type Props = {
  setOldPwd: any;
  setNewPwd: any;
  setConfirmPwd: any;
  newPwd: string | undefined;
  confirmPwd: string | undefined;
};

const ChangePassword = ({
  setOldPwd,
  setNewPwd,
  setConfirmPwd,
  newPwd,
  confirmPwd,
}: Props) => {
  const [oldSesh] = useState<DebounceSession>(new DebounceSession(500));
  const [newSesh] = useState<DebounceSession>(new DebounceSession(500));
  const [confirmSesh] = useState<DebounceSession>(new DebounceSession(500));

  const newInvalid = newPwd !== undefined && newPwd.length < 8;
  const confirmInvalid = newPwd !== confirmPwd;

  return (
    <Center width="full" p="3">
      <VStack width="full">
        <FormControl>
          <FormControl.Label>Old Password</FormControl.Label>
          <Input
            secureTextEntry={true}
            onChangeText={(e) => oldSesh.trigger(() => setOldPwd(e))}
          />
        </FormControl>
        <FormControl mt="3" isInvalid={newInvalid}>
          <FormControl.Label>New Password</FormControl.Label>
          <Input
            secureTextEntry={true}
            onChangeText={(e) => newSesh.trigger(() => setNewPwd(e))}
          />
          <FormControl.ErrorMessage>
            Password must be at least 8 characters
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl mt="3" isInvalid={confirmInvalid}>
          <FormControl.Label>Confirm New Password</FormControl.Label>
          <Input
            secureTextEntry={true}
            onChangeText={(e) => confirmSesh.trigger(() => setConfirmPwd(e))}
          />
          <FormControl.ErrorMessage>
            Passwords must match
          </FormControl.ErrorMessage>
        </FormControl>
      </VStack>
    </Center>
  );
};

export default ChangePassword;
