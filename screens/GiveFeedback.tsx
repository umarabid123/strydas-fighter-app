import React from 'react';
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  TextInput,
  TextStyle,
  View
} from 'react-native';
import AppButton from '../components/common/AppButton';
import AppText from '../components/common/AppText';
import Header from '../components/common/Header';
import { Colors } from '../constant';
import SearchSection from '../components/common/SearchSection';
import FighterCard from '../components/FighterCard';
import CarouselItem from '../components/CarouselItem';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const GiveFeedback = ({
  height = 287,
  inputStyle,
}: {
  height?: number;
  inputStyle?: TextStyle;
}) => {
  return (
    <View style={styles.container}>
      <Header title="Give Feedback" isBack />
      <View style={styles.content}>
        <AppText
          text="Give us your feedback!"
          color={Colors.white}
          fontSize={14}
          style={{ fontWeight: 500 }}
        />
        <TextInput
          multiline
          placeholder="Write here..."
          placeholderTextColor={'#FFFFFF80'}
          style={[styles.textarea, { height: height }, inputStyle]}
        />
        <AppButton
          text="Send feedback"
          btnStyle={{
            width: 'auto',
            paddingHorizontal: 32,
            paddingVertical: 17,
            backgroundColor: Colors.white,
            borderRadius: 50,
            marginTop: 32,
          }}
          textStyle={{ color: Colors.black, fontWeight: 600 }}
        />
      </View>
    </View>
  );
};

export default GiveFeedback;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    // paddingTop: 60,
  },
  content: {
    paddingHorizontal: 20,
    marginTop: 30
  },
  textarea: {
    borderRadius: 12,
    color: Colors.white,
    fontSize: 15,
    lineHeight: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF26',
  },
});
