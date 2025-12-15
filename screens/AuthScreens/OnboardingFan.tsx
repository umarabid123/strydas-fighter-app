import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
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
  View,
} from 'react-native';
import AppButton from '../../components/common/AppButton';
import AppText from '../../components/common/AppText';
import MeshGradientBackground from '../../components/common/MeshGradientBackground';
import Toggle from '../../components/common/Toggle';
import { BorderRadius, Colors, DESIGN_HEIGHT, DESIGN_WIDTH, Spacing, Typography } from '../../constant';
import { useAuth } from '../../navigation';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');


interface OnboardingFanProps {
  onComplete?: () => void;
}

export default function OnboardingFan({ onComplete }: OnboardingFanProps) {
  const navigation = useNavigation<NavigationProp<any>>();
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const { setIsAuthenticated } = useAuth();

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);

  const handleProfileImagePress = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleComplete = () => {
    console.log('Complete fan profile:', {
      profileImage,
      notificationsEnabled,
      locationEnabled,
    });
    if (onComplete) {
      onComplete();
    }
    setIsAuthenticated(true);
  };

  return (
    <View style={styles.container}>
      <MeshGradientBackground />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Progress Bar - 100% filled */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground} />
          <View style={[styles.progressFill, { width: '100%' }]} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Title and Description */}
          <View style={styles.titleContainer}>
            <AppText
              text="Complete your fan profile."
              fontSize={Typography.fontSize.xxl}
              fontName="CircularStd-Medium"
              color={colors.white}
              textAlign="center"
              style={styles.title}
            />
            <AppText
              text="Tailor the experience to your likings."
              fontSize={Typography.fontSize.md}
              fontName="CircularStd-Book"
              color="rgba(255, 255, 255, 0.8)"
              textAlign="center"
              style={styles.subtitle}
            />
          </View>

          {/* Profile Picture */}
          <View style={styles.profilePictureContainer}>
            <View style={styles.profilePictureWrapper}>
              <View style={styles.profilePicture}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                  <Image
                    source={require('../../assets/images/profile.png')}
                    resizeMode="contain"
                    style={styles.profilePlaceholderImage}
                  />
                )}
              </View>
              <TouchableOpacity
                style={styles.addPhotoButton}
                onPress={handleProfileImagePress}
              >
                <AppText
                  text="+"
                  fontSize={Typography.fontSize.lg}
                  fontName="CircularStd-Medium"
                  color={Colors.black}
                />
              </TouchableOpacity>
            </View>
            <AppText
              text="Jonathan Haggerty"
              fontSize={Typography.fontSize.xl}
              fontName="CircularStd-Medium"
              color={colors.white}
              textAlign="center"
              style={styles.profileName}
            />
          </View>

          {/* Toggle Options */}
          <View style={styles.optionsContainer}>
            <Toggle
              label="Allow notifications?"
              subtitle="Get updated with your fighters and events."
              value={notificationsEnabled}
              onToggle={setNotificationsEnabled}
            />
            <Toggle
              label="Allow location?"
              subtitle="See relevant events near you"
              value={locationEnabled}
              onToggle={setLocationEnabled}
            />
          </View>
        </ScrollView>

        {/* Complete Button */}
        <View style={styles.completeButtonContainer}>
          <AppButton
            text="That's it, complete"
            onPress={handleComplete}
            btnStyle={styles.completeButton}
            textStyle={styles.completeButtonText}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  keyboardView: {
    flex: 1,
  },
  progressContainer: {
    position: 'absolute',
    top: (47 / DESIGN_HEIGHT) * SCREEN_HEIGHT, // 5.52% from top
    left: (SCREEN_WIDTH - (197 / DESIGN_WIDTH) * SCREEN_WIDTH) / 2,
    width: (197 / DESIGN_WIDTH) * SCREEN_WIDTH,
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
  },
  scrollContent: {
    paddingHorizontal: (32 / DESIGN_WIDTH) * SCREEN_WIDTH,
    paddingBottom: (120 / DESIGN_HEIGHT) * SCREEN_HEIGHT,
  },
  titleContainer: {
    width: (329 / DESIGN_WIDTH) * SCREEN_WIDTH,
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: (96 / DESIGN_HEIGHT) * SCREEN_HEIGHT,
    marginBottom: Spacing.xl,
    alignSelf: 'center',
  },
  title: {
    width: '100%',
    letterSpacing: -0.48,
  },
  subtitle: {
    width: '100%',
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40
  },
  profilePictureWrapper: {
    position: 'relative',
    width: 120,
    height: 120,
    marginBottom: Spacing.md,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  profilePlaceholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  addPhotoButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  profileName: {
    marginTop: Spacing.xs,
  },
  optionsContainer: {
    width: (329 / DESIGN_WIDTH) * SCREEN_WIDTH,
    alignSelf: 'center',
    marginTop: 0,
    gap: Spacing.xxl,
  },
  completeButtonContainer: {
    position: 'absolute',
    bottom: (46 / DESIGN_HEIGHT) * SCREEN_HEIGHT,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: (32 / DESIGN_WIDTH) * SCREEN_WIDTH,
    zIndex: 10,
  },
  completeButton: {
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
  completeButtonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.black,
  },
});

