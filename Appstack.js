import { View, Text, TouchableOpacity } from "react-native";
import React,{useState,useEffect} from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useContext } from "react";
import { AuthContext } from "./src/utils/AuthContext";
import Notify from "react-native-vector-icons/Ionicons"; 
import Signup_screen from "./src/screens/Signup_screen";
import Reset_password_screen from "./src/screens/Reset_password_screen";
import Home_screen from "./src/screens/main_screens/Home_screen";
import MyBookings_screen from "./src/screens/main_screens/MyBookings_screen";
import MyProfile_screen from "./src/screens/main_screens/MyProfile_screen";
import BecomeVendor_screen from "./src/screens/main_screens/BecomeVendor_screen";
import Custom_drawer_style from "./src/utils/Custom_drawer_style";
import Menu_icon from "react-native-vector-icons/Entypo";
import Home_Icon from "react-native-vector-icons/Octicons";
import Booking_Icon from "react-native-vector-icons/SimpleLineIcons";
import User_Icon from "react-native-vector-icons/Feather";
import Support_Icon from "react-native-vector-icons/AntDesign";
import { colors } from "./src/utils/constants";
import Support_screen from "./src/screens/main_screens/Support_screen";
import AutoMain_screen from "./src/screens/passenger_vehicles/AutoMain_screen";
import CarMain_screen from "./src/screens/passenger_vehicles/CarMain_screen";
import CarDetails from "./src/components/passengers_vehicles/CarDetails";
import AutoDetails from "./src/components/passengers_vehicles/AutoDetails";
import VanDetails from "./src/components/passengers_vehicles/VanDetails";
import VanMain_screen from "./src/screens/passenger_vehicles/VanMain_screen";
import BusMain_screen from "./src/screens/passenger_vehicles/BusMain_screen";
import BusDetails from "./src/components/passengers_vehicles/BusDetails";
import ChangePassword_screen from "./src/screens/ChangePassword_screen";
import OtpInput_screen from "./src/screens/OtpInput_screen";
import NewPassword_screen from "./src/screens/NewPassword_screen";
import SmallMain_screen from "./src/screens/goods_vehicles/SmallMain_screen";
import SmallVehicleDetails from "./src/components/goods_vehicles/SmallVehicleDetails";
import MediumMain_screen from "./src/screens/goods_vehicles/MediumMain_screen";
import MediumVehicleDetails from "./src/components/goods_vehicles/MediumVehicleDetails";
import LargeMain_screen from "./src/screens/goods_vehicles/LargeMain_screen";
import LargeVehicleDetails from "./src/components/goods_vehicles/LargeVehicleDetails";
import XLargeMain_screen from "./src/screens/goods_vehicles/XLargeMain_screens";
import XLargeVehicleDetails from "./src/components/goods_vehicles/XLargeVehicleDetails";
import CarBookings_details from "./src/components/passenger_booking_details/CarBookings_details";
import VanBookings_details from "./src/components/passenger_booking_details/VanBookings_details";
import BusBookings_details from "./src/components/passenger_booking_details/BusBookings_details";
import SmallBookings_details from "./src/components/goods_bookings_details/SmallBookings_details";
import MediumBookings_details from "./src/components/goods_bookings_details/MediumBookings_details";
import LargeBookings_details from "./src/components/goods_bookings_details/LargeBookings_details";
import XL_Bookings_details from "./src/components/goods_bookings_details/XL_Bookings_details";
import Notification_screen from "./src/screens/main_screens/Notification_screen";
import Bell from "react-native-vector-icons/MaterialIcons";
import { Badge } from 'react-native-paper';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AxiosService from "./src/utils/AxiosService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SampleScreen from "./src/components/SampleScreen";
import LoginWithPhone from "./src/screens/main_screens/LoginWithPhone";
import LoginOTPVerification from "./src/screens/main_screens/LoginOTPVerification";

const stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const Appstack = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [notificationCount, setnotificationCount] = useState(0);

  const getNotificationCount = async () => {
    const vendor = await AsyncStorage.getItem("user");
    const customer = JSON.parse(vendor);
    const customerId = customer._id;
    try {
      const res = await AxiosService.post("customer/getCustomerNotification", {
        customerId,
      });
      const data = res.data.customerNotifications.filter(
        (item) => item.readed === false
      );
      const count = data.length;
      if (res.status === 200) {
        setnotificationCount(count);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      getNotificationCount();
    }
  }, [isAuthenticated]);
  

  return (
    <stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Login"
    >
      {isAuthenticated ? (
        <stack.Screen name="MainHome">
      {() => <HomeNavigation getNotificationCount={getNotificationCount}  notificationCount={notificationCount} />}
    </stack.Screen>      
    // <stack.Screen name="Success" component={Success_screen_modal}/>

    
  ) : (
        <>
          {/* <stack.Screen name="Login" component={Login_screen} /> */}
          <stack.Screen name="Login" component={LoginWithPhone} />
          <stack.Screen name="Login OTP Verify" component={LoginOTPVerification} />
          <stack.Screen name="SignUp" component={Signup_screen} />
          <stack.Screen
            name="Reset_password"
            component={Reset_password_screen}
          />
          <stack.Screen name="NewPassword" component={NewPassword_screen} />
          <stack.Screen name="Otp" component={OtpInput_screen} />
        </>
      )}
     
      <stack.Screen name="ChangePassword" component={ChangePassword_screen} />
      <stack.Screen name="Become_vendor" component={BecomeVendor_screen} />
      {/* passenger vehicle */}
      <stack.Screen name="Auto_main" component={AutoMain_screen} />
      <stack.Screen name="Car_main" component={CarMain_screen} />
      <stack.Screen name="Van_main" component={VanMain_screen} />
      <stack.Screen name="Bus_main" component={BusMain_screen} />
      <stack.Screen name="CarDetails" component={CarDetails} />
      <stack.Screen name="AutoDetails" component={AutoDetails} />
      <stack.Screen name="VanDetails" component={VanDetails} />
      <stack.Screen name="BusDetails" component={BusDetails} />
      <stack.Screen name="CarBookingDetails" component={CarBookings_details} />
      <stack.Screen name="VanBookingDetails" component={VanBookings_details} />
      <stack.Screen name="BusBookingsDetails" component={BusBookings_details} />
      {/* goods vehicle */}
      <stack.Screen name="Small_main" component={SmallMain_screen} />
      <stack.Screen name="Medium_main" component={MediumMain_screen} />
      <stack.Screen name="Large_main" component={LargeMain_screen} />
      <stack.Screen name="XL_main" component={XLargeMain_screen} />
      <stack.Screen
        name="SmallVehicle_details"
        component={SmallVehicleDetails}
      />
      <stack.Screen
        name="MediumVehicle_details"
        component={MediumVehicleDetails}
      />
      <stack.Screen
        name="LargeVehicle_details"
        component={LargeVehicleDetails}
      />
      <stack.Screen
        name="XLargeVehicle_details"
        component={XLargeVehicleDetails}
      />
      <stack.Screen
        name="SmallBookingsDetails"
        component={SmallBookings_details}
      />
      <stack.Screen
        name="MediumBookingsDetails"
        component={MediumBookings_details}
      />
      <stack.Screen
        name="LargeBookingsDetails"
        component={LargeBookings_details}
      />
      <stack.Screen
        name="Sample"
        component={SampleScreen}
      />
      <stack.Screen name="XL_BookingsDetails" component={XL_Bookings_details} />
    </stack.Navigator>
  );
};

// drawer navigation
const HomeNavigation = ({notificationCount , getNotificationCount}) => {
const navigation = useNavigation()


 

  

  return (
    <Drawer.Navigator
  drawerContent={(props) => <Custom_drawer_style {...props} />}
  initialRouteName="Home"
  screenOptions={({ navigation }) => ({
    drawerLabelStyle: {
      fontSize: 16,
      marginLeft: -17,
    },
    headerLeft: () => (
      <Menu_icon
        name="menu"
        size={30}
        style={{ marginLeft: 20 }}
        onPress={navigation.toggleDrawer}
      />
    ),
    drawerActiveBackgroundColor: colors.label_green,
    drawerActiveTintColor: colors.black,
    headerStyle: {
      backgroundColor: colors.light_gray,
    },
  })}
>
  {/* Home screen */}
  <Drawer.Screen 
  name="Home"
  options={{
    drawerIcon: ({ color }) => <Home_Icon name="home" size={20} color={color} />,
    headerRight: () => (
      <>
      <TouchableOpacity onPress={()=>navigation.navigate('Notifications')}> 
        {notificationCount>0 && <Badge style={{ position: "absolute", top: -8, right: 22 }}>{notificationCount}</Badge>}
        <Bell name="notifications" style={{ marginRight: 30 }} size={30} />
        </TouchableOpacity>
      </>
    ),
  }}
>
  {props => (
    <Home_screen
      {...props}
      getNotificationCount={getNotificationCount} // Passing function as prop
    />
  )}
</Drawer.Screen>
  {/* Profile screen */}
  <Drawer.Screen
    name="My Profile"
    component={MyProfile_screen}
    options={{
      drawerIcon: ({ color }) => <User_Icon name="user" size={20} />,
    }}
  />
  {/* My Bookings screen */}
  <Drawer.Screen
    name="My Bookings"
    component={MyBookings_screen}
    options={{
      drawerIcon: ({ color }) => <Booking_Icon name="book-open" size={20} />,
    }}
  />
  <Drawer.Screen
    name="Notifications"
    component={Notification_screen}
    options={{
      drawerIcon: ({ color }) => <Notify name="notifications" size={15} />,
    }}
  />
  {/* Support screen */}
  <Drawer.Screen
    name="Support"
    component={Support_screen}
    options={{
      drawerIcon: ({ color }) => <Support_Icon name="customerservice" size={20} />,
    }}
  />
</Drawer.Navigator>

  );
};

export default Appstack;
