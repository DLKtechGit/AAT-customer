import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";
import { colors } from "../../utils/constants";
import { useNavigation } from "@react-navigation/native";

const MediumVehicleList = () => {
  const navigation = useNavigation();
  return (
    <>
      {/* main container */}
      <Pressable
        style={styles.main_container}
        onPress={() => navigation.navigate("MediumVehicle_details")}
      >
        {/* description */}
        <View style={styles.desc}>
          <Text style={styles.vehicle_name_txt}>Tata Ace</Text>
          <Text style={styles.vehicle_details_txt}>
            Ton - 750 kG / Size - 7ft × 4ft × 5ft
          </Text>
          <Text style={styles.km_price_txt}>Per Km - ₹55</Text>
        </View>
        {/*vehicle image */}
        <View style={styles.img_container}>
          <Image
            source={require("../../assets/Images/medium-truck.png")}
            style={styles.img}
          />
        </View>
      </Pressable>
      {/* 2 */}
      {/* <Pressable style={styles.main_container}> */}
      {/* description */}
      {/* <View style={styles.desc}>
          <Text style={styles.vehicle_name_txt}>Toyota</Text>
          <Text style={styles.vehicle_details_txt}>
            No of Seats - 6 / Color - Red
          </Text>
          <Text style={styles.km_price_txt}>Per Km - ₹50</Text>
        </View> */}
      {/*vehicle image */}
      {/* <View style={styles.img_container}>
          <Image
            source={require("../../assets/Images/car.png")}
            style={styles.img}
          />
        </View>
      </Pressable> */}
    </>
  );
};

export default MediumVehicleList;

const styles = StyleSheet.create({
  main_container: {
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
    fontSize: 13,
  },
  km_price_txt: {
    fontWeight: "500",
    color: colors.dark_green,
  },
  //   img_container:{
  //     borderColor:colors.light_green,
  //     borderWidth:0.5,
  //     padding:5
  //   }
});
