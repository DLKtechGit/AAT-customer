import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Modal,
  ScrollView,
} from "react-native";
import React, { useState, useRef } from "react";
import { colors } from "../../utils/constants";
import moment from "moment";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AxiosService from "../../utils/AxiosService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Antdesign from "react-native-vector-icons/AntDesign";
import { useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const Notification_screen = () => {
  const [notificationData, setNotificationData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visibleMenuId, setVisibleMenuId] = useState(null); // Track visible menu
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 }); // Track menu position
  const { width } = useWindowDimensions();
  const [customerid, setCustomerId] = useState("");
  const navigation = useNavigation();
  const buttonRefs = useRef({});

  useFocusEffect(
    React.useCallback(() => {
      getCustomerNotifications();
    }, [])
  );

  const getCustomerNotifications = async () => {
    const user = await AsyncStorage.getItem("user");
    const customer = JSON.parse(user);
    const customerId = customer._id;
    setCustomerId(customerId);

    try {
      setLoading(true);
      const res = await AxiosService.post("customer/getCustomerNotification", {
        customerId,
      });
      const data = res.data.customerNotifications;
      if (res.status === 200) {
        await AxiosService.post("customer/notificatonReaded", {
          customerId,
        });

        setNotificationData(data);
        console.log("Notifications fetched");
      }
    } catch (error) {
      console.error(
        error.response ? error.response.data.message : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const OnRefresh = async () => {
    setRefreshing(true);
    await getCustomerNotifications();
    setRefreshing(false);
  };

  const handleNavigatetoBookings = () => {
    setVisibleMenuId(null);
    navigation.navigate("My Bookings");
  };

  const handleDelete = async (messageId) => {
    try {
      const res = await AxiosService.post("customer/deleteNotification", {
        customerid,
        messageId,
      });

      if (res.status === 200) {
        console.log("Notification Deleted");
        setNotificationData((prevData) =>
          prevData.filter((item) => item._id !== messageId)
        );
        setVisibleMenuId(null);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error.response ? error.response.data.message : error.message,
      });
    }
  };

  const toggleMenu = (itemId, ref) => {
    ref.measure((fx, fy, width, height, px, py) => {
      setMenuPosition({ x: px, y: py + height });
      setVisibleMenuId(itemId);
    });
  };

  const NotificationItem = React.memo(({ item }) => (
    <View style={styles.notification_list_main_container}>
      <View style={styles.header_section_main_container}>
        <View style={styles.icon_and_datetime_container}>
          <Image
            source={
              item.title === "Booking Approved" ||
              item.title === "Vehicle approved by admin"
                ? require("../../assets/Images/notification-bell.png")
                : require("../../assets/Images/notification-bell1.png")
            }
            style={styles.icon}
          />
          <View style={{ gap: 3 }}>
            <Text style={styles.heading_txt}>{item.title}</Text>
            <Text style={styles.date_time_txt}>
              {moment(item.dateAt).format("DD-MM-YYYY")} |{" "}
              {moment(item.dateAt).format("LT")}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          ref={(ref) => (buttonRefs.current[item._id] = ref)}
          onPress={() => toggleMenu(item._id, buttonRefs.current[item._id])}
          style={styles.menu_icon}
        >
          <Text style={{ fontSize: 20, color: colors.dark_gray }}>⋮</Text>
        </TouchableOpacity>

        {visibleMenuId === item._id && (
          <Modal
            transparent={true}
            visible={true}
            animationType="fade"
            onRequestClose={() => setVisibleMenuId(null)}
          >
            <TouchableOpacity
              style={styles.modal_overlay}
              activeOpacity={1}
              onPressOut={() => setVisibleMenuId(null)}
            >
              <View
                style={[
                  styles.menu_container,
                  {
                    top: menuPosition.y,
                    left:
                      menuPosition.x > width - 190
                        ? width - 190
                        : menuPosition.x,
                  },
                ]}
              >
                {item.title !== "Cancellation Penalty" && (
                  <TouchableOpacity
                    style={styles.menu_item}
                    onPress={handleNavigatetoBookings}
                  >
                    <FontAwesome
                      name="eye"
                      color={colors.dark_green}
                      size={20}
                    />
                    <Text style={styles.menu_text}>View </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[
                    styles.menu_item,
                    { borderTopWidth: 1, borderColor: colors.light_gray },
                  ]}
                  onPress={() => handleDelete(item._id)}
                >
                  <Antdesign name="delete" color={colors.red} size={20} />
                  <Text style={styles.menu_text}>Delete </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        )}
      </View>
      <Text style={styles.subject_txt}>{item.description}</Text>
    </View>
  ));

  return (
    <View style={styles.main_container}>
      {notificationData.length === 0 ? (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={OnRefresh} />
          }
          contentContainerStyle={styles.no_data_main_container}
        >
          <Image
            source={require("../../assets/Images/notification.png")}
            style={styles.img}
          />
          <Text style={styles.main_txt}>No Notifications</Text>
          <Text style={styles.sub_txt}>
            You do not have any notification at this time
          </Text>
        </ScrollView>
      ) : loading ? (
        <ActivityIndicator size="large" color={colors.dark_green} />
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={OnRefresh} />
          }
          showsVerticalScrollIndicator={false}
          data={[...notificationData].reverse()}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => <NotificationItem item={item} />}
        />
      )}
      <Toast />
    </View>
  );
};

export default Notification_screen;

const styles = StyleSheet.create({
  main_container: {
    backgroundColor: colors.very_light_gray,
    flex: 1,
    paddingTop: 15,
    paddingHorizontal: 15,
  },
  header_section_main_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  notification_list_main_container: {
    backgroundColor: colors.white,
    marginBottom: 15,
    padding: 15,
    elevation: 1.5,
    borderRadius: 10,
  },
  icon_and_datetime_container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  icon: {
    height: 45,
    width: 45,
  },
  heading_txt: {
    fontSize: 17,
    fontWeight: "600",
  },
  date_time_txt: {
    fontWeight: "500",
    fontSize: 13,
    color: colors.dark_gray,
  },
  subject_txt: {
    fontSize: 13.5,
    fontWeight: "500",
    color: colors.dark_gray,
  },
  menu_icon: {
    padding: 8,
  },
  modal_overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  menu_container: {
    position: "absolute",
    backgroundColor: colors.white,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: 170,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginTop: -30,
  },
  menu_item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  menu_text: {
    fontSize: 16,
    color: colors.dark_gray,
    marginLeft: 10,
  },
  no_data_main_container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(15),
    gap: 10,
  },
  img: {
    height: hp(21),
    width: wp(45.1),
  },
  main_txt: {
    fontSize: 25,
    fontWeight: "800",
    color: colors.dark_green,
  },
  sub_txt: {
    fontSize: 16,
    maxWidth: wp(60),
    textAlign: "center",
    fontWeight: "500",
    color: colors.dark_gray,
  },
});
