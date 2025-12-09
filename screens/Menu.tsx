import { useNavigation } from '@react-navigation/native';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';
import Header from '../components/common/Header';
import MenuItem from '../components/MenuItem';
import { Colors } from '../constant';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const Menu = () => {
  const navigation = useNavigation<any>()
  return (
    <View style={styles.container}>
      <Header title="Menu" />
      <MenuItem label='App Settings' icon={(require('../assets/images/setting-icon.png'))} onPress={() => navigation.navigate('AppSetting')} />
      <MenuItem label='Medical Papers' icon={(require('../assets/images/madical-paper-icon.png'))} onPress={() => navigation.navigate('MedicalPaper')} />
      <MenuItem label='Give feedback' icon={(require('../assets/images/feedback-icon.png'))} onPress={() => navigation.navigate('Feedback')} />
    </View>
  );
};

export default Menu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    paddingTop: Platform.OS === 'ios' ? 0 : 20

  },
});
