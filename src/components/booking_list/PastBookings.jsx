import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../../utils/constants";
import { bookingHistory } from "../../Data/PastBookings";
import Icon from "react-native-vector-icons/AntDesign";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import AxiosService from "../../utils/AxiosService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import moment from "moment";
import carImg from "../../assets/Images/car.png";
import autoImg from "../../assets/Images/auto1.jpg";
import vanImg from "../../assets/Images/van.png";
import busImg from "../../assets/Images/bus.png";
import smallTruckImg from "../../assets/Images/small-truck.jpg";
import mediumTruckImg from "../../assets/Images/medium-truck.png";
import largeTruckImg from "../../assets/Images/large-truck.jpg";
import XLTruckImg from "../../assets/Images/XL-truck.png";
import loadingGif from "../../assets/Images/loadingGif.gif";
import nodata from "../../assets/Images/nodata.gif";
import Fontaswome from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

const PastBookings = () => {
  const [showButton, setShowButton] = useState(false);
  const [filtered, setFiltered] = useState("all");
  const [loading, setLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    GetBookings();
  }, []);

  const filteredData =
    filtered === "all"
      ? bookingDetails
      : bookingDetails.filter(
          (vehicle) => vehicle.tripStatus === filtered
        );

  const handleFilterChange = (filter) => {
    setFiltered(filter);
    setShowButton(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await GetBookings();
    setRefreshing(false);
  };

  const GetBookings = async () => {
    try {
      setLoading(true);
      const getId = await AsyncStorage.getItem("user");
      const Id = JSON.parse(getId);
      const customerId = Id._id;

      const res = await AxiosService.get(
        `customer/getBookingsByCustomerId/${customerId}`
      );
      const data = res.data.bookings;
      const filteredData = data?.filter(
        (item) =>
          item.vendorApprovedStatus === "rejected" ||
          item.tripStatus === "cancelled"||  item.tripStatus === "completed"
      );

      if (res.status === 200) {
        setBookingDetails(filteredData);
        console.log("Bookings fetched successfully");
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.message);
      } else if (error.message) {
        console.log(error.message);
      } else {
        console.log("Something went wrong please try again later");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 30,
        }}
      >
        <Image style={{ width: 100, height: 100 }} source={loadingGif} />
        <Text style={styles.btn_txt}> Loading... </Text>
      </View>
    );
  } else if (bookingDetails.length === 0) {
    return (
      <>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            marginTop: 200,
          }}
        >
          <Image style={{ width: 200, height: 200 }} source={nodata} />
          <Text style={styles.noBookingText}> No Bookings Found! </Text>
        </ScrollView>
      </>
    );
  }
  

  return (
    <>
      {/* filter section */}
      <View style={styles.header_sec}>
        <Text style={styles.month_txt}>
          {moment(Date.now()).format("MMMM Do YYYY")}
        </Text>
        {/* filter button container */}
        {bookingDetails.length !== 0 && (
          <View style={styles.filter_btn_container}>
            {/* filter main button */}
            <Pressable
              style={styles.filter_main_btn_container}
              onPress={() => setShowButton(!showButton)}
            >
              <Text style={styles.filter_btn_txt}>
                {" "}
                {filtered.charAt(0).toUpperCase() + filtered.slice(1)}
                <Icon name="filter" size={18} />
              </Text>
            </Pressable>
            {showButton && (
              // complete button
              <>
                <TouchableOpacity
                  style={styles.filter_complete_btn_container}
                  onPress={() => handleFilterChange("completed")}
                >
                  <Text style={styles.complete_btn_txt}>Completed</Text>
                </TouchableOpacity>
                {/*  cancel button */}
                <TouchableOpacity
                  style={styles.filter_cancel_btn_container}
                  onPress={() => handleFilterChange("cancelled")}
                >
                  <Text style={styles.complete_btn_txt}>Cancelled</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.filter_all_container, styles.filter_btn_txt]} // You can customize the style if needed
                  onPress={() => handleFilterChange("all")}
                >
                  <Text style={styles.filter_btn_txt}>All</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>
      {/* auto */}
      {filteredData?.map((item, i) => {
        let vehicleimg;
        if (item.vehicleDetails.foundVehicle.subCategory === "car") {
          vehicleimg = carImg;
        } else if (item.vehicleDetails.foundVehicle.subCategory === "auto") {
          vehicleimg = autoImg;
        } else if (item.vehicleDetails.foundVehicle.subCategory === "van") {
          vehicleimg = vanImg;
        } else if (item.vehicleDetails.foundVehicle.subCategory === "bus") {
          vehicleimg = busImg;
        } else if (
          item.vehicleDetails.foundVehicle.subCategory === "truck" &&
          item.vehicleDetails.foundVehicle.goodsType === "Small"
        ) {
          vehicleimg = smallTruckImg;
        } else if (
          item.vehicleDetails.foundVehicle.subCategory === "truck" &&
          item.vehicleDetails.foundVehicle.goodsType === "Medium"
        ) {
          vehicleimg = mediumTruckImg;
        } else if (
          item.vehicleDetails.foundVehicle.subCategory === "truck" &&
          item.vehicleDetails.foundVehicle.goodsType === "Large"
        ) {
          vehicleimg = largeTruckImg;
        } else if (
          item.vehicleDetails.foundVehicle.subCategory === "truck" &&
          item.vehicleDetails.foundVehicle.goodsType === "XL"
        ) {
          vehicleimg = XLTruckImg;
        }
        return (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            style={styles.main_container}
            key={i}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("BusBookingsDetails", {
                  BookingDetails: item,
                  vehicleimg: vehicleimg,

                })
              }
              style={styles.content_container}
            >
              {/* image container */}
              <View style={styles.img_container}>
                <Image source={vehicleimg} style={styles.img} />
              </View>
              {/* description container */}
              <View style={styles.desc_container}>
                {/* vehicle type */}
                <View style={styles.status_container}>
                  <Text style={styles.vehicle_type_txt}>
                    {item.vehicleDetails.foundVehicle.vehicleModel}
                  </Text>
                  <Text
                    style={[
                      styles.status_txt,
                      item.tripStatus === "completed"
                        ? styles.status_txt
                        : styles.cancelled_txt,
                    ]}
                  >
                    {item.tripStatus.charAt(0)
                      .toUpperCase() +
                      item.tripStatus.slice(1)}
                  </Text>
                </View>
                {/* booking date */}  
                <Text style={styles.date_txt}>
                Booking ID: {String(item._id).slice(-5).toLocaleUpperCase()}
                </Text>
                <Text style={styles.date_txt}>
                  Booking date: {moment(item.pickupDate).format("DD -MM- YYYY")}
                </Text>
                {/* fare */}
                <Text style={styles.fare_txt}>
                  Fare: {item.totalFare ? item.totalFare : "-"}
                </Text>
                {/* advance */}
                <Text style={styles.fare_txt}>
                  Advance:{item.advanceAmount}{" "}
                </Text>
                {/* Refund status */}
                {item.tripStatus === "cancelled" && <Text style={styles.fare_txt}>
                  Refund status:{" "}
                  {item.advanceRefund === true ? "Refunded" : "Not refunded"}
                </Text>}
              </View>
            </TouchableOpacity>
          </ScrollView>
        );
      })}
    </>
  );
};

