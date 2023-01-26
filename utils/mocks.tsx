import { ForumMock } from '../xplat/types/forum';
import { LazyStaticVideo } from '../xplat/types/media';
import { PostMock } from '../xplat/types/post';
import {
  RouteClassifier,
  RouteMock,
  RouteStatus,
  RouteType,
} from '../xplat/types/route';
import { TagMock } from '../xplat/types/tag';
import { LazyStaticImage, UserStatus } from '../xplat/types/types';
import { UserMock } from '../xplat/types/user';

export const profilePic = new LazyStaticImage(
  'mock/path',
  'https://wallpaperaccess.com/full/317501.jpg'
);
export const setterMock = new UserMock(
  'mockymock',
  'setter@setter.com',
  'Mock mock',
  "I'm a mocked user, I like mocks!",
  UserStatus.Employee,
  [],
  [],
  [],
  profilePic
);
export const forumMock = new ForumMock([]);
export const tagMocks = [
  new TagMock('crimpy', 'desc'),
  new TagMock('solid', 'desc'),
];
export const routeMock = new RouteMock(
  'Cool beans',
  new RouteClassifier(60, RouteType.Toprope),
  forumMock,
  [],
  tagMocks,
  RouteStatus.Active,
  'This route is pretty awesome. Dynamic movements with some technique near the top. Short climbers beware!',
  setterMock,
  profilePic,
  5
);
export const routeMock2 = new RouteMock(
  'Slime In the Ice Machine',
  new RouteClassifier(5, RouteType.Boulder),
  forumMock,
  [],
  tagMocks,
  RouteStatus.Active,
  'This seems to be required, but I think that it shouldnt...'
);
export const routeMock3 = new RouteMock(
  'Another one',
  new RouteClassifier(2, RouteType.Boulder),
  forumMock,
  [],
  tagMocks,
  RouteStatus.Active,
  'Another desc'
);
export const routeMock4 = new RouteMock(
  'How did we get here?',
  new RouteClassifier(61, RouteType.Toprope),
  forumMock,
  [],
  tagMocks,
  RouteStatus.Active,
  'Another one!'
);
export const routeMocks = [routeMock, routeMock2, routeMock3, routeMock4];
export const videoMock = new LazyStaticVideo(
  'mock/path',
  'mock/path',
  'https://i.insider.com/602ee9ced3ad27001837f2ac?width=2000&format=jpeg&auto=webp',
  'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4'
);
export const userMock2 = new UserMock(
  'bruh',
  'myboy@mail.com',
  'HAHA',
  'AYO MY BOI',
  UserStatus.Verified,
  [],
  [],
  [],
  profilePic
);
export const userMock3 = new UserMock(
  'user3',
  'fakeuser3@mail.com',
  'AYOOOO',
  'Who is you',
  UserStatus.Verified,
  [],
  [],
  [],
  profilePic
);
export const userMock4 = new UserMock(
  'im fakee',
  'faker@mail.com',
  'So much code',
  'Last of us',
  UserStatus.Verified,
  [],
  [],
  [],
  profilePic
);
export const userMock = new UserMock(
  'mockitymock',
  'fakeemail@mail.com',
  'Mockity Mock',
  'Being mocked is my personality',
  UserStatus.Verified,
  [],
  [userMock2, userMock3],
  [userMock4],
  profilePic
);
export const postMock = new PostMock(
  userMock,
  new Date(Date.now()),
  'This is really the best post ever. Like, wow! I like rocks. Who would have thought that rocks would be so cool. Also grabbing them.',
  [],
  [],
  [profilePic, profilePic],
  videoMock
);
export const postMockNoImage = new PostMock(
  userMock,
  new Date(Date.now()),
  'This is really the best post ever. Like, wow! I like rocks. Who would have thought that rocks would be so cool. Also grabbing them.',
  [],
  [],
  [],
  videoMock
);
export const postMockNoVideo = new PostMock(
  userMock,
  new Date(Date.now()),
  'This is really the best post ever. Like, wow! I like rocks. Who would have thought that rocks would be so cool. Also grabbing them.',
  [],
  [],
  [profilePic, profilePic]
);
