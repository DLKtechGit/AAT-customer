import {
  StyleSheet,
  Text,
  Platform,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { colors } from "../../utils/constants";
import Icon from "react-native-vector-icons/AntDesign";
import Icon1 from "react-native-vector-icons/FontAwesome6";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import DateRangePicker from "../../components/DateRangePicker";
import Buslist from "../../components/passengers_vehicles/BusList"
import AxiosService from "../../utils/AxiosService";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import Toast from "react-native-toast-message";
import haversine from "haversine";
import MapViewDirections from "react-native-maps-directions";
import { MAP_API_KEY } from "@env";
import bus_view from "../../assets/Images/bus_view.png";
import _ from 'lodash';
import axios from 'axios';

const GOOGLE_API_KEY = MAP_API_KEY;

const BusMain_screen = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);

  const [pickUpLocation, setPickUpLocation] = useState(null);
  const [returnLocation, setReturnLocation] = useState(null);
  const [pickUpDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [busData, setBusData] = useState(null);
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

  const vehicleType = "buses";
  const tripType = "Round Trip";

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
    setBusData(null);
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

  const getBus = async () => {
    if (!pickUpLocation || !returnLocation) {
      Toast.show({
        type: "info",
        text1: "Pickup location and Drop location is required",
        text2: "Pickup date also required",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await AxiosService.post(
        "customer/AvailableVehiclesForBooking",
        {
          tripType,
          pickUpDate,
          returnDate,
          vehicleType,
          customerLatitude: pickUpLocation.latitude,
          customerLongitude: pickUpLocation.longitude,
        }
      );
      const busDatas = res.data.availableVehicles;
      if (res.status === 200) {
        setBusData(busDatas);
        console.log(res.data.message);
        scrollViewRef.current?.scrollToEnd({ animated: true });
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
      const filteredVendor = data.filter((e) => e.vehicles.buses.length > 0);
      setVendorsData(filteredVendor);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{ flex: 1 }}>
          <Pressable
            style={styles.nav_container}
            onPress={() => navigation.navigate("MainHome")}
          >
            <Icon name="arrowleft" size={30} />
          </Pressable>
          <FlatList
            data={[{ key: "content" }]}
            renderItem={() => (
              <ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
                style={styles.main_container}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.content_container}>
                  <Text style={styles.heading_txt}>Choose a Ride</Text>
                  
                  {/* Date Picker */}
                  <DateRangePicker
                    returnDate={returnDate}
                    setReturnDate={setReturnDate}
                    pickupDate={pickUpDate}
                    setPickupDate={setPickupDate}
                  />
                  
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
                      <Marker coordinate={pickUpLocation} title="Pickup Location">
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
                      <Marker coordinate={returnLocation} title="Drop Location">
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
                        strokeWidth={5}
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
                            source={bus_view}
                            style={{
                              width: 30,
                              height: 30,
                              resizeMode: "contain",
                            }}
                          />  
                        </View>
                      </Marker>
                    ))}
                  </MapView>

                  <TouchableOpacity
                    style={styles.Vehicle_heading_txt}
                    onPress={getBus}
                  >
                    <Text style={styles.search_btn_text}>
                      Search Available Buses
                    </Text>
                  </TouchableOpacity>

                  {/* Bus list */}
                  <View>
                    {loading ? (
                      <ActivityIndicator
                        style={{ marginTop: 10 }}
                        size="large"
                        color={colors.dark_green}
                      />
                    ) : (
                      <Buslist
                        busData={busData}
                        pickUpLocation={pickupAddress}
                        returnLocation={dropAddress}
                        pickUpDate={pickUpDate ? pickUpDate.toString() : ""}
                        totalKm={totalKm}
                        tripType={tripType}
                        returnDate={returnDate ? returnDate.toString() : ""}
                      />
                    )}
                  </View>
                </View>
                <Toast />
              </ScrollView>
            )}
          />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default BusMain_screen;

const styles = StyleSheet.create({
  main_container: {
    backgroundColor: colors.white,
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: 8,
  },
  nav_container: {
    padding: 15,
    paddingTop: 40,
    backgroundColor: colors.light_gray,
  },
  content_container: {
    flex: 1,
    padding: 15,
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
  search_btn_text: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    color: colors.white,
  },
  location_input_container: {
    position: "relative",
    width: "100%",
    marginTop: 10,
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