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
  ActivityIndicator,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import Carousel from "react-native-reanimated-carousel";
import { colors } from "../../utils/constants";
import Icon from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import Tick from "react-native-vector-icons/FontAwesome";
import Icon1 from "react-native-vector-icons/FontAwesome6";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AxiosService from "../../utils/AxiosService";
import Toast from "react-native-toast-message";
import Success_screen_modal from "../modals/Success_screen_modal";

const AutoDetails = ({ route }) => {
  const [activeIndex, setactiveIndex] = useState(0);
  const [images, setImages] = useState();
  const [customerId, setCustomerId] = useState("");
  const [loading, setLoading] = useState(false);
  const carouselRef = useRef();
  const width = Dimensions.get("window").width;
  const [ModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const {
    autoDetails,
    pickUpLocation,
    returnLocation,
    pickUpDate,
    totalKm,
    tripType,
  } = route.params;

  useEffect(() => {
    getcustomerData();
    const Imgs = autoDetails?.vehicleDetails.vehicleImages;
    setImages(Imgs);
  }, [route]);

  const getcustomerData = async () => {
    const cusId = await AsyncStorage.getItem("user");
    const details = JSON.parse(cusId);
    setCustomerId(details._id);
  };

  const handleBookAuto = async () => {

    try {
      setLoading(true);
      const res = await AxiosService.post("customer/bookcar", {
        customerId,
        vendorId: autoDetails?.vendorId,
        vehicleId: autoDetails?.vehicleDetails._id,
        pickupLocation: pickUpLocation,
        dropLocation: returnLocation,
        pickupDate: pickUpDate,
        // returnDate: returnDate,
        totalKm: totalKm,
        tripType: tripType,
        totalFare:totalAmount
      });

      if (res.status === 201) {
        setModalVisible(true);
        Toast.show({
          type: "success",
          text1: "Auto Booked successfully",
          text2: "Please wait for vendor response",
          position: "top",
        });

        // setTimeout(() => {
        //   navigation.navigate("My Bookings");
        // }, 3000);
      }
    } catch (error) {
      if (error.response) {
        Toast.show({
          type: "error",
          text1: error.response.data.message,
        });
      } else if (error.message) {
        Toast.show({
          type: "error",
          text1: error.message,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Something went wrong, please try again later",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    navigation.navigate("My Bookings");
  };

  const renderPagination = () => {
    return (
      <View style={styles.pagination}>
        {images?.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dot, activeIndex === index && styles.activeDot]}
            onPress={() => carouselRef.current.scrolltoindex(index)}
          />
        ))}
      </View>
    );
  };
  const totalAmount = (
    totalKm * autoDetails?.vehicleDetails?.pricePerKm
  ).toFixed(2);


  return (
    <View style={styles.main_container}>
      {/* nav container */}
      <Pressable
        style={styles.nav_container}
        onPress={() => navigation.navigate("Auto_main")}
      >
        <Icon name="arrowleft" size={30} />
      </Pressable>
      {/* content container */}
      <View style={styles.content_container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.heading_txt}>Auto Details</Text>
          {/* Vehicle carousel */}
          <View style={styles.carousel_container}>
            <Carousel
              ref={carouselRef}
              width={width}
              height={width / 2}
              data={images}
              renderItem={({ item }) => (
                <View style={styles.img_container}>
                  <Image source={{ uri: item }} style={styles.carousel_img} />
                </View>
              )}
              autoPlay
              scrollAnimationDuration={2000}
              snapEnabled
              onSnapToItem={(index) => setactiveIndex(index)}
            />
            {renderPagination()}
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
                <Text style={styles.label_txt}>Fuel Type</Text>

                <Text style={styles.label_txt}>Price per Km</Text>

                <Text style={styles.label_txt}>Price per day</Text>
                {/* vehicle Color */}
                {/* <Text style={styles.label_txt}>vehicle Color</Text> */}
                {/* Number of Seats */}
                {/* Mileage */}
              </View>
              {/* information section */}
              {/* prettier-ignore */}
              <View style={styles.info_container}>
                {/* Owner Name */}
                <Text style={styles.info_txt}>-  {autoDetails?.vendorName}</Text>
                {/* Owner Phone */}
                <Text style={styles.info_txt}>-   {autoDetails?.vendorPhoneNumber}</Text>
                {/* Vehicle Make */}
                <Text style={styles.info_txt}>-  {autoDetails.vehicleDetails.vehicleMake}</Text>
                {/* Vehicle Model */}
                <Text style={styles.info_txt}>-  {autoDetails?.vehicleDetails.vehicleModel}</Text>
                {/* License Plate Number */}
                <Text style={styles.info_txt}>-  {autoDetails?.vehicleDetails.licensePlate}</Text>
                <Text style={styles.info_txt}>-  {autoDetails?.vehicleDetails.fuelType}</Text>


                <Text style={styles.info_txt}>-  {autoDetails?.vehicleDetails.pricePerKm}</Text>

                <Text style={styles.info_txt}>-  {autoDetails?.vehicleDetails.pricePerDay}</Text>

                {/* vehicle Color */}
                {/* <Text style={styles.info_txt}>-  Yellow</Text> */}
                {/* Number of Seats */}
                {/* Mileage */}
              </View>
            </View>
            {/* boarding instruction */}
            <Text style={styles.second_desc_heading}>Easy boarding</Text>
            {/* instruction main container */}
            <View style={styles.instruction_main_container}>
              {/* instruction sub container */}
              {/* 1 */}
              <View style={styles.instruction_sub_container}>
                <View style={styles.count}>
                  <Text style={styles.count_txt}>1</Text>
                </View>
                <Text>Driver will reach your pickup location</Text>
              </View>
              {/* 2 */}
              <View style={styles.instruction_sub_container}>
                <View style={styles.count}>
                  <Text style={styles.count_txt}>2</Text>
                </View>
                <Text>Show your booking</Text>
              </View>
              {/* 3 */}
              <View style={styles.instruction_sub_container}>
                <View style={styles.count}>
                  <Text style={styles.count_txt}>3</Text>
                </View>
                <Text>Sit back & enjoy your trip</Text>
              </View>
            </View>
          </View>
          {/* location details container */}
          <View style={styles.fifth_details_container}>
            {/* pick up address container */}
            <View style={styles.location_sub_container}>
              {/* icon heading container */}
              <View style={styles.icon_heading_container}>
                <Icon1
                  name="location-crosshairs"
                  size={20}
                  color={colors.white}
                />
                <Text style={styles.location_heading}>Pickup Address</Text>
              </View>
              {/* city name */}
              {/* <Text style={styles.city_txt}>Chennai</Text> */}
              {/* address */}
              <Text style={styles.address_txt}>{pickUpLocation}</Text>
            </View>
            {/* icon */}
            <Icon
              name="arrowdown"
              size={25}
              color={colors.dark_green}
              style={{ textAlign: "center" }}
            />
            {/* return address container */}
            <View style={styles.location_sub_container}>
              {/* icon heading container */}
              <View style={styles.icon_heading_container}>
                <Icon1 name="map-pin" size={20} color={colors.white} />
                <Text style={styles.location_heading}>Drop Address</Text>
              </View>
              {/* city name */}
              {/* <Text style={styles.city_txt}>Chennai</Text> */}
              {/* address */}
              <Text style={styles.address_txt}>{returnLocation}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Text style={styles.second_desc_heading}>
                {" "}
                Total kilometers -
              </Text>
              <Text style={styles.second_desc_heading}> {totalKm}</Text>
            </View>
          </View>
          {/* Amount details container */}
          {/* <View style={styles.sixth_details_container}> */}
          {/* amount heading section */}
          {/* <View style={styles.amount_heading_container}>
              <Text style={styles.amount_heading_txt}>Advance amount</Text>
              <Text style={styles.price_heading_txt}>₹500</Text>
            </View> */}
          {/* base fare section */}
          {/* <View style={styles.base_fare_amount_container}>
              <Text style={styles.sub_heading_txt}>Base Fare</Text>
              <Text style={styles.sub_price_txt}>₹500</Text>
            </View> */}
          {/* bottom text */}
          {/* <Text style={styles.amount_btm_txt}>
              Pay the remaining payment following confirmation with the Owner.
            </Text>
          </View> */}
          {/* confirmation button */}
          <View style={{ flexDirection: "row", justifyContent: "center", backgroundColor: colors.light_gray, padding: 10, borderRadius: 5,marginTop:20 }}>
            <Text style={[styles.second_desc_heading,{color:colors.dark_green}]}>Total Amount -</Text>
            <Text style={[styles.second_desc_heading,{color:colors.dark_green}]}> ₹ {totalAmount}</Text>
          </View>

          <TouchableOpacity
            onPress={handleBookAuto}
            style={styles.confirm_btn_container}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.confirm_btn_txt}>Book a Ride</Text>
            )}
          </TouchableOpacity>
          <Success_screen_modal
            visible={ModalVisible}
            onclose={handleCloseModal}
          />
        </ScrollView>
      </View>
      <Toast />
    </View>
  );
};

