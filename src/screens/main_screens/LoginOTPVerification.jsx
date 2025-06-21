import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    Image,
    Pressable,
    ActivityIndicator,
  } from "react-native";
  import React, { useRef, useState,useContext} from "react";
  import safe_area_style from "../../utils/safe_area_style";
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
  import { colors } from "../../utils/constants";
  import Icon1 from "react-native-vector-icons/AntDesign";
  import { OtpInput } from "react-native-otp-entry";
  import Toast from "react-native-toast-message";
  import AxiosService from "../../utils/AxiosService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../utils/AuthContext";
  
  const LoginOTPVerification = ({ navigation,route}) => {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const otpInputRef = useRef(null);
    const { phoneNumber } = route.params;
    // const phoneNumber = 9876544566
    const {login} = useContext(AuthContext)
  
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
  
    const handleResendOTP = async () => {
      try {
        const res = await AxiosService.post("customer/sendLoginOtp", {
          phoneNumber,
        });
  
        if (res.status === 200) {
          Toast.show({
            type: "success",
            text1: res.data.message,
            
          });
        }
      } catch (error) {
        Toast.show({
          type: "error",
          text1: error.response.data.message,
        });
      } 
    };
      
    const handleOtpSubmit = async () => {
      
      setLoading(true)
      const numericOtp = parseInt(otp);
      try {
        const res = await AxiosService.post("customer/verifyOtp", {
          phoneNumber,
          otp:numericOtp,
        });
  
        if (res.status === 200) {
          Toast.show({
            type: "success",
            text1: res.data.message,
          });
        }
        login(res.data.token);
        await AsyncStorage.setItem("user", JSON.stringify(res.data.userData));
      } catch (error) {
        Toast.show({
          type: "error",
          text1: error.response.data.message,
        });
      }
      finally{
        setLoading(false)
      }
    };
  
    //receiving value from otp input field
    const handleOtp = (text) => {
      setOtp(text);
      if (otp.length > 0) {
        setError("");
      }
    };
    
  
   
    return (
      <SafeAreaView style={safe_area_style.android_safe_area}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* nav container */}
          <Pressable
            style={styles.nav_container}
            onPress={() => navigation.goBack()}
          >
            <Icon1 name="arrowleft" size={30} />
          </Pressable>
          <View style={styles.main_container}>
            {/* image container */}
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../../assets/Images/LoginOtp.jpg")}
                style={styles.img}
              />
            </View>
            {/* heading text */}
            <Text style={styles.heading_txt}>Enter the Verification Code</Text>
            {/* sub heading */}
            <Text style={styles.sub_txt}>
              Enter the 4 digit number from the sms we set to +91{phoneNumber}
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
              {error ? <Text style={styles.error_txt}>{error}</Text> : null}
            </View>
            {/* submit button */}
            <Pressable onPress={handleOtpSubmit} style={styles.btn_container}>
              {loading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.btn_txt}>Submit</Text>
              )}
            </Pressable>
            {/* resend code section */}
            <Text style={styles.main_txt}>
              Haven't received code ?{" "}
              <Text style={styles.main_sub_txt} onPress={handleResendOTP}>
                Resend now
              </Text>
            </Text>
            <Toast />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  export default LoginOTPVerification;
  
  const styles = StyleSheet.create({
    main_container: {
      paddingHorizontal: 20,
      alignItems: "center",
    },
    img: {
      width: wp(50),
      height: hp(30),
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
      color: colors.red,
    },
  });
  