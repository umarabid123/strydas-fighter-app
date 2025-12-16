import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constant';
import AppText from './common/AppText';

const InfoTag = ({ label, icon }: any) => (
  <View style={styles.infoTag}>
    <AppText text={label} fontSize={16} color={Colors.white} />
    {icon && <Image source={icon} style={styles.tagIcon} resizeMode="contain" />}
  </View>
);

export default function FighterCard({
  fighterName = "Fighter Name",
  fighterImage = require("../assets/images/event-card-img.png"),
  fighterFlag = require("../assets/images/flag-icon.png"),
  countryCode = "DEN",
  discipline = "Muay Thai",
  onPress = () => { },
  fightRecord = "0-0-0",
  weightClass = "65 kg",
  style = {},
}) {
  return (
    <TouchableOpacity style={[styles.cardContainer, style]} onPress={onPress}>
      <Image source={fighterImage} resizeMode="cover" style={styles.fighterImage} />

      <View>
        <View style={styles.headerRow}>
          <AppText
            text={fighterName}
            fontSize={18}
            color={Colors.white}
            style={{ fontWeight: '600' }}
          />
        </View>

        <View style={styles.metaRow}>
          <InfoTag label={fightRecord} />
          <InfoTag label={countryCode} icon={fighterFlag} />
          <InfoTag label={discipline} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  fighterImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  tagIcon: {
    width: 14,
    height: 14,
    borderRadius: 50,
    marginLeft: 6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  infoTag: {
    backgroundColor: "#343636",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
    flexDirection: "row",
    alignItems: "center",
  },
});
