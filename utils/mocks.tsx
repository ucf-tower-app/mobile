import { ForumMock } from '../xplat/types/forum';
import { LazyStaticVideo } from '../xplat/types/media';
import { PostMock } from '../xplat/types/post';
import { RouteMock } from '../xplat/types/route';
import { TagMock } from '../xplat/types/tag';
import { LazyStaticImage, UserStatus } from '../xplat/types/types';
import { UserMock } from '../xplat/types/user';

export const setterMock = new UserMock(
  'mockymock',
  'setter@setter.com',
  'Mock mock',
  "I'm a mocked user, I like mocks!",
  UserStatus.Employee,
  [],
  [],
  []
);
export const forumMock = new ForumMock([]);
export const tagMocks = [
  new TagMock('crimpy', 'desc'),
  new TagMock('solid', 'desc'),
];
export const routeMock = new RouteMock(
  'Cool beans',
  '5.9',
  setterMock,
  forumMock,
  [],
  tagMocks
);
export const routeMock2 = new RouteMock(
  'Slime In the Ice Machine',
  'V2',
  setterMock,
  forumMock,
  [],
  tagMocks
);
export const routeMock3 = new RouteMock(
  'Another one',
  'V4',
  setterMock,
  forumMock,
  [],
  tagMocks
);
export const routeMock4 = new RouteMock(
  'How did we get here?',
  '5.10+',
  setterMock,
  forumMock,
  [],
  tagMocks
);
export const routeMocks = [routeMock, routeMock2, routeMock3, routeMock4];
export const profilePic = new LazyStaticImage(
  'mock/path',
  'https://wallpaperaccess.com/full/317501.jpg'
);
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
