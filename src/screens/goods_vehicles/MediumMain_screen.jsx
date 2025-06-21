import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    Pressable,
    TextInput,
  } from "react-native";
  import React from "react";
  import { colors } from "../../utils/constants";
  import Icon from "react-native-vector-icons/AntDesign";
  import { useNavigation } from "@react-navigation/native";
  import LocationInputFields from "../../components/LocationInputFields";
import MediumVehicleList from "../../components/goods_vehicles/MediumVehicleList";
import DateTimeSelector from "../../components/DateTimeSelector";
  
  const MediumMain_screen = () => {
    const navigation = useNavigation();

    const handleDateTime =(DateTime)=>{
      console.log('medium',DateTime);
      
    }
  
    return (
      // main container
      <View style={styles.main_container}>
        {/* nav container */}
        <Pressable
          style={styles.nav_container}
          onPress={() => navigation.navigate("MainHome")}
        >
          <Icon name="arrowleft" size={30} />
        </Pressable>
        {/* content container */}
        <View style={styles.content_container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.heading_txt}>Choose a Movers</Text>
            {/* ride date picker */}
            <DateTimeSelector DateTimeSelect={handleDateTime}/>
            {/* location input fields */}
            <LocationInputFields />
            {/* receiver input fields */}
            {/* receiver name */}
            <View style={styles.input_field_container}>
              <Text style={styles.label}>Receiver Name </Text>
              <TextInput
                placeholder="Enter Receiver Name"
                style={styles.input_field}
              />
            </View>
            {/* receiver phone number */}
            <View style={styles.input_field_container}>
              <Text style={styles.label}>Receiver phone number </Text>
              <TextInput
                placeholder="Enter Receiver phone number"
                style={styles.input_field}
              />
            </View>
            {/* vehicle heading */}
            <Text style={styles.Vehicle_heading_txt}>Available Vehicles</Text>
            {/* car list */}
            <MediumVehicleList/>
          </ScrollView>
        </View>
      </View>
    );
  };
  
  export default MediumMain_screen;
  
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
    //   input fields style
    input_field_container: {
      backgroundColor: colors.very_light_gray,
      padding: 10,
      borderRadius: 10,
      marginBottom: 25,
    },
    input_field: {
      borderColor: colors.dark_gray,
      borderWidth: 1,
      padding: 10,
      height: 40,
      borderRadius: 5,
    },
    label: {
      fontSize: 15,
      fontWeight: "500",
      marginBottom: 10,
    },
  });
  