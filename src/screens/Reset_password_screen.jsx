import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Pressable,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import safe_area_style from "../utils/safe_area_style";
import { colors } from "../utils/constants";
import Back_icon from "react-native-vector-icons/FontAwesome6";
import Toast from "react-native-toast-message";
import AxiosService from "../utils/AxiosService";

const Reset_password_screen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmail = (text) => {
    setEmail(text);
    if (text.length > 0) {
      setError("");
    }
  };

  // const verifyEmail = () => {
  //   if (email.trim() === "") {
  //     setError("This field cannot be empty");
  //   } else {
  //     setEmail("");
  //     navigation.navigate("Otp");
  //     console.log("success");
  //   }
  // };

  const handleResetPassword = async () => {
    try {
      setLoading(true);
      const res = await AxiosService.post("customer/forgotPassword", {
        email,
      });
      if (res.status === 201) {
        setEmail("");

        Toast.show({
          type: "success",
          text1: "PIN sent to your email",
          text2: "It will expire in 3 minutes",
        });
      }
      setTimeout(() => {
        navigation.navigate("Otp", { email: email });
      }, 2000);
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

  return (
    <SafeAreaView style={safe_area_style.android_safe_area}>
      {/* main container */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.main_container}>
          {/* icon */}
          <Image
            source={require("../assets/Images/key.png")}
            style={styles.icon}
          />
          {/* heading */}
          <Text style={styles.heading_txt}>Forgot Password?</Text>
          {/* sub text */}
          <Text style={styles.sub_txt}>
            No worries, we'll send you reset instruction
          </Text>
          {/* input field */}
          <View style={styles.main_input_container}>
            <Text style={styles.lable}>Email</Text>
            <View style={styles.input_container}>
              <TextInput
                placeholder="Enter your email"
                inputMode="email"
                autoCapitalize="none"
                onChangeText={handleEmail}
                value={email}
              />
            </View>
            {error ? <Text style={styles.error_txt}>{error}</Text> : null}
          </View>
          {/* button */}
          <TouchableOpacity
            style={styles.btn_container}
            onPress={handleResetPassword}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Text style={styles.btn_txt}>Reset password</Text>
            )}
          </TouchableOpacity>
          {/* back navigation */}
          <Pressable
            style={styles.nav_container}
            onPress={() => navigation.navigate("Login")}
          >
            <Back_icon
              name="arrow-left-long"
              size={24}
              color={colors.dark_gray}
            />
            <Text style={styles.back_txt}>Back to log in</Text>
          </Pressable>
        </View>
        <Toast />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Reset_password_screen;

const styles = StyleSheet.create({
  main_container: {
    display: "flex",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  icon: {
    width: 80,
    height: 80,
  },
  main_input_container: {
    width: "100%",
    gap: 7,
    marginTop: 20,
    marginBottom: 15,
  },
  input_container: {
    borderColor: colors.gray,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  heading_txt: {
    fontSize: 25,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 7,
  },
  sub_txt: {
    color: colors.dark_gray,
    fontSize: 14,
  },
  lable: {
    fontSize: 15,
    fontWeight: "500",
  },
  btn_container: {
    backgroundColor: colors.dark_green,
    width: "100%",
    padding: 8,
    borderRadius: 6,
  },
  btn_txt: {
    textAlign: "center",
    color: colors.white,
    fontWeight: "500",
  },
  nav_container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginTop: 30,
    justifyContent: "center",
  },
  back_txt: {
    color: colors.dark_gray,
  },
  error_txt: {
    color: colors.red,
    fontSize: 12,
  },
});
