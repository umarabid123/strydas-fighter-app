import type { NavigationProp } from "@react-navigation/native"
import { useNavigation } from "@react-navigation/native"
import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native"
import AppButton from "../../components/common/AppButton"
import AppText from "../../components/common/AppText"
import MeshGradientBackground from "../../components/common/MeshGradientBackground"
import { BorderRadius, Colors, DESIGN_HEIGHT, DESIGN_WIDTH, Spacing, Typography } from "../../constant"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

interface IntroProps {
  onSignUp?: () => void
  onLogIn?: () => void
}

export default function Intro({ onSignUp, onLogIn }: IntroProps) {
  const navigation = useNavigation<NavigationProp<any>>()
  const colorScheme = useColorScheme()
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light

  const handleSignUp = () => {
    navigation.navigate("SignUp")
    if (onSignUp) {
      onSignUp()
    }
  }

  const handleLogIn = () => {
    navigation.navigate("Login")
    if (onLogIn) {
      onLogIn()
    }
  }
  // Local images from assets
  const logoImage = require("../../assets/images/logo.png")
  const cardImage = require("../../assets/images/card-image.png")
  const featuredCardImage = require("../../assets/images/featured-card.png")

  return (
    <View style={styles.container}>
      {/* Background Mesh Gradient - Same as Login */}
      <MeshGradientBackground />

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={logoImage}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Tagline */}
      <AppText
        text="The hub of combat sports."
        fontSize={Typography.fontSize.md}
        color={Colors.textSecondary}
        textAlign="center"
        style={styles.tagline}
      />

      {/* Horizontal Scrollable Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
        style={styles.cardsScrollView}
      >
        {/* Left Card */}
        <View style={styles.card}>
          <ImageBackground
            source={cardImage}
            style={styles.cardImage}
            resizeMode="cover"
          >
            {/* <View style={styles.cardOverlay} /> */}
          </ImageBackground>
        </View>

        {/* Center Card - Featured */}
        <View style={[styles.card, styles.featuredCard]}>
          <ImageBackground
            source={featuredCardImage}
            style={styles.cardImage}
            resizeMode="cover"
          >
            <View style={styles.gradientOverlay}>
              <View style={styles.gradientBottom} />
              <View style={styles.cardContent}>
                <AppText
                  text="For Fighters"
                  fontSize={Typography.fontSize.sm}
                  fontName="CircularStd-Medium"
                  color={Colors.successGreen}
                  style={styles.cardLabel}
                />
                <AppText
                  text={`Browse competitions\nlooking for fighters.`}
                  fontSize={Typography.fontSize.xl}
                  fontName="CircularStd-Medium"
                  color={colors.white}
                  style={styles.cardTitle}
                />
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Right Card */}
        <View style={styles.card}>
          <ImageBackground
            source={cardImage}
            style={styles.cardImage}
            resizeMode="cover"
          >
            <View style={styles.cardOverlay} />
          </ImageBackground>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        {/* Sign Up Button */}
        <AppButton
          text="Sign up"
          onPress={handleSignUp}
          btnStyle={[styles.button, styles.signUpButton]}
          textStyle={[styles.buttonText, styles.signUpButtonText]}
        />

        {/* Log In Button */}
        <AppButton
          text="Log in"
          onPress={handleLogIn}
          btnStyle={[styles.button, styles.logInButton]}
          textStyle={[styles.buttonText, styles.logInButtonText]}
        />
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  tagline: {
    position: "absolute",
    top: (78 / DESIGN_HEIGHT) * SCREEN_HEIGHT,
    left: (SCREEN_WIDTH - (329 / DESIGN_WIDTH) * SCREEN_WIDTH) / 2,
    width: (329 / DESIGN_WIDTH) * SCREEN_WIDTH,
  },
  logoContainer: {
    position: "absolute",
    top: (40 / DESIGN_HEIGHT) * SCREEN_HEIGHT, // 40px from Figma
    left: (SCREEN_WIDTH - (126.424 / DESIGN_WIDTH) * SCREEN_WIDTH) / 2, // Centered, 126.424px width
    width: (126.424 / DESIGN_WIDTH) * SCREEN_WIDTH,
    height: (28 / DESIGN_HEIGHT) * SCREEN_HEIGHT,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  cardsScrollView: {
    position: "absolute",
    top: (SCREEN_HEIGHT / 2) - (500 / DESIGN_HEIGHT) * SCREEN_HEIGHT / 2 - (39.5 / DESIGN_HEIGHT) * SCREEN_HEIGHT, // calc(50% - 39.5px)
    left: 0,
    right: 0,
    height: (500 / DESIGN_HEIGHT) * SCREEN_HEIGHT,
  },
  cardsContainer: {
    paddingLeft: (32 / DESIGN_WIDTH) * SCREEN_WIDTH,
    paddingRight: (32 / DESIGN_WIDTH) * SCREEN_WIDTH,
    gap: Spacing.lg,
    alignItems: "center",
  },
  card: {
    width: (301 / DESIGN_WIDTH) * SCREEN_WIDTH,
    height: (500 / DESIGN_HEIGHT) * SCREEN_HEIGHT,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    backgroundColor: Colors.lightGrey,
  },
  featuredCard: {
    width: (305 / DESIGN_WIDTH) * SCREEN_WIDTH, // 305px for center card
  },
  cardImage: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  cardOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.blackOpacity30,
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
    height: "20%", // Gradient covers bottom 60%
    backgroundColor: Colors.blackOpacity60,
  },
  cardContent: {
    gap: Spacing.sm,
    zIndex: 1,
  },
  cardLabel: {
    marginBottom: 0,
  },
  cardTitle: {
    lineHeight: Typography.lineHeight.lg,
  },
  buttonsContainer: {
    position: "absolute",
    bottom: Spacing.xxl,
    left: 0,
    right: 0,
    width: "100%",
    paddingHorizontal: (32 / DESIGN_WIDTH) * SCREEN_WIDTH,
    alignItems: "center",
  },
  button: {
    width: "100%",
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
  },
  signUpButton: {
    backgroundColor: Colors.white,
  },
  logInButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.white,
  },
  buttonText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    textAlign: "center",
  },
  signUpButtonText: {
    color: Colors.darkGray,
  },
  logInButtonText: {
    color: Colors.white,
  },
})

