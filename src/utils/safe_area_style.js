import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  android_safe_area: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 30 : 0,
  },
});
