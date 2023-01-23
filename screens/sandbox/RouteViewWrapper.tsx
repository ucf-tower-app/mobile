import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import RouteView from '../../components/route/RouteView';
import { focusedRouteAtom } from '../../utils/atoms';
import { routeMock } from '../../utils/mocks';

const RouteViewWrapper = () => {
  const setFocusedRoute = useSetRecoilState(focusedRouteAtom);

  useEffect(() => {
    setFocusedRoute(routeMock);
  }, []);

  return <RouteView />;
};

export default RouteViewWrapper;
