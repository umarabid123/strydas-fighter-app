import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Colors, Typography, DESIGN_WIDTH } from '../../constant';
import AppText from './AppText';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Tab {
  label: string;
  icon: any; // emoji or icon identifier
  id: string;
}

interface BottomTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabPress: (tabId: string) => void;
}

export default function BottomTabs({
  tabs,
  activeTab,
  onTabPress,
}: BottomTabsProps) {
  return (
    <View style={styles.container}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabButton, isActive && styles.tabButtonActive]}
            onPress={() => onTabPress(tab.id)}
          >
            <View style={styles.tabContent}>
              <Image
                source={tab.icon}
                style={{ width: 32, height: 32,  tintColor: activeTab === tab.id ? Colors.successGreen : Colors.white }}
                resizeMode="contain"
              />

              <AppText
                text={tab.label}
                fontSize={Typography.fontSize.xs}
                fontName="CircularStd-Book"
                color={isActive ? Colors.successGreen : Colors.whiteOpacity60}
                style={styles.tabLabel}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: (80 / DESIGN_WIDTH) * SCREEN_WIDTH,
    backgroundColor: Colors.black,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: (16 / DESIGN_WIDTH) * SCREEN_WIDTH,
  },
  tabButton: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: (12 / DESIGN_WIDTH) * SCREEN_WIDTH,
  },
  tabButtonActive: {
    // Active state styling
  },
  tabContent: {
    alignItems: 'center',
    gap: (4 / DESIGN_WIDTH) * SCREEN_WIDTH,
  },
  tabLabel: {
    lineHeight:16,
  
  },
});
