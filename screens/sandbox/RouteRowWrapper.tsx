import RouteRow from '../../components/route/RouteRow';
import { UserStatus } from '../../xplat/types/common';
import { ForumMock } from '../../xplat/types/forum';
import { RouteMock } from '../../xplat/types/route';
import { UserMock } from '../../xplat/types/user';
import { TagMock } from '../../xplat/types/tag';

const setterMock = new UserMock(
  'mockymock',
  'setter@setter.com',
  'Mock mock',
  "I'm a mocked user, I like mocks!",
  UserStatus.Employee,
  [],
  [],
  []
);
const forumMock = new ForumMock([]);
const tagMocks = [new TagMock('crimpy', 'desc'), new TagMock('solid', 'desc')];
const routeMock = new RouteMock(
  'Mocked route',
  '5.9',
  setterMock,
  forumMock,
  [],
  tagMocks
);

const RouteRowWrapper = () => {
  return <RouteRow route={routeMock} />;
};

export default RouteRowWrapper;
