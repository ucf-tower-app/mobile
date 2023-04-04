// Route metadata for tab-global routes
import Comments from '../../../screens/media/Comments';
import CreatePost from '../../../screens/media/CreatePost';
import BlockedList from '../../../screens/profile/BlockedList';
import Follows from '../../../screens/profile/Follows';
import Profile from '../../../screens/profile/Profile';
import Sends from '../../../screens/profile/Sends';
import RouteView from '../../../screens/route/RouteView';
import { Name } from './names';

export type Route = {
  name: Name;
  component: any;
};

export const routes: Route[] = [
  {
    name: 'Profile',
    component: Profile,
  },
  {
    name: 'Sends',
    component: Sends,
  },
  {
    name: 'Follows',
    component: Follows,
  },
  {
    name: 'Route View',
    component: RouteView,
  },
  {
    name: 'Create Post',
    component: CreatePost,
  },
  {
    name: 'Comments',
    component: Comments,
  },
  {
    name: 'Blocked List',
    component: BlockedList,
  },
];
