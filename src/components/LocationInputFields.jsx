import React from "react";
import { View, Text, TextInput, StyleSheet, Platform } from "react-native";
import { colors } from "../utils/constants";
import Icon1 from "react-native-vector-icons/FontAwesome6";

const LocationInputFields = ({ value1, onChangeText1,value2,onChangeText2 }) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Icon1
          name="location-crosshairs"
          size={18}
          color={colors.dark_gray}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your pick-up location"
          placeholderTextColor={colors.dark_gray}
          value={value1}
          onChangeText={onChangeText1}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon1
          name="map-pin"
          size={18}
          color={colors.dark_gray}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your drop location"
          placeholderTextColor={colors.dark_gray}
          value={value2}
          onChangeText={onChangeText2}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.light_green,
    marginBottom: 16,
    borderRadius: 50,
  },
  icon: {
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 15,
  },
});

export default LocationInputFields;
