import { useNavigation } from '@react-navigation/native';
import { Button } from 'native-base';
import { useEffect, useState } from 'react';
import { useArchivedSet } from '../../utils/queries';
import { getRouteByName } from '../../xplat/api';

type Props = {
  routeName: string;
  noPadding?: boolean;
};
const RouteLink = ({ routeName, noPadding = false }: Props) => {
  const navigation = useNavigation();

  const archivedRoutes = useArchivedSet();
  const [targScreen, setTargScreen] = useState<
    'SearchTab' | 'ActiveRoutesTab'
  >();

  useEffect(() => {
    if (archivedRoutes.data !== undefined)
      setTargScreen(
        archivedRoutes.data.has(routeName) ? 'SearchTab' : 'ActiveRoutesTab'
      );
  }, [archivedRoutes.data, routeName]);

  const navigateToRoute = () => {
    if (targScreen === undefined) return;
    const screen = targScreen;

    getRouteByName(routeName).then((route) =>
      navigation.navigate('Tabs', {
        screen,
        params: {
          screen: 'RouteView',
          params: {
            routeDocRefId: route.getId(),
          },
        },
      })
    );
  };

  return (
    <Button
      variant="link"
      onPress={navigateToRoute}
      _text={{ fontSize: 'xs', numberOfLines: 1 }}
      p={noPadding ? '0' : '2'}
    >
      {routeName}
    </Button>
  );
};

export default RouteLink;
