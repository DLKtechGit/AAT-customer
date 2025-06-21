import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors } from "../utils/constants";

const DateTimeSelector = ({DateTimeSelect}) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");
  const [selectedDateTime, setSelectedDateTime] = useState(null);

  // Handle date and time change
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);

    if (mode === "date") {
      setDate(currentDate);
      setMode("time"); 
      setShow(true); 
    } else if (mode === "time") {
      const newDateTime = new Date(date);
      newDateTime.setHours(currentDate.getHours());
      newDateTime.setMinutes(currentDate.getMinutes());
      setSelectedDateTime(newDateTime);

      
      // console.log("Selected Date and Time:", newDateTime.toLocaleString());

      setMode("date"); 

      if(DateTimeSelect){
        DateTimeSelect(newDateTime.toLocaleString())
      }
    }
  };

  // Show date picker
  const showDatepicker = () => {
    setMode("date");
    setShow(true);
  };

  // Show time picker
//   const showTimepicker = () => {
//     setMode("time");
//     setShow(true);
//   };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={showDatepicker} style={styles.button}>
        <Text style={styles.buttonText}>
          {selectedDateTime
            ? `Selected Date and Time: ${selectedDateTime.toLocaleDateString()} ${selectedDateTime.toLocaleTimeString()}`
            : "Select pick-up date and time"}
        </Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={false}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop:25
  },
  button: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 50,
    width:'100%',
    borderColor:colors.light_green,
    borderWidth:1
  },
  buttonText: {    
    fontSize: 15,
    fontWeight:'500'
  },
});

export default DateTimeSelector;
