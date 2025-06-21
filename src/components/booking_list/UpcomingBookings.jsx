import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  RefreshControl,
  Modal,
  TextInput,
  ActivityIndicator,
  ToastAndroid
} from "react-native";
import React, { useEffect, useState,useRef} from "react";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "../../utils/constants";
import Icon1 from "react-native-vector-icons/FontAwesome6";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { data } from "../../Data/UpcomingBookings";
import { useNavigation } from "@react-navigation/native";
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
import Icon from "react-native-vector-icons/AntDesign";
const UpcomingBookings = ({showToast }) => {
  const [bookingDetails, setBookingDetails] = useState([]);
  const navigation = useNavigation();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalshow, setmodalshow] = useState(false);
  const [customerCancelledReason, setCustomerCancelledReason] = useState("");
  const [cancellLoading, setCancelLoading] = useState(false);
  const [customerid, setcustomerId] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [reason, setReason] = useState("");

  const flatListRef = useRef(null);


  const toggleDetails = (index) => {
    setSelectedIndex(selectedIndex === index ? null : index);
  };

  useFocusEffect(
    React.useCallback(() => {
      GetBookings();
    }, [])
  );

  const toastConfig = {
    error: ({ text1 }) => (
      <View style={[styles.toastContainer, styles.errorToast]}>
        <Text style={styles.toastText}>{text1}</Text>
      </View>
    ),
  };

  const cancelBooking = async () => {
    try {
      setCancelLoading(true);
      const res = await AxiosService.post("customer/cancelBookingByCustomer", {
        customerId: customerid,
        bookingId,
        reason
      });
      console.log("res", res);

      if (res.status === 200) {
        ToastAndroid.show(res.data.message, ToastAndroid.SHORT,);
        setReason('')
        setmodalshow(false)
        GetBookings()
      }
    } catch (error) {
      if (error.response) {
        setmodalshow(false)
        setReason('')
        ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT,);
      } 
      else {
        ToastAndroid.show("Something went wront please try again later");
      }
    } finally {
      setCancelLoading(false);
    }
  };

  const RejectModelClose = () => {
    setBookingId("");
    setReason("")
    setmodalshow(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await GetBookings();
    setRefreshing(false);
  };

  const handleModelShow = (_id) => {
    setBookingId(_id);
    setmodalshow(true);
  };

  const GetBookings = async () => {
    try {
      setLoading(true);
      const getId = await AsyncStorage.getItem("user");
      const Id = JSON.parse(getId);
      const customerId = Id._id;
      setcustomerId(customerId);

      const res = await AxiosService.get(
        `customer/getBookingsByCustomerId/${customerId}`
      );
      const data = res.data.bookings;
      const filteredData = data?.filter(
        (item) =>
          (item.vendorApprovedStatus === "approved" ||
            item.vendorApprovedStatus === "pending") &&
          item.tripStatus !== "completed" &&
          item.tripStatus !== "cancelled"
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
    // main container
    <>
    <View style={{ paddingBottom: 30 }}>
      {/* {loading && (
   
)} */}
      {/* Auto */}
      {bookingDetails?.map((item, i) => {
        let vehicleimg;
        if (item?.vehicleDetails?.foundVehicle?.subCategory === "car") {
          vehicleimg = carImg;
        } else if (item?.vehicleDetails?.foundVehicle?.subCategory === "auto") {
          vehicleimg = autoImg;
        } else if (item?.vehicleDetails?.foundVehicle?.subCategory === "van") {
          vehicleimg = vanImg;
        } else if (item?.vehicleDetails?.foundVehicle?.subCategory === "bus") {
          vehicleimg = busImg;
        } else if (
          item?.vehicleDetails?.foundVehicle?.subCategory === "truck" &&
          item?.vehicleDetails?.foundVehicle?.goodsType === "Small"
        ) {
          vehicleimg = smallTruckImg;
        } else if (
          item?.vehicleDetails?.foundVehicle?.subCategory === "truck" &&
          item?.vehicleDetails?.foundVehicle?.goodsType === "Medium"
        ) {
          vehicleimg = mediumTruckImg;
        } else if (
          item?.vehicleDetails?.foundVehicle?.subCategory === "truck" &&
          item?.vehicleDetails?.foundVehicle?.goodsType === "Large"
        ) {
          vehicleimg = largeTruckImg;
        } else if (
          item?.vehicleDetails?.foundVehicle?.subCategory === "truck" &&
          item?.vehicleDetails?.foundVehicle?.goodsType === "XL"
        ) {
          vehicleimg = XLTruckImg;
        }

        console.log('ce',item.vehicleDetails.goodsType);
        
        return (
          <ScrollView
          ref={flatListRef}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            style={styles.main_container}
            key={i}
          >
            {/* content container */}
            <View style={styles.content_container}>
              {/* image container */}
              <View style={styles.img_container}>
                <Image source={vehicleimg} style={styles.img} />
              </View>
              {/* description container */}
              <View style={styles.desc_container}>
                {/* vehicle type */}
                <View style={styles.status_container}>
                  <Text style={styles.vehicle_type_txt}>
                    {item?.vehicleDetails?.foundVehicle?.subCategory
                      .charAt(0)
                      .toUpperCase() +
                      item?.vehicleDetails?.foundVehicle?.subCategory.slice(1)}
                  </Text>
                  <Text
                    style={[
                      styles.status_txt,
                      item.vendorApprovedStatus === "approved"
                        ? styles.status_txt
                        : styles.cancelled_txt,
                    ]}
                  >
                    {item.vendorApprovedStatus.charAt(0).toUpperCase() +
                      item.vendorApprovedStatus.slice(1)}
                  </Text>
                </View>
                {/* booking date */}
                <Text style={styles.date_txt}>
                  Booking ID: {String(item._id).slice(-5).toLocaleUpperCase()}
                </Text>
                <Text style={styles.date_txt}>
                  Booking date: {moment(item.pickupDate).format("MMM DD YYYY")}
                </Text>
                {/* fare */}
                <Text style={styles.fare_txt}>
                  Fare: {item.totalFare ? item.totalFare : "Vendor will update"}
                </Text>
                {item.vendorApprovedStatus === "approved" && (
                  <Text style={styles.fare_txt}>
                    Trip Status:{" "}
                    <Text
                      style={[
                        styles.fare_txt,
                        item.tripStatus === "start"
                          ? styles.start_trip_status_txt
                          : styles.ongoing_trip_status_txt,
                      ]}
                    >
                      {" "}
                      {item.tripStatus}{" "}
                    </Text>
                  </Text>
                )}
                {/* otp */}
                {/* <Text style={styles.fare_txt}>OTP: 7546</Text> */}
              </View>
            </View>
            {/* location details section */}
            <View style={styles.location_main_container}>
              {/* icon container*/}
              <View style={styles.icon_container}>
                <Icon1
                  name="location-crosshairs"
                  size={14}
                  color={colors.dark_green}
                />
                <Icon1 name="map-pin" size={14} color={colors.dark_green} />
              </View>
              {/* location text container */}
              <View style={styles.location_text_container}>
                <Text style={styles.location_txt}>{item.pickupLocation}</Text>
                <Text style={styles.location_txt}>{item.dropLocation}</Text>
              </View>
            </View>
            {/* trip details */}

            {/* button section */}
            <View style={styles.main_btn_container}>
              {/* cancell button */}
              <TouchableOpacity
              disabled={ item.tripStatus === "ongoing" ? true : false}
                onPress={() => handleModelShow(item._id)}
                style={[
                  styles.btn_contanier, 
                  item.tripStatus === "ongoing" && styles.disable_btn_contanier
                ]}
              >
                <Text style={styles.btn_txt}>Cancel Trip</Text>
              </TouchableOpacity>
              {/* view details button */}
              <TouchableOpacity
                style={styles.btn_contanier}
                // onPress={() => toggleDetails(i)}
                onPress={() =>
                  navigation.navigate("CarBookingDetails", {
                    BookingDetails: item,
                    vehicleimg: vehicleimg,
                  })
                }
              >
                <Text style={styles.btn_txt}>View More</Text>
              </TouchableOpacity>
              <Modal
                transparent={true}
                visible={modalshow}
                onRequestClose={() => setmodalshow(false)}
              >
                {/* modal background */}
                {/* <TouchableWithoutFeedback onPress={() => setmodalshow(false)}> */}
                <View style={styles.modal_background}>
                  {/* modal container */}
                  <View style={styles.modal_container}>
                    {/* image */}
                    <Image
                      source={require("../../assets/Images/modal.png")}
                      style={styles.modal_img}
                    />
                    <Text style={styles.reg_txt}>
                      Enter reason for cancellation
                    </Text>
                    {/* input field */}
                    <TextInput
                      value={reason}
                      onChangeText={setReason}
                      placeholder="Enter reason"
                      style={styles.modal_input_fireld}
                    />
                    <TouchableOpacity
                      onPress={cancelBooking}
                      style={styles.modal_ok_btn_container}
                    >
                      {cancellLoading ? (
                        <ActivityIndicator size="small" color={colors.white} />
                      ) : (
                        <Text style={styles.modal_ok_btn_txt}>Submit</Text>
                      )}
                    </TouchableOpacity>
                    {/* close icon */}
                    <TouchableOpacity
                      style={styles.close_icon}
                      onPress={RejectModelClose}
                    >
                      <Icon
                        name="closecircle"
                        size={20}
                        color={"rgba(0,0,0,0.40)"}
                      />
                    </TouchableOpacity>
                  </View>
                  <Toast/>
                </View>
                {/* </TouchableWithoutFeedback> */}
              </Modal>
            </View>
          </ScrollView>
        );
      })}
    </View>
    {/* <Toast config={toastConfig} /> */}
    </>
  );
};



export default UpcomingBookings;

const styles = StyleSheet.create({
  main_container: {
    borderColor: colors.gray,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 15,
  },
  //   vehicle image and details style
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
  // location container styles
  location_main_container: {
    borderTopColor: colors.gray,
    borderTopWidth: 1,
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingLeft: 10,
  },
  icon_container: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  location_text_container: {
    gap: 12,
  },
  location_txt: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.dark_gray,
  },
  //   button section style
  main_btn_container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.light_gray,
    padding: 7,
    borderRadius: 10,
    width: "100%",
  },
  btn_contanier: {
    backgroundColor: colors.white,
    padding: 7,
    width: wp(40),
    borderRadius: 5,
    alignItems: "center",
    borderColor: colors.light_green,
    borderWidth: 0.5,
  },
  disable_btn_contanier:{
    backgroundColor: colors.gray,
    padding: 7,
    width: wp(40),
    borderRadius: 5,
    alignItems: "center",
    borderColor: colors.gray,
    borderWidth: 0.5,
  },
  btn_txt: {
    fontWeight: "600",
    color: colors.dark_green,
  },
  //   details section style
  details_main_container: {
    borderTopColor: colors.gray,
    borderTopWidth: 1,
    padding: 10,
    gap: 15,
    marginBottom: 10,
  },
  heading_txt: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 5,
  },
  info_main_container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  info_container: {
    gap: 3,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.dark_gray,
  },
  label_sub_txt: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.black,
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
  start_trip_status_txt: {
    color: colors.dark_green,
  },
  ongoing_trip_status_txt: {
    color: colors.red,
  },
  modal_container: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: colors.white,
    width: wp(80),
    paddingVertical: 20,
    gap: 10,
    borderRadius: 15,
    position: "relative",
    padding: 15,
  },
  modal_background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modal_img: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    alignSelf: "center",
  },
  reg_txt: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 15,
  },
  modal_input_fireld: {
    backgroundColor: colors.very_light_gray,
    height: 40,
    padding: 10,
    borderRadius: 10,
    borderColor: colors.gray,
    borderWidth: 1,
    marginBottom: 5,
  },
  modal_ok_btn_container: {
    backgroundColor: colors.dark_green,
    width: "100%",
    height: 35,
    borderRadius: 6,
  },
  modal_ok_btn_txt: {
    color: colors.white,
    textAlign: "center",
    fontSize: 17,
    // padding: 5,
    height: 30,
    marginTop: 5,
    fontWeight: "700",
  },
  close_icon: {
    position: "absolute",
    top: 7,
    right: 7,
  },
  toastContainer: {
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // position:"absolute",
    // bottom:30
  },
  errorToast: {
    backgroundColor: '#000', // Black background
  },
  toastText: {
    color: '#fff',
    fontSize: 16,
  },
});

