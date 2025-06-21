import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableWithoutFeedback,
  Image,
  Pressable,
} from "react-native";
import React from "react";
import { colors } from "../../utils/constants";
import Close from "react-native-vector-icons/AntDesign";

const Medium_vehicle_modal = ({ onClose }) => {
  return (
    <Modal transparent={true} visible={true} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        {/* modal background */}
        <View style={styles.modal_background}>
          {/* modal content */}
          <View style={styles.modal_container}>
            {/* vehicle img */}
            <Image
              source={require("../../assets/Images/medium-truck.png")}
              style={styles.vehicle_img}
            />
            {/* weight and dimensions info */}
            <View style={styles.info_container}>
              <Text style={styles.txt}>750 Kg</Text>
              <Text style={styles.txt}>7ft × 4ft × 5ft</Text>
            </View>

            {/* button */}
            <Pressable onPress={onClose} style={styles.btn_container}>
              <Text style={styles.btn_txt}>Done</Text>
            </Pressable>
            <Close
              name="closecircleo"
              size={20}
              color={colors.dark_gray}
              style={styles.close_icon}
              onPress={onClose}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default Medium_vehicle_modal;

const styles = StyleSheet.create({
  modal_background: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  vehicle_img: {
    width: 120,
    height: 120,
    marginVertical: 10,
  },
  modal_container: {
    width: "90%",
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  info_container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
    paddingBottom: 15,
    width: "100%",
  },
  txt: {
    backgroundColor: colors.light_gray,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    fontWeight: "500",
  },
  btn_container: {
    backgroundColor: colors.dark_green,
    paddingHorizontal: 25,
    paddingVertical: 7,
    marginVertical: 15,
    borderRadius: 7,
  },
  btn_txt: {
    color: colors.white,
    fontWeight: "600",
  },
  close_icon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});
