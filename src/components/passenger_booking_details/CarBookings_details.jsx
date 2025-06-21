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
  Linking,
  ActivityIndicator,
  ToastAndroid
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import Carousel from "react-native-reanimated-carousel";
import { colors } from "../../utils/constants";
import Icon from "react-native-vector-icons/AntDesign";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Tick from "react-native-vector-icons/FontAwesome";
import Icon1 from "react-native-vector-icons/FontAwesome6";
import moment from "moment";
import completeImg from "../../assets/Images/rideComplete.png";
import cancel from "../../assets/Images/rideCancel.png";
import OTPTextInput from "react-native-otp-textinput";
import MapView, { Marker } from "react-native-maps";
import checkIcon from "../../assets/Images/check.png";
import MapViewDirections from "react-native-maps-directions";
import profrile from "../../assets/Images/pro-pic.png";
import carImg from "../../assets/Images/car_view.png";
import autoImg from "../../assets/Images/auto.png";
import vanImg from "../../assets/Images/van_view.png";
import busImg from "../../assets/Images/bus_view.png";
import truckImg from "../../assets/Images/truck_view.png";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { MAP_API_KEY } from "@env";
import axios from "axios";
import AxiosService from "../../utils/AxiosService";
import origin_flag from '../../assets/Images/origin_fag.png'
import destination_flag from '../../assets/Images/destination_Flag.png'
import Toast from "react-native-toast-message";

