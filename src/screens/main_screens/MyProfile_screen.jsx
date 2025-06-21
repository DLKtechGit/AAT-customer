import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Pressable,
  TextInput,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { colors } from "../../utils/constants";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import Location from "react-native-vector-icons/FontAwesome6";
import Icon from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../../utils/AuthContext";
import AsyncStorage, { useAsyncStorage } from "@react-native-async-storage/async-storage";
import AxiosService from "../../utils/AxiosService";
import Toast from "react-native-toast-message";

const MyProfile_screen = () => {
  const [customerId, setCustomerId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userName , setUserName] = useState("")
  const [email , setEmail] = useState("")
  const [address , setAddress] = useState("")
  const [loading , setLoading ] = useState(false) 
  const [refreshing , setRefreshing] = useState(false)
  const [profileImg, setProfileImage] = useState(''); 
  const [imageUri, setImageUri] = useState(null); 

  const { logout } = useContext(AuthContext);

  const [userDetails, setUserDetails] = useState({});
  const navigation = useNavigation();

  

  useEffect(() => {
    getCustomerData();
  }, []);

  const getCustomerData = async () => {
    try {
      const customer = await AsyncStorage.getItem("user");
      const customerData = JSON.parse(customer);
      const id = customerData._id;
      setCustomerId(id);

      const res = await AxiosService.post("customer/getCustomerById", {
        customerId: id,
      });
      const data = res.data.user;
      const Phone = String(data.phoneNumber);
      const FormatedNumber = Phone.slice(2)
      if (res.status === 200) {
        console.log(res.data.message);
        setUserName(data.userName);
        setEmail(data.email);
        setPhoneNumber(FormatedNumber);
        setAddress(data.address);
        setProfileImage(data.profileImg)
      }
    } catch (error) {
      console.log("Error retrieving user data:", error.message);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      setProfileImage( result.assets[0].uri);
      setImageUri(result.assets[0].uri);
      console.log("Image URI picked:", result.assets[0].uri); 
    }
  };

  console.log('imageProfile',profileImg);
  
  
  const handleEdit = async () => {
    setLoading(true);
  
    if (!imageUri && !profileImg ) {
      Toast.show({ type: "error", text1: "Please select an image first" });
      setLoading(false);
      return;
    }
  
    const formData = new FormData();
   
    formData.append("customerId", customerId);
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("phoneNumber", phoneNumber);
    formData.append("address", address);
  
    if (imageUri) {
      const fileName = imageUri.split("/").pop();
      const fileType = fileName.split(".").pop();
      formData.append("profileImg", {
        uri: imageUri,
        name: fileName,
        type: `image/${fileType}`,
      });
    }else if (profileImg) {
      formData.append("profileImg", profileImg);
    }
  
    try {
      console.log("Sending profile data:", formData);
  
      let attempts = 0;
      const maxAttempts = 3;
      let res;
  
      while (attempts < maxAttempts) {
        try {
          res = await AxiosService.post("customer/editCustomerProfile", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          break; 
        } catch (error) {
          attempts++;
          if (attempts === maxAttempts) {
            throw error; 
          }
          
          await new Promise(resolve => setTimeout(resolve, 1000)); 
        }
      }
  
      if (res.status === 200) {
        Toast.show({ type: "success", text1: "Profile updated successfully!" });
        getCustomerData()
      }
    } catch (error) {
      console.log("Error details:", error);
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
        Toast.show({ type: "error", text1: "An unexpected error occurred" });
      }
    } finally {
      setLoading(false);
    }
  };
  


  const onRefresh = async () => {
    setRefreshing(true);
    await getCustomerData();
    setRefreshing(false);
  };



  const handleLogout = () => {
    logout();
  };

  

  return (
    // main container
    <ScrollView
      style={styles.main_container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* user profile container */}
      <View style={styles.user_profile_main_container}>
        {/* profile picture container */}
        <View>
          {/* Profile Image */}
          <Image
            source={profileImg ? {uri:profileImg} : require("../../assets/Images/pro-pic.png")}
            style={styles.profile_pic}
          />
          {/* Image Edit Icon */}
          <Pressable style={styles.edit_icon_container} onPress={pickImage}>
            <Image
              source={require("../../assets/Images/edit-icon.png")}
              style={styles.edit_icon}
            />
          </Pressable>
        </View>
        {/* user info container */}
        <View style={styles.user_info_container}>
          {/* user name */}
          <Text style={styles.username_txt}>{userName}</Text>
          {/* user email */}
          <Text style={styles.useremail_txt}>{email}</Text>
          {/* user location */}
          <View style={styles.user_location_container}>
            {/* icon */}
            <Location name="location-dot" color={colors.dark_gray} />
            {/* location text */}
            <Text style={styles.useremail_txt}>{address}</Text>
          </View>
        </View>
      </View>
      {/* user info main container */}
      <View style={{ backgroundColor: colors.white }}>
        <View style={styles.user_info_edit_main_container}>
          {/* Name */}
          <Text style={styles.label}>Name</Text>
          <TextInput
            value={userName}
            onChangeText={setUserName}
            style={styles.input_fields}
          />
          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            style={styles.input_fields}
            onChangeText={setEmail}
          />
          {/* Phone Number */}
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            value={phoneNumber}
            style={styles.input_fields}
            onChangeText={setPhoneNumber}
            maxLength={10}
          />
          {/* Address */}
          <Text style={styles.label}>Address</Text>
          <TextInput
            value={address}
            style={styles.input_fields}
            onChangeText={setAddress}
          />
          {/* save changes button */}
          <TouchableOpacity onPress={handleEdit} style={styles.save_btn_container}>
            {loading?(<ActivityIndicator size="small" color={colors.white} />):(<Text style={styles.save_btn_txt}>Save changes</Text>)}
          </TouchableOpacity>
          {/* change password button */}
          {/* <Pressable
            style={styles.change_password_btn_container}
            onPress={() => navigation.navigate("ChangePassword",{customerId:customerId})}
          >
            <Text style={styles.change_password_btn_txt}>Change Password</Text>
            <Icon name="chevron-right" size={20} />
          </Pressable> */}
          {/* Logout button */}
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.logout_btn_container}
          >
            <Feather name="power" size={18} color={colors.white} />
            <Text style={styles.logout_btn_txt}>Log out</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Toast/>
    </ScrollView>
  );
};

