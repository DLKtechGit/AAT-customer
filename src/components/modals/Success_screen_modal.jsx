import React, { useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import successImg from "../../assets/Images/successicon.png";
import { colors } from "../../utils/constants";
import Icon from "react-native-vector-icons/Entypo";

const Success_screen_modal = ({ visible, onclose }) => {
  return (
    <View>
      <Modal visible={visible} animationType="fade" transparent={true}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ alignItems: "center", marginTop: 150 }}>
              <Image
                style={styles.ModalImage}
                source={successImg}
                alt="success"
              />
              <Text style={styles.bookingText}>
                Your booking has been successfully placed !
              </Text>
              <Text style={styles.bookingSubText}>
                You will receive a confirmation Call by vendor shortly.
              </Text>
              <TouchableOpacity style={styles.button} onPress={onclose}>
                <Text
                  style={{
                    color: colors.dark_gray,
                    fontSize: 16,
                    fontWeight: "700",
                  }}
                >
                  View Booking
                </Text>
                <Icon
                  name="chevron-small-right"
                  size={25}
                  color={colors.dark_green}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    width: "100%",
    height: "100%",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  ModalImage: {
    width: 200,
    height: 200,
  },
  bookingText: {
    marginTop: 10,
    color: "black",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  bookingSubText: {
    marginTop: 10,
    color: colors.dark_gray,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    width: 250,
  },
  button: {
    borderWidth: 1,
    borderColor: colors.dark_green,
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    flexDirection: "row",
    paddingHorizontal: 35,
    gap: 10,
    marginTop: 50,
  },
});

export default Success_screen_modal;