const CarBookings_details = ({ route }) => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [pickupCoordinates, setPickupCoordinates] = useState(null);
  const [dropCoordinates, setDropCoordinates] = useState(null);
  const [vendorCoordinates, setVendorCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);

  const [details, setDetails] = useState(false);

  const { BookingDetails, vehicleimg } = route.params;
  const [otp, setOtp] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      handleSetLocations();
    }, [BookingDetails])
  );

  const fetchvendorLocation = async () => {
    try {
      const res = await AxiosService.post("vendor/getVendorById", {
        vendorId: BookingDetails?.vehicleDetails?.vendorId,
      });
      const vendorData = res.data.user;
      setVendorCoordinates({
        latitude: vendorData.latitude,
        longitude: vendorData.longitude,
      });
    } catch (error) {
      console.error("Error fetching bike rider location:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchvendorLocation, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Safely handle OTP initialization
    let otpValue = [];
  
    if (BookingDetails?.otpForAuto) {
      const otpString = String(BookingDetails.otpForAuto);
      otpValue = otpString.split("");
    } 
    else if (BookingDetails?.otpForCar) {
      const otpString = String(BookingDetails.otpForCar);
      otpValue = otpString.split("");
    }
  
    setOtp(otpValue);
  }, [BookingDetails]);

  const bottomSheetModalRef = useRef(null);

  React.useEffect(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const OnRefresh = () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  const openGoogleMaps = () => {
    if (pickupCoordinates && dropCoordinates) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${pickupCoordinates.latitude},${pickupCoordinates.longitude}&destination=${dropCoordinates.latitude},${dropCoordinates.longitude}&travelmode=driving`;
      Linking.openURL(url).catch((err) =>
        console.error("Failed to open URL:", err)
      );
    }
  };

  const geocodeAddress = async (address) => {
    const apiKey = MAP_API_KEY;
    const baseUrl = "https://maps.googleapis.com/maps/api/geocode/json";

    try {
      const response = await axios.get(baseUrl, {
        params: {
          address: address,
          key: apiKey,
        },
      });

      if (response.data.status === "OK") {
        return response.data.results[0].geometry.location;
      } else {
        console.error("Geocoding API Error:", response.data.status);
        return null;
      }
    } catch (error) {
      console.error("Error fetching geocoding data:", error.message);
      return null;
    }
  };

  const handleSetLocations = async () => {
    // Convert addresses to coordinates
    const pickupLocation = await geocodeAddress(BookingDetails?.pickupLocation);
    const dropLocation = await geocodeAddress(BookingDetails?.dropLocation);

    // Update state with the geocoded coordinates
    if (pickupLocation) {
      setPickupCoordinates({
        latitude: pickupLocation.lat,
        longitude: pickupLocation.lng,
      });
    }
    if (dropLocation) {
      setDropCoordinates({
        latitude: dropLocation.lat,
        longitude: dropLocation.lng,
      });
    }
  };

  const handlePaymentComplete = async () => {
    setLoading(true);
    try {
      const res = await AxiosService.post("customer/CustomerPayedOnline", {
        bookingId: BookingDetails._id,
      });

      if (res.data.success) {
        Toast.show({
          type: "success",
          text1: res.data.message,
        });

        setTimeout(() => {
          navigation.navigate("My Bookings");
        }, 2000);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || "Payment failed",
      });
    } finally {
      setLoading(false);
    }
  };

  let vehicleIcon = "";

  if (BookingDetails?.vehicleDetails.foundVehicle.subCategory === "car") {
    vehicleIcon = carImg;
  } else if (
    BookingDetails?.vehicleDetails.foundVehicle.subCategory === "van"
  ) {
    vehicleIcon = vanImg;
  } else if (
    BookingDetails?.vehicleDetails.foundVehicle.subCategory === "auto"
  ) {
    vehicleIcon = autoImg;
  } else if (
    BookingDetails?.vehicleDetails.foundVehicle.subCategory === "bus"
  ) {
    vehicleIcon = busImg;
  } else if (
    BookingDetails?.vehicleDetails.foundVehicle.subCategory === "truck"
  ) {
    vehicleIcon = truckImg;
  }

  return (
    <View style={styles.main_container}>
      <MapView
        showsMyLocationButton
        style={styles.map}
        initialRegion={{
          latitude: 12.8718,
          longitude: 80.2195,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        region={
          pickupCoordinates || dropCoordinates
            ? {
                latitude:
                  pickupCoordinates?.latitude || dropCoordinates.latitude,
                longitude:
                  pickupCoordinates?.longitude || dropCoordinates.longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }
            : undefined
        }
      >
        {pickupCoordinates && (
          <Marker
            coordinate={pickupCoordinates}
            title="Pickup Location"
            onPress={openGoogleMaps}
          >
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Image source={origin_flag} style={{ width: 35, height: 35 }} alt="loc" />
            </View>
          </Marker>
        )}
        {dropCoordinates && (
          <Marker
            coordinate={dropCoordinates}
            title="Drop Location"
            onPress={openGoogleMaps}
          >
            <Image source={destination_flag} style={{ width: 35, height: 35 }} alt="loc" />
          </Marker>
        )}
        {vendorCoordinates &&
          vendorCoordinates.latitude &&
          vendorCoordinates.longitude &&
          BookingDetails.vendorApprovedStatus === "approved" &&
          BookingDetails?.tripStatus === "start" && (
            <Marker coordinate={vendorCoordinates} title="Bike Rider Location">
              <Image
                source={vehicleIcon}
                style={{ width: 25, height: 25 }}
                alt="vehicle"
              />
            </Marker>
          )}
        <MapViewDirections
          origin={pickupCoordinates}
          destination={dropCoordinates}
          apikey={MAP_API_KEY}
          strokeWidth={2}
          strokeColor="black"
        />

        {vendorCoordinates &&
          vendorCoordinates.latitude &&
          vendorCoordinates.longitude &&
          BookingDetails.vendorApprovedStatus === "approved" &&
          BookingDetails?.tripStatus === "start" && (
            <MapViewDirections
              origin={vendorCoordinates}
              destination={pickupCoordinates}
              apikey={MAP_API_KEY}
              strokeWidth={2}
              strokeColor="green"
            />
          )}
      </MapView>
      <Icon
        onPress={() => navigation.goBack()}
        style={styles.nav_container}
        name="arrowleft"
        size={30}
      />

      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={["75%", "50%"]}
          enablePanDownToClose={false}
        >
          <BottomSheetView style={styles.content_container}>
            <View style={styles.confirm_ride_con}>
              <Image
                style={{ width: 18, height: 18, marginBottom: 15 }}
                source={checkIcon}
                alt="check"
              />
              <Text style={styles.second_desc_heading}>
                Your ride is confirmed
              </Text>
            </View>

            <ScrollView
              style={{ paddingHorizontal: 10 }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={OnRefresh} />
              }
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.fourth_details_container}>
                <View style={{ width: "60%" }}>
                  <Text style={styles.label_txt}>
                    {BookingDetails.vehicleDetails?.foundVehicle?.licensePlate}
                  </Text>
                  <Text style={styles.info_txt}>
                    {BookingDetails.vehicleDetails?.foundVehicle?.vehicleModel}
                  </Text>
                  <Text style={styles.info_txt}>
                    {BookingDetails?.vehicleDetails?.vendorName}
                  </Text>
                  <Text style={styles.info_txt}>
                    {BookingDetails?.vehicleDetails?.vendorPhoneNumber}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {Array.isArray(
                    BookingDetails.vehicleDetails?.foundVehicle?.ownerImage
                  ) &&
                    BookingDetails.vehicleDetails.foundVehicle.ownerImage.map(
                      (e, index) => (
                        <Image
                          key={index}
                          style={{ width: 70, height: 70, borderRadius: 50 }}
                          source={e ? { uri: e } : profrile}
                        />
                      )
                    )}
                  <Image
                    style={{ width: 70, height: 70, borderRadius: 50 }}
                    source={vehicleimg}
                  />
                </View>
              </View>

              {BookingDetails.tripType === "One Day Trip" &&
                BookingDetails?.tripStatus === "start" &&
                otp.length > 0 && ( // Only show OTP if it exists
                  <View>
                    <Text
                      style={[
                        styles.second_desc_heading,
                        { textAlign: "center", marginBottom: 0, marginTop: 15 },
                      ]}
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

              <View style={styles.booking_details_container}>
                <Text style={styles.second_desc_heading}>
                  Booking & Price information
                </Text>
                <View style={styles.location_main_container}>
                  <View style={styles.icon_container}>
                    <Icon1
                      name="location-crosshairs"
                      size={14}
                      color={colors.dark_green}
                    />
                    <Text style={styles.location_txt}>
                      {BookingDetails?.pickupLocation}
                    </Text>
                  </View>
                  <View style={[styles.icon_container, { marginLeft: 3 }]}>
                    <Icon1 name="map-pin" size={14} color={colors.dark_green} />
                    <Text style={styles.location_txt}>
                      {BookingDetails?.dropLocation}
                    </Text>
                  </View>
                </View>
                <View style={styles.details_main_container}>
                  <View style={styles.label_container}>
                    <Text style={styles.booking_label_txt}>Booking Date</Text>
                    <Text style={styles.booking_label_txt}>Total Km</Text>
                    <Text style={styles.booking_label_txt}>Cost per Km</Text>
                    <Text style={styles.booking_label_txt}>Cost per Day</Text>
                    {BookingDetails?.vendorApprovedStatus === "approved" && (
                      <Text style={styles.booking_label_txt}>Total Amount</Text>
                    )}
                    {BookingDetails?.tripType === "One Day Trip" &&
                      BookingDetails?.vendorApprovedStatus === "pending" && (
                        <Text style={styles.booking_label_txt}>Total Amount</Text>
                      )}
                    {BookingDetails.vehicleDetails?.foundVehicle?.subCategory !==
                      "auto" && (
                      <Text style={styles.booking_label_txt}>Advance Paid</Text>
                    )}
                    {BookingDetails?.vendorApprovedStatus === "approved" && (
                      <Text style={styles.booking_label_txt}>
                        Balance Amount
                      </Text>
                    )}
                    {(BookingDetails?.customerCancelled ||
                      BookingDetails?.vendorCancelled) && (
                      <Text style={styles.booking_label_txt}>Cancelled By</Text>
                    )}
                    {(BookingDetails?.customerCancelled ||
                      BookingDetails?.vendorCancelled) && (
                      <Text style={styles.booking_label_txt}>
                        Refund Status
                      </Text>
                    )}
                  </View>
                  <View style={styles.info_container}>
                    <Text style={styles.booking_info_txt}>
                      - {moment(BookingDetails?.pickupDate).format("MMM DD YYYY")}
                    </Text>
                    <Text style={styles.booking_info_txt}>
                      - {parseInt(BookingDetails.totalKm).toFixed(2)} Km
                    </Text>
                    <Text style={styles.booking_info_txt}>
                      - ₹ {BookingDetails.vehicleDetails?.foundVehicle?.pricePerKm}
                    </Text>
                    <Text style={styles.booking_info_txt}>
                      - ₹ {BookingDetails.vehicleDetails?.foundVehicle?.pricePerDay}
                    </Text>
                    {BookingDetails?.vendorApprovedStatus === "approved" && (
                      <Text style={styles.booking_info_txt}>
                        - ₹ {BookingDetails.totalFare}
                      </Text>
                    )}
                    {BookingDetails?.tripType === "One Day Trip" &&
                      BookingDetails?.vendorApprovedStatus === "pending" && (
                        <Text style={styles.booking_info_txt}>
                          - ₹ {BookingDetails.totalFare}
                        </Text>
                      )}
                    {BookingDetails.vehicleDetails?.foundVehicle?.subCategory !==
                      "auto" && (
                      <Text style={styles.booking_info_txt}>
                        - ₹ {BookingDetails.advanceAmount}
                      </Text>
                    )}
                    {BookingDetails?.vendorApprovedStatus === "approved" && (
                      <Text style={styles.booking_info_txt}>
                        - ₹ {BookingDetails.remainingPayment}
                      </Text>
                    )}
                    {(BookingDetails?.customerCancelled ||
                      BookingDetails?.vendorCancelled) && (
                      <Text style={styles.booking_info_txt}>
                        -{" "}
                        {BookingDetails.customerCancelled
                          ? "Customer"
                          : BookingDetails.vendorCancelled
                          ? "Vendor"
                          : ""}
                      </Text>
                    )}
                    {(BookingDetails?.customerCancelled ||
                      BookingDetails?.vendorCancelled) && (
                      <Text style={styles.booking_info_txt}>
                        - {BookingDetails.advanceRefund ? "Refund successfully" : "Not Refunded"}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
              {(BookingDetails.customerPayedOnline === false &&
                (BookingDetails?.tripStatus === "start" ||
                  BookingDetails?.tripStatus === "ongoing")) && (
                <TouchableOpacity
                  onPress={handlePaymentComplete}
                  style={styles.confirm_btn_container}
                >
                  <Text style={styles.confirm_btn_txt}>
                    {loading ? (
                      <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                      "Pay now"
                    )}
                  </Text>
                </TouchableOpacity>
              )}
              {BookingDetails.customerPayedOnline && (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 5,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "700",
                      fontSize: 18,
                      color: colors.dark_green,
                      textAlign: "center",
                    }}
                  >
                    Payment Successful!
                  </Text>
                  <Image
                    style={{ width: 15, height: 15 }}
                    source={require("../../assets/Images/check.png")}
                  />
                </View>
              )}
            </ScrollView>
          </BottomSheetView>
          <Toast />
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </View>
  );
};

export default CarBookings_details;

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
  nav_container: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
  },
  map: {
    flex: 1,
  },
  content_container: {
    backgroundColor: colors.white,
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
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
  fourth_details_container: {
    padding: 10,
    borderColor: colors.light_green,
    borderWidth: 0.7,
    marginTop: 20,
    borderRadius: 10,
    flexDirection: "row",
  },
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
    fontWeight: "700",
    fontSize: 16,
  },
  info_txt: {
    fontWeight: "700",
    fontSize: 14,
    marginTop: 5,
    color: colors.dark_gray,
  },
  location_main_container: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    paddingVertical: 10,
  },
  icon_container: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  location_text_container: {
    gap: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    height: 40,
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
    marginBottom: 15,
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
    textAlign: "center",
    fontSize: 18,
    marginHorizontal: 25,
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
  confirm_ride_con: {
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    alignItems: "flex-end",
    alignContent: "center",
    borderBottomColor: colors.light_gray,
    borderBottomWidth: 1,
  },
});