import React from 'react';
import { View } from 'react-native';
import { Colors } from '../../constant/themes';
import AppText from './AppText';

export default function AuthDescription({title, description,customStyle}:{title?:string, description?:string; customStyle?:any}) {
  return (
    <View style={[{ marginBottom: 60},customStyle]}>
      <AppText
        text={title}
        textAlign="center"
        fontSize={24}
        style={{ fontWeight: 600,marginBottom:6 }}
        color={Colors.white}
      />
      <AppText
        text={description}
        textAlign="center"
        fontSize={14}
        color="#FFFFFF99"
      />
    </View>
  );
}