// [
//   {
//     __v: 0,
//     _id: "67286446236bac78951dc790",
//     adminCancelled: false,
//     adminCommissionAmount: 90,
//     advanceAmount: 500,
//     advanceRefund: false,
//     bookedAt: "2024-11-04T06:05:58.075Z",
//     customer: {
//       customerAddress: "Chennai  , vadapalani ",
//       customerEmail: "aattravels5@gmail.com",
//       customerId: "66ed3bf5a2b3661ba1768fbc",
//       customerName: "Raj",
//       customerPhoneNumber: 9834344345,
//     },
//     customerCancelled: false,
//     dropLocation: "Gy",
//     pickupDate: "2024-11-05T06:05:00.000Z",
//     pickupLocation: "Uu",
//     remainingPayment: 2500,
//     returnDate: "2024-11-06T06:05:00.000Z",
//     totalFare: 3150,
//     totalKm: "50",
//     tripStatus: "start",
//     vehicleDetails: {
//       foundVehicle: [Object],
//       vendorAddress: "chennai,vadapalani",
//       vendorEmail: "dlktechnologiesreact@gmail.com",
//       vendorId: "67067e34025cb91f0132e3b9",
//       vendorName: "vijayaraj M",
//       vendorPhoneNumber: 6384084510,
//     },
//     vendorApprovedStatus: "pending",
//     vendorCancelled: false,
//     vendorTotalPayment: 2910,
//   },
// ];









