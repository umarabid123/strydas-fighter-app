import React from "react"
import { Dimensions, ImageBackground, StyleSheet, useColorScheme } from "react-native"
import { Colors } from "../../constant"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

export default function MeshGradientBackground() {
  const colorScheme = useColorScheme()
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light
  const meshGradientImage = require("../../assets/images/mesh-gradient.png")

  return (
    <ImageBackground
      source={meshGradientImage}
      style={[styles.container, { backgroundColor: colors.background }]}
      resizeMode="cover"
    />
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
})
