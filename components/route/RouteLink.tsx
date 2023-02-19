import { useNavigation } from '@react-navigation/native';
import { Button } from 'native-base';
import { useQuery } from 'react-query';
import { Route, RouteStatus } from '../../xplat/types';

type Props = {
  route: Route;
  noPadding?: boolean;
};
const RouteLink = ({ route, noPadding = false }: Props) => {
  const navigation = useNavigation();

  const { isLoading, isError, data, error } = useQuery(
    route.getId(),
    route.buildFetcher()
  );

  const navigateToRoute = () => {
    if (data === undefined) return;

    const screen =
      data.status === RouteStatus.Archived ? 'SearchTab' : 'ActiveRoutesTab';

    navigation.navigate('Tabs', {
      screen,
      params: {
        screen: 'RouteView',
        params: {
          routeDocRefId: data.routeObject.getId(),
        },
      },
    });
  };

  if (isLoading) return null;

  if (isError || data === undefined) {
    console.error(error);
    return null;
  }

  return (
    <Button
      variant="link"
      onPress={navigateToRoute}
      _text={{ fontSize: 'xs' }}
      p={noPadding ? '0' : '2'}
    >
      {data.name}
    </Button>
  );
};

export default RouteLink;
