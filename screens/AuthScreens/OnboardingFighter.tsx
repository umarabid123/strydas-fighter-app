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
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import Slider from 'react-native-sticky-range-slider';
import AppButton from '../../components/common/AppButton';
import AppLoader from '../../components/common/AppLoader';
import AppText from '../../components/common/AppText';
import MeshGradientBackground from '../../components/common/MeshGradientBackground';
import { ContactSheet, MatchSheet } from '../../components/common/OnboardingSheets';
import ProfileInput from '../../components/common/ProfileInput';
import { Rail, RailSelected, Thumb } from '../../components/common/SliderComponents';
import { BorderRadius, Colors, DESIGN_HEIGHT, DESIGN_WIDTH, Spacing, Typography } from '../../constant';
import { useAuth } from '../../navigation';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');


interface OnboardingFighterProps {
  onComplete?: () => void;
}


// ... (inside component)
export default function OnboardingFighter({ onComplete }: OnboardingFighterProps) {
  const navigation = useNavigation<NavigationProp<any>>();
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const { setIsAuthenticated } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [weightDivision, setWeightDivision] = useState('63.5');
  const [weightRange, setWeightRange] = useState('2.0');
  const [height, setHeight] = useState('230');
  const [gym, setGym] = useState('Keddles Gym');
  const [showContactSheet, setShowContactSheet] = useState(false);
  const [showMatchSheet, setShowMatchSheet] = useState(false);
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

  const handleComplete = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log('Complete fighter profile:', {
        profileImage,
        weightDivision,
        weightRange,
        height,
        gym,
      });
      if (onComplete) {
        onComplete();
      }
      setIsAuthenticated(true);
    }, 1500);
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
              text="Complete your fighter profile."
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
            <View style={styles.fighterInfo}>
              <AppText
                text="0W 0L 0D"
                fontSize={Typography.fontSize.md}
                fontName="CircularStd-Book"
                color="rgba(255, 255, 255, 0.8)"
              />
              <View style={styles.dividerVertical} />
              <View style={styles.flagContainer}>
                <Image
                  source={require('../../assets/images/flag-icon.png')}
                  style={styles.flagIcon}
                  resizeMode="contain"
                />
                <AppText
                  text="ENG"
                  fontSize={Typography.fontSize.md}
                  fontName="CircularStd-Book"
                  color="rgba(255, 255, 255, 0.8)"
                />
              </View>
            </View>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Sports you compete in */}
            <View style={styles.sectionContainer}>
              <AppText
                text="Sports you compete in *"
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

            {/* Weight Division */}
            <View style={styles.weightDivisionContainer}>
              <AppText
                text="Weight Divison *"
                fontSize={Typography.fontSize.md}
                fontName="CircularStd-Medium"
                color={colors.white}
                style={styles.sectionLabel}
              />
              <View style={styles.weightValueContainer}>
                <TextInput
                  // value={weightDivision}
                  onChangeText={setWeightDivision}
                  keyboardType="decimal-pad"
                  style={{
                    fontFamily: 'CircularStd-Book',
                    fontSize: Typography.fontSize.xl,
                    color: colors.white,
                    flex: 1,
                    paddingVertical: 4,
                  }}
                  placeholder="63.5"
                  placeholderTextColor={Colors.whiteOpacity20}
                />
                <AppText
                  text="kg"
                  fontSize={Typography.fontSize.md}
                  fontName="CircularStd-Book"
                  color={colors.white}
                />
              </View>
            </View>

            {/* Weight Range */}
            <View style={styles.sectionContainer}>
              <AppText
                text="Weight Range *"
                fontSize={Typography.fontSize.md}
                fontName="CircularStd-Medium"
                color={colors.white}
                style={styles.sectionLabel}
              />
              <View style={styles.sliderContainer}>
                <View style={styles.sliderWrapper}>
                  <Slider
                    min={0}
                    max={10}
                    step={0.1}
                    disableRange={true}
                    low={parseFloat(weightRange || '0')}
                    onValueChanged={(low: number) => {
                      setWeightRange(low.toFixed(1));
                    }}
                    renderThumb={() => <Thumb />}
                    renderRail={() => <Rail />}
                    renderRailSelected={() => <RailSelected />}

                  />
                </View>
                <View style={styles.sliderValueContainer}>
                  <TextInput
                    onChangeText={setWeightRange}
                    keyboardType="decimal-pad"
                    style={{
                      fontFamily: 'CircularStd-Book',
                      fontSize: Typography.fontSize.xl,
                      color: colors.white,
                      minWidth: 40,
                      textAlign: 'right',
                    }}
                    placeholder="0.0"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                  />
                  <AppText
                    text="kg"
                    fontSize={Typography.fontSize.md}
                    fontName="CircularStd-Book"
                    color={colors.white}
                  />
                </View>
              </View>
            </View>

            {/* Height */}
            <View style={styles.heightContainer}>
              <AppText
                text="Height"
                fontSize={Typography.fontSize.md}
                fontName="CircularStd-Medium"
                color={colors.white}
                style={styles.sectionLabel}
              />
              <View style={styles.heightValueContainer}>
                <TextInput
                  onChangeText={setHeight}
                  keyboardType="decimal-pad"
                  style={{
                    fontFamily: 'CircularStd-Book',
                    fontSize: Typography.fontSize.xl,
                    color: colors.white,
                    flex: 1,
                    paddingVertical: 4,
                  }}
                  placeholder="170"
                  placeholderTextColor={'rgba(255,255,255,0.3)'}
                />
                <AppText
                  text="cm"
                  fontSize={Typography.fontSize.md}
                  fontName="CircularStd-Book"
                  color={colors.white}
                />
              </View>
            </View>

            {/* Gym / Club */}
            <ProfileInput
              label="Gym / Club"
              onChangeText={setGym}
              placeholder="Keddles Gym"
            />

            {/* Contact Information */}
            <View style={styles.sectionContainer}>
              <AppText
                text="Contact Information *"
                fontSize={Typography.fontSize.md}
                fontName="CircularStd-Medium"
                color={colors.white}
                style={styles.sectionLabel}
              />
              <TouchableOpacity style={styles.addButton} onPress={() => setShowContactSheet(true)}>
                <AppText
                  text="+"
                  fontSize={Typography.fontSize.xxl}
                  fontName="CircularStd-Medium"
                  color={Colors.black}
                />
              </TouchableOpacity>
            </View>

            {/* Record */}
            <View style={styles.sectionContainer}>
              <View style={styles.recordHeader}>
                <AppText
                  text="Record"
                  fontSize={Typography.fontSize.md}
                  fontName="CircularStd-Medium"
                  color={colors.white}
                  style={styles.sectionLabel}
                />
                <AppText
                  text="Add your previous fight history."
                  fontSize={Typography.fontSize.md}
                  fontName="CircularStd-Book"
                  color="rgba(255, 255, 255, 0.8)"
                />
              </View>
              <TouchableOpacity style={styles.addButton} onPress={() => setShowMatchSheet(true)}>
                <AppText
                  text="+"
                  fontSize={Typography.fontSize.xxl}
                  fontName="CircularStd-Medium"
                  color={Colors.black}
                />
              </TouchableOpacity>
            </View>
          </View>
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
        <MatchSheet visible={showMatchSheet} onClose={() => setShowMatchSheet(false)} />
      </KeyboardAvoidingView>
      <AppLoader isLoading={isLoading} />
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
    top: (60 / DESIGN_HEIGHT) * SCREEN_HEIGHT,
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
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
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
    marginBottom: Spacing.xs,
  },
  fighterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dividerVertical: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  flagIcon: {
    width: 14,
    height: 14,
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
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  sectionLabel: {
    letterSpacing: 0.28,
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
  weightDivisionContainer: {
    width: '100%',
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  weightValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: (60 / DESIGN_WIDTH) * SCREEN_WIDTH,
  },
  sliderWrapper: {
    flex: 1,
    height: 20,
    justifyContent: 'center',
  },
  sliderTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: BorderRadius.full,
    position: 'relative',
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.full,
  },
  sliderThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.white,
    marginLeft: -10,
    top: -8,
  },
  sliderValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  heightContainer: {
    width: '100%',
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  heightValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  recordHeader: {
    gap: Spacing.xs,
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

