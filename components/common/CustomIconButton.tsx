import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { wp } from '../../constant/constants';

const buttonWidth = wp(90);

export default function CustomIconButton({
  text,
  route,
  btnStyle,
  textStyle,
  source,
  iconStyle,
  onPress,
}: {
  text?: string;
  route?: string;
  btnStyle?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  source?: any;
  iconStyle?: any;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={[styles.button, btnStyle]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{text}</Text>

      {source && (
        <Image
          source={source}
          style={[styles.icon, iconStyle]}
          resizeMode="contain"
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: buttonWidth,
    alignSelf: 'center',
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '500',
    lineHeight: 24,
  },
  icon: {
    width: 19,
    height: 14,
  },
});
