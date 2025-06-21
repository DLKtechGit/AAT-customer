import React, { useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

const SampleScreen = () => {
  const bottomSheetModalRef = useRef(null);

  React.useEffect(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <View style={styles.container}>
      {/* Map View */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 12.8718,
          longitude: 80.2195,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude: 12.8718, longitude: 80.2195 }}
          title="Driver Location"
        />
      </MapView>

      {/* Emergency Button */}

      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={["70%", "50%"]}
          enablePanDownToClose={false}
        >
          <BottomSheetView style={styles.contentContainer}>
            <Text style={styles.sheetText}>Driver and Ride Details</Text>
            <Text>More details about the ride...</Text>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  emergencyButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "blue",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  emergencyText: {
    color: "white",
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  sheetText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SampleScreen;


