import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import AppText from './AppText';
import { Colors } from '../../constant/themes';
import { wp } from '../../constant/constants';

export default function EmailInput() {
  const [email, setEmail] = useState('');

  return (
    <View style={styles.container}>
      <AppText text="E-mail" color={Colors.white} style={{ fontWeight: 500 }} />
      <TextInput
        style={styles.input}
        placeholder="your@email.com"
        placeholderTextColor="#999"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#2a2a2a',
    width: wp(90),
    marginHorizontal: 'auto',
    borderRadius: 12,
    marginTop: 24,
  },
  input: {
    fontSize: 16,
    color: '#fff',
  },
});



