import {
  convertBoulderStringToClassifier,
  convertTopropeStringToClassifier,
} from '../xplat/api';
import { ForumMock } from '../xplat/types/forum';
import { LazyStaticVideo } from '../xplat/types/media';
import { PostMock } from '../xplat/types/post';
import { RouteMock, RouteStatus } from '../xplat/types/route';
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
  convertTopropeStringToClassifier('5.6+'),
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
  convertBoulderStringToClassifier('V5'),
  forumMock,
  [],
  tagMocks,
  RouteStatus.Active,
  'This seems to be required, but I think that it shouldnt...'
);
export const routeMock3 = new RouteMock(
  'Another one',
  convertBoulderStringToClassifier('V8'),
  forumMock,
  [],
  tagMocks,
  RouteStatus.Active,
  'Another desc'
);
export const routeMock4 = new RouteMock(
  'How did we get here?',
  convertTopropeStringToClassifier('5.7-'),
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
export const userMock = new UserMock(
  'mockitymock',
  'fakeemail@mail.com',
  'Mockity Mock',
  'Being mocked is my personality',
  UserStatus.Verified,
  [],
  [],
  [],
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
