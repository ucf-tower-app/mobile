// Route metadata for the sandbox tab
import { Name } from './names';
import Sandbox from '../../../pages/sandbox/Sandbox';
import RouteRow from '../../../components/route/RouteRow';
import ProfileBanner from '../../../components/profile/ProfileBanner';
import StatBox from '../../../components/profile/StatBox';

export type Route = {
  name: Name;
  component: any;
};

export const routes: Array<Route> = [
  {
    name: 'Sandbox',
    component: Sandbox,
  },
  {
    name: 'RouteRow',
    component: RouteRow,
  },
  {
    name: 'ProfileBanner',
    component: ProfileBanner,
  },
  {
    name: 'StatBox',
    component: StatBox,
  },
];

// Verbose props may be swapped for middleware lazy-objects down the line
export type PropMap = {
  Sandbox: undefined;

  RouteRow: {
    thumbnail: string;
    name: string;
    grade: string;
    tags: Array<string>;
  };

  ProfileBanner: {
    avatarUrl: string;
    userName: string;
    userHandle: string;
  };

  StatBox: {
    stat: string;
    value: string;
    onPress: () => void;
  };
};
