import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { colors } from "../utils/constants";
import Icon from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import AxiosService from "../utils/AxiosService";

const Signup_screen = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
  });

  const handleInputChange = (name, value) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await AxiosService.post("customer/signup", form);
      console.log("API response:", res);

      if (res.status === 201) {
        Toast.show({
          type: "success",
          text1: "Customer Signup Successfully ",
        });
        setForm({
          userName: "",
          email: "",
          phoneNumber: "",
          address: "",
        });
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
        console.log("error", error);
      } else {
        console.log("An unexpected error occurred. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.main_container}
      showsVerticalScrollIndicator={false}
    >
      {/* content container */}
      <View style={styles.content_container}>
        {/* logo */}
        <Image
          source={require("../assets/Images/AAT-logo-latest.png")}
          style={styles.logo}
        />
        {/* heading */}
        <Text style={styles.heading_txt}>Sign Up</Text>
        {/* input fields */}
        {/* username */}
        <View style={styles.input_container}>
          <TextInput
            value={form.userName}
            keyboardType="default"
            onChangeText={(value) => handleInputChange("userName", value)}
            placeholder="Username"
            style={{ width: "95%" }}
          />
        </View>
        {/* email */}
        <View style={styles.input_container}>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(value) => handleInputChange("email", value)}
            placeholder="Email"
            style={{ width: "95%" }}
          />
        </View>
        <View style={styles.input_container}>
          <TextInput
            keyboardType="numeric"
            value={form.phoneNumber}
            onChangeText={(value) => {
              const formattedValue = value.replace(/[^0-9]/g, "").slice(0, 10);
              handleInputChange("phoneNumber", formattedValue);
            }}
            placeholder="Phone Number"
            style={{ width: "95%" }}
          />
        </View>
        <TouchableOpacity onPress={handleSubmit} style={styles.btn_container}>
          {loading ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <Text style={styles.btn_txt}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.main_txt}>
          Already have an account?
          <Text
            style={styles.sub_txt}
            onPress={() => navigation.replace("Login")}
          >
            {" "}
            Login
          </Text>
        </Text>
        <Image
          source={require("../assets/Images/login-1.jpg")}
          style={styles.img}
        />
      </View>
      <Toast />
    </ScrollView>
  );
};

export default Signup_screen;

const styles = StyleSheet.create({
  main_container: {
    backgroundColor: colors.light_green,
    height: "100%",
    paddingHorizontal: 15,
    paddingVertical: 45,
    display: "flex",
    // alignItems:'center'
  },
  content_container: {
    display: "flex",
    alignItems: "center",
    // justifyContent: "center",
    backgroundColor: colors.white,
    height: "100%",
    width: "100%",
    padding: 20,
    borderRadius: 20,
    gap: 5,
  },
  logo: {
    width: 200,
    height: 200,
    marginTop: -20,
  },
  heading_txt: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input_container: {
    paddingHorizontal: 15,
    // paddingVertical: 5,
    height: 45,
    borderColor: colors.gray,
    borderWidth: 1,
    width: "100%",
    borderRadius: 5,
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  btn_container: {
    backgroundColor: colors.dark_green,
    width: "50%",
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 10,
    margin: 10,
    alignItems: "center",
  },
  btn_txt: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "600",
  },
  main_txt: {
    color: colors.dark_gray,
  },
  sub_txt: {
    color: colors.black,
    fontWeight: "500",
  },
  img: {
    width: "80%",
    height: 150,
    marginBottom: 40,
    marginTop: 10,
  },
});
