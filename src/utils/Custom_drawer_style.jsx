import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
} from "react-native";
import React from "react";
import safe_area_style from "./safe_area_style";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { colors } from "./constants";
import { useNavigation } from "@react-navigation/native";

const Custom_drawer_style = (props) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={safe_area_style.android_safe_area}>
      {/* main container */}
      <View style={styles.main_container}>
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={{ marginTop: -30 }}
        >
          <View style={styles.img_container}>
            <Image
              source={require("../assets/Images/AAT-logo-latest.png")}
              style={{ width: 160, height: 160 }}
            />
          </View>
          {/* Navigation menu */}
          <View style={styles.nav_menu_container}>
            <DrawerItemList {...props} />
          </View>
          {/* button */}
          {/* <Pressable
            style={styles.btn_container}
            onPress={() => navigation.navigate("Become_vendor")}
          >
            <Text style={styles.btn_txt}>Become a vendor!</Text>
          </Pressable> */}
        </DrawerContentScrollView>
        <View style={styles.img_container}>
          <Image
            source={require("../assets/Images/driver-img.png")}
            style={{ width: 220, height: 150 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Custom_drawer_style;

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    paddingBottom: 20,
  },
  img_container: {
    alignItems: "center",
  },

  btn_container: {
    backgroundColor: colors.dark_green,
    marginHorizontal: 10,
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  btn_txt: {
    textAlign: "center",
    color: colors.white,
    fontSize: 15,
    fontWeight: "500",
  },
  nav_menu_container: {
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
});
