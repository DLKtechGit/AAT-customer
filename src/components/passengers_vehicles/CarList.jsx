import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";
import { colors } from "../../utils/constants";
import { useNavigation } from "@react-navigation/native";
import searchCar from "../../assets/Images/searchCar1.png";
import nodata from "../../assets/Images/nodataifle.png";

const CarList = ({ carData,pickUpLocation,returnLocation,pickUpDate,totalKm,tripType,returnDate}) => {
  const navigation = useNavigation();

  

  if ( carData == null) {
    return (
      <View style={styles.emptyContainer}>
         <Image style={{ width: 300, height: 150 }} source={searchCar} alt="search" />
        <Text style={styles.emptyText}>Available cars will appear here</Text>
      </View>
    );
  }else if(carData?.length === 0){
    return(
      <View style={styles.emptyContainer}>
      <Image
      style={{ width: 220, height: 200 }}
      source={nodata}
      alt="noData"
    />
<Text style={styles.emptyText}> No cars available</Text>
</View>
    )
  }

  return (
    <>
      {carData?.map((data, index) => (
        <Pressable
          key={index}
          style={styles.main_container}
          onPress={() => navigation.navigate("CarDetails",{carDetails:data,pickUpLocation:pickUpLocation,returnLocation:returnLocation,pickUpDate:pickUpDate,totalKm:totalKm,tripType:tripType,returnDate:returnDate})}
        >
          {/* description */}
          <View style={styles.desc}>
            <Text style={styles.vehicle_name_txt}>
              {data.vehicleDetails.vehicleModel}
            </Text>
            <Text style={styles.vehicle_details_txt}>
              No of Seats - {data.vehicleDetails.numberOfSeats} / Color -{" "}
              {data.vehicleDetails.vehicleColor}
            </Text>
            <Text style={styles.km_price_txt}>
              Per Km - ₹{data.vehicleDetails.pricePerKm} / Per Day - ₹
              {data.vehicleDetails.pricePerDay}
            </Text>
          </View>
          {/*vehicle image */}
          <View style={styles.img_container}>
            <Image
              source={require("../../assets/Images/car5.png")}
              style={styles.img}
            />
          </View>
        </Pressable>
      ))}
    </>
  );
};

export default CarList;

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
  },
  km_price_txt: {
    fontWeight: "500",
    color: colors.dark_green,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    color: colors.dark_gray,
  },
});
