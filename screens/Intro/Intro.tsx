import type { NavigationProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AppButton from "../../components/common/AppButton";
import AppText from "../../components/common/AppText";
import MeshGradientBackground from "../../components/common/MeshGradientBackground";
import {
  BorderRadius,
  Colors,
  DESIGN_HEIGHT,
  DESIGN_WIDTH,
  Spacing,
  Typography,
} from "../../constant";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// 🔥 Scale values automatically based on screen size
const scaleW = (value: number) => (value / DESIGN_WIDTH) * SCREEN_WIDTH;
const scaleH = (value: number) => (value / DESIGN_HEIGHT) * SCREEN_HEIGHT;

export default function Intro() {
  const navigation = useNavigation<NavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;

  const logoImage = require("../../assets/images/logo.png");
  const cardImage = require("../../assets/images/card-image.png");
  const featuredCardImage = require("../../assets/images/featured-card.png");

  const handleSignUp = () => navigation.navigate("SignUp");
  const handleLogIn = () => navigation.navigate("Login");

  /* Data for slides */
  const introSlides = [
    {
      id: "1",
      title: "For Organizers",
      description: "Create and manage\nfight cards easily.",
      image: cardImage,
    },
    {
      id: "2",
      title: "For Fighters",
      description: "Browse competitions\nlooking for fighters.",
      image: featuredCardImage,
    },
    {
      id: "3",
      title: "For Fans",
      description: "Follow your favorite\nfighters and events.",
      image: cardImage,
    },
  ];

  return (
    <View style={styles.container}>
      <MeshGradientBackground />

      {/* Top Content: Logo + Tagline */}
      <View style={[styles.headerContainer, { marginTop: scaleH(20) }]}>
        <View style={styles.logoContainer}>
          <Image source={logoImage} style={styles.logo} resizeMode="contain" />
        </View>

        <AppText
          text="The hub of combat sports."
          fontSize={Typography.fontSize.md}
          color={Colors.textSecondary}
          textAlign="center"
          style={styles.tagline}
        />
      </View>

      {/* Middle Content: Cards Carousel */}
      <View style={styles.carouselContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsScrollContent}
          style={styles.cardsScrollView}
          snapToInterval={scaleW(305) + Spacing.lg}
          decelerationRate="fast"
        >
          {introSlides.map((slide) => (
            <View key={slide.id} style={styles.card}>
              <ImageBackground source={slide.image} style={styles.cardImage} resizeMode="cover">
                <View style={styles.gradientOverlay}>
                  <View style={styles.gradientBottom} />
                  <View style={styles.cardContent}>
                    <AppText
                      text={slide.title}
                      fontSize={Typography.fontSize.sm}
                      color={Colors.successGreen}
                    />
                    <AppText
                      text={slide.description}
                      fontSize={Typography.fontSize.xl}
                      fontName="CircularStd-Medium"
                      color={colors.white}
                    />
                  </View>
                </View>
              </ImageBackground>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Bottom Content: Buttons */}
      <View style={[styles.buttonsContainer, { paddingBottom: insets.bottom + scaleH(20) }]}>
        <AppButton
          text="Sign up"
          onPress={handleSignUp}
          btnStyle={[styles.button, styles.signUpButton]}
          textStyle={[styles.buttonText, styles.signUpButtonText]}
        />

        <AppButton
          text="Log in"
          onPress={handleLogIn}
          btnStyle={[styles.button, styles.logInButton]}
          textStyle={[styles.buttonText, styles.logInButtonText]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },

  headerContainer: {
    alignItems: 'center',
    marginBottom: scaleH(20),
    zIndex: 10,
    paddingTop: 20
  },

  logoContainer: {
    width: scaleW(126),
    height: scaleH(28),
    marginBottom: Spacing.md,
  },

  logo: {
    width: "100%",
    height: "100%"
  },

  tagline: {
    width: scaleW(300),
  },

  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  cardsScrollView: {
    flexGrow: 0,
  },

  cardsScrollContent: {
    paddingHorizontal: scaleW(32),
    gap: Spacing.lg,
    alignItems: "center",
  },

  card: {
    width: scaleW(305),
    height: "100%",
    aspectRatio: 305 / 480,
    maxHeight: scaleH(480),
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    backgroundColor: Colors.lightGrey,
  },

  cardImage: {
    width: "100%",
    height: "100%",
  },

  gradientOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: Spacing.xl,
  },

  gradientBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
    backgroundColor: Colors.blackOpacity60,
  },

  cardContent: {
    gap: Spacing.sm,
    zIndex: 2,
  },

  buttonsContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: scaleW(32),
    paddingTop: scaleH(20),
  },

  button: {
    width: "100%",
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
  },

  signUpButton: { backgroundColor: Colors.white },

  logInButton: {
    marginTop: Spacing.md,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.white,
  },

  buttonText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
  },

  signUpButtonText: { color: Colors.darkGray },
  logInButtonText: { color: Colors.white },
});

