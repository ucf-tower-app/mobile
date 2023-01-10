import { LazyStaticImage } from '../xplat/types/common';
import { ForumMock } from '../xplat/types/forum';
import { PostMock } from '../xplat/types/post';
import { RouteMock } from '../xplat/types/route';
import { TagMock } from '../xplat/types/tag';
import { UserStatus } from '../xplat/types/types';
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
  'Mocked route',
  '5.9',
  setterMock,
  forumMock,
  [],
  tagMocks
);
export const profilePic = new LazyStaticImage(
  'mock/path',
  'https://wallpaperaccess.com/full/317501.jpg'
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
  [profilePic, profilePic]
);
export const postMockNoImage = new PostMock(
  userMock,
  new Date(Date.now()),
  'This is really the best post ever. Like, wow! I like rocks. Who would have thought that rocks would be so cool. Also grabbing them.'
);
