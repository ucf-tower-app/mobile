// Route metadata for the activeRoutes tab
import ActiveRoutes from '../../../screens/activeRoutes/ActiveRoutes';
import { Name } from './names';

export type Route = {
  name: Name;
  component: any;
};

export const routes: Route[] = [
  {
    name: 'ActiveRoutes',
    component: ActiveRoutes,
  },
  {
    name: 'RouteView',
    component: RouteView,
  },
];