export default AutoDetails;

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
  //   carousel style
  carousel_img: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    borderRadius: 10,
    borderColor: colors.light_green,
    borderWidth: 0.7,
  },
  img_container: {
    paddingHorizontal: 16,
    overflow: "hidden",
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: -15,
  },
  dot: {
    width: 6,
    height: 6,
    backgroundColor: colors.gray,
    marginHorizontal: 3,
    borderRadius: 100,
  },
  activeDot: {
    width: 12,
    height: 6,
    backgroundColor: colors.dark_green,
  },
  carousel_container: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    marginTop: 10,
  },
  //   vehicle details style
  main_details_container: {
    borderColor: colors.light_green,
    borderWidth: 0.7,
    padding: 10,
    borderRadius: 10,
    marginTop: 25,
    paddingLeft: 18,
  },
  first_details_container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  img: {
    width: 120,
    height: 80,
  },
  vehicle_name_txt: {
    fontWeight: "500",
    fontSize: 17,
  },
  seat_txt: {
    fontWeight: "500",
    color: colors.dark_gray,
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
  //   inclusion and exclution style
  second_details_container: {
    padding: 10,
    borderColor: colors.light_green,
    borderWidth: 0.7,
    marginTop: 20,
    borderRadius: 10,
    paddingLeft: 18,
  },
  second_desc_heading: {
    fontSize: 16,
    fontWeight: "600",
    borderBottomWidth: 1,
    borderBottomColor: colors.light_gray,
    paddingBottom: 7,
  },
  second_desc_sub_heading: {
    fontSize: 14,
    fontWeight: "500",
    paddingVertical: 8,
  },
  icon_txt_container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  second_details_sub_container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 10,
    marginBottom: 15,
  },
  points_txt: {
    fontSize: 13,
  },
  second_right_container: {
    gap: 7,
  },
  second_left_container: {
    gap: 7,
  },
  //   driver and vehicle details section
  fourth_details_container: {
    padding: 10,
    borderColor: colors.light_green,
    borderWidth: 0.7,
    marginTop: 20,
    borderRadius: 10,
    paddingLeft: 18,
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
    paddingVertical: 20,
    gap: 30,
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
  fifth_details_container: {
    padding: 10,
    borderColor: colors.light_green,
    borderWidth: 0.7,
    marginTop: 20,
    borderRadius: 10,
    gap: 10,
  },
  icon_heading_container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.dark_green,
    padding: 3,
    borderRadius: 3,
    justifyContent: "center",
  },
  location_sub_container: {
    borderColor: colors.light_green,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    gap: 10,
  },
  location_heading: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.white,
  },
  city_txt: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  address_txt: {
    borderColor: colors.gray,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    fontWeight: "600",
  },
  //   amount section style
  sixth_details_container: {
    padding: 10,
    borderColor: colors.light_green,
    borderWidth: 0.7,
    marginTop: 20,
    borderRadius: 10,
    gap: 10,
  },
  amount_heading_container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.light_gray,
    padding: 10,
    borderRadius: 5,
  },
  amount_heading_txt: {
    fontSize: 18,
    fontWeight: "700",
  },
  price_heading_txt: {
    fontSize: 18,
    fontWeight: "700",
  },
  base_fare_amount_container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  sub_heading_txt: {
    fontSize: 16,
    fontWeight: "500",
  },
  sub_price_txt: {
    fontSize: 16,
    fontWeight: "500",
  },
  amount_btm_txt: {
    textAlign: "center",
    fontSize: 11,
    paddingHorizontal: 5,
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
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  count_txt: {
    fontWeight: "600",
    color: colors.white,
  },
  instruction_main_container: {
    gap: 8,
    marginTop: 10,
  },
});
