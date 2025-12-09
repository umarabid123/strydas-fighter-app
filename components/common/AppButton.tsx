import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,

} from 'react-native';
import { Colors } from '../../constant/themes';
export default function AppButton({
  text,
  route,
  btnStyle,
  textStyle,
  onPress, 
  params,
  source,
  type,
  iconStyle
}: {
  text?: string;
  route?: string;
  btnStyle?: any;
  textStyle?: TextStyle | TextStyle[];
  onPress?: () => void;
  params?: any;
  source?: any;
  type?: string;
  iconStyle?: object
}) {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <TouchableOpacity
      style={[styles.button, btnStyle]}
      onPress={() => {
        if (route) {
          navigation.navigate(route, params);
        } else if (onPress) {
          onPress();
        }
      }}>
      {type == 'icon' && <Image source={source} style={iconStyle} />}
      <Text style={[styles.buttonText, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    width: 'auto',
    alignSelf: 'center', // ✅ Use alignSelf instead of margin: 'auto'
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '500', // ✅ fontWeight should be a string, not a number
    // lineHeight: 24,
  },
});
