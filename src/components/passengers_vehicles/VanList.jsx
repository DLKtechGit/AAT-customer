import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";
import { colors } from "../../utils/constants";
import { useNavigation } from "@react-navigation/native";
import searchCar from "../../assets/Images/searchCar1.png";
import nodata from "../../assets/Images/nodataifle.png";

const VanList = ({ vanData ,pickUpLocation,returnLocation,pickUpDate,totalKm,tripType,returnDate }) => {
  const navigation = useNavigation();


  if ( vanData == null) {
    return (
      <View style={styles.emptyContainer}>
         <Image style={{ width: 300, height: 150 }} source={searchCar} alt="search" />
        <Text style={styles.emptyText}>Available vans will appear here</Text>
      </View>
    );
  }else if(vanData?.length === 0){
    return(
      <View style={styles.emptyContainer}>
      <Image
      style={{ width: 220, height: 200 }}
      source={nodata}
      alt="noData"
    />
<Text style={styles.emptyText}> No vans available</Text>
</View>
    )
  }


  return (
    <>
      {/* main container */}

      {vanData?.map((data, index) => {
        return(
        <Pressable
          key={index}
          style={styles.main_container}
          onPress={() => navigation.navigate("VanDetails",{vanDetails:data,pickUpLocation:pickUpLocation,returnLocation:returnLocation,pickUpDate:pickUpDate,totalKm:totalKm,tripType:tripType,returnDate:returnDate})}
        >
          {/* description */}
          <View style={styles.desc}>
            <Text style={styles.vehicle_name_txt}>
              {" "}
              {data.vehicleDetails.vehicleModel}
            </Text>
            <Text style={styles.vehicle_details_txt}>
              No of Seats - {data.vehicleDetails.numberOfSeats} / Color -{" "}
              {data.vehicleDetails.vehicleColor}
            </Text>
            <Text style={styles.km_price_txt}>
              {" "}
              Per Km - ₹{data.vehicleDetails.pricePerKm} / Per Day - ₹
              {data.vehicleDetails.pricePerDay}
            </Text>
          </View>
          {/*vehicle image */}
          <View style={styles.img_container}>
            <Image
              source={require("../../assets/Images/van.png")}
              style={styles.img}
            />
          </View>
        </Pressable>
        )
      })}
    </>
  );
};

export default VanList;

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
    // marginBottom:50
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
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom:150
  },
  emptyText: {
    fontSize: 18,
    color: colors.dark_gray,
  },
  //   img_container:{
  //     borderColor:colors.light_green,
  //     borderWidth:0.5,
  //     padding:5
  //   }
});
