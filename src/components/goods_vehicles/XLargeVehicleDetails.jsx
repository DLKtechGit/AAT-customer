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
} from "react-native";
import React, { useState, useRef } from "react";
import Carousel from "react-native-reanimated-carousel";
import { colors } from "../../utils/constants";
import Icon from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import Tick from "react-native-vector-icons/FontAwesome";
import Icon1 from "react-native-vector-icons/FontAwesome6";

const XLargeVehicleDetails = () => {
  const [activeIndex, setactiveIndex] = useState(0);
  const carouselRef = useRef();
  const width = Dimensions.get("window").width;
  const navigation = useNavigation();

  const images = [
    { image: require("../../assets/Images/XL-truck.png") },
    { image: require("../../assets/Images/XL-truck.png") },
    { image: require("../../assets/Images/XL-truck.png") },
    { image: require("../../assets/Images/XL-truck.png") },
    { image: require("../../assets/Images/XL-truck.png") },
  ];
  //   pagination
  const renderPagination = () => {
    return (
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dot, activeIndex === index && styles.activeDot]}
            onPress={() => carouselRef.current.scrolltoindex(index)}
          />
        ))}
      </View>
    );
  };
  return (
    <View style={styles.main_container}>
      {/* nav container */}
      <Pressable
        style={styles.nav_container}
        onPress={() => navigation.navigate("XL_main")}
      >
        <Icon name="arrowleft" size={30} />
      </Pressable>
      {/* content container */}
      <View style={styles.content_container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.heading_txt}>Vehicle Details</Text>
          {/* Vehicle carousel */}
          <View style={styles.carousel_container}>
            <Carousel
              ref={carouselRef}
              width={width}
              height={width / 2}
              data={images}
              renderItem={({ item }) => (
                <View style={styles.img_container}>
                  <Image source={item.image} style={styles.carousel_img} />
                </View>
              )}
              autoPlay
              scrollAnimationDuration={2000}
              snapEnabled
              onSnapToItem={(index) => setactiveIndex(index)}
            />
            {renderPagination()}
          </View>
          {/* more details about vehicle section */}
          {/* main details container */}
          <View style={styles.main_details_container}>
            {/*vehicle name image container */}
            <View style={styles.first_details_container}>
              <View style={{ gap: 5 }}>
                <Text style={styles.vehicle_name_txt}>Eicher</Text>
                <Text style={styles.seat_txt}>Ton {""} : 2500 kg</Text>
                <Text style={styles.seat_txt}>Size : 9ft × 5½ft × 6½ft</Text>
              </View>
              <View>
                <Image
                  source={require("../../assets/Images/XL-truck.png")}
                  style={styles.img}
                />
              </View>
            </View>
            {/* more details */}
            <View>
              {/* <Text style={styles.desc_heading}>Spacious Auto</Text> */}
              {/* icon and details container */}
              <View style={styles.desc_container}>
                {/* left section */}
                <View style={styles.left_main_container}>
                  {/* 1 */}
                  <View style={styles.left_sec}>
                    {/* icon */}
                    <Image
                      source={require("../../assets/Images/money.png")}
                      style={styles.icon}
                    />
                    {/* txt */}
                    <Text style={styles.desc_txt}>Extra km fare</Text>
                  </View>
                  {/* 2 */}
                  <View style={styles.left_sec}>
                    {/* icon */}
                    <Image
                      source={require("../../assets/Images/fuel.png")}
                      style={styles.icon}
                    />
                    {/* txt */}
                    <Text style={styles.desc_txt}>Fuel Type</Text>
                  </View>
                  {/* 3 */}
                  <View style={styles.left_sec}>
                    {/* icon */}
                    <Image
                      source={require("../../assets/Images/clock.png")}
                      style={styles.icon}
                    />
                    {/* txt */}
                    <Text style={styles.desc_txt}>Cancellation</Text>
                  </View>
                </View>
                <View style={styles.right_main_container}>
                  <Text style={styles.desc_txt}>- Based on Kms</Text>
                  <Text style={styles.desc_txt}>- Diesel</Text>
                  <Text style={styles.desc_txt}>
                    - Free cancelation 2 per month
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {/* inclusion and exclution section */}
          {/* <View style={styles.second_details_container}> */}
          {/* first heading */}
          {/* <Text style={styles.second_desc_heading}>
                  Inclusions & exclusions
                </Text> */}
          {/* sub heading */}
          {/* <Text style={styles.second_desc_sub_heading}>
                  Included in your fare
                </Text> */}
          {/* second details sub container */}
          {/* <View style={styles.second_details_sub_container}> */}
          {/* left main container */}
          {/* <View style={styles.second_left_container}>
                    <View style={styles.icon_txt_container}>
                      <Tick name="check" size={16} color={colors.dark_green} />
                      <Text style={styles.points_txt}>57 Kms</Text>
                    </View> */}
          {/* 2 */}
          {/* <View style={styles.icon_txt_container}>
                      <Tick name="check" size={16} color={colors.dark_green} />
                      <Text style={styles.points_txt}>State Taxes</Text>
                    </View> */}
          {/* 3 */}
          {/* <View style={styles.icon_txt_container}>
                      <Tick name="check" size={16} color={colors.dark_green} />
                      <Text style={styles.points_txt}>Driver fare</Text>
                    </View>
                  </View> */}
          {/* right main container */}
          {/* <View style={styles.second_right_container}> */}
          {/* 1 */}
          {/* <View style={styles.icon_txt_container}>
                      <Tick name="check" size={16} color={colors.dark_green} />
                      <Text style={styles.points_txt}>
                        Only One Pickup and Drop
                      </Text>
                    </View> */}
          {/* 2 */}
          {/* <View style={styles.icon_txt_container}>
                      <Tick name="check" size={16} color={colors.dark_green} />
                      <Text style={styles.points_txt}>Toll Charges</Text>
                    </View> */}
          {/* 3 */}
          {/* <View style={styles.icon_txt_container}>
                      <Tick name="check" size={16} color={colors.dark_green} />
                      <Text style={styles.points_txt}>Parking Charges</Text>
                    </View> */}
          {/* </View> */}
          {/* </View> */}
          {/* sub heading */}
          {/* <Text style={styles.second_desc_sub_heading}>
                  Extra charges (based on your usage)
                </Text>
              </View> */}
          {/* Driver and vehicle details */}
          <View style={styles.fourth_details_container}>
            {/* first heading */}
            <Text style={styles.second_desc_heading}>
              Driver & Vehicle details
            </Text>
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
                <Text style={styles.label_txt}>vehicle Color</Text>
                {/* vehicle size */}
                <Text style={styles.label_txt}>vehicle Size</Text>
                {/* Ton detail */}
                <Text style={styles.label_txt}>Ton</Text>
                {/* Mileage */}
                <Text style={styles.label_txt}>Mileage</Text>
              </View>
              {/* information section */}
              {/* prettier-ignore */}
              <View style={styles.info_container}>
                    {/* Owner Name */}
                    <Text style={styles.info_txt}>-  Tommy shelby</Text>
                    {/* Owner Phone */}
                    <Text style={styles.info_txt}>-  9876543210</Text>
                    {/* Vehicle Make */}
                    <Text style={styles.info_txt}>-  India</Text>
                    {/* Vehicle Model */}
                    <Text style={styles.info_txt}>-  2021</Text>
                    {/* License Plate Number */}
                    <Text style={styles.info_txt}>-  TN 05 AA 1234</Text>
                    {/* vehicle Color */}
                    <Text style={styles.info_txt}>-  Yellow</Text>
                    {/* vehicle Size */}
                    <Text style={styles.info_txt}>-  9ft × 5½ft × 6½ft</Text>
                    {/* Ton detail */}
                    <Text style={styles.info_txt}>-  2500 kg</Text>
                    {/* Mileage */}
                    <Text style={styles.info_txt}>-  20 kmpl</Text>
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
                <Text>Just load your goods</Text>
              </View>
              {/* 3 */}
              <View style={styles.instruction_sub_container}>
                <View style={styles.count}>
                  <Text style={styles.count_txt}>3</Text>
                </View>
                <Text>Sit back & relax</Text>
              </View>
            </View>
          </View>
          {/* Booking details container */}
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
                <Text style={styles.location_heading}>Pick-up Address</Text>
              </View>
              {/* city name */}
              <Text style={styles.city_txt}>Chennai</Text>
              {/* address */}
              <Text style={styles.address_txt}>Adyar</Text>
            </View>
            {/* icon */}
            <Icon
              name="arrowdown"
              size={18}
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
              <Text style={styles.city_txt}>Andhra pradesh</Text>
              {/* address */}
              <Text style={styles.address_txt}>Kadappa</Text>
            </View>
            {/* receiver details section */}
            <View style={styles.receiver_details_container}>
              <Text style={styles.receiver_details_heading_txt}>
                Receiver details
              </Text>
              {/* receiver info */}
              <View style={styles.receiver_info_main_container}>
                <View style={styles.receiver_info_container}>
                  <Text style={styles.label}>Name </Text>
                  <Text style={styles.label}>Phone number </Text>
                </View>
                <View style={styles.receiver_info_container}>
                  <Text style={styles.label_sub_txt}>: {""} Ranga Reddy</Text>
                  <Text style={styles.label_sub_txt}>: {""} 9807654321</Text>
                </View>
              </View>
            </View>
          </View>
          {/* Amount details container */}
          <View style={styles.sixth_details_container}>
            {/* amount heading section */}
            <View style={styles.amount_heading_container}>
              <Text style={styles.amount_heading_txt}>Advance amount</Text>
              <Text style={styles.price_heading_txt}>₹500</Text>
            </View>
            {/* base fare section */}
            {/* <View style={styles.base_fare_amount_container}>
                  <Text style={styles.sub_heading_txt}>Base Fare</Text>
                  <Text style={styles.sub_price_txt}>₹500</Text>
                </View> */}
            {/* bottom text */}
            <Text style={styles.amount_btm_txt}>
              Pay the remaining payment following confirmation with the Owner.
            </Text>
          </View>
          {/* confirmation button */}
          <TouchableOpacity
            style={styles.confirm_btn_container}
            onPress={() => navigation.navigate("XL_BookingsDetails")}
          >
            <Text style={styles.confirm_btn_txt}>Pay ₹500 & Confirm Now</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

export default XLargeVehicleDetails;

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
    paddingTop: 15,
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
  receiver_details_container: {
    gap: 5,
    borderRadius: 5,
    borderColor: colors.light_green,
    borderWidth: 1,
    padding: 10,
  },
  receiver_details_heading_txt: {
    fontSize: 16,
    fontWeight: "500",
    paddingBottom: 5,
    borderColor: colors.gray,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  receiver_info_main_container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  receiver_info_container: {
    gap: 10,
  },
  label: {
    fontWeight: "600",
    fontSize: 15,
  },
  label_sub_txt: {
    paddingLeft: 20,
    fontWeight: "500",
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
