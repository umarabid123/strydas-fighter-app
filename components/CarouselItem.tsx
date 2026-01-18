import { Colors } from '@/constant';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import AppText from './common/AppText';

export default function CarouselItem({
  item,
  size = 173,
  borderRadius = 16,
  style = {},
  onPress = () => { },
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.carouselItem}>
        <Image
          source={item.image}
          style={styles.carouselImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', '#AC1746']}
          style={styles.gradientOverlay}
        />
        <View style={styles.carouselContent}>
          <AppText
            text={item.title}
            fontSize={17}
            color={Colors.white}
            fontName="CircularStd-Bold"
            style={styles.carouselTitle}
          />
        </View>
      </View>
    </TouchableOpacity>
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
  carouselItem: {
    width: 173,
    height: 173,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  carouselContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  carouselTitle: {
    flex: 1,
    fontWeight: 600
  },
});
