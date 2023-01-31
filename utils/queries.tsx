import { User, UserStatus } from '../xplat/types/types';

type FetchedUser = {
  username: string;
  email: string;
  displayName: string;
  bio: string;
  status: UserStatus;
  avatarUrl: string;
};
export const buildUserFetcher = (user: User) => {
  return async () => {
    await user.getData();
    return {
      username: await user.getUsername(),
      email: await user.getEmail(),
      displayName: await user.getDisplayName(),
      bio: await user.getBio(),
      status: await user.getStatus(),
      avatarUrl: await user.getAvatarUrl(),
    } as FetchedUser;
  };
};
