import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native"; // Import this hook
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WebView from "react-native-webview";
import Ionicons from "@expo/vector-icons/Ionicons";

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

//local imports
import GreetingText from "../components/GreetingText";
import Menu from "../components/Menu";
import BottomMenu from "../components/BottomMenu";
import { API_PATH } from "../../ApiPath";

const PurchasePoints = ({ navigation }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noOfPoints, setNoOfPoints] = useState("");
  const [totalAmountToPay, setTotalAmountToPay] = useState("");
  const [priceOfPoints, setPriceOfPoints] = useState(1);
  const [paymenyUrl, setPaymentUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const pointsOptions = [
    { label: "10 Points", value: 10 },
    { label: "20 Points", value: 20 },
    { label: "30 Points", value: 30 },
    { label: "50 Points", value: 50 },
    { label: "100 Points", value: 100 },
  ];

  useFocusEffect(
    React.useCallback(() => {
      const getUserPhone = async () => {
        const userPhone = await AsyncStorage.getItem("appUserPhone");
        console.log(userPhone);
        if (userPhone) {
          setPhone(userPhone);
        } else {
          await AsyncStorage.removeItem("accessToken");
          await AsyncStorage.removeItem("expiresIn");
          navigation.navigate("Login");
        }
      };
      getUserPhone();

      // Return a cleanup function if needed when the screen goes out of focus
      return () => {
        console.log("Cleanup if necessary");
      };
    }, []) // Empty dependency array ensures the effect runs every time screen is focused
  );

  const onPressShowMenu = () => {
    setShowMenu(true);
  };

  const onPressCloseMenu = () => {
    setShowMenu(false);
  };

  const onChangeNumberOfPoints = (text) => {
    // Check if text is a valid number and not emptyr
    setNoOfPoints(Number(text));
    setTotalAmountToPay(Number(text) * Number(priceOfPoints));
  };

  const handleSelectItem = (value) => {
    console.log(value);
    setNoOfPoints(Number(value));
    setTotalAmountToPay(Number(value) * Number(priceOfPoints));
    setModalVisible(false);
  };

  const onPressBuyButton = () => {
    if (noOfPoints > 1 && totalAmountToPay > 1) {
      setLoading(true);
      console.log("Buy Action");

      const numberOfPoints = Number(noOfPoints);
      const totalAmountToPay = Number(noOfPoints) * Number(priceOfPoints);
      console.log("TOTAL POINTS TO PURCHASE: ", numberOfPoints);
      console.log("TOTAL AMOUNT TO PAY: ", totalAmountToPay);

      fetch(`${API_PATH}/create-payment`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numberOfPoints: numberOfPoints,
          totalAmountToPay: totalAmountToPay,
          phone: phone,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          console.log(data);
          if (data.paymentUrl) {
            setPaymentUrl(data.paymentUrl);
            setPaymentId(data.paymentId);
          } else {
            Alert.alert("Error", "Unable to make payment request", [
              { text: "OK" },
            ]);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          Alert.alert("Error", "Unable to make payment request", [
            { text: "OK" },
          ]);
        });
    } else {
      Alert.alert("Invalid Details", "Please enter valid number of points", [
        { text: "OK" },
      ]);
    }
  };

  // Detect navigation changes in WebView
  const handleWebViewNavigation = (event) => {
    setLoading(true);
    const { url } = event;
    console.log(event);
    console.log("NO OF POINTS: ", noOfPoints);
    // Check for payment success
    if (url.includes("sswellnesstestpaymentsuccess")) {
      setPaymentUrl(""); // Close WebView
      setTimeout(() => {
        //post req to check if payment success, then update user points
        fetch(`${API_PATH}/update-points-purchased`, {
          method: "put",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentId: paymentId,
            phone: phone,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            setLoading(false);
            if (data === "success") {
              console.log("PAYMENT SUCCESSFUL");
              console.log(
                `${noOfPoints} APP POINTS HAVE BEEN CREDITED TO YOUR ACCOUNT`
              );
              Alert.alert(
                "Payment Successful!",
                `${noOfPoints} points have been credited to your account.`
              );
            } else if (data === "fail") {
              console.log("PAYMENT FAIL");
              console.log(
                `${noOfPoints} APP POINTS HAVE BEEN CREDITED TO YOUR ACCOUNT`
              );
              Alert.alert("Payment Fail!", `Try again later`);
            } else {
              console.log("PAYMENT FAIL");
              console.log(
                `${noOfPoints} APP POINTS HAVE BEEN CREDITED TO YOUR ACCOUNT`
              );
              Alert.alert("Payment Fail!", `Try again later`);
            }
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
            setLoading(false);
            Alert.alert("Error", "Something wrong with with the server", [
              { text: "OK" },
            ]);
          });
      }, 3000);
    }
  };

  if (loading == true && paymenyUrl === "") {
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
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color="white"
                />
                {/* <FontAwesome name="calendar-check-o" size={24} color="white" /> */}
              </TouchableOpacity>
            </View>
            {showMenu === true ? (
              <Menu onPress={onPressCloseMenu} activePage={"purchasePoints"} />
            ) : null}
            <ScrollView
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              <View style={styles.mainFormConatiner}>
                <View style={styles.mainFormInnerContainer}>
                  <ActivityIndicator size="large" color="#FFFFFF" />
                </View>
              </View>
            </ScrollView>
          </View>
          <BottomMenu />
        </KeyboardAvoidingView>
      </>
    );
  } else if (loading === false && paymenyUrl === "") {
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
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color="white"
                />
                {/* <FontAwesome name="calendar-check-o" size={24} color="white" /> */}
              </TouchableOpacity>
            </View>
            {showMenu === true ? (
              <Menu onPress={onPressCloseMenu} activePage={"purchasePoints"} />
            ) : null}
            <ScrollView
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              <View style={styles.mainFormConatiner}>
                <View style={styles.mainFormInnerContainer}>
                  <Text style={styles.sectionHeading}>PURCHASE POINTS</Text>
                  <View style={styles.formField}>
                    <View style={styles.formLabelField}>
                      <Text style={styles.formLabelFieldMainText}>
                        Number Of Points
                      </Text>
                    </View>
                    {/* <View>
                      <Picker
                        selectedValue={noOfPoints}
                        onValueChange={(itemValue) =>
                          onChangeNumberOfPoints(itemValue)
                        }
                        style={{backgroundColor: "#FFFFFF"}}
                      >
                        <Picker.Item label="Select Points" value="" />
                        {pointsOptions.map((option) => (
                          <Picker.Item
                            key={option.value}
                            label={option.label}
                            value={option.value}
                            color="#000"
                          />
                        ))}
                      </Picker>
                    </View> */}
                    <View style={styles.dropdowncontainer}>
                      {/* Custom dropdown trigger */}
                      <TouchableOpacity
                        style={styles.dropdownButton}
                        onPress={() => setModalVisible(true)}
                      >
                        <Text style={styles.selectedText}>
                          {noOfPoints ? noOfPoints : "Select Points"}
                        </Text>
                      </TouchableOpacity>

                      {/* Modal to show dropdown options */}
                      <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                      >
                        <View style={styles.modalBackground}>
                          <View style={styles.modalContent}>
                            {pointsOptions.map((option) => (
                              <TouchableOpacity
                                key={option.value}
                                style={styles.optionButton}
                                onPress={() => handleSelectItem(option.value)}
                              >
                                <Text style={styles.optionText}>
                                  {option.label}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                      </Modal>
                    </View>
                    <View>
                      {noOfPoints < 1 || noOfPoints === "" ? (
                        <Text style={styles.validationText}>
                          This field is required
                        </Text>
                      ) : null}
                    </View>
                  </View>
                  {Number(noOfPoints) > 0 ? (
                    <View style={styles.formField}>
                      <View style={styles.formLabelField}>
                        <Text
                          style={styles.formLabelFieldMainText}
                        >{`Amount (RM)`}</Text>
                      </View>
                      <View>
                        <TextInput
                          style={styles.inputField}
                          editable={false}
                          value={totalAmountToPay.toString()}
                        />
                      </View>
                    </View>
                  ) : null}
                  {Number(noOfPoints) > 0 ? (
                    <TouchableOpacity
                      style={styles.buyButton}
                      onPress={onPressBuyButton}
                      disabled={loading}
                    >
                      <Text style={styles.buyButtonText}>
                        {loading === false ? "Buy" : "Buy..."}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            </ScrollView>
          </View>
          <BottomMenu />
        </KeyboardAvoidingView>
      </>
    );
  } else {
    return (
      <>
        <View style={styles.outerMainPaymentContainer}>
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
            <Menu onPress={onPressCloseMenu} activePage={"purchasePoints"} />
          ) : null}
          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            <KeyboardAwareScrollView
              extraScrollHeight={20}
              enableOnAndroid={true}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
            >
              <WebView
                source={{
                  uri: `${paymenyUrl}`,
                }}
                onNavigationStateChange={handleWebViewNavigation}
                startInLoadingState={true}
                // renderLoading={() => (
                //   <ActivityIndicator size="large" color="#0000ff" />
                // )}
                style={{ height: height - 160 }}
              />
            </KeyboardAwareScrollView>
          </ScrollView>
        </View>
        <BottomMenu />
      </>
    );
  }
};

export default PurchasePoints;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3C3C3B",
  },
  outerMainContainer: {
    backgroundColor: "#3C3C3B",
    flex: 1,
  },
  outerMainPaymentContainer: {
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
  mainFormConatiner: {
    width: width,
    height: height - 160,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  mainFormInnerContainer: {
    width: 300,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  sectionHeading: {
    color: "#FFFFFF",
    fontFamily: "MontserratRegular",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
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
    fontSize: 16,
    fontFamily: "MontserratLight",
    fontWeight: "500",
    color: "#FFFFFF",
    lineHeight: 16,
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
  validationText: {
    fontSize: 14,
    color: "#E53E3E",
    fontFamily: "MontserratRegular",
    lineHeight: 16,
  },
  buyButton: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    height: 40,
    borderRadius: 6,
    width: 130,
  },
  buyButtonText: {
    color: "#3C3C3B",
    textAlign: "center",
    fontSize: 14,
    fontFamily: "MontserratRegular",
  },
  container: {
    flex: 1,
  },
  pickerStyle: {
    height: 50,
    width: "100%",
    backgroundColor: "#f0f0f0", // Optional: Add a background
    borderRadius: 5, // Optional: Round edges
  },
  dropdowncontainer: {
    width: "100%",
  },
  dropdownButton: {
    width: "100%",
    height: 40,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "left",
    paddingHorizontal: 15,
  },
  selectedText: {
    fontSize: 16,
    color: "#333",
    textAlign: "left",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparent background
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    width: "80%",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  optionText: {
    fontSize: 14,
    color: "#000",
    fontFamily: "MontserratRegular",
  },
});
