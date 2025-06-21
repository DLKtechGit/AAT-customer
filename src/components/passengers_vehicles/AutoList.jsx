import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";
import { colors } from "../../utils/constants";
import { useNavigation } from "@react-navigation/native";

const AutoList = () => {
  const navigation = useNavigation();
  return (
    <>

      {/* main container */}
      <Pressable
        style={styles.main_container1}
        onPress={() => navigation.navigate("AutoDetails")}
      >
        {/* description */}
        <View style={styles.desc}>
          <Text style={styles.vehicle_name_txt}>Bajaj</Text>
          <Text style={styles.vehicle_details_txt}>
            No of Seats - 3 / Color - Yellow
          </Text>
          <Text style={styles.km_price_txt}>Per Km - ₹10</Text>
        </View>
        {/*vehicle image */}
        <View style={styles.img_container}>
          <Image
            source={require("../../assets/Images/auto.png")}
            style={styles.img}
          />
        </View>
      </Pressable>
    </>
  );
};

export default AutoList;

const styles = StyleSheet.create({
  main_container1: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderColor: colors.gray,
    borderWidth: 1,
    marginTop: 20,
    borderRadius: 10,
  },
  img: {
    width: 120,
    height: 80,
  },
  desc: {
    gap: 8,
  },
  vehicle_name_txt: {
    fontSize: 16,
    fontWeight: "600",
  },
  vehicle_details_txt: {
    fontWeight: "500",
    color: colors.dark_gray,
  },
  km_price_txt: {
    fontWeight: "500",
    color: colors.dark_green,
  },
});
