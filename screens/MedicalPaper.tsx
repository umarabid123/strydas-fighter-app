import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import MeshGradientBackground from '../components/common/MeshGradientBackground';
import Header from '../components/common/Header';
import { Colors } from '../constant';
import AppText from '../components/common/AppText';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")
const MedicalPaper = () => {
  return (
    <View style={styles.container}>
      <Header title="Medical Papers" isBack={true} />
      <AppText text={'TODO\nMedical Papers'} fontSize={44} color={Colors.white} style={{ fontWeight: '600', textAlign: 'center', marginTop: 155 }} />
    </View>
  );
};

export default MedicalPaper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    paddingTop: Platform.OS === 'ios' ? 0 : 20

  },
});