// {"__v": 0, "_id": "679b1b89c0561003bccf0c0d", "adminCancelled": false, "adminCommissionAmount": 36, "advanceRefund": false, "bookedAt": "2025-01-30T06:26:17.910Z", "customer": {"customerAddress": "Chennai.", "customerEmail": "customer@gmail.com", "customerId": "6740845069d605d5ef3ef3a7", "customerName": "Customer", "customerPhoneNumber": 8521456481}, "customerCancelled": true, "customerCancelledReason": "N000", "dropLocation": "Chennai, Tamil Nadu, India", "otpForAuto": 4318, "penaltyAmount": 0, "pickupDate": "2025-03-02T06:25:19.000Z", "pickupLocation": "Door No : 66 Ground, Raahat Plaza, Arcot Rd, opp. Vijaya Hospital, Ottagapalayam, Kannika Puram, Vadapalani, Chennai, Tamil Nadu 600026, India", "remainingPayment": 600, "totalFare": 600, "totalKm": "10.322", "totalTripFare": 600, "tripStatus": "yet to start", "vehicleDetails": {"foundVehicle": {"_id": "679b065fc0561003bccee92f", "adminCommissionPercentage": 6, "categoryType": "Passengers", "createdAt": "2025-01-30T04:55:59.759Z", "fuelType": "Petrol", "licensePlate": "TN 09 TH 6654", "ownerAdharCard": [Array], "ownerDrivingLicense": [Array], "ownerImage": [Array], "pricePerDay": "2500", "pricePerKm": "60", "registerAmount": 2000, "registerAmountRefund": false, "subCategory": "auto", "vehicleApprovedByAdmin": "approved", "vehicleAvailable": "no", "vehicleImages": [Array], "vehicleInsurance": [Array], "vehicleMake": "2019", "vehicleModel": "Bajaj", "vehicleRC": [Array]}, "vendorAddress": "Chennai", "vendorEmail": "vendor@gmail.com", "vendorId": "67409d8aa0a0dbb69b7cf800", "vendorName": "Vendor", "vendorPhoneNumber": 6332384545}, "vendorApprovedStatus": "pending", "vendorCancelled": false, "vendorTotalPayment": 564}

 