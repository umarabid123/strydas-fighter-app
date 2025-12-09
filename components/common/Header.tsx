import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors, DESIGN_WIDTH } from '../../constant';
import AppText from './AppText';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HeaderProps {
  title?: string;
  onNotificationPress?: () => void;
  onMenuPress?: () => void;
  showNotificationDot?: boolean;
  isBack?: boolean
}

export default function Header({
  title,
  onNotificationPress,
  onMenuPress,
  showNotificationDot = true,
  isBack = false
}: HeaderProps) {
  const navigation = useNavigation<any>()
  const route = useRoute();
  return (
    <View style={styles.container}>

      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        {isBack &&
          <Pressable style={{ backgroundColor: Colors.darkGray1, padding: 8, borderRadius: 10 }} onPress={() => navigation.goBack()}>
            <Image source={require('../../assets/images/back-arrow-icon.png')} resizeMode='contain' style={{ width: 16, height: 16 }} />
          </Pressable>
        }
        <AppText
          text={title}
          fontSize={18}
          style={{ fontWeight: 600 }}
          fontName="CircularStd-Medium"
          color={Colors.white}
        />
      </View>

      <View style={styles.rightSection}>
        {/* Notification Bell */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onNotificationPress}
        >
          {/* Bell Icon SVG */}
          <View style={styles.bellIcon}>
            <Image
              source={require('../../assets/images/notifications.png')}
              width={24}
              height={24}
            />
          </View>

          {/* Notification Dot */}
          {showNotificationDot && <View style={styles.notificationDot} />}
        </TouchableOpacity>

        {/* Hamburger Menu */}
        <TouchableOpacity style={styles.iconButton} onPress={() => {
          if (route.name === 'Menu') {
            navigation.goBack(); // already on Menu → go to Home
          } else {
            navigation.navigate('Menu'); // go to Menu
          }
        }}>
          <View style={styles.hamburgerIcon}>
            <Image
              source={require('../../assets/images/menu-line-icon.png')}
              width={24}
              height={24}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: (60 / DESIGN_WIDTH) * SCREEN_WIDTH,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: (16 / DESIGN_WIDTH) * SCREEN_WIDTH,
    paddingVertical: 20
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: (16 / DESIGN_WIDTH) * SCREEN_WIDTH,
  },
  iconButton: {
    position: 'relative',
    width: (28 / DESIGN_WIDTH) * SCREEN_WIDTH,
    height: (28 / DESIGN_WIDTH) * SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: (8 / DESIGN_WIDTH) * SCREEN_WIDTH,
    height: (8 / DESIGN_WIDTH) * SCREEN_WIDTH,
    borderRadius: (4 / DESIGN_WIDTH) * SCREEN_WIDTH,
    backgroundColor: Colors.successGreenAlt,
  },
  hamburgerIcon: {
    gap: (4 / DESIGN_WIDTH) * SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hamburgerLine: {
    width: (20 / DESIGN_WIDTH) * SCREEN_WIDTH,
    height: 2,
    backgroundColor: Colors.white,
    borderRadius: 1,
  },
});
