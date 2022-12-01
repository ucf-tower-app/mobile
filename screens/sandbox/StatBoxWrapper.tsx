import StatBox from '../../components/profile/StatBox';

const StatBoxWrapper = () => {
  return (
    <StatBox
      stat="Boulder"
      value="V7"
      onPress={() => {
        console.log('Statbox was pressed!');
      }}
    />
  );
};

export default StatBoxWrapper;
