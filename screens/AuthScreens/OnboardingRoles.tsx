import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import AppButton from '../../components/common/AppButton';
import AppLoader from '../../components/common/AppLoader';
import AppText from '../../components/common/AppText';
import { BorderRadius, Colors, DESIGN_HEIGHT, DESIGN_WIDTH, Spacing, Typography } from '../../constant';
import { useAuth } from '../../navigation';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OnboardingRolesProps {
  onComplete?: () => void;
}

type RoleType = 'fan' | 'fighter' | 'organizer';

interface RoleOption {
  id: RoleType;
  title: string;
  subtitle: string;
  icon: any; // Will be replaced with actual icons
}

export default function OnboardingRoles({ onComplete }: OnboardingRolesProps) {
  const navigation = useNavigation<NavigationProp<any>>();
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const { setIsAuthenticated } = useAuth()
  const [selectedRole, setSelectedRole] = useState<RoleType>('fan');
  const [isLoading, setIsLoading] = useState(false);

  const roles: RoleOption[] = [
    {
      id: 'fan',
      title: "I'm a fan",
      subtitle: 'Just want to browse',
      icon: require('../../assets/images/user-avatar-icon.png'), // Placeholder
    },
    {
      id: 'fighter',
      title: "I'm a fighter",
      subtitle: 'Muay Thai, BJJ, MMA...',
      icon: require('../../assets/images/user-avatar-icon.png'), // Placeholder
    },
    {
      id: 'organizer',
      title: "I'm an organizer",
      subtitle: 'Promotion, Manager, Federation...',
      icon: require('../../assets/images/user-avatar-icon.png'), // Placeholder
    },
  ];

  const handleNext = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log('Selected role:', selectedRole);

      // Navigate to appropriate screen based on selected role
      switch (selectedRole) {
        case 'fan':
          navigation.navigate('OnboardingFan');
          break;
        case 'fighter':
          navigation.navigate('OnboardingFighter');
          break;
        case 'organizer':
          navigation.navigate('OnboardingOrganizer');
          break;
        default:
          if (onComplete) {
            onComplete();
          }
          setIsAuthenticated(true)
      }
    }, 500); // Shorter delay for roles
  };

  const renderRadioButton = (isSelected: boolean) => {
    if (isSelected) {
      return (
        <View style={styles.radioButtonSelected}>
          <View style={styles.radioButtonCheckmark}>
            <Image
              source={require('../../assets/images/tick-icon.png')}
              width={10}
              height={7}
              style={{ width: 10, height: 7 }}

            />
          </View>
        </View>
      );
    }
    return <View style={styles.radioButton} />;
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Progress Bar - 75% filled (147.75px out of 196.5px) */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground} />
          <View style={[styles.progressFill, { width: '75%' }]} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Title and Description */}
          <View style={styles.titleContainer}>
            <AppText
              text="Select your roles."
              fontSize={Typography.fontSize.xxl}
              fontName="CircularStd-Medium"
              color={colors.white}
              textAlign="center"
              style={styles.title}
            />
            <AppText
              text="You can create an organisation later."
              fontSize={Typography.fontSize.md}
              fontName="CircularStd-Book"
              color="rgba(255, 255, 255, 0.8)"
              textAlign="center"
              style={styles.subtitle}
            />
          </View>

          {/* Role Options */}
          <View style={styles.rolesContainer}>
            {roles.map((role, index) => {
              const isSelected = selectedRole === role.id;
              return (
                <React.Fragment key={role.id}>
                  <TouchableOpacity
                    style={styles.roleItem}
                    onPress={() => setSelectedRole(role.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.roleContent}>
                      <View style={styles.roleIconContainer}>
                        <Image
                          source={role.icon}
                          style={styles.roleIcon}
                          resizeMode="contain"
                        />
                      </View>
                      <View style={styles.roleTextContainer}>
                        <AppText
                          text={role.title}
                          fontSize={Typography.fontSize.xl}
                          fontName="CircularStd-Medium"
                          color={colors.white}
                          style={styles.roleTitle}
                        />
                        <AppText
                          text={role.subtitle}
                          fontSize={Typography.fontSize.md}
                          fontName="CircularStd-Book"
                          color="rgba(255, 255, 255, 0.8)"
                          style={styles.roleSubtitle}
                        />
                      </View>
                    </View>
                    {renderRadioButton(isSelected)}
                  </TouchableOpacity>
                  {index < roles.length - 1 && <View style={styles.divider} />}
                </React.Fragment>
              );
            })}
          </View>
        </ScrollView>

        {/* Next Button */}
        <View style={styles.nextButtonContainer}>
          <AppButton
            text="Next"
            onPress={handleNext}
            btnStyle={styles.nextButton}
            textStyle={styles.nextButtonText}
          />
        </View>
      </KeyboardAvoidingView>
      <AppLoader isLoading={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Colors.black,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  keyboardView: {
    flex: 1,
  },
  progressContainer: {
    position: 'absolute',
    top: (60 / DESIGN_HEIGHT) * SCREEN_HEIGHT, // 7.04% from top
    left: (SCREEN_WIDTH - (196.5 / DESIGN_WIDTH) * SCREEN_WIDTH) / 2,
    width: (196.5 / DESIGN_WIDTH) * SCREEN_WIDTH,
    height: 4,
    borderRadius: BorderRadius.full,
    zIndex: 10,
  },
  progressBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BorderRadius.full,
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.full,
  },
  scrollView: {
    flex: 1,
    marginTop: (96 / DESIGN_HEIGHT) * SCREEN_HEIGHT,
  },
  scrollContent: {
    paddingHorizontal: (32 / DESIGN_WIDTH) * SCREEN_WIDTH,
    paddingBottom: (120 / DESIGN_HEIGHT) * SCREEN_HEIGHT,
  },
  titleContainer: {
    width: (329 / DESIGN_WIDTH) * SCREEN_WIDTH,
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: 60,
    alignSelf: 'center',
  },
  title: {
    width: '100%',
    letterSpacing: -0.48,
  },
  subtitle: {
    width: '100%',
  },
  rolesContainer: {
    width: (329 / DESIGN_WIDTH) * SCREEN_WIDTH,
    alignSelf: 'center',
  },
  roleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    width: '100%',
  },
  roleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  roleIconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleIcon: {
    width: 60,
    height: 60,
  },
  roleTextContainer: {
    flex: 1,
    gap: Spacing.xs,
  },
  roleTitle: {
    letterSpacing: -0.36,
  },
  roleSubtitle: {
    letterSpacing: -0.28,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    width: '100%',
  },
  radioButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.white,
    backgroundColor: 'transparent',
  },
  radioButtonSelected: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.white,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonCheckmark: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  nextButtonContainer: {
    position: 'absolute',
    bottom: (83 / DESIGN_HEIGHT) * SCREEN_HEIGHT, // 769px from top in 852px design
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: (32 / DESIGN_WIDTH) * SCREEN_WIDTH,
    zIndex: 10,
  },
  nextButton: {
    minWidth: 120,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.lg,
    height: 51,
  },
  nextButtonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.black,
  },
});

