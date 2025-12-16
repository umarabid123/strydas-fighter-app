import { useEffect, useState } from 'react';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';
import EmptyState from '../components/EmptyState';
import AppLoader from '../components/common/AppLoader';
import AppText from '../components/common/AppText';
import CustomBottomSheet from '../components/common/CustomBottomSheet';
import Header from '../components/common/Header';
import { Colors } from '../constant';

const Home = () => {
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetType, setSheetType] = useState<'match' | 'event' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const openSheet = (type: 'match' | 'event') => {
    setSheetType(type);
    setSheetVisible(true);
  };

  return (
    <View style={[styles.container]}>
      <Header title='Home' />
      <EmptyState
        title="My matches"
        subtitle='You have no matches yet.'
        buttonLabel='Browse'
        customStyle={{ marginBottom: 12, marginTop: 14 }}
        onButtonPress={() => openSheet('match')}
      />
      <EmptyState
        title="My events"
        subtitle='You have no events yet.'
        buttonLabel='Create event'
        onButtonPress={() => openSheet('event')}
      />

      <CustomBottomSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        title={sheetType === 'match' ? 'Create Matches' : 'Create event'}
      >
        <AppText
          text={sheetType === 'match' ? 'TODO\nMatches field' : 'TODO\nEvent fields'}
          color={Colors.white}
          fontSize={32}
          fontName="CircularStd-Bold"
          textAlign="center"
          style={{ marginTop: 50 }}
        />
      </CustomBottomSheet>
      <AppLoader isLoading={isLoading} />
    </View>
  );
};
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")
export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    paddingBottom: 0
  },
});