export default MyProfile_screen;

const styles = StyleSheet.create({
  main_container: {
    backgroundColor: colors.light_gray,
  },
  // profile container style
  user_profile_main_container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: colors.white,
    paddingVertical: 20,
  },
  profile_pic: {
    width: wp(25),
    height: hp(12),
    objectFit: "cover",
    borderRadius: 100,
  },
  edit_icon: {
    width: 30,
    height: 30,
  },
  edit_icon_container: {
    position: "absolute",
    right: 10,
    bottom: 0,
    borderColor: colors.gray,
    borderWidth: 1,
    backgroundColor: colors.white,
    borderRadius: 100,
  },
  user_info_container: {
    paddingLeft: wp(7),
    width: "53%",
  },
  username_txt: {
    fontSize: hp(2.8),
    fontWeight: "700",
  },
  useremail_txt: {
    fontSize: hp(1.6),
    fontWeight: "500",
    color: colors.dark_gray,
  },
  user_location_container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 10,
  },
  // input fields container
  user_info_edit_main_container: {
    paddingHorizontal: 15,
    paddingTop: 20,
    backgroundColor: colors.light_gray,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },
  input_fields: {
    flex: 1,
    height: 37,
    fontSize: 15,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    borderRadius: 7,
    marginBottom: 20,
  },
  save_btn_container: {
    backgroundColor: colors.red,
    padding: 10,
    marginBottom: hp(1),
    borderRadius: 7,
  },
  save_btn_txt: {
    color: colors.white,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  // change password button style
  change_password_btn_container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    padding: 13,
    marginTop: hp(3),
    borderRadius: 7,
    borderColor: colors.dark_green,
    borderWidth: 1,
  },
  change_password_btn_txt: {
    fontSize: 15,
    fontWeight: "600",
  },
  // log out button style
  logout_btn_container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.blue,
    padding: 13,
    marginTop: hp(3),
    borderRadius: 7,
    gap: 10,
    marginBottom: hp(5),
  },
  logout_btn_txt: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
});
