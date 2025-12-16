import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
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
import DatePickerModal from '../../components/common/DatePickerModal';
import MeshGradientBackground from '../../components/common/MeshGradientBackground';
import ProfileInput from '../../components/common/ProfileInput';
import SelectPicker from '../../components/common/SelectPicker';
import { BorderRadius, Colors, CountryOptions, DESIGN_HEIGHT, DESIGN_WIDTH, GenderOptions, MonthNames, Spacing, Typography } from '../../constant';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const TOTAL_STEPS = 2;

interface CompleteProfileProps {
  onComplete?: () => void;
}
export default function CompleteProfile({ onComplete }: CompleteProfileProps) {
  const navigation = useNavigation<NavigationProp<any>>();
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const [currentStep, setCurrentStep] = useState(1);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('Jonathan');
  const [lastName, setLastName] = useState('Haggerty');
  const [dateOfBirth, setDateOfBirth] = useState('Mar 03, 2000');
  const [birthDate, setBirthDate] = useState(new Date(2000, 2, 3)); // March 3, 2000
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('England');
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [socialLinks, setSocialLinks] = useState([
    { platform: 'Instagram', url: 'https://www.instagram.com/laugepetersen' },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate progress: Step 1 = 25%, Step 2 = 50%
  const progressPercentage = currentStep === 1 ? 25 : 50;

  const handleAddSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: '', url: '' }]);
  };

  const handleRemoveSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const handleProfileImagePress = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    } else if (result.canceled) {
      // User cancelled
    }
  };

  const formatDate = (date: Date): string => {
    const month = MonthNames[date.getMonth()];
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setBirthDate(selectedDate);
      setDateOfBirth(formatDate(selectedDate));
    }
  };

  const handleDatePickerPress = () => {
    setShowDatePicker(true);
  };


  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      // Advance to next step
      setCurrentStep(currentStep + 1);
    } else {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        // Complete profile and navigate
        console.log('Complete profile:', {
          profileImage,
          firstName,
          lastName,
          dateOfBirth,
          gender,
          country,
          socialLinks,
        });
        if (onComplete) {
          onComplete();
        }
        navigation.navigate('Home');
      }, 1500);
    }
  };

  const handleLetsDoIt = () => {
    // Navigate to OnboardingRoles screen
    navigation.navigate('OnboardingRoles');
  };

  const handleDoItLater = () => {
    // Skip and navigate
    if (onComplete) {
      onComplete();
    }
    navigation.navigate('Home');
  };

  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <>
          {/* Title and Description */}
          <View style={styles.titleContainer}>
            <AppText
              text="Complete your account."
              fontSize={Typography.fontSize.xxl}
              fontName="CircularStd-Medium"
              color={colors.white}
              textAlign="center"
              style={styles.title}
            />
            <AppText
              text="You can change this later."
              fontSize={Typography.fontSize.md}
              fontName="CircularStd-Book"
              color={Colors.textSecondary}
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
                  <View style={styles.profilePlaceholder}>
                    <Image source={require('../../assets/images/profile.png')} resizeMode="contain" style={styles.profileImage} />
                  </View>
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
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <ProfileInput
              label="First Name *"
              // value={firstName}
              onChangeText={setFirstName}
              placeholder="Jonathan"
            />
            <ProfileInput
              label="Last Name *"
              // value={lastName}
              onChangeText={setLastName}
              placeholder="Haggerty"
            />
            <ProfileInput
              label="Date of birth *"
              // value={dateOfBirth}
              placeholder="Mar 03, 2000"
              editable={false}
              onPress={handleDatePickerPress}
            />
            <ProfileInput
              label="Gender *"
              // value={gender}
              placeholder="-"
              editable={false}
              onPress={() => setShowGenderPicker(true)}
            />
            <ProfileInput
              label="Country *"
              value={country}
              placeholder="England"
              editable={false}
              onPress={() => setShowCountryPicker(true)}
            />

            {/* Sports of Interest */}
            <View style={styles.sectionContainer}>
              <AppText
                text="Sports of interest (optional)"
                fontSize={Typography.fontSize.md}
                fontName="CircularStd-Medium"
                color={colors.white}
                style={styles.sectionLabel}
              />
              <TouchableOpacity style={styles.addButton}>
                <AppText
                  text="+"
                  fontSize={Typography.fontSize.xxl}
                  fontName="CircularStd-Medium"
                  color={Colors.black}
                />
              </TouchableOpacity>
            </View>

            {/* Social Links */}
            <View style={styles.sectionContainer}>
              <View style={styles.socialLinksHeader}>
                <AppText
                  text="Social Links"
                  fontSize={Typography.fontSize.md}
                  fontName="CircularStd-Medium"
                  color={colors.white}
                  style={styles.sectionLabel}
                />
                <AppText
                  text="Website, Instagram, TikTok, Facebook, etc."
                  fontSize={Typography.fontSize.md}
                  fontName="CircularStd-Book"
                  color={Colors.textSecondary}
                />
              </View>

              {socialLinks.map((link, index) => (
                <View key={index} style={styles.socialLinkCard}>
                  <View style={styles.socialLinkContent}>
                    <AppText
                      text={link.platform}
                      fontSize={Typography.fontSize.lg}
                      fontName="CircularStd-Medium"
                      color={colors.white}
                    />
                    <AppText
                      text={link.url}
                      fontSize={Typography.fontSize.lg}
                      fontName="CircularStd-Book"
                      color={Colors.textSecondary}
                      lines={1}
                      style={styles.socialLinkUrl}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveSocialLink(index)}
                  >
                    <AppText
                      text="×"
                      fontSize={Typography.fontSize.xxl}
                      fontName="CircularStd-Medium"
                      color={Colors.white}
                    />
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddSocialLink}
              >
                <AppText
                  text="+"
                  fontSize={Typography.fontSize.xxl}
                  fontName="CircularStd-Medium"
                  color={Colors.black}
                />
              </TouchableOpacity>
            </View>

            <AppButton
              text="Next"
              onPress={handleNext}
              btnStyle={styles.nextButton}
              textStyle={styles.nextButtonText}
            />
          </View>
        </>
      );
    } else {
      // Step 2: "Great! Let's setup your profile" screen
      return (
        <View style={styles.step2Container}>
          {/* Title */}
          <View style={styles.step2TitleContainer}>
            <View style={styles.step2TitleRow}>
              <AppText
                text="Great! Let's setup your profile to benefit from "
                fontSize={Typography.fontSize.xxl}
                fontName="CircularStd-Medium"
                color={colors.white}
                textAlign="center"
                style={styles.step2Title}
              />
              <AppText
                text="STRYDA"
                fontSize={Typography.fontSize.xxl}
                fontName="CircularStd-Bold"
                color={colors.white}
                textAlign="center"
                style={[styles.step2Title, styles.strydaBold]}
              />
              <AppText
                text="."
                fontSize={Typography.fontSize.xxl}
                fontName="CircularStd-Medium"
                color={colors.white}
                textAlign="center"
                style={styles.step2Title}
              />
            </View>
          </View>

          {/* Illustration Container */}
          <View style={styles.illustrationWrapper}>
            {/* Background ST Logo */}
            <Image
              source={require('../../assets/images/st-logo.png')}
              style={styles.stLogoBackground}
              resizeMode="contain"
            />

            {/* Ryu Character */}
            <Image
              source={require('../../assets/images/ryu-character.png')}
              style={styles.ryuCharacter}
              resizeMode="contain"
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.step2ButtonsContainer}>
            <AppButton
              text="Yes! Let's do it"
              onPress={handleLetsDoIt}
              btnStyle={styles.yesButton}
              textStyle={styles.yesButtonText}
            />
            <TouchableOpacity onPress={handleDoItLater} style={styles.laterButton}>
              <AppText
                text="I'll do it later"
                fontSize={Typography.fontSize.lg}
                fontName="CircularStd-Medium"
                color={colors.white}
                textAlign="center"
              />
            </TouchableOpacity>
          </View>
          <AppLoader isLoading={isLoading} />
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <MeshGradientBackground />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Progress Bar */}
        <View style={[
          styles.progressContainer,
          { top: currentStep === 1 ? (43 / DESIGN_HEIGHT) * SCREEN_HEIGHT : (60 / DESIGN_HEIGHT) * SCREEN_HEIGHT }
        ]}>
          <View style={styles.progressBackground} />
          <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
        </View>

        {currentStep === 1 ? (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {renderStepContent()}
          </ScrollView>
        ) : (
          <View style={styles.step2Wrapper}>
            {renderStepContent()}
          </View>
        )}
      </KeyboardAvoidingView>

      {/* Gender Picker Modal */}
      <SelectPicker
        visible={showGenderPicker}
        onClose={() => setShowGenderPicker(false)}
        title="Select Gender"
        options={GenderOptions}
        selectedValue={gender}
        onSelect={setGender}
      />

      {/* Country Picker Modal */}
      <SelectPicker
        visible={showCountryPicker}
        onClose={() => setShowCountryPicker(false)}
        title="Select Country"
        options={CountryOptions}
        selectedValue={country}
        onSelect={setCountry}
      />

      {/* Date Picker Modal */}
      <DatePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        title="Select Date of Birth"
        value={birthDate}
        onChange={handleDateChange}
        maximumDate={new Date()}
        minimumDate={new Date(1900, 0, 1)}
      />
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
    left: (SCREEN_WIDTH - (196.5 / DESIGN_WIDTH) * SCREEN_WIDTH) / 2,
    width: (196.5 / DESIGN_WIDTH) * SCREEN_WIDTH,
    height: 4,
    borderRadius: 30,
    zIndex: 10,
  },
  progressBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: 30,
  },
  titleContainer: {
    width: (329 / DESIGN_WIDTH) * SCREEN_WIDTH,
    alignItems: 'center',
    gap: Spacing.xs,
    zIndex: 10,
  },
  title: {
    width: '100%',
    letterSpacing: -0.48,
  },
  subtitle: {
    width: '100%',
  },
  scrollView: {
    flex: 1,
    marginTop: (70 / DESIGN_HEIGHT) * SCREEN_HEIGHT,
  },
  scrollContent: {
    paddingHorizontal: (32 / DESIGN_WIDTH) * SCREEN_WIDTH,
    paddingBottom: (200 / DESIGN_HEIGHT) * SCREEN_HEIGHT,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    marginTop: 60,
  },
  profilePictureWrapper: {
    position: 'relative',
    width: 120,
    height: 120,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  profilePlaceholder: {
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
  formContainer: {
    width: (329 / DESIGN_WIDTH) * SCREEN_WIDTH,
    gap: Spacing.xxl,
  },
  sectionContainer: {
    width: '100%',
    gap: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  sectionLabel: {
    letterSpacing: 0.28,
  },
  socialLinksHeader: {
    gap: Spacing.xs,
  },
  socialLinkCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    position: 'relative',
  },
  socialLinkContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  socialLinkUrl: {
    overflow: 'hidden',
  },
  removeButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  nextButton: {
    width: (120 / DESIGN_WIDTH) * SCREEN_WIDTH,
    minWidth: 120,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.lg,
  },
  nextButtonText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.black,
  },
  // Step 2 Styles
  step2Wrapper: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: (96 / DESIGN_HEIGHT) * SCREEN_HEIGHT,
  },
  step2Container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: (32 / DESIGN_WIDTH) * SCREEN_WIDTH,
    paddingTop: 0,
    paddingBottom: (75 / DESIGN_HEIGHT) * SCREEN_HEIGHT,
  },
  step2TitleContainer: {
    width: (329 / DESIGN_WIDTH) * SCREEN_WIDTH,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  step2TitleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  step2Title: {
    letterSpacing: -0.48,
    lineHeight: Typography.lineHeight.xxl,
  },
  strydaBold: {
    fontWeight: Typography.fontWeight.bold,
    fontStyle: 'italic',
  },
  illustrationWrapper: {
    width: SCREEN_WIDTH,
    height: (340 / DESIGN_HEIGHT) * SCREEN_HEIGHT,
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  stLogoBackground: {
    position: 'absolute',
    left: (85 / DESIGN_WIDTH) * SCREEN_WIDTH,
    top: '50%',
    marginTop: -((305 / DESIGN_HEIGHT) * SCREEN_HEIGHT / 2) + ((40 / DESIGN_HEIGHT) * SCREEN_HEIGHT),
    width: (221 / DESIGN_WIDTH) * SCREEN_WIDTH,
    height: (305 / DESIGN_HEIGHT) * SCREEN_HEIGHT,
    opacity: 0.3,
  },
  ryuCharacter: {
    width: (176 / DESIGN_WIDTH) * SCREEN_WIDTH,
    height: (340 / DESIGN_HEIGHT) * SCREEN_HEIGHT,
    alignSelf: 'center',
  },
  step2ButtonsContainer: {
    width: '100%',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  yesButton: {
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
  yesButtonText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.black,
  },
  laterButton: {
    paddingVertical: Spacing.sm,
  },
});


