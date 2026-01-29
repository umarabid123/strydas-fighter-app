import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { X } from 'lucide-react-native';
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
import { ContactSheet, MatchSheet, SportsSheet } from '../../components/common/OnboardingSheets';
import ProfileInput from '../../components/common/ProfileInput';
import { Rail, RailSelected, Thumb } from '../../components/common/SliderComponents';
import { BorderRadius, Colors, DESIGN_HEIGHT, DESIGN_WIDTH, Spacing, Typography } from '../../constant';
import { useAuth } from '../../navigation';
import { profileService, contactInfoService, sportsOfInterestService, sportsRecordsService } from '../../services/profileService';
import { DivisionEnum } from '../../lib/types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OnboardingFighterProps {
  onComplete?: () => void;
}

export default function OnboardingFighter({ onComplete }: OnboardingFighterProps) {
  const navigation = useNavigation<NavigationProp<any>>();
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const { setIsAuthenticated, user, setHasCompletedOnboarding } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [weightDivision, setWeightDivision] = useState('63.5');
  const [weightRange, setWeightRange] = useState('2.0');
  const [height, setHeight] = useState('230');
  const [gym, setGym] = useState('Keddles Gym');
  const [showContactSheet, setShowContactSheet] = useState(false);
  const [showMatchSheet, setShowMatchSheet] = useState(false);
  const [showSportSheet, setShowSportSheet] = useState(false);
  const [sportsOfInterest, setSportsOfInterest] = useState<string[]>([]);

  const [fighterRecords, setFighterRecords] = useState<Record<string, { wins: number, losses: number, draws: number }>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // State for contact info
  const [contactData, setContactData] = useState<{
    fullName: string;
    phone: string;
    email: string;
    org: string;
  } | null>(null);

  const handleSportSave = (sport: string) => {
    if (!sportsOfInterest.includes(sport)) {
      setSportsOfInterest([...sportsOfInterest, sport]);
      if (error) setError('');
    }
  };

  const handleRemoveSport = (sport: string) => {
    setSportsOfInterest(sportsOfInterest.filter(s => s !== sport));
    if (error) setError('');
  };

  const handleMatchSave = (match: { date: Date; opponent: string; event: string; division: string; sport: string; result: string }) => {
    const current = fighterRecords[match.sport] || { wins: 0, losses: 0, draws: 0 };
    if (match.result === 'Won') current.wins++;
    else if (match.result === 'Lost') current.losses++;
    else if (match.result === 'Draw') current.draws++;

    setFighterRecords({
      ...fighterRecords,
      [match.sport]: current
    });
  };

  const getTotalRecord = () => {
    let w = 0, l = 0, d = 0;
    Object.values(fighterRecords).forEach(r => {
      w += r.wins;
      l += r.losses;
      d += r.draws;
    });
    return `${w}W ${l}L ${d}D`;
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
    }
  };

  const handleContactSave = (data: { fullName: string; phone: string; email: string; org: string }) => {
    setContactData(data);
    if (error) setError('');
  };

  const handleComplete = async () => {
    if (!user?.id) {
      alert('User not authenticated. Please sign in again.');
      return;
    }

    // Validation
    setError('');

    if (sportsOfInterest.length === 0) {
      setError('Add at least one sport you compete in.');
      return;
    }

    if (!weightDivision || isNaN(parseFloat(weightDivision))) {
      setError('Please enter a valid Weight Division.');
      return;
    }

    if (!weightRange || isNaN(parseFloat(weightRange))) {
      setError('Please enter a valid Weight Range.');
      return;
    }

    if (!contactData) {
      setError('Add at least one contact method.');
      return;
    }

    setIsLoading(true);
    try {
      // Update fighter profile
      await profileService.updateFighterProfile(user.id, {
        weight_division: parseFloat(weightDivision),
        weight_range: parseFloat(weightRange),
        height: parseInt(height),
        gym: gym,
        division: DivisionEnum.PRO, // Default to Pro, could be from user input
      });

      // Save contact info if exists
      if (contactData) {
        await contactInfoService.addContactInfo({
          profile_id: user.id,
          full_name: contactData.fullName,
          phone: contactData.phone,
          email: contactData.email || null,
          organisation: contactData.org || null,
        });
      }

      // Save sports of interest
      if (sportsOfInterest.length > 0) {
        const sportPromises = sportsOfInterest.map(async (sport) => {
          try {
            await sportsOfInterestService.addSportOfInterest({
              profile_id: user.id,
              sport_name: sport,
            });
          } catch (sportError: any) {
            // Ignore duplicate key error (23505) if likely already added
            // Adjust this check based on the actual error object structure you receive (e.g. sportError.code)
            if (sportError?.code === '23505' || sportError?.message?.includes('duplicate key')) {
              console.log(`Sport '${sport}' already exists, skipping.`);
            } else {
              throw sportError;
            }
          }
        });
        await Promise.all(sportPromises);
      }

      // Save sports records
      const recordPromises = Object.entries(fighterRecords).map(([sport, record]) =>
        sportsRecordsService.addSportsRecord({
          profile_id: user.id,
          sport_name: sport,
          wins: record.wins,
          losses: record.losses,
          draws: record.draws
        })
      );
      await Promise.all(recordPromises);

      // Mark onboarding as complete
      await profileService.completeOnboarding(user.id);

      console.log('Complete fighter profile saved');

      if (onComplete) {
        onComplete();
      }
      setHasCompletedOnboarding(true);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error saving fighter profile:', error);
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
                text={getTotalRecord()}
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
              <View style={styles.recordHeader}>
                <AppText
                  text="Sports you compete in *"
                  fontSize={Typography.fontSize.md}
                  fontName="CircularStd-Medium"
                  color={colors.white}
                  style={styles.sectionLabel}
                />
              </View>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                {sportsOfInterest.map(sport => (
                  <View key={sport} style={{
                    backgroundColor: '#303030',
                    borderRadius: 99,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6
                  }}>
                    <AppText text={sport} fontSize={Typography.fontSize.sm} color={Colors.white} />
                    <TouchableOpacity onPress={() => handleRemoveSport(sport)} style={{ opacity: 0.7 }}>
                      <X size={14} color={Colors.white} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <TouchableOpacity style={styles.addButton} onPress={() => {
                setShowSportSheet(true);
                if (error) setError('');
              }}>
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
                  value={weightDivision}
                  onChangeText={(text) => {
                    setWeightDivision(text);
                    if (error) setError('');
                  }}
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
                      if (error) setError('');
                    }}
                    renderThumb={() => <Thumb />}
                    renderRail={() => <Rail />}
                    renderRailSelected={() => <RailSelected />}
                    renderLowValue={() => null}

                  />
                </View>
                <View style={styles.sliderValueContainer}>
                  <TextInput
                    onChangeText={(text) => {
                      setWeightRange(text);
                      if (error) setError('');
                    }}
                    value={weightRange}
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
                  onChangeText={(text) => {
                    setHeight(text);
                    if (error) setError('');
                  }}
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
              onChangeText={(text) => {
                setGym(text);
                if (error) setError('');
              }}
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

              {contactData && (
                <View style={{ marginBottom: 10 }}>
                  <AppText
                    text={`${contactData.fullName} (${contactData.phone})`}
                    fontSize={Typography.fontSize.md}
                    color={colors.white}
                    fontName="CircularStd-Book"
                  />
                </View>
              )}

              <TouchableOpacity style={styles.addButton} onPress={() => {
                setShowContactSheet(true);
                if (error) setError('');
              }}>
                <AppText
                  text={contactData ? "Edit" : "+"}
                  fontSize={contactData ? Typography.fontSize.sm : Typography.fontSize.xxl}
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
              <TouchableOpacity style={styles.addButton} onPress={() => {
                setShowMatchSheet(true);
                if (error) setError('');
              }}>
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
            {error ? (
              <AppText
                text={error}
                color={Colors.errorRed}
                fontSize={Typography.fontSize.sm}
                style={{ marginBottom: 10 }}
              />
            ) : null}
            <AppButton
              text="That's it, complete"
              onPress={handleComplete}
              btnStyle={styles.completeButton}
              textStyle={styles.completeButtonText}
            />
          </View>
        </ScrollView>
        <ContactSheet
          visible={showContactSheet}
          onClose={() => setShowContactSheet(false)}
          onSave={handleContactSave}
        />
        <MatchSheet visible={showMatchSheet} onClose={() => setShowMatchSheet(false)} onSave={handleMatchSave} />
        <SportsSheet
          visible={showSportSheet}
          onClose={() => setShowSportSheet(false)}
          onSave={handleSportSave}
        />
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

