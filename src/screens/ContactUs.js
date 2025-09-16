import React, { useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  Text,
  TextInput,
  Linking,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StyleSheet,
  Alert,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";

const { width } = Dimensions.get("window");

//local imports
import GreetingText from "../components/GreetingText";
import Menu from "../components/Menu";
import BottomMenu from "../components/BottomMenu";

const ContactUs = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleWhatsAppClick = (phoneNumber) => {
    // Format the phone number for WhatsApp link
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}`;

    // Open WhatsApp with the link
    Linking.openURL(url).catch((err) => {
      console.error("Error opening WhatsApp:", err);
      Alert.alert(
        "Error",
        "Could not open WhatsApp. Please ensure it's installed."
      );
    });
  };

  const onPressShowMenu = () => {
    setShowMenu(true);
  };

  const onPressCloseMenu = () => {
    setShowMenu(false);
  };

  const onChangeFirstName = (text) => {
    console.log(text);
    setFirstName(text);
  };

  const onChangeEmailAdrress = (text) => {
    console.log(text);
    setEmailAddress(text);
  };

  const onChangePhoneNumber = (text) => {
    console.log(text);
    setPhoneNumber(text);
  };

  const onChangeMessage = (text) => {
    console.log(text);
    setMessage(text);
  };

  const onPressSendMessage = () => {
    if (
      firstName === "" ||
      emailAddress === "" ||
      phoneNumber === "" ||
      message === ""
    ) {
      Alert.alert("Please fill all fields");
    } else {
      setLoading(true);

      console.log(firstName, emailAddress, phoneNumber, message);
      fetch("https://sswellness.com.my/contact-us/", {
        method: "post",
        headers: {
          "Content-Type": "application/json", // Specify you're sending JSON
          Accept: "*/*", // Adding 'Accept' header to match the curl example
        },
        body: JSON.stringify({
          "name-1": firstName,
          "email-1": firstName,
          "phone-1": firstName,
          "text-area-1": firstName,
        }),
      })
        .then((res) => res.text())
        .then((data) => {
          setLoading(false);
          Alert.alert("Message sent successfully");
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
          Alert.alert(err.message);
        });
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.outerMainContainer}>
          <View style={styles.greetingMainContainer}>
            <TouchableOpacity onPress={onPressShowMenu}>
              <Ionicons name="menu-sharp" size={30} color="white" />
            </TouchableOpacity>
            <View>
              <GreetingText />
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Notifications")}
            >
              <Ionicons name="notifications-outline" size={24} color="white" />
              {/* <FontAwesome name="calendar-check-o" size={24} color="white" /> */}
            </TouchableOpacity>
          </View>
          {showMenu === true ? (
            <Menu onPress={onPressCloseMenu} activePage={"contactUs"} />
          ) : null}
          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            <View>
              <View style={styles.outletSection}>
                <View>
                  <Text style={styles.sectionHeading}>CONTACT US</Text>
                </View>
                <View style={styles.outletItemListing}>
                  <View style={styles.outletItem}>
                    <TouchableOpacity
                      onPress={() => handleWhatsAppClick("+6017-4181788")}
                    >
                      <View style={styles.outletTextSection}>
                        <Feather name="phone" size={20} color="white" />
                        <Text style={styles.outletText}>
                          {"Call Us @ Air Itam Farlim"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.outletItem}>
                    <TouchableOpacity
                      onPress={() => handleWhatsAppClick("+6017-4998980")}
                    >
                      <View style={styles.outletTextSection}>
                        <Feather name="phone" size={20} color="white" />
                        <Text style={styles.outletText}>
                          {"Call Us @ Georgetown"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.outletItem}>
                    <TouchableOpacity
                      onPress={() => handleWhatsAppClick("+6012-5241335")}
                    >
                      <View style={styles.outletTextSection}>
                        <Feather name="phone" size={20} color="white" />
                        <Text style={styles.outletText}>
                          {"Call Us @ Jelutong"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.outletItem}>
                    <TouchableOpacity
                      onPress={() => handleWhatsAppClick("+6012-5952728")}
                    >
                      <View style={styles.outletTextSection}>
                        <Feather name="phone" size={20} color="white" />
                        <Text style={styles.outletText}>
                          {"Call Us @ Bayan lepas"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.outletItem}>
                    <TouchableOpacity
                      onPress={() => handleWhatsAppClick("+6012-2237088")}
                    >
                      <View style={styles.outletTextSection}>
                        <Feather name="phone" size={20} color="white" />
                        <Text style={styles.outletText}>
                          {"Call Us @ Lebuh Farquhar"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.outletItem}>
                    <TouchableOpacity
                      onPress={() => handleWhatsAppClick("+6012-4989788")}
                    >
                      <View style={styles.outletTextSection}>
                        <Feather name="phone" size={20} color="white" />
                        <Text style={styles.outletText}>
                          {"Call Us @ Kuala Lumpur (Kuchai Lama)"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.contactUsFormSection}>
                  <View style={styles.formField}>
                    <View style={styles.formLabelField}>
                      <Text style={styles.formLabelFieldMainText}>
                        First Name
                      </Text>
                    </View>
                    <View>
                      <TextInput
                        style={styles.inputField}
                        value={firstName}
                        onChangeText={onChangeFirstName}
                      />
                    </View>
                    <View>
                      {/* {loginValidationFields.password === true ? <Text style={styles.validationText}>This field is required</Text> : null} */}
                    </View>
                  </View>
                  <View style={styles.formField}>
                    <View style={styles.formLabelField}>
                      <Text style={styles.formLabelFieldMainText}>
                        Email Address
                      </Text>
                    </View>
                    <View>
                      <TextInput
                        style={styles.inputField}
                        onChangeText={onChangeEmailAdrress}
                      />
                    </View>
                    <View>
                      {/* {loginValidationFields.password === true ? <Text style={styles.validationText}>This field is required</Text> : null} */}
                    </View>
                  </View>
                  <View style={styles.formField}>
                    <View style={styles.formLabelField}>
                      <Text style={styles.formLabelFieldMainText}>
                        Phone Number
                      </Text>
                    </View>
                    <View>
                      <TextInput
                        style={styles.inputField}
                        onChangeText={onChangePhoneNumber}
                      />
                    </View>
                    <View>
                      {/* {loginValidationFields.password === true ? <Text style={styles.validationText}>This field is required</Text> : null} */}
                    </View>
                  </View>
                  <View style={styles.formField}>
                    <View style={styles.formLabelField}>
                      <Text style={styles.formLabelFieldMainText}>Message</Text>
                    </View>
                    <View>
                      <TextInput
                        style={styles.textAreaInputField}
                        multiline={true}
                        numberOfLines={4}
                        textAlignVertical="top"
                        onChangeText={onChangeMessage}
                      />
                    </View>
                    <View>
                      {/* {loginValidationFields.password === true ? <Text style={styles.validationText}>This field is required</Text> : null} */}
                    </View>
                  </View>
                  <View style={styles.formField}>
                    <View>
                      <Pressable
                        style={styles.loginButton}
                        disabled={loading}
                        onPress={onPressSendMessage}
                      >
                        {loading ? (
                          <Text style={styles.loginButtonText}>Sending...</Text>
                        ) : (
                          <Text style={styles.loginButtonText}>
                            Send Message
                          </Text>
                        )}
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
        <BottomMenu />
      </KeyboardAvoidingView>
    </>
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  outerMainContainer: {
    backgroundColor: "#3C3C3B",
    flex: 1,
  },
  greetingMainContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    paddingTop: 25,
    paddingBottom: 25,
    backgroundColor: "#3C3C3B",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.1,
    elevation: 5,
  },
  greetingText: {
    color: "#FFFFFF",
    fontFamily: "MontserratRegular",
    fontSize: 16,
  },
  //Outlet css
  outletSection: {
    width: width,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
    marginTop: 20,
    paddingBottom: 120,
  },
  sectionHeading: {
    color: "#FFFFFF",
    fontFamily: "MontserratRegular",
    fontSize: 20,
  },
  outletItemListing: {
    width: width,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "baseline",
    gap: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  outletItem: {
    display: "flex",
    flexDirection: "column",
    width: width,
  },
  outletItemImage: {
    width: "100%",
    height: width,
    objectFit: "cover",
  },
  outletTextSection: {
    display: "flex",
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  outletText: {
    fontFamily: "MontserratLight",
    width: "90%",
    textAlign: "left",
    fontSize: 14,
    color: "#FFFFFF",
  },
  //Menu css
  menuSection: {
    width: width,
    height: 85,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#3C3C3B",
    position: "absolute",
    bottom: 0,
    left: 0,
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 0,
    borderBottomWidth: 0,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  menuItemText: {
    fontFamily: "MontserratRegular",
    fontSize: 12,
    color: "#FFFFFF",
  },
  menuItemSmallText: {
    fontFamily: "MontserratRegular",
    fontSize: 12,
    color: "#FFFFFF",
  },
  activeMenuItemText: {
    fontFamily: "MontserratRegular",
    fontSize: 12,
    color: "#A27C6B",
  },
  contactUsFormSection: {
    padding: 15,
    width: "100%",
    gap: 5,
  },
  formField: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  formLabelField: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  formLabelFieldMainText: {
    fontSize: 14,
    fontFamily: "MontserratLight",
    fontWeight: "500",
    color: "#FFFFFF",
  },
  formLabelFieldOtherText: {
    fontSize: 12,
    fontFamily: "MontserratBold",
    color: "#FFFFFF",
  },
  inputField: {
    borderWidth: 1,
    height: 40,
    borderRadius: 6,
    borderColor: "#e5e7eb",
    fontSize: 14,
    paddingLeft: 15,
    color: "#FFFFFF",
    fontFamily: "MontserratLight",
  },
  textAreaInputField: {
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "#e5e7eb",
    fontSize: 16,
    height: 100,
    paddingLeft: 15,
    color: "#FFFFFF",
    fontFamily: "MontserratLight",
  },
  loginButton: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    height: 40,
    borderRadius: 6,
    width: 130,
  },
  loginButtonText: {
    color: "#3C3C3B",
    textAlign: "center",
    fontSize: 14,
    fontFamily: "MontserratRegular",
  },
  container: {
    flex: 1,
    backgroundColor: "#3C3C3B",
  },
});
