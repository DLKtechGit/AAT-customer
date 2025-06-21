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
  KeyboardAvoidingView,
  ActivityIndicator
} from "react-native";
import React, { useState } from "react";
import safe_area_style from "../utils/safe_area_style";
import { colors } from "../utils/constants";
import Back_icon from "react-native-vector-icons/FontAwesome6";
import Icon from "react-native-vector-icons/Ionicons";
import Icon1 from "react-native-vector-icons/AntDesign";
import Toast from "react-native-toast-message";
import AxiosService from "../utils/AxiosService";

const NewPassword_screen = ({ navigation,route }) => {
  const [newPasswordShow, setNewPasswordShow] = useState(true);
  const [newPassword , setNewPassword] = useState('')
  const [confirmPassword , setConfirmPassword] = useState('')
  const [confirmPasswordShow, setConfirmPasswordShow] = useState(true);
  const [loading , setLoading] =  useState(false)
  const { resetPin, email } = route.params;
  

  const handleResetPassword = async()=>{
    try {
      setLoading(true);
      const res = await AxiosService.post("customer/resetPassword", {
        email,
        resetPin,
        newPassword,
        confirmPassword,
      });
      if (res.status === 201) {
        setConfirmPassword('')
        setNewPassword('')
        Toast.show({
          type: "success",
          text1: res.data.message,
        });
      }
      setTimeout(() => {
        navigation.navigate("Login");
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
  }

  return (
    <View style={{ backgroundColor: colors.white, flex: 1 }}>
      {/* nav container */}
      <Pressable
        style={styles.nav_container}
        onPress={() => navigation.navigate("Reset_password")}
      >
        <Icon1 name="arrowleft" size={30} />
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: colors.white }}>
          {/* main container */}
          <View style={styles.main_container}>
            {/* icon */}
            <Image
              source={require("../assets/Images/key.png")}
              style={styles.icon}
            />
            {/* heading */}
            <Text style={styles.heading_txt}>Reset Password</Text>

            {/* input field */}
            <View style={styles.main_input_container}>
              {/* old password field */}
             
              <Text style={styles.lable}>Enter new password</Text>
              <View style={styles.input_container}>
                <TextInput
                  placeholder="New Password"
                  style={{ flex: 1 }}
                  secureTextEntry={newPasswordShow}
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <Icon
                  name={newPasswordShow ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color={colors.dark_gray}
                  onPress={() => setNewPasswordShow(!newPasswordShow)}
                />
              </View>
              {/* confirm password field */}
              <Text style={styles.lable}>Confirm password</Text>
              <View style={styles.input_container}>
                <TextInput
                  placeholder="Confirm Password"
                  style={{ flex: 1 }}
                  secureTextEntry={confirmPasswordShow}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <Icon
                  name={confirmPasswordShow ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color={colors.dark_gray}
                  onPress={() => setConfirmPasswordShow(!confirmPasswordShow)}
                />
              </View>
            </View>
            {/* button */}
            <TouchableOpacity onPress={handleResetPassword} style={styles.btn_container}>
              {
                loading?(<ActivityIndicator color={colors.white} size="small"/>):(
<Text style={styles.btn_txt}>Reset password</Text>
                )
              }
              
            </TouchableOpacity>
          </View>
        </View>
        <Toast/>
      </ScrollView>
    </View>
  );
};

export default NewPassword_screen;

const styles = StyleSheet.create({
  main_container: {
    display: "flex",
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.white,
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
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
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderColor: colors.gray,
    borderWidth: 1,
    width: "100%",
    borderRadius: 5,
    marginBottom: 18,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    paddingBottom: 15,
  },
});
