import { UserStatus } from '../xplat/types';

export const permissionLevelCanWrite = (
  permissionLevel: UserStatus | undefined
) => {
  return (
    permissionLevel !== undefined && permissionLevel >= UserStatus.Approved
  );
};
