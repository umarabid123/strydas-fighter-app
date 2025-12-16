import React from "react";
import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { Colors } from "../constant";
import AppText from "./common/AppText";

interface EventCardProps {
  image: ImageSourcePropType;
  title: string;
  subtitle: string;
  containerStyle?: ViewStyle;
  onPress?: () => void;
}

export default function EventCard({
  image,
  title,
  subtitle,
  containerStyle,
  onPress,
}: EventCardProps) {
  return (
    <TouchableOpacity style={[styles.card, containerStyle]} onPress={onPress}>
      <Image source={image} resizeMode="cover" style={styles.image} />

      <View style={styles.textContainer}>
        <AppText
          text={title}
          fontSize={18}
          color={Colors.white}
          style={styles.title}
        />

        <AppText
          text={subtitle}
          fontSize={14}
          color={Colors.textSecondary}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#262a2b",
    padding: 8,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    width: "auto"
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "600",
    marginBottom: 4,
  },
});
