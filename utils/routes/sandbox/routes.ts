// Route metadata for the sandbox tab
import { Name } from './names';
import Sandbox from '../../../pages/sandbox/Sandbox';
import RouteRow from '../../../components/route/RouteRow';

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
];

export type PropMap = {
  Sandbox: undefined;

  // Maybe replace this with RouteRef backend object down the line
  RouteRow: {
    thumbnail: string;
    name: string;
    grade: string;
    tags: Array<string>;
  };
};
