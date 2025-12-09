import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors, DESIGN_WIDTH } from '../constant';
import { Spacing } from '../constant/spacing';
import { Typography } from '../constant/typography';
import AppText from './common/AppText';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SettingsRowProps {
  icon?: any;
  label: string;
  onPress?: () => void;
}

export default function MenuItem({ icon, label, onPress }: SettingsRowProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        <Image source={icon} resizeMode="contain" />
        <AppText
          text={label}
          fontSize={Typography.fontSize.lg}
          fontName="CircularStd-Medium"
          color={Colors.white}
        />
      </View>
      <Image
        source={require('../assets/images/right-arrow-icon.png')}
        style={{ width: 24, height: 24, tintColor: Colors.grayMedium }}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: SCREEN_WIDTH,
    paddingVertical: (16 / DESIGN_WIDTH) * SCREEN_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.whiteOpacity10,
    marginHorizontal: (16 / DESIGN_WIDTH) * SCREEN_WIDTH,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
});
