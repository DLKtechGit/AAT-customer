import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import React, { useState,useRef} from "react";
import { colors } from "../../utils/constants";
import Toast from "react-native-toast-message";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import UpcomingBookings from "../../components/booking_list/UpcomingBookings";
import PastBookings from "../../components/booking_list/PastBookings";

const MyBookings_screen = () => {
  const [current, setCurrent] = useState(true);
  const [history, setHistory] = useState(false);
  const toastRef = useRef();

  const showToast = (type, text1) => {
    
    Toast.show({
      type,
      text1,
      position: "top",
    });
  };

  const handleCurrent = () => {
    setCurrent(true);
    setHistory(false);
  };
  const handleHistory = () => {
    setHistory(true);
    setCurrent(false);
  };

  return (
    <View style={styles.main_container}>
      {/* button container */}
      <View style={styles.Btn_main_container}>
        {/* current bookings */}
        <TouchableOpacity
          style={[styles.btn_container, current && styles.selected_btn]}
          onPress={handleCurrent}
        >
          <Text style={[styles.btn_txt, current && styles.selected_btn_txt]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        {/* History */}
        <TouchableOpacity
          style={[styles.btn_container, history && styles.selected_btn]}
          onPress={handleHistory}
        >
          <Text style={[styles.btn_txt, history && styles.selected_btn_txt]}>
            History
          </Text>
        </TouchableOpacity>
      </View>
      {/* Booking list details */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {current && <UpcomingBookings showToast={showToast} />}
        {history && <PastBookings/>}
      </ScrollView>
      <Toast/>
    </View>
  );
};

export default MyBookings_screen;

const styles = StyleSheet.create({
  main_container: {
    paddingHorizontal: 15,
    backgroundColor: colors.white,
    flex: 1,
    paddingTop:15,
  },
  Btn_main_container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.very_light_gray,
    padding: 7,
    borderRadius: 50,
    gap: 5,
  },
  btn_txt: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.dark_green,
  },
  selected_btn_txt: {
    color: colors.white,
  },
  btn_container: {
    backgroundColor: colors.white,
    padding: 10,
    width: wp(43),
    alignItems: "center",
    borderRadius: 50,
    borderColor: colors.light_green,
    borderWidth: 0.5,
  },
  selected_btn: {
    backgroundColor: colors.dark_green,
  },
});
