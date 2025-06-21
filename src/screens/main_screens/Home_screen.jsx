import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import Carousel_slider from "../../components/Carousel_slider";
import { colors } from "../../utils/constants";
import Small_vehicle_modal from "../../components/modals/Small_vehicle_modal";
import Medium_vehicle_modal from "../../components/modals/Medium_vehicle_modal";
import Large_vehicle_modal from "../../components/modals/Large_vehicle_modal";
import XL_vehicle_modal from "../../components/modals/XL_vehicle_modal";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../utils/AuthContext";

const Home_screen = ({ navigation, getNotificationCount }) => {
  const [smallTruck, setSmallTruck] = useState(false);
  const [mediumTruck, setMediumTruck] = useState(false);
  const [largeTruck, setLargeTruck] = useState(false);
  const [XLTruck, setXLTruck] = useState(false);
  const [reloadKey, setReloadKey] = useState(0); // A key to force re-render
  const [refreshing, setRefreshing] = useState(false);
  const { logout } = useContext(AuthContext);
  const { isAuthenticated } = useContext(AuthContext);

  useFocusEffect(
    React.useCallback(() => {
      getNotificationCount();
    }, [])
  );

  const Onrefresh = async () => {
    setRefreshing(true);
    getNotificationCount();
    setRefreshing(false);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      navigation.replace("Login");
    }
  }, []);

  return (
    <ScrollView
      style={styles.main_container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={Onrefresh} />
      }
    >
      {/* image carousel */}
      <Carousel_slider />
      {/* passenger container */}
      <View style={styles.sub_container}>
        <Text style={styles.heading_txt}>Passengers Vehicles</Text>
        <Text style={styles.sub_heading_txt}>
          Your ride is just a tap away.
        </Text>
        {/* vehicle container */}
        <View style={styles.main_vehicle_container}>
          {/* auto */}
          <Pressable
            style={styles.vehicle_container}
            onPress={() => navigation.navigate("Auto_main")}
          >
            <Image
              source={require("../../assets/Images/auto.png")}
              style={styles.vehicle_img}
            />
            <Text style={styles.vehicle_name}>Auto</Text>
          </Pressable>
          {/* car */}
          <Pressable
            style={styles.vehicle_container}
            onPress={() => navigation.navigate("Car_main")}
          >
            <Image
              source={require("../../assets/Images/car.png")}
              style={styles.vehicle_img}
            />
            <Text style={styles.vehicle_name}>Car</Text>
          </Pressable>
          {/* van */}
         
        </View>

        <View style={[styles.main_vehicle_container,{marginTop:10}]}>
        <Pressable
            style={styles.vehicle_container}
            onPress={() => navigation.navigate("Van_main")}
          >
            <Image
              source={require("../../assets/Images/van.png")}
              style={styles.vehicle_img}
            />
            <Text style={styles.vehicle_name}>Van</Text>
          </Pressable>
          {/* Bus */}
          <Pressable
            style={styles.vehicle_container}
            onPress={() => navigation.navigate("Bus_main")}
          >
            <Image
              source={require("../../assets/Images/bus.png")}
              style={styles.vehicle_img}
            />
            <Text style={styles.vehicle_name}>Bus</Text>
          </Pressable>
        </View>
      </View>
      {/* Goods container */}
      <View style={styles.goods_sub_container}>
        <Text style={styles.heading_txt}>Goods Vehicles</Text>
        <Text style={styles.sub_heading_txt}>
          Your ride is just a tap away.
        </Text>
        {/* vehicle container */}
        <View style={[styles.main_vehicle_container,{flexWrap:"wrap"}]}>
          {/* small truck */}
          <Pressable
            style={[styles.vehicle_container, { width: "45%" }]}
            // onPress={() => navigation.navigate("Car_main")}
            onPress={() =>
              navigation.navigate("Large_main", {
                minimumTon: 500,
                maximumTon: 1000,
              })
            }
          >
            <Image
              source={require("../../assets/Images/under1-ton.jpg")}
              style={[styles.vehicle_img, { width: 130 }]}
            />
            <Text style={styles.vehicle_name}>0.5 Ton - 1 Ton</Text>
            {/* description main container */}
            <View style={styles.desc_container}>
              {/* weight section */}
              {/* <View style={styles.weight_section}>
                <Weight
                  name="weight-hanging"
                  size={16}
                  color={colors.dark_gray}
                />
                <Text style={styles.weight_txt}>500 Kg</Text>
              </View> */}
              {/* info section */}
              {/* <Pressable
                onPress={() => setSmallTruck(true)}
                style={styles.info_button}
              >
                <Text style={styles.btn_txt}>View Details</Text>
              </Pressable> */}
              {smallTruck && (
                <Small_vehicle_modal onClose={() => setSmallTruck(false)} />
              )}
            </View>
          </Pressable>
          {/* medium truck*/}
          <Pressable
            style={[styles.vehicle_container, { width: "45%" }]}
            // onPress={() => navigation.navigate("Car_main")}
            onPress={() =>
              navigation.navigate("Large_main", {
                minimumTon: 1001,
                maximumTon: 10000,
              })
            }
          >
            <Image
              source={require("../../assets/Images/XL-truck.png")}
              style={styles.vehicle_img}
            />
            <Text style={styles.vehicle_name}>1.1 Ton - 10 Ton</Text>
            {/* description main container */}
            <View style={styles.desc_container}>
              {/* weight section */}
              {/* <View style={styles.weight_section}>
                <Weight
                  name="weight-hanging"
                  size={16}
                  color={colors.dark_gray}
                />
                <Text style={styles.weight_txt}>750 Kg</Text>
              </View> */}
              {/* info section */}
              {/* <Pressable
                onPress={() => setMediumTruck(true)}
                style={styles.info_button}
              >
                <Text style={styles.btn_txt}>View Details</Text>
              </Pressable> */}
              {mediumTruck && (
                <Medium_vehicle_modal onClose={() => setMediumTruck(false)} />
              )}
            </View>
          </Pressable>
          {/* Large truck */}
          <Pressable
            style={[styles.vehicle_container, { width: "45%" }]}
            // onPress={() => navigation.navigate("Car_main")}

            onPress={() =>
              navigation.navigate("Large_main", {
                minimumTon: 10001,
                maximumTon: 20000,
              })
            }
          >
            <Image
              source={require("../../assets/Images/below-20-ton.png")}
              style={styles.vehicle_img}
            />
            <Text style={styles.vehicle_name}>10.1 Ton - 20 Ton</Text>
            {/* description main container */}
            <View style={styles.desc_container}>
              {/* weight section */}
              {/* <View style={styles.weight_section}>
                <Weight
                  name="weight-hanging"
                  size={16}
                  color={colors.dark_gray}
                />
                <Text style={styles.weight_txt}>1200 Kg</Text>
              </View> */}
              {/* info section */}
              {/* <Pressable
                onPress={() => setLargeTruck(true)}
                style={styles.info_button}
              >
                <Text style={styles.btn_txt}>View Details</Text>
              </Pressable> */}
              {largeTruck && (
                <Large_vehicle_modal onClose={() => setLargeTruck(false)} />
              )}
            </View>
          </Pressable>
          {/* XL truck */}
          <Pressable
            style={[styles.vehicle_container, { width: "45%" }]}
            // onPress={() => navigation.navigate("Car_main")}
            onPress={() =>
              navigation.navigate("Large_main", {
                minimumTon: 20001,
                maximumTon: "more",
              })
            }
          >
            <Image
              source={require("../../assets/Images/moreThen20-ton.png")}
              style={styles.vehicle_img}
            />
            <Text style={styles.vehicle_name}>More than 20 Ton</Text>
            {/* description main container */}
            <View style={styles.desc_container}>
              {/* weight section */}
              {/* <View style={styles.weight_section}>
                <Weight
                  name="weight-hanging"
                  size={16}
                  color={colors.dark_gray}
                />
                <Text style={styles.weight_txt}>2500 Kg</Text>
              </View> */}
              {/* info section */}
              {/* <Pressable
                onPress={() => setXLTruck(true)}
                style={styles.info_button}
              >
                <Text style={styles.btn_txt}>View Details</Text>
              </Pressable> */}
              {XLTruck && (
                <XL_vehicle_modal onClose={() => setXLTruck(false)} />
              )}
            </View>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default Home_screen;

const styles = StyleSheet.create({
  main_container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  heading_txt: {
    fontSize: 21,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
    backgroundColor: colors.light_gray,
    padding: 3,
    borderRadius: 5,
  },
  sub_heading_txt: {
    marginBottom: 20,
    textAlign: "center",
  },
  sub_container: {
    backgroundColor: colors.white,
    margin: 15,
    padding: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: colors.light_green,
    elevation: 1,
  },
  goods_sub_container: {
    backgroundColor: colors.white,
    margin: 15,
    padding: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: colors.light_green,
    elevation: 1,
    marginBottom: 40,
  },
  vehicle_img: {
    width: 150,
    height: 100,
    objectFit: "contain",
  },
  vehicle_container: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 10,
    padding: 5,
    height: 140,
  },
  main_vehicle_container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    gap: 13,
  },
  vehicle_name: {
    fontWeight: "600",
    fontSize: 16,
  },
  weight_section: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  desc_container: {
    // display: "flex",
    // flexDirection: "row",
    // alignItems: "center",
    // gap: 15,
    // marginTop: 10,
    // marginBottom: 5,
    width: "100%",
  },
  // weight_txt: {
  //   fontWeight: "500",
  // },
  info_button: {
    backgroundColor: colors.dark_green,
    width: "100%",
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  btn_txt: {
    color: colors.white,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
  },
});
