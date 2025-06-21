import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  Dimensions,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import Carousel from "react-native-reanimated-carousel";
import { colors } from "../../utils/constants";
import Icon from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import Tick from "react-native-vector-icons/FontAwesome";
import Icon1 from "react-native-vector-icons/FontAwesome6";
import moment from "moment";
import completeImg from "../../assets/Images/rideComplete.png";
import cancel from "../../assets/Images/rideCancel.png";
import OTPTextInput from "react-native-otp-textinput";

const BusBookings_details = ({ route }) => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const [details, setDetails] = useState(false);

  const { BookingDetails, vehicleimg } = route.params;
  const [otp, setOtp] = useState([]);

  useEffect(() => {
    const digits = String(BookingDetails.otpForAuto).split("");
    setOtp(digits);
  }, []);

  const OnRefresh = () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  return (
    <View style={styles.main_container}>
      {/* nav container */}
      <Pressable
        style={styles.nav_container}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrowleft" size={30} />
      </Pressable>
      {/* content container */}
      <View style={styles.content_container}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={OnRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.heading_txt}>Booking summary</Text>

          {/* more details about vehicle section */}
          {/* main details container */}
          <View style={styles.main_details_container}>
            <View style={{ alignItems: "center" }}>
              <Image source={vehicleimg} style={styles.img} />
            </View>
            {/*vehicle name image container */}
            <View style={styles.first_details_container}>
              {/* <View style={{ gap: 5,}}> */}
              <View>
                <Text style={styles.vehicle_name_txt}>
                  {BookingDetails?.vehicleDetails?.foundVehicle?.vehicleModel}
                </Text>
                <Text style={styles.seat_txt}>
                  {BookingDetails?.vehicleDetails?.foundVehicle?.numberOfSeats}{" "}
                  Seats
                </Text>
              </View>
              {(BookingDetails?.tripStatus === "completed" ||
                BookingDetails?.tripStatus === "cancelled") && (
                <View>
                  <Image
                    style={{
                      width: 80,
                      height: 80,
                      transform: [{ rotate: "-10deg" }],
                    }}
                    source={
                      BookingDetails?.tripStatus === "completed"
                        ? completeImg
                        : cancel
                    }
                  />
                </View>
              )}
              {/* </View> */}
            </View>
          </View>

          {/* Driver and vehicle details */}
          <View style={styles.fourth_details_container}>
            {/* first heading */}
            <Text style={styles.second_desc_heading}>Driver & Car details</Text>
            {/* details container */}
            <View style={styles.details_main_container}>
              {/* labels section */}
              <View style={styles.label_container}>
                {/* Owner Name */}
                <Text style={styles.label_txt}>Owner Name</Text>
                {/* Owner Phone */}
                <Text style={styles.label_txt}>Owner Phone</Text>
                {/* Vehicle Make */}
                <Text style={styles.label_txt}>Vehicle Make</Text>
                {/* Vehicle Model */}
                <Text style={styles.label_txt}>Vehicle Model</Text>
                {/* License Plate Number */}
                <Text style={styles.label_txt}>License Plate Number</Text>
                {/* vehicle Color */}
                {BookingDetails.vehicleDetails?.foundVehicle?.subCategory !==
                  "auto" && <Text style={styles.label_txt}>vehicle Color</Text>}
                {/* Number of Seats */}
                {BookingDetails.vehicleDetails?.foundVehicle?.subCategory !==
                  "auto" &&
                  BookingDetails.vehicleDetails?.foundVehicle?.subCategory !==
                    "truck" && (
                    <Text style={styles.label_txt}>Number of Seats</Text>
                  )}
                {/* Mileage */}
                {BookingDetails.vehicleDetails?.foundVehicle?.subCategory !==
                  "auto" && <Text style={styles.label_txt}>Mileage</Text>}

                {BookingDetails.vehicleDetails?.foundVehicle?.subCategory ===
                  "bus" && <Text style={styles.label_txt}>AC</Text>}

                {BookingDetails.vehicleDetails?.foundVehicle?.subCategory ===
                  "truck" && <Text style={styles.label_txt}>Tonnage </Text>}

                {BookingDetails.vehicleDetails?.foundVehicle?.subCategory ===
                  "truck" && <Text style={styles.label_txt}>Size </Text>}

                <Text style={styles.label_txt}>Fuel Type</Text>

                <Text style={styles.label_txt}>Price per Km</Text>

                <Text style={styles.label_txt}>Price per day</Text>
              </View>
              {/* information section */}
              {/* prettier-ignore */}
              <View style={styles.info_container}>
                {/* Owner Name */}
                <Text style={styles.info_txt}>-  {BookingDetails?.vehicleDetails?.vendorName}</Text>
                {/* Owner Phone */}
                <Text style={styles.info_txt}>-  {BookingDetails?.vehicleDetails?.vendorPhoneNumber}</Text>
                {/* Vehicle Make */}
                <Text style={styles.info_txt}>-  {BookingDetails.vehicleDetails?.foundVehicle?.vehicleMake}</Text>
                {/* Vehicle Model */}
                <Text style={styles.info_txt}>-  {BookingDetails.vehicleDetails?.foundVehicle?.vehicleModel}</Text>
                {/* License Plate Number */}
                <Text style={styles.info_txt}>-  {BookingDetails.vehicleDetails?.foundVehicle?.licensePlate}</Text>
                {/* vehicle Color */}
                {(BookingDetails.vehicleDetails?.foundVehicle?.subCategory !=='auto') &&(<Text style={styles.info_txt}>-  {BookingDetails.vehicleDetails?.foundVehicle?.vehicleColor}</Text>)}
                {/* Number of Seats */}
                {(BookingDetails.vehicleDetails?.foundVehicle?.subCategory !=='auto'&& BookingDetails.vehicleDetails?.foundVehicle?.subCategory !=='truck' ) &&(<Text style={styles.info_txt}>-  {BookingDetails.vehicleDetails?.foundVehicle?.numberOfSeats}</Text>)}
                {/* Mileage */}
                {(BookingDetails.vehicleDetails?.foundVehicle?.subCategory !=='auto') &&(<Text style={styles.info_txt}>-  {BookingDetails.vehicleDetails?.foundVehicle?.milage} Kmpl</Text> )}
                {BookingDetails.vehicleDetails?.foundVehicle?.subCategory ==='bus'&&<Text style={styles.info_txt}>-  {BookingDetails.vehicleDetails?.foundVehicle?.ac} </Text> }
                {BookingDetails.vehicleDetails?.foundVehicle?.subCategory  ==='truck'&&<Text style={styles.info_txt}>-  {BookingDetails.vehicleDetails?.foundVehicle?.ton} Kg </Text> }
                {BookingDetails.vehicleDetails?.foundVehicle?.subCategory  ==='truck'&&<Text style={styles.info_txt}>-  {BookingDetails.vehicleDetails?.foundVehicle?.size} </Text> }

                <Text style={styles.info_txt}>-  {BookingDetails.vehicleDetails?.foundVehicle?.fuelType} </Text> 



                <Text style={styles.info_txt}>-  {BookingDetails.vehicleDetails?.foundVehicle?.pricePerKm}</Text>

<Text style={styles.info_txt}>-  {BookingDetails.vehicleDetails?.foundVehicle?.pricePerDay}</Text>


              </View>
            </View>
            {/* boarding instruction */}
            {BookingDetails?.tripStatus !== "completed" ||
              (BookingDetails?.tripStatus !== "cancelled" && (
                <>
                  <Text style={styles.second_desc_heading}>Easy boarding</Text>
                  <View style={styles.instruction_main_container}>
                    <View style={styles.instruction_sub_container}>
                      <View style={styles.count}>
                        <Text style={styles.count_txt}>1</Text>
                      </View>
                      <Text>Driver will reach your pickup location</Text>
                    </View>
                    <View style={styles.instruction_sub_container}>
                      <View style={styles.count}>
                        <Text style={styles.count_txt}>2</Text>
                      </View>
                      <Text>Show your booking</Text>
                    </View>
                    <View style={styles.instruction_sub_container}>
                      <View style={styles.count}>
                        <Text style={styles.count_txt}>3</Text>
                      </View>
                      <Text>Sit back & enjoy your trip</Text>
                    </View>
                  </View>
                </>
              ))}
          </View>

          {BookingDetails.vehicleDetails?.foundVehicle?.subCategory ===
            "auto" &&
            BookingDetails?.tripStatus === "start" && (
              <View>
                <Text
                  style={[styles.second_desc_heading, { textAlign: "center" }]}
                >
                  Your OTP for ride
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 15,
                    justifyContent: "center",
                    marginTop: 10,
                  }}
                >
                  {otp.map((otps, index) => (
                    <Text key={index} style={styles.otpNumbers}>
                      {otps}
                    </Text>
                  ))}
                </View>
              </View>
            )}

          {/* booking information */}
          <View style={styles.booking_details_container}>
            {/* first heading */}
            <Text style={styles.second_desc_heading}>
              Booking & Price information
            </Text>
            {/* location container */}
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
                <Text style={styles.location_txt}>
                  {BookingDetails?.pickupLocation}
                </Text>
                <Text style={styles.location_txt}>
                  {BookingDetails?.dropLocation}
                </Text>
              </View>
            </View>
            {/* details container */}
            <View style={styles.details_main_container}>
              {/* labels section */}
              <View style={styles.label_container}>
                {/* booking date text */}
                <Text style={styles.booking_label_txt}>Booking Date</Text>
                {/* total km text */}
                <Text style={styles.booking_label_txt}>Total Km</Text>
                {/* cost per km text */}
                <Text style={styles.booking_label_txt}>Cost per Km</Text>

                <Text style={styles.booking_label_txt}>Cost per Day</Text>

                {/* total amount text*/}
                {BookingDetails?.vendorApprovedStatus === "approved" && (
                  <Text style={styles.booking_label_txt}>Total Amount</Text>
                )}

                {/* advance text */}
                {BookingDetails.vehicleDetails?.foundVehicle?.subCategory !==
                  "auto" && (
                  <Text style={styles.booking_label_txt}>Advance Paid</Text>
                )}
                {/* balance text */}
                {BookingDetails?.vendorApprovedStatus === "approved" && (
                  <Text style={styles.booking_label_txt}>Balance Amount</Text>
                )}
                {(BookingDetails?.customerCancelled ||
                  BookingDetails?.vendorCancelled) && (
                  <Text style={styles.booking_label_txt}>Cancelled By</Text>
                )}

                {(BookingDetails?.customerCancelled ||
                  BookingDetails?.vendorCancelled) && (
                  <Text style={styles.booking_label_txt}>Refund Status</Text>
                )}
              </View>
              {/* information section */}
              {/* prettier-ignore */}
              <View style={styles.info_container}>
                {/* total km text */}
                <Text style={styles.booking_info_txt}>-  {moment(BookingDetails?.pickupDate).format("MMM DD YYYY")}</Text> 
                  {/* total km text */}
                  <Text style={styles.booking_info_txt}>-  {parseInt(BookingDetails.totalKm).toFixed(2)} Km</Text>
                  {/* cost per km text */}
                  <Text style={styles.booking_info_txt}>-  ₹ {BookingDetails.vehicleDetails?.foundVehicle?.pricePerKm} </Text>
                  <Text style={styles.booking_info_txt}>-  ₹ {BookingDetails.vehicleDetails?.foundVehicle?.pricePerDay} </Text>

                  {/* total amount text*/}
                  { BookingDetails?.vendorApprovedStatus === 'approved' && <Text style={styles.booking_info_txt}>-  ₹ {BookingDetails.totalFare}</Text>}
                  {/* advance text */}
                  {BookingDetails.vehicleDetails?.foundVehicle?.subCategory !=='auto'&&<Text style={styles.booking_info_txt}>-  ₹ {BookingDetails.advanceAmount}</Text>}
                  {/* balance text */}
                  { BookingDetails?.vendorApprovedStatus === 'approved' && <Text style={styles.booking_info_txt}>-  ₹ {BookingDetails.remainingPayment}</Text>     }  
                  {(BookingDetails?.customerCancelled || BookingDetails?.vendorCancelled) &&  <Text style={styles.booking_info_txt}>-  {BookingDetails.customerCancelled?"Customer":BookingDetails.vendorCancelled?"Vendor":''}</Text>     } 
                  {(BookingDetails?.customerCancelled || BookingDetails?.vendorCancelled) &&  <Text style={styles.booking_info_txt}>-  {BookingDetails.advanceRefund? "Refund successfully":"Not Refunded"}</Text>     }             
            
           
                </View>
            </View>
          </View>
          {/* confirmation button */}
          {BookingDetails?.tripStatus === "start" &&
            BookingDetails?.tripStatus === "ongoing" && (
              <TouchableOpacity
                style={styles.confirm_btn_container}
                // onPress={() => navigation.navigate("CarBookingDetails")}
              >
                <Text style={styles.confirm_btn_txt}>Pay via UPI or Cash</Text>
              </TouchableOpacity>
            )}
        </ScrollView>
      </View>
    </View>
  );
};

export default BusBookings_details;

const styles = StyleSheet.create({
  main_container: {
    backgroundColor: colors.light_gray,
    flex: 1,
  },
  nav_container: {
    padding: 15,
    paddingTop: 40,
  },
  content_container: {
    backgroundColor: colors.white,
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  heading_txt: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    backgroundColor: colors.light_gray,
    padding: 8,
    color: colors.dark_green,
    borderRadius: 10,
  },
  Vehicle_heading_txt: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    backgroundColor: colors.dark_green,
    padding: 8,
    color: colors.white,
    borderRadius: 10,
    marginTop: 10,
  },

  //   vehicle details style
  main_details_container: {
    borderColor: colors.light_green,
    borderWidth: 0.7,
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
  },
  first_details_container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  img: {
    width: 220,
    height: 140,
    resizeMode: "contain",
  },
  vehicle_name_txt: {
    fontWeight: "500",
    fontSize: 20,
  },
  seat_txt: {
    fontWeight: "500",
    color: colors.dark_gray,
    fontSize: 16,
  },
  icon: {
    width: 15,
    height: 15,
  },
  desc_container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 10,
    paddingBottom: 9,
  },
  left_sec: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  desc_heading: {
    fontWeight: "500",
    fontSize: 16,
    paddingBottom: 10,
  },
  desc_txt: {
    fontSize: 13,
    textAlign: "left",
  },
  left_main_container: {
    gap: 8,
  },
  right_main_container: {
    gap: 8,
  },
  //   driver and vehicle details section
  fourth_details_container: {
    padding: 15,
    borderColor: colors.light_green,
    borderWidth: 0.7,
    marginTop: 20,
    borderRadius: 10,
  },
  //   booking detail container
  booking_details_container: {
    padding: 15,
    borderColor: colors.light_green,
    borderWidth: 0.7,
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: colors.very_light_green,
    marginBottom: 10,
  },
  booking_label_txt: {
    fontSize: 16,
    fontWeight: "600",
  },
  booking_info_txt: {
    fontSize: 16,
    fontWeight: "600",
  },
  details_container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  details_main_container: {
    display: "flex",
    flexDirection: "row",
    // justifyContent: "space-between",
    paddingRight: 10,
    // paddingVertical: 20,
    gap: 30,
    marginVertical: 10,
  },
  label_container: {
    gap: 7,
  },
  info_container: {
    gap: 7,
  },
  label_txt: {
    fontWeight: "500",
    fontSize: 13,
  },
  info_txt: {
    fontSize: 13,
  },
  //   location details container
  location_main_container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
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
    color: colors.black,
  },

  confirm_btn_container: {
    backgroundColor: colors.dark_green,
    padding: 10,
    marginBottom: 40,
    marginTop: 20,
    borderRadius: 5,
  },
  confirm_btn_txt: {
    color: colors.white,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  instruction_sub_container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    // paddingTop:10,
    gap: 10,
  },
  count: {
    backgroundColor: colors.light_green,
    width: 15,
    height: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  count_txt: {
    fontWeight: "600",
    color: colors.white,
    fontSize: 9,
  },
  instruction_main_container: {
    gap: 8,
    marginTop: 10,
  },
  instruction_heading: {
    fontWeight: "600",
    fontSize: 14,
    marginTop: 10,
  },
  instruction_txt: {
    fontSize: 12.5,
    fontWeight: "500",
    color: colors.dark_gray,
  },
  second_desc_heading: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },
  heading_btn_main_container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  heading_btn_container: {
    backgroundColor: colors.dark_green,
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  heading_btn_txt: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.white,
  },
  squareInput: {
    width: 40,
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    textAlign: "center", // Centers the text within each square
    fontSize: 18, // Adjust font size as needed
    marginHorizontal: 25, // Adjust this value to control the gap
    marginTop: 10,
    fontWeight: "700",
  },
  otpNumbers: {
    width: 40,
    backgroundColor: colors.light_gray,
    height: 40,

    borderRadius: 10,
    color: colors.black,
    fontWeight: "700",
    textAlign: "center",
    paddingTop: 8,
    fontSize: 18,
  },
});
