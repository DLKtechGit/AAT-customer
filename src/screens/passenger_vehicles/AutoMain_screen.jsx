import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Pressable,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  TextInput,
} from "react-native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { colors } from "../../utils/constants";
import Icon from "react-native-vector-icons/AntDesign";
import Icon1 from "react-native-vector-icons/FontAwesome6";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AxiosService from "../../utils/AxiosService";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import Toast from "react-native-toast-message";
import haversine from "haversine";
import MapViewDirections from "react-native-maps-directions";
import { MAP_API_KEY } from "@env";
import image from "../../assets/Images/auto.png";
import nodata from "../../assets/Images/nodataifle.png";
import moment from "moment";
import { Keyboard } from "react-native";
import auto_view from '../../assets/Images/auto.png';
import _ from 'lodash';
import axios from 'axios';

const GOOGLE_API_KEY = MAP_API_KEY;

const AutoMain_screen = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);

  const [pickUpLocation, setPickUpLocation] = useState(null);
  const [returnLocation, setReturnLocation] = useState(null);
  const [pickUpDate, setPickUpDate] = useState("");
  const [autoData, setAutoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalKm, setTotalKm] = useState(null);
  const [location, setLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [pickupAddress, setPickupAddress] = useState("");
  const [usingCurrentLocaton, setUsingCurrentLocaton] = useState(false);
  const [dropAddress, setDropAddress] = useState("");
  const [canceled, setCanceled] = useState(true);
  const [vendorsData, setVendorsData] = useState([]);
  const [places, setPlaces] = useState([]);
  const [query, setQuery] = useState("");
  const [activeInput, setActiveInput] = useState(null);

  const tripType = "One Day Trip";
  const vehicleType = "autos";

  // Debounced place search function
  const fetchPlaces = async (input) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
        {
          params: {
            input,
            key: GOOGLE_API_KEY,
            language: "en",
          },
        }
      );
      setPlaces(response.data.predictions);
    } catch (error) {
      console.log(error);
    }
  };

  const debouncedFetchPlaces = useCallback(_.debounce(fetchPlaces, 300), []);

  useEffect(() => {
    if (query.length > 2) {
      debouncedFetchPlaces(query);
    } else {
      setPlaces([]);
    }
  }, [query, debouncedFetchPlaces]);

  const handleInputChange = (text, type) => {
    setQuery(text);
    setActiveInput(type);
    if (type === 'pickup') {
      setPickupAddress(text);
    } else {
      setDropAddress(text);
    }
  };

  const handlePlaceSelect = async (placeId) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json`,
        {
          params: {
            place_id: placeId,
            key: GOOGLE_API_KEY,
          },
        }
      );
      
      const { lat, lng } = response.data.result.geometry.location;
      const selectedLocation = {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      const address = response.data.result.formatted_address;

      if (activeInput === 'pickup') {
        setPickUpLocation(selectedLocation);
        setPickupAddress(address);
        setUsingCurrentLocaton(false);
      } else {
        setReturnLocation(selectedLocation);
        setDropAddress(address);
      }

      setLocation(selectedLocation);
      setPlaces([]);
      setQuery("");
      Keyboard.dismiss();
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getAllvendor();
      const fetchCurrentLocation = async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            alert("Location permission not granted");
            return;
          }

          const userLocation = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = userLocation.coords;

          const defaultLocation = {
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };
          
          setCurrentLocation(defaultLocation);
          setLocation(defaultLocation);
          setPickUpDate(moment().format());

          // Fetch address of the current location
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
          );
          const data = await response.json();
          if (data.results && data.results[0]) {
            setPickupAddress(data.results[0].formatted_address);
          }
        } catch (error) {
          console.error("Error fetching location:", error);
        }
      };

      fetchCurrentLocation();
    }, [])
  );

  const resetToCurrentLocation = async () => {
    if (currentLocation) {
      setCanceled(false);
      setPickUpLocation(currentLocation);
      setUsingCurrentLocaton(true);
      setLocation(currentLocation);

      // Fetch the address for the current location
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentLocation.latitude},${currentLocation.longitude}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();
      if (data.results && data.results[0]) {
        setPickupAddress(data.results[0].formatted_address);
      }
    }
  };

  const handleCancelcurrenlocation = () => {
    setCanceled(true);
    setPickupAddress("");
    setUsingCurrentLocaton(false);
    setPickUpLocation(null);
    setLocation(null);
  };

  const calculateDistance = () => {
    if (pickUpLocation && returnLocation) {
      const start = {
        latitude: pickUpLocation.latitude,
        longitude: pickUpLocation.longitude,
      };
      const end = {
        latitude: returnLocation.latitude,
        longitude: returnLocation.longitude,
      };
      const distanceKm = haversine(start, end, { unit: "km" });
      setTotalKm(distanceKm);
    }
  };

  useEffect(() => {
    if (pickUpLocation && returnLocation) {
      calculateDistance();
    }
  }, [pickUpLocation, returnLocation]);

  const GetAuto = async () => {
    if (!pickUpLocation || !returnLocation) {
      Toast.show({
        type: "info",
        text1: "Pickup and drop location are required",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await AxiosService.post(
        "customer/AvailableVehiclesForBooking",
        {
          tripType: "One Day Trip",
          pickUpDate,
          vehicleType: "autos",
          customerLatitude: pickUpLocation.latitude,
          customerLongitude: pickUpLocation.longitude,
        }
      );
      setAutoData(res.data.availableVehicles || []);
      scrollViewRef.current?.scrollToEnd({ animated: true });
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
        console.log("An unexpected error occurred. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  const getAllvendor = async () => {
    try {
      const res = await AxiosService.get("vendor/getAllVendors");
      const data = res.data.vendors;
      const filteredVendor = data.filter((e) => e.vehicles.autos.length > 0);
      setVendorsData(filteredVendor);
    } catch (error) {
      console.log(error.message);
    }
  };

  const renderAutoItem = ({ item }) => (
    <Pressable
      style={styles.main_container1}
      onPress={() =>
        navigation.navigate("AutoDetails", {
          autoDetails: item,
          pickUpLocation: pickupAddress,
          returnLocation: dropAddress,
          pickUpDate: pickUpDate ? pickUpDate.toString() : "",
          totalKm,
          tripType,
        })
      }
    >
      <View style={styles.desc}>
        <Text style={styles.vehicle_name_txt}>
          {item.vehicleDetails.vehicleModel}
        </Text>
        <Text style={styles.vehicle_details_txt}>
          Number Plate - {item.vehicleDetails.licensePlate}
        </Text>
        <Text style={styles.km_price_txt}>
          Per Km - ₹{item.vehicleDetails.pricePerKm} / per day -{" "}
          {item.vehicleDetails.pricePerDay}
        </Text>
      </View>
      <View style={styles.img_container}>
        <Image source={image} style={styles.img} />
      </View>
    </Pressable>
  );

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={{ flex: 1 }}>
            <Pressable style={styles.nav_container}>
              <Icon
                onPress={() => navigation.navigate("MainHome")}
                name="arrowleft"
                size={30}
              />
            </Pressable>
            <FlatList
              data={[{ key: "content" }]}
              renderItem={() => (
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  style={styles.main_container}
                >
                  <View style={styles.content_container}>
                    <Text style={styles.heading_txt}>Book Auto for Ride</Text>
                    
                    {/* Pickup Location Input */}
                    <View style={styles.location_input_container}>
                      <Icon1
                        name="location-crosshairs"
                        size={18}
                        color={colors.dark_green}
                        style={styles.icon}
                      />
                      <TextInput
                        placeholder="Enter your pick-up location"
                        style={[
                          styles.textInput,
                          { paddingLeft: 50, paddingRight: 40 },
                        ]}
                        value={pickupAddress}
                        onChangeText={(text) => handleInputChange(text, "pickup")}
                        onFocus={() => setActiveInput("pickup")}
                      />
                      {usingCurrentLocaton && (
                        <Icon1
                          onPress={handleCancelcurrenlocation}
                          size={15}
                          style={styles.Xicon}
                          name="xmark"
                        />
                      )}
                      {!usingCurrentLocaton && (
                        <TouchableOpacity
                          onPress={resetToCurrentLocation}
                          style={styles.resetButton}
                        >
                          <Text style={styles.resetButtonText}>
                            Use Current Location
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* Drop Location Input */}
                    <View style={styles.location_input_container}>
                      <Icon1
                        name="map-pin"
                        size={18}
                        color={colors.red}
                        style={styles.icon}
                      />
                      <TextInput
                        placeholder="Enter your drop location"
                        style={[
                          styles.textInput,
                          { paddingLeft: 50, paddingRight: 40 },
                        ]}
                        value={dropAddress}
                        onChangeText={(text) => handleInputChange(text, "drop")}
                        onFocus={() => setActiveInput("drop")}
                      />
                    </View>

                    {/* Location suggestions */}
                    {places.length > 0 && (
                      <View style={styles.suggestionsContainer}>
                        {places.map((place, index) => (
                          <Pressable
                            key={index}
                            style={styles.suggestionItem}
                            onPress={() => handlePlaceSelect(place.place_id)}
                          >
                            <Icon1
                              name={
                                activeInput === "pickup"
                                  ? "location-crosshairs"
                                  : "map-pin"
                              }
                              size={18}
                              color={
                                activeInput === "pickup"
                                  ? colors.dark_green
                                  : colors.red
                              }
                              style={{ marginRight: 10 }}
                            />
                            <Text style={styles.suggestionText}>
                              {place.description}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    )}

                    <MapView
                      showsUserLocation
                      showsMyLocationButton
                      showsCompass
                      style={{ width: "100%", height: 200, marginTop: 10 }}
                      region={location}
                    >
                      {pickUpLocation && (
                        <Marker
                          coordinate={pickUpLocation}
                          title="Pickup Location"
                        >
                          <View
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Icon1
                              name="location-crosshairs"
                              size={30}
                              color={colors.dark_green}
                            />
                          </View>
                        </Marker>
                      )}
                      {returnLocation && (
                        <Marker
                          coordinate={returnLocation}
                          title="Drop Location"
                        >
                          <Icon1
                            name="map-pin"
                            size={20}
                            color={colors.red}
                            style={styles.icon}
                          />
                        </Marker>
                      )}
                      {pickUpLocation && returnLocation && (
                        <MapViewDirections
                          origin={pickUpLocation}
                          destination={returnLocation}
                          apikey={GOOGLE_API_KEY}
                          strokeWidth={3}
                          strokeColor="blue"
                          onReady={(result) => {
                            setTotalKm(result.distance);
                          }}
                        />
                      )}
                      {vendorsData.map((vendor, index) => (
                        <Marker
                          key={index}
                          coordinate={{
                            latitude: vendor.latitude,
                            longitude: vendor.longitude,
                          }}
                          title={vendor.userName}
                        >
                          <View style={{ alignItems: "center" }}>
                            <Image
                              source={auto_view}
                              style={{
                                width: 40,
                                height: 40,
                                resizeMode: "contain",
                              }}
                            />
                          </View>
                        </Marker>
                      ))}
                    </MapView>

                    <TouchableOpacity
                      style={styles.Vehicle_heading_txt}
                      onPress={GetAuto}
                    >
                      <Text style={styles.search_btn_text}>Search Autos</Text>
                    </TouchableOpacity>

                    {loading ? (
                      <ActivityIndicator
                        style={{ marginTop: 10 }}
                        size="large"
                        color={colors.dark_green}
                      />
                    ) : (
                      <View style={{ marginBottom: 230 }}>
                        <FlatList
                          data={autoData}
                          renderItem={renderAutoItem}
                          keyExtractor={(item, index) => index.toString()}
                          ListEmptyComponent={
                            <View style={styles.noDataContainer}>
                              <Image
                                style={{ width: 220, height: 200 }}
                                source={nodata}
                                alt="noData"
                              />
                              <Text style={styles.searchText}>
                                No autos available
                              </Text>
                            </View>
                          }
                          contentContainerStyle={
                            autoData?.length === 0 ? { flex: 1 } : {}
                          }
                        />
                      </View>
                    )}
                  </View>
                  <Toast />
                </ScrollView>
              )}
            />
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

export default AutoMain_screen;

const styles = StyleSheet.create({
  main_container: {
    backgroundColor: colors.white,
    flex: 1,
    padding: 15,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  nav_container: {
    padding: 15,
    paddingTop: 40,
    backgroundColor: colors.light_gray,
  },
  heading_txt: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    backgroundColor: colors.light_gray,
    padding: 8,
    color: colors.dark_green,
    borderRadius: 10,
    marginBottom: 10,
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
  icon: {
    marginHorizontal: 10,
  },
  main_container1: {
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
  search_btn_text: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    color: colors.white,
  },
  searchText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.dark_gray,
  },
  noDataContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  location_input_container: {
    position: "relative",
    width: "100%",
    marginTop: 5,
  },
  icon: {
    position: "absolute",
    left: 20,
    top: 15,
    zIndex: 1,
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.light_green,
    borderRadius: 8,
    fontSize: 16,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  Xicon: {
    position: "absolute",
    right: 20,
    top: 18,
    zIndex: 1,
    width: 20,
  },
  resetButton: {
    backgroundColor: "#1c8fbb",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 5,
  },
  resetButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  suggestionsContainer: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginTop: 5,
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  suggestionText: {
    fontSize: 16,
    flex: 1,
  },
});