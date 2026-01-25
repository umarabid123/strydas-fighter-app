import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import AppButton from '../../components/common/AppButton';
import AppLoader from '../../components/common/AppLoader';
import AppText from '../../components/common/AppText';
import { AddFighterSheet, ContactSheet } from '../../components/common/OnboardingSheets';
import { BorderRadius, Colors, DESIGN_HEIGHT, DESIGN_WIDTH, Spacing, Typography } from '../../constant';
import { useAuth } from '../../navigation';
import { profileService, contactInfoService, fightersManagedService } from '../../services/profileService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');


interface OnboardingOrganizerProps {
  onComplete?: () => void;
}


// ... (in component)
export default function OnboardingOrganizer({ onComplete }: OnboardingOrganizerProps) {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const { setIsAuthenticated, user, setHasCompletedOnboarding } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [jobTitle, setJobTitle] = useState('IFMA President');
  const [organisation, setOrganisation] = useState('Keddles Gym');
  const [showContactSheet, setShowContactSheet] = useState(false);
  const [showAddFighterSheet, setShowAddFighterSheet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleComplete = async () => {
    if (!user?.id) {
      alert('User not authenticated. Please sign in again.');
      return;
    }

    setIsLoading(true);
    try {
      // Update organizer profile
      await profileService.updateOrganizerProfile(user.id, {
        job_title: jobTitle,
        organisation: organisation,
      });

      // TODO: Add contact info when ContactSheet returns data
      // TODO: Add managed fighters when AddFighterSheet returns data

      // Mark onboarding as complete
      await profileService.completeOnboarding(user.id);

      console.log('Complete organizer profile:', {
        profileImage,
        jobTitle,
        organisation,
      });

      if (onComplete) {
        onComplete();
      }
      setHasCompletedOnboarding(true);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error saving organizer profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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
              text="Complete your organisational profile."
              fontSize={Typography.fontSize.xxl}
              fontName="CircularStd-Medium"
              color={colors.white}
              textAlign="center"
              style={styles.title}
            />
            <AppText
              text="Make it easy for matchmakers to find you."
              fontSize={Typography.fontSize.md}
              fontName="CircularStd-Book"
              color={Colors.whiteOpacity80}
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

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Job Title */}
            <View style={styles.jobTitleContainer}>
              <View style={styles.labelContainer}>
                <AppText
                  text="Job Title"
                  fontSize={Typography.fontSize.md}
                  fontName="CircularStd-Medium"
                  color={colors.white}
                  style={styles.sectionLabel}
                />
                <AppText
                  text="Highlight your position"
                  fontSize={Typography.fontSize.md}
                  fontName="CircularStd-Book"
                  color={Colors.whiteOpacity80}
                />
              </View>
              <TextInput
                // value={jobTitle}
                onChangeText={setJobTitle}
                style={{
                  fontFamily: 'CircularStd-Book',
                  fontSize: Typography.fontSize.xl,
                  color: colors.textTertiary,
                  padding: 0
                }}
                placeholder="Highlight your position"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
              />
            </View>

            {/* Organisation */}
            <View style={styles.organisationContainer}>
              <View style={styles.labelContainer}>
                <AppText
                  text="Organisation"
                  fontSize={Typography.fontSize.md}
                  fontName="CircularStd-Medium"
                  color={colors.white}
                  style={styles.sectionLabel}
                />
                <AppText
                  text="Which organisation are you from?"
                  fontSize={Typography.fontSize.md}
                  fontName="CircularStd-Book"
                  color={Colors.whiteOpacity80}
                />
              </View>
              <TextInput
                // value={organisation}
                onChangeText={setOrganisation}
                style={{
                  fontFamily: 'CircularStd-Book',
                  fontSize: Typography.fontSize.xl,
                  color: colors.textTertiary,
                  padding: 0
                }}
                placeholder="Which organisation are you from?"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
              />
            </View>

            {/* Contact Information */}
            <View style={styles.sectionContainer}>
              <View style={styles.labelContainer}>
                <AppText
                  text="Contact information"
                  fontSize={Typography.fontSize.md}
                  fontName="CircularStd-Medium"
                  color={colors.white}
                  style={styles.sectionLabel}
                />
                <AppText
                  text="Add contact options."
                  fontSize={Typography.fontSize.md}
                  fontName="CircularStd-Book"
                  color={Colors.whiteOpacity80}
                />
              </View>
              <TouchableOpacity style={styles.addButton} onPress={() => setShowContactSheet(true)}>
                <AppText
                  text="+"
                  fontSize={Typography.fontSize.xxl}
                  fontName="CircularStd-Medium"
                  color={Colors.black}
                />
              </TouchableOpacity>
            </View>

            {/* Fighters you manage */}
            <View style={styles.sectionContainer}>
              <View style={styles.labelContainer}>
                <AppText
                  text="Fighters you manage"
                  fontSize={Typography.fontSize.md}
                  fontName="CircularStd-Medium"
                  color={colors.white}
                  style={styles.sectionLabel}
                />
                <AppText
                  text="If you're a manager"
                  fontSize={Typography.fontSize.md}
                  fontName="CircularStd-Book"
                  color={Colors.whiteOpacity80}
                />
              </View>
              <TouchableOpacity style={styles.addButton} onPress={() => setShowAddFighterSheet(true)}>
                <AppText
                  text="+"
                  fontSize={Typography.fontSize.xxl}
                  fontName="CircularStd-Medium"
                  color={Colors.black}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Complete Button */}
          <View style={styles.completeButtonContainer}>
            <AppButton
              text="That's it, complete"
              onPress={handleComplete}
              btnStyle={styles.completeButton}
              textStyle={styles.completeButtonText}
            />
          </View>
        </ScrollView>
        <ContactSheet visible={showContactSheet} onClose={() => setShowContactSheet(false)} />
        <AddFighterSheet visible={showAddFighterSheet} onClose={() => setShowAddFighterSheet(false)} />
      </KeyboardAvoidingView>
      <AppLoader isLoading={isLoading} />
    </View >
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
    top: (52 / DESIGN_HEIGHT) * SCREEN_HEIGHT, // 6.09% from top
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
    backgroundColor: Colors.whiteOpacity20,
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
    marginBottom: 31,
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
    marginBottom: 55,
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
    backgroundColor: Colors.whiteOpacity10,
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
    borderColor: Colors.whiteOpacity10,
  },
  profileName: {
    marginTop: Spacing.xs,
  },
  formContainer: {
    width: (329 / DESIGN_WIDTH) * SCREEN_WIDTH,
    gap: Spacing.xxl,
    alignSelf: 'center',
  },
  sectionContainer: {
    width: '100%',
    gap: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.whiteOpacity15,
  },
  sectionLabel: {
    letterSpacing: 0.28,
  },
  labelContainer: {
    gap: Spacing.xs,
  },
  jobTitleContainer: {
    width: '100%',
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.whiteOpacity15,
  },
  organisationContainer: {
    width: '100%',
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.whiteOpacity15,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  completeButtonContainer: {
    alignItems: 'center',
    paddingHorizontal: (32 / DESIGN_WIDTH) * SCREEN_WIDTH,
    zIndex: 10,
  },
  completeButton: {
    minWidth: 120,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.whiteOpacity10,
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
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 100,
    padding: 8,
  },
  backButtonIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 8,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: Colors.white,
  },
});

