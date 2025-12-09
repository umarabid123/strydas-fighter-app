import { View, StyleSheet, Dimensions } from 'react-native';
import { Colors, Typography, BorderRadius, DESIGN_WIDTH } from '../constant';
import AppText from './common/AppText';
import AppButton from './common/AppButton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface EmptyStateProps {
  title: string;
  subtitle: string;
  buttonLabel?: string;
  onButtonPress?: () => void;
  badgeLabel?: string;
  badgeColor?: string;
  customStyle?:any
}

export default function EmptyState({
  title,
  subtitle,
  buttonLabel,
  onButtonPress,
  customStyle
}: EmptyStateProps) {
  return (
    <View style={[styles.container, customStyle]}>
      {/* Title */}
      <AppText
        text={title}
        fontSize={Typography.fontSize.lg}
        fontName="CircularStd-Medium"
        color={Colors.white}
        style={styles.title}
      />

      {/* Subtitle */}
      <AppText
        text={subtitle}
        fontSize={Typography.fontSize.xl}
        fontName="CircularStd-Book"
        color={Colors.textSecondary}
        style={styles.subtitle}
      />

      {/* Content Section */}
      <AppButton text={buttonLabel} onPress={onButtonPress} textStyle={{color: Colors.black}} btnStyle={styles.button}  />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.darkGray2,
    borderRadius: 12,
    padding: 20,
    justifyContent:'flex-start',
     marginHorizontal: (12 / DESIGN_WIDTH) * SCREEN_WIDTH,
  },
  title: {
    fontWeight: 600,
  },
  subtitle: {
    marginTop:8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.full,
    paddingVertical: 11,
    paddingHorizontal: 20,
    width: 'auto',
    alignSelf: 'flex-start',
    marginTop:16
  }
});
