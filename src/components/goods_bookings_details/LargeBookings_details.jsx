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
  
  const LargeBookings_details = () => {
    const navigation = useNavigation();
  
    const [details, setDetails] = useState(false);
  
    return (
      <View style={styles.main_container}>
        {/* nav container */}
        <Pressable
          style={styles.nav_container}
          onPress={() => navigation.navigate("LargeVehicle_details")}
        >
          <Icon name="arrowleft" size={30} />
        </Pressable>
        {/* content container */}
        <View style={styles.content_container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.heading_txt}>Booking summary</Text>
  
            {/* more details about vehicle section */}
            {/* main details container */}
            <View style={styles.main_details_container}>
              <View style={{ alignItems: "center" }}>
                <Image
                  source={require("../../assets/Images/large-truck.jpg")}
                  style={styles.img}
                />
              </View>
              {/*vehicle name image container */}
              <View style={styles.first_details_container}>
                <View style={{ gap: 5 }}>
                  <Text style={styles.vehicle_name_txt}>Pick up</Text>
                  <Text style={styles.seat_txt}>Ton : 1200kg</Text>
                </View>
              </View>
            </View>
  
            {/* Driver and vehicle details */}
            <View style={styles.fourth_details_container}>
              {/* first heading */}
              <View style={styles.heading_btn_main_container}>
                <Text style={styles.second_desc_heading}>
                  Driver & Car details
                </Text>
                <Pressable
                  onPress={() => setDetails(!details)}
                  style={styles.heading_btn_container}
                >
                  <Text style={styles.heading_btn_txt}>View Details</Text>
                </Pressable>
              </View>
              {/* details container */}
              {details && (
                <View
                  style={[
                    styles.details_main_container,
                    {
                      marginTop: 15,
                    },
                  ]}
                >
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
                    {/* vehicle ton */}
                    <Text style={styles.label_txt}>Ton</Text>
                    {/* vehicle size */}
                    <Text style={styles.label_txt}>Vehicle Size</Text>
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
                      <Text style={styles.info_txt}>-  Gray</Text>
                      {/* vehicle ton */}
                      <Text style={styles.info_txt}>-  1200kg</Text>
                      {/* Number of Seats */}
                      <Text style={styles.info_txt}>-  8ft × 4½ft × 5½ft</Text>
                      {/* Mileage */}
                      <Text style={styles.info_txt}>-  13 kmpl</Text>
                    </View>
                </View>
              )}
              {/* boarding instruction */}
              <Text style={styles.instruction_heading}>Easy boarding</Text>
              {/* instruction main container */}
              <View style={styles.instruction_main_container}>
                {/* instruction sub container */}
                {/* 1 */}
                <View style={styles.instruction_sub_container}>
                  <View style={styles.count}>
                    <Text style={styles.count_txt}>1</Text>
                  </View>
                  <Text style={styles.instruction_txt}>
                    Driver will reach your pickup location
                  </Text>
                </View>
                {/* 2 */}
                <View style={styles.instruction_sub_container}>
                  <View style={styles.count}>
                    <Text style={styles.count_txt}>2</Text>
                  </View>
                  <Text style={styles.instruction_txt}>Show your booking</Text>
                </View>
                {/* 3 */}
                <View style={styles.instruction_sub_container}>
                  <View style={styles.count}>
                    <Text style={styles.count_txt}>3</Text>
                  </View>
                  <Text style={styles.instruction_txt}>
                    Sit back & enjoy your trip
                  </Text>
                </View>
              </View>
            </View>
  
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
                    Chennai Airport, Chennai
                  </Text>
                  <Text style={styles.location_txt}>
                    Meenakshi Amman Temple, Madurai
                  </Text>
                </View>
              </View>
              {/* details container */}
              <View style={styles.details_main_container}>
                {/* labels section */}
                <View style={styles.label_container}>
                  {/* Receiver Name text */}
                <Text style={styles.booking_label_txt}>Receiver Name</Text>
                {/* Receiver Phone text */}
                <Text style={styles.booking_label_txt}>Receiver Phone</Text>
                  {/* booking date text */}
                  <Text style={styles.booking_label_txt}>Booking Date</Text>
                  {/* total km text */}
                  <Text style={styles.booking_label_txt}>Total Km</Text>
                  {/* cost per km text */}
                  <Text style={styles.booking_label_txt}>Cost per Km</Text>
                  {/* total amount text*/}
                  <Text style={styles.booking_label_txt}>Total Amount</Text>
                  {/* advance text */}
                  <Text style={styles.booking_label_txt}>Advance Paid</Text>
                  {/* balance text */}
                  <Text style={styles.booking_label_txt}>Balance Amount</Text>
                </View>
                {/* information section */}
                {/* prettier-ignore */}
                <View style={styles.info_container}>
                   {/* receiver name */}
                   <Text style={styles.booking_info_txt}>-  Raghu</Text>
                  {/* receiver phone number */}
                  <Text style={styles.booking_info_txt}>-  9345267218</Text>
                    {/* total km text */}
                    <Text style={styles.booking_info_txt}>-  20-09-2024</Text>
                      {/* total km text */}
                      <Text style={styles.booking_info_txt}>-  450 Km</Text>
                      {/* cost per km text */}
                      <Text style={styles.booking_info_txt}>-  ₹20 </Text>
                      {/* total amount text*/}
                      <Text style={styles.booking_info_txt}>-  ₹6500</Text>
                      {/* advance text */}
                      <Text style={styles.booking_info_txt}>-  ₹500</Text>
                      {/* balance text */}
                      <Text style={styles.booking_info_txt}>-  ₹6000</Text>                  
                    </View>
              </View>
            </View>
            {/* confirmation button */}
            <TouchableOpacity
              style={styles.confirm_btn_container}
              // onPress={() => navigation.navigate("CarBookingDetails")}
            >
              <Text style={styles.confirm_btn_txt}>Pay via UPI or Cash</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    );
  };
  
  export default LargeBookings_details;
  
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
      resizeMode:'contain'
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
  });
  