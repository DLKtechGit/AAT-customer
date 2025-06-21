import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../utils/constants";
import Icon from "react-native-vector-icons/AntDesign";

const DateRangePicker = ({
  pickupDate,
  returnDate,
  setPickupDate,
  setReturnDate,
  triptype,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [isPickingStart, setIsPickingStart] = useState(true);

  const onChange = (event, selectedDate) => {
    setShowPicker(false);
    if (event.type === "set" && selectedDate) {
      if (isPickingStart) {
        setPickupDate(selectedDate);
        if (returnDate && returnDate < selectedDate) {
          setReturnDate(null);
        }
      } else {
        setReturnDate(selectedDate);
      }
    }
  };

  const showDatePicker = (isStart) => {
    setIsPickingStart(isStart);
    setShowPicker(true);
  };

  const minDate = new Date();

  return (
    <View style={styles.container}>
      {/* Pickup Date */}
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => showDatePicker(true)}
      >
        <Text style={styles.dateText}>
          {pickupDate ? new Date(pickupDate).toDateString() : "Pick Up Date"}
        </Text>
        <Ionicons name="calendar" size={16} color={colors.dark_gray} />
      </TouchableOpacity>

      {triptype !== "One Day Trip" && (
        <>
          <View style={styles.iconContainer}>
            <Icon name="swap" size={24} color={colors.dark_green} />
          </View>

          {/* Return Date */}
          <TouchableOpacity
            style={[
              styles.dateButton,
              !pickupDate && { opacity: 0.5, backgroundColor: colors.gray },
            ]}
            onPress={() => pickupDate && showDatePicker(false)}
            disabled={!pickupDate}
          >
            <Text style={styles.dateText}>
              {returnDate ? new Date(returnDate).toDateString() : "Return Date"}
            </Text>
            <Ionicons name="calendar" size={16} color={colors.dark_gray} />
          </TouchableOpacity>
        </>
      )}

      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={
            isPickingStart
              ? pickupDate
                ? new Date(pickupDate)
                : minDate
              : returnDate
              ? new Date(returnDate)
              : pickupDate
              ? new Date(pickupDate)
              : minDate
          }
          mode="date"
          display="default"
          onChange={onChange}
          minimumDate={isPickingStart ? minDate : pickupDate ? new Date(pickupDate) : minDate}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    gap: 10,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    width: "43%",
    backgroundColor: colors.light_gray,
    borderRadius: 6,
    borderColor: colors.light_green,
    borderWidth: 1,
    justifyContent: "center",
  },
  dateText: {
    fontSize: 14,
    marginRight: 8,
    fontWeight: "500",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DateRangePicker;