export default PastBookings;

const styles = StyleSheet.create({
  main_container: {
    borderColor: colors.gray,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 15,
  },

  // content style
  content_container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  img: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
  img_container: {
    borderColor: colors.gray,
    borderWidth: 1,
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  desc_container: {
    gap: 3,
    marginLeft: 10,
    width: "70%",
  },
  vehicle_type_txt: {
    fontSize: 17,
    fontWeight: "600",
  },
  date_txt: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.dark_gray,
  },
  fare_txt: {
    fontWeight: "500",
    color: colors.dark_gray,
    fontSize: 13,
  },
  status_container: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  status_txt: {
    fontWeight: "700",
    color: colors.dark_green,
    fontSize: 15,
  },
  cancelled_txt: {
    color: colors.red,
  },
  // filter styles
  header_sec: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  month_txt: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.dark_gray,
  },
  filter_main_btn_container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    justifyContent: "center",
    backgroundColor: colors.light_gray,
    padding: 5,
    borderRadius: 5,
    borderColor: colors.light_green,
    borderWidth: 0.5,
  },
  filter_btn_container: {
    width: wp(40),
    padding: 3,
    borderRadius: 10,
    borderColor: colors.dark_green,
    borderWidth: 1,
  },
  filter_all_container: {
    alignItems: "center",
    // gap: 3,
    backgroundColor: colors.light_gray,
    width: wp(38),
    padding: 3,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 3,
    borderColor: colors.light_gray,
  },
  filter_btn_txt: {
    fontSize: 16,
    fontWeight: "600",
  },
  filter_complete_btn_container: {
    backgroundColor: colors.dark_green,
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  complete_btn_txt: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.white,
    textAlign: "center",
  },
  filter_cancel_btn_container: {
    backgroundColor: colors.red,
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },

  status_container: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    justifyContent: "space-between",
    width: "85%",
  },
  status_txt: {
    fontWeight: "700",
    color: colors.dark_green,
    fontSize: 15,
    marginLeft: 30,
  },
  cancelled_txt: {
    color: colors.red,
  },
  noBookingText: {
    color: colors.dark_green,
    fontSize: 17,
    fontWeight: "700",
  },
});
