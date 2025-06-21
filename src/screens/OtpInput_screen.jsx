import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator
} from "react-native";
import React, { useRef, useState } from "react";
import safe_area_style from "../utils/safe_area_style";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { colors } from "../utils/constants";
import Icon1 from "react-native-vector-icons/AntDesign";
import { OtpInput } from "react-native-otp-entry";
import Toast from "react-native-toast-message";
import AxiosService from "../utils/AxiosService";

const OtpInput_screen = ({ navigation,route}) => {
  const [otp, setOtp] = useState("");
  const [loading , setLoading] = useState(false)
  const [error, setError] = useState("");
  const otpInputRef = useRef(null);
  const { email } = route.params;

  
  

  //submit button functionality
  // const handleOtpChange = () => {
  //   let receivedOtp = otp;
  //   const defaultOtp = "1234";
  //   if (receivedOtp === defaultOtp) {
  //     console.log(receivedOtp, "successful");
  //     Toast.show({
  //       type: "success",
  //       text1: "Verified successfully",
  //       autoHide: true,
  //       visibilityTime: 3000,
  //       position: "top",
  //     });
  //     navigation.navigate("NewPassword");
  //     if (otpInputRef.current) {
  //       otpInputRef.current.clear();
  //     }
  //   } else {
  //     console.log("incorrect code");
  //     setError("Invalid code, Please try again");
  //     if (otpInputRef.current) {
  //       otpInputRef.current.clear();
  //     }
  //   }
  // };

  const handleOtpVerify = async()=>{
    try {
      setLoading(true);
      const res = await AxiosService.post("customer/validateOTP", {
        email,
        resetPin:otp
      });
      console.log('res',res);
      
      if (res.status === 201) {
        setOtp("")
        Toast.show({
          type: "success",
          text1: res.data.message,
          text2: "You can now reset your password",
        });
      }
      setTimeout(() => {
        navigation.navigate("NewPassword",{resetPin:otp,email:email});
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

  //receiving value from otp input field
  const handleOtp = (text) => {
    setOtp(text);
    if (otp.length > 0) {
      setError("");
    }
  };


  //resend button functionality
  const resendOtp = async() => {
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
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* nav container */}
        <Pressable
          style={styles.nav_container}
          onPress={() => navigation.navigate("Reset_password")}
        >
          <Icon1 name="arrowleft" size={30} />
        </Pressable>
        <View style={styles.main_container}>
          {/* image container */}
          <View style={{ alignItems: "center" }}>
            <Image
              source={require("../assets/Images/otp-img.jpg")}
              style={styles.img}
            />
          </View>
          {/* heading text */}
          <Text style={styles.heading_txt}>Enter the Verification Code</Text>
          {/* sub heading */}
          <Text style={styles.sub_txt}>
            Enter the 4 digit number that we sent to the entered Email address
          </Text>
          {/* otp input fields */}
          <View
            style={{
              width: "80%",
              alignItems: "center",
              marginVertical: 20,
            }}
          >
            <OtpInput
              ref={otpInputRef}
              numberOfDigits={4}
              focusColor={colors.dark_green}
              // focusStickBlinkingDuration={5000}
              onTextChange={handleOtp}
              disabled={false}
              theme={{
                pinCodeContainerStyle: {
                  backgroundColor: colors.white,
                  width: 45,
                  height: 45,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: colors.gray,
                },
                pinCodeTextStyle: {
                  fontSize: 18,
                  fontWeight: "600",
                },
                filledPinCodeContainerStyle: {
                  borderWidth: 1,
                  borderColor: colors.dark_green,
                },
              }}
            />
          </View>
          {/* submit button */}
          <Pressable onPress={handleOtpVerify} style={styles.btn_container}>
            {
              loading?(<ActivityIndicator color={colors.white} size="small"/>) :(<Text style={styles.btn_txt}>Submit</Text>)
            }
            
          </Pressable>
          {/* resend code section */}
          <Text style={styles.main_txt}>
            Haven't received code ?{" "}
            <Text style={styles.main_sub_txt} onPress={resendOtp}>
              Resend now
            </Text>
          </Text>
        </View>
        <Toast />
      </ScrollView>
    </SafeAreaView>
  );
};

export default OtpInput_screen;

const styles = StyleSheet.create({
  main_container: {
    paddingHorizontal: 20,
    alignItems: "center",
  },
  img: {
    width: wp(40),
    height: hp(22),
  },
  heading_txt: {
    fontSize: 22,
    fontWeight: "600",
    marginVertical: 10,
    textAlign: "center",
  },
  sub_txt: {
    textAlign: "center",
    fontSize: 14,
    color: colors.dark_gray,
  },
  nav_container: {
    // marginBottom: 20,
    alignItems: "flex-start",
    padding: 20,
  },
  btn_container: {
    backgroundColor: colors.dark_green,
    width: "100%",
    padding: 10,
    borderRadius: 5,
    marginVertical: 20,
  },
  btn_txt: {
    textAlign: "center",
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  error_txt: {
    color: colors.red,
    fontSize: 12,
    marginTop: 10,
  },
  main_txt: {
    fontSize: 14,
    fontWeight: "500",
  },
  main_sub_txt: {
    color: colors.dark_green,
  },
});
