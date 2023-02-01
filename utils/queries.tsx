import { getUserById } from '../xplat/api';
import {
  Cursor,
  Post,
  RouteClassifier,
  RouteType,
  User,
  UserStatus,
} from '../xplat/types/types';

export interface FetchedUser {
  username: string;
  email: string;
  displayName: string;
  bio: string;
  status: UserStatus;
  avatarUrl: string;
  followingList: User[];
  bestBoulder: RouteClassifier | undefined;
  bestToprope: RouteClassifier | undefined;
  totalSends: number;
  postsCursor: Cursor<Post>;
  followersCursor: Cursor<User>;
  followingCursor: Cursor<User>;
  __userObject: User;
}
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
      followingList: user.following ?? [],
      bestBoulder: await user.getBestSendClassifier(RouteType.Boulder),
      bestToprope: await user.getBestSendClassifier(RouteType.Toprope),
      totalSends: await user.getTotalSends(),
      postsCursor: await user.getPostsCursor(),
      followersCursor: await user.getFollowersCursor(),
      followingCursor: await user.getFollowingCursor(),
      __userObject: user,
    } as FetchedUser;
  };
};
export const buildUserFetcherFromDocRefId = (docRefId: string) => {
  return buildUserFetcher(getUserById(docRefId));
};
