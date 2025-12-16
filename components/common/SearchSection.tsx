import React, { useState } from "react";
import { Image, Platform, StyleSheet, TextInput, View } from "react-native";
import { Colors, wp } from "../../constant";
import AppText from "./AppText";
import CustomIconButton from "./CustomIconButton";

export default function SearchSection({
  title = "",
  subtitle = "",
  placeholder = "Search",
  searchValue = "",
  onSearchChange = () => { },
  onFilterPress = () => { },
  searchIcon = require("../../assets/images/search-icon.png"),
  filterIcon = require("../../assets/images/search-filter-icon.png"),
  containerStyle = {},
  titleStyle = {},
  subtitleStyle = {},
  searchBarStyle = {},
  filterButtonStyle = {},
}) {

  const [filter, setFilter] = useState(false)

  const handleFilterPress = () => {
    setFilter(!filter)
    onFilterPress()
  }
  return (
    <View style={[styles.container, containerStyle]}>
      <AppText
        text={title}
        fontSize={32}
        color={Colors.white}
        style={[styles.title, titleStyle]}
      />

      <AppText
        text={subtitle}
        color={Colors.textSecondary}
        style={subtitleStyle}
      />

      <View style={styles.searchRow}>
        <View style={[styles.searchBar, searchBarStyle]}>
          <Image
            source={searchIcon}
            resizeMode="contain"
            style={styles.searchIcon}
          />

          <TextInput
            value={searchValue}
            onChangeText={onSearchChange}
            placeholder={placeholder}
            placeholderTextColor="#00000099"
            style={styles.searchInput}
          />
        </View>

        <CustomIconButton
          source={filterIcon}
          onPress={handleFilterPress}
          btnStyle={[styles.filterBtn, { backgroundColor: filter ? "rgb(15,44,28)" : "#FFFFFF26", borderWidth: 1, borderColor: filter ? "rgb(15,44,28)" : "#FFFFFF26" }, filterButtonStyle]}
          textStyle={styles.hiddenText}
          iconStyle={[styles.filterIcon, filter ? styles.filterIconActive : styles.filterIconInactive]}
        />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  title: {
    fontWeight: "600",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
    gap: 8,
  },
  searchBar: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: Platform.OS === 'ios' ? 16 : 6,
    flexDirection: "row",
    width: wp(75),
    maxWidth: wp(75),
    alignItems: "center",
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 6,
    backgroundColor: "transparent",
    borderWidth: 0,
    color: "#000",
  },
  filterBtn: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    width: 52,
    height: 52,
  },
  filterIcon: {
    width: 24,
    height: 24,
  },
  filterIconActive: {
    tintColor: Colors.green,
  },
  filterIconInactive: {
    tintColor: "#fff",
  },
  hiddenText: {
    display: "none",
  },
});
