import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/AntDesign";
import { colors } from "../../utils/constants";
import * as DocumentPicker from "expo-document-picker";

const BecomeVendor_screen = ({ navigation }) => {
  const [insurance, setInsurance] = useState([]);
  const [rcBook, setRcbook] = useState([]);
  const [license, setLicense] = useState([]);

  //picking document functionality
  const PickDocument = async (setDocumentState) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/jpeg", "application/pdf"],
        multiple: true,
      });
      console.log("picked document", result);

      if (result.assets && result.assets.length > 0) {
        const validDocuments = result.assets.filter(
          (doc) =>
            doc.mimeType === "image/jpeg" || doc.mimeType === "application/pdf"
        );

        if (validDocuments.length > 0) {
          setDocumentState((prevDocuments) => [
            ...prevDocuments,
            ...validDocuments,
          ]);
        } else {
          Alert.alert(
            "Invalid File Type",
            "Please choose JPEG images or PDF documents."
          );
        }
      } else {
        Alert.alert(
          "No Document Selected",
          "Please select at least one document."
        );
      }
    } catch (error) {
      console.log("Error picking documents", error);
    }
  };

  // displaying the selected document / image functionality
  const renderDocument = (documents) => {
    if (!documents || documents.length === 0) return null;

    return documents.map((document, index) => {
      const { uri, mimeType, name } = document;
      return (
        <View key={index} style={styles.doc_container}>
          <Text style={styles.sub_heading_txt}>selected document</Text>
          {mimeType && mimeType.startsWith("image/") ? (
            <View style={styles.doc_img_container}>
              <Image source={{ uri }} style={styles.image} />
            </View>
          ) : (
            <Text style={styles.doc_name}>
              {name ? name : "No name available"}
              {/* (
              {mimeType ? mimeType : "No format available"}
              ) */}
            </Text>
          )}
        </View>
      );
    });
  };

  return (
    // main container
    <View style={styles.main_container}>
      {/* nav container */}
      <Pressable
        style={styles.nav_container}
        onPress={() => navigation.navigate("MainHome")}
      >
        <Icon name="arrowleft" size={30} />
      </Pressable>
      {/* content container */}
      <View style={styles.content_container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.heading_txt}>
            To attach your vehicle with AAT, you need to provide the following
            details
          </Text>
          {/*vendor name field */}
          <View style={styles.input_field_container}>
            <Text style={styles.label}>Vendor Name</Text>
            <TextInput style={styles.input_field} />
          </View>
          {/* phone number field */}
          <View style={styles.input_field_container}>
            <Text style={styles.label}>Vendor phone number</Text>
            <TextInput style={styles.input_field} />
          </View>
          {/* insurance */}
          <View style={styles.input_field_container}>
            <Text style={styles.label}>Insurence</Text>
            <Pressable
              style={styles.container}
              onPress={() => PickDocument(setInsurance)}
            >
              <Image
                source={require("../../assets/Images/file.png")}
                style={styles.img}
              />
              <Text style={styles.sub_txt}>Click to upload file</Text>
            </Pressable>
            {/* displaying selected document */}
            {renderDocument(insurance)}
          </View>
          {/* Rc book */}
          <View style={styles.input_field_container}>
            <Text style={styles.label}>Rc book</Text>
            <Pressable
              style={styles.container}
              onPress={() => PickDocument(setRcbook)}
            >
              <Image
                source={require("../../assets/Images/file.png")}
                style={styles.img}
              />
              <Text style={styles.sub_txt}>Click to upload file</Text>
            </Pressable>
            {/* displaying selected document */}
            {renderDocument(rcBook)}
          </View>
          {/* license */}
          <View style={styles.input_field_container}>
            <Text style={styles.label}>License</Text>
            <Pressable
              style={styles.container}
              onPress={() => PickDocument(setLicense)}
            >
              <Image
                source={require("../../assets/Images/file.png")}
                style={styles.img}
              />
              <Text style={styles.sub_txt}>Click to upload file</Text>
            </Pressable>
            {/* displaying selected document */}
            {renderDocument(license)}
          </View>
          {/* button */}
          <TouchableOpacity style={styles.btn_container}>
            <Text style={styles.btn_txt}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

export default BecomeVendor_screen;

const styles = StyleSheet.create({
  main_container: {
    backgroundColor: colors.light_gray,
    flex: 1,
  },
  nav_container: {
    padding: 15,
    paddingTop: 40,
  },
  content_container: {
    backgroundColor: colors.white,
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 15,
  },
  heading_txt: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: 15,
    marginBottom: 20,
    backgroundColor: colors.dark_green,
    color: colors.white,
    padding: 5,
    borderRadius: 10,
  },
  // input field style
  input_field_container: {
    backgroundColor: colors.light_gray,
    padding: 10,
    borderRadius: 10,
    marginBottom: 25,
  },
  input_field: {
    borderColor: colors.dark_gray,
    borderWidth: 1,
    flex: 1,
    height: 40,
    borderRadius: 10,
    padding: 10,
  },
  img: {
    width: 50,
    height: 50,
  },
  container: {
    alignItems: "center",
    borderColor: colors.dark_gray,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  //submit button style
  btn_container: {
    backgroundColor: colors.dark_green,
    width: "100%",
    padding: 8,
    borderRadius: 6,
    marginVertical: 15,
  },
  btn_txt: {
    textAlign: "center",
    color: colors.white,
    fontWeight: "500",
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 10,
  },
  // rendered documents style
  doc_container: {
    paddingTop: 10,
    alignItems: "center",
  },
  doc_name: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
    color: colors.dark_green,
    backgroundColor: colors.white,
    padding: 5,
    width: "100%",
    borderRadius: 5,
    borderColor: colors.light_green,
    borderWidth: 1,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  doc_img_container: {
    width: "100%",
    borderRadius: 5,
    borderColor: colors.light_green,
    borderWidth: 1,
    backgroundColor: colors.white,
    alignItems: "center",
  },
  sub_heading_txt: {
    marginBottom: 5,
    fontSize: 14,
    fontWeight: "500",
  },
});
