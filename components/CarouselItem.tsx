import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default function CarouselItem({
  imageSource = require('../assets/images/caraousal-icon.png'),
  size = 173,
  borderRadius = 16,
  style = {},
}) {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius }, style]}>
      <Image source={imageSource} resizeMode="contain" style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
