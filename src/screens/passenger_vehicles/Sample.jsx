import React from 'react'

const Sample = () => {
  return (
    <div>

<SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={[{ key: "content" }]}
        renderItem={() => (
          <View style={styles.main_container}>
            <Pressable
              style={styles.nav_container}
              onPress={() => navigation.navigate("MainHome")}
            >
              <Icon name="arrowleft" size={30} />
            </Pressable>

            <View style={styles.content_container}>
              <Text style={styles.heading_txt}>Choose a Ride</Text>
              <View style={styles.Btn_main_container}>
                <TouchableOpacity
                  style={[styles.btn_container, rouneTrip && styles.selected_btn]}
                  onPress={handleRoundTrip}
                >
                  <Text style={[styles.btn_txt, rouneTrip && styles.selected_btn_txt]}>
                    Round Trip
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn_container, oneDayTrip && styles.selected_btn]}
                  onPress={handleOneDayTrip}
                >
                  <Text style={[styles.btn_txt, oneDayTrip && styles.selected_btn_txt]}>
                    One Day Trip
                  </Text>
                </TouchableOpacity>
              </View>

              <DateRangePicker
                pickupDate={pickUpDate}
                returnDate={returnDate}
                setPickupDate={setPickUpDate}
                setReturnDate={setReturnDate}
                tripType={tripType}
              />

              <View style={{ marginTop: 10 }}>
                <GooglePlacesAutocomplete
                  placeholder="Enter your pick-up location"
                  fetchDetails
                  onPress={(data, details = null) => handleLocationSelect(data, details, "pickup")}
                  query={{ key: GOOGLE_API_KEY, language: "en" }}
                  styles={styles.autocomplete}
                  onFail={(error) => console.error("Autocomplete error:", error)}
                />
                <GooglePlacesAutocomplete
                  placeholder="Enter your drop location"
                  fetchDetails
                  onPress={(data, details = null) => handleLocationSelect(data, details, "drop")}
                  query={{ key: GOOGLE_API_KEY, language: "en" }}
                  styles={styles.autocomplete}
                />
              </View>

              <MapView
                showsMyLocationButton
                showsCompass
                toolbarEnabled
                style={{ width: "100%", height: 200 }}
                region={location}
              >
                {location && <Marker coordinate={location} title="Your Location" />}
                {pickUpLocation && (
                  <Marker coordinate={pickUpLocation} title="Pickup Location" pinColor="blue" />
                )}
                {returnLocation && (
                  <Marker coordinate={returnLocation} title="Drop Location" pinColor="red" />
                )}
              </MapView>

              <TouchableOpacity style={styles.Vehicle_heading_txt} onPress={GetCar}>
                <Text style={styles.search_btn_text}>Search Available Cars</Text>
              </TouchableOpacity>

              {loading ? (
                <ActivityIndicator style={{ marginTop: 10 }} size="large" color={colors.dark_green} />
              ) : (
                <CarList
                  carData={carData}
                  pickUpLocation={pickUpLocation}
                  returnLocation={returnLocation}
                  pickUpDate={pickUpDate.toString()}
                  totalKm={totalKm}
                  tripType={tripType}
                  returnDate={returnDate.toString()}
                />
              )}
            </View>
            <Toast />
          </View>
        )}
        keyExtractor={(item) => item.key}
      />
    </SafeAreaView>
      
    </div>
  )
}

export default Sample
