import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React, { useState } from "react";
import { colors } from "../../utils/constants";
import { useNavigation } from "@react-navigation/native";
import largTruck from "../../assets/Images/below-20-ton.png";
import mediumtruck from "../../assets/Images/XL-truck.png";
import smallTruck from "../../assets/Images/under1-ton.jpg";
import Xltruck from "../../assets/Images/moreThen20-ton.png";
import searchCar from "../../assets/Images/searchCar1.png";
import nodata from "../../assets/Images/nodataifle.png";


const LargeVehicleList = ({ truckData,pickUpLocation,returnLocation,pickUpDate,totalKm,tripType,returnDate,receiversName,receiversNumber }) => {
  const navigation = useNavigation();


  if ( truckData == null) {
    return (
      <View style={styles.emptyContainer}>
         <Image style={{ width: 300, height: 150 }} source={searchCar} alt="search" />
        <Text style={styles.emptyText}>Available vehicles will appear here</Text>
      </View>
    );
  }else if(truckData?.length === 0){
    return(
      <View style={styles.emptyContainer}>
      <Image
      style={{ width: 220, height: 200 }}
      source={nodata}
      alt="noData"
    />
<Text style={styles.emptyText}> No vehicle available</Text>
</View>
    )
  }

  return (
    <>
      {/* main container */}
      {truckData?.map((data, index) => {
        const calculatedTon = parseFloat(data.vehicleDetails.ton);
        let vehicleImage;

        if (calculatedTon <= 1000) {
          vehicleImage = smallTruck;
        } else if (calculatedTon > 1000 && calculatedTon <= 10000) {
          vehicleImage = mediumtruck;
        } else if (calculatedTon > 10000 && calculatedTon <= 20000) {
          vehicleImage = largTruck;
        } else if (calculatedTon > 20000) {
          vehicleImage = Xltruck;
        }

        return (
          <Pressable
            key={index}
            style={styles.main_container}
            onPress={() => navigation.navigate("LargeVehicle_details",{truckData:data,pickUpLocation:pickUpLocation,returnLocation:returnLocation,pickUpDate:pickUpDate,totalKm:totalKm,tripType:tripType,returnDate:returnDate,receiversName:receiversName,receiversNumber:receiversNumber})}
          >
            {/* description */}
            <View style={styles.desc}>
              <Text style={styles.vehicle_name_txt}>
                {data.vehicleDetails.vehicleModel}
              </Text>
              <Text style={styles.vehicle_details_txt}>
                Ton - {data.vehicleDetails.ton} KG / Size -{" "}
                {data.vehicleDetails.size}
              </Text>
              <Text style={styles.km_price_txt}>
                Per Km - ₹{data.vehicleDetails.pricePerKm} / per Day ₹
                {data.vehicleDetails.pricePerDay}
              </Text>
            </View>
            {/* vehicle image */}
            <View style={styles.img_container}>
              <Image source={vehicleImage} style={styles.img} />
            </View>
          </Pressable>
        );
      })}
    </>
  );
};

export default LargeVehicleList;

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
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
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
