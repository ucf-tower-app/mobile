import { useNavigation } from '@react-navigation/native';
import { Button } from 'native-base';
import { useArchivedSet } from '../../utils/queries';
import { getRouteByName } from '../../xplat/api';

type Props = {
  routeName: string;
  noPadding?: boolean;
};
const RouteLink = ({ routeName, noPadding = false }: Props) => {
  const navigation = useNavigation();

  const archivedRoutes = useArchivedSet();

  const navigateToRoute = () => {
    if (archivedRoutes.data === undefined) return;

    const screen = archivedRoutes.data.has(routeName)
      ? 'SearchTab'
      : 'ActiveRoutesTab';

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
      _text={{ fontSize: 'xs' }}
      p={noPadding ? '0' : '2'}
    >
      {routeName}
    </Button>
  );
};

export default RouteLink;
