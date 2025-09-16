import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { startTokenMonitor } from "../utils/AuthUtils";
import Images from "../../assets/images/index";
import { API_PATH } from "../../ApiPath";

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

const ForgotPassword = ({ navigation }) => {
  const [method, setMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [validEmailOrMobileNumber, setValidEmailOrMobileNumber] =
    useState(false);
  const [codeSendCoolDownTime, setCodeSendCoolDownTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showErrorText, setShowErrorText] = useState(false);
  const [errorText, setErrorText] = useState("aa");

  const [loginValidationFields, setLoginValidationFields] = useState({
    email: false,
    mobileNumber: false,
    mfaCode: false,
  });

  useEffect(() => {
    let timer;
    if (codeSendCoolDownTime > 0) {
      timer = setInterval(() => {
        setCodeSendCoolDownTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [codeSendCoolDownTime]);

  const requestTwoFactorCode = () => {
    console.log("METHOD: ", method);
    console.log("EMAIL: ", email);
    console.log("MOBILE NUMBER: ", mobileNumber);

    setLoginValidationFields({
      email: false,
      mobileNumber: false,
      mfaCode: false,
    });

    if (method === "email") {
      if (email.length > 0) {
        setLoading(true);

        fetch(`https://pos.sswellness.com.my/app/request-mfc`, {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            method: method,
            username: email,
          }),
        })
          .then((resp) => resp.json())
          .then((data) => {
            setLoading(false);
            console.log(data);

            if (data.error) {
              setShowErrorText(true);
              setErrorText(data.error);

              setTimeout(() => {
                setShowErrorText(false);
              }, 4000);
            } else if (data === "contact" || data === "email") {
              setValidEmailOrMobileNumber(true);
              setCodeSendCoolDownTime(60);
            }
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);

            setShowErrorText(true);
            setErrorText(err);

            setTimeout(() => {
              setShowErrorText(false);
            }, 4000);
          });
      } else {
        if (email.length === 0) {
          setLoginValidationFields({
            email: true,
            mobileNumber: false,
            mfaCode: false,
          });
        }
      }
    } else if (method === "contact") {
      if (mobileNumber.length > 0) {
        setLoading(true);

        fetch(`https://pos.sswellness.com.my/app/request-mfc`, {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            method: method,
            username: mobileNumber,
          }),
        })
          .then((resp) => resp.json())
          .then((data) => {
            setLoading(false);
            console.log(data);

            if (data.error) {
              setShowErrorText(true);
              setErrorText(data.error);

              setTimeout(() => {
                setShowErrorText(false);
              }, 4000);
            } else {
              setValidEmailOrMobileNumber(true);
              setCodeSendCoolDownTime(60);
            }
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);

            setShowErrorText(true);
            setErrorText(err);

            setTimeout(() => {
              setShowErrorText(false);
            }, 4000);
          });
      } else {
        if (mobileNumber.length === 0) {
          setLoginValidationFields({
            email: false,
            mobileNumber: true,
            mfaCode: false,
          });
        }
      }
    }
  };

  const confirmTwoFactorCode = async () => {
    console.log("METHOD: ", method);
    console.log("MFA CODE: ", mfaCode);

    setLoginValidationFields({
      email: false,
      mobileNumber: false,
      mfaCode: false,
    });

    if (method === "email") {
      if (mfaCode.length > 0) {
        setLoading(true);

        try {
          const response = await fetch(
            `https://pos.sswellness.com.my/app/login`,
            {
              method: "post",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                code: mfaCode,
                method: method,
                username: email,
              }),
            }
          );

          const data = await response.json();
          console.log(data);

          if (data.error) {
            setShowErrorText(true);
            setErrorText(data.error);

            setTimeout(() => {
              setShowErrorText(false);
            }, 4000);
          } else if (data.access_token) {
            // Storing token and expiration time
            await AsyncStorage.setItem("accessToken", data.access_token);
            await AsyncStorage.setItem(
              "expiresIn",
              (Date.now() + data.expires_in * 1000).toString()
            ); // Store expiration timestamp as string
            console.log(
              "Expiration Time Stored:",
              await AsyncStorage.getItem("expiresIn")
            ); // Log expiration time

            await AsyncStorage.setItem("appUserPhone", data.data.contact);
            await AsyncStorage.setItem("name", data.data.name);

            const response2 = await fetch(`${API_PATH}/add-user`, {
              method: "post",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                phone: data.data.contact,
              }),
            });
            const data2 = await response2.json();
            console.log(data2);
            setLoading(false);

            if (data2 === "success") {
              // Start the token monitor after login
              startTokenMonitor(navigation);

              navigation.navigate("Home");
            } else {
              Alert.alert("Login Fail", "Something wrong with the server", [
                { text: "OK" },
              ]);
            }
          }
        } catch (err) {
          setLoading(false);
          console.log(err);

          setShowErrorText(true);
          setErrorText(err.message);

          setTimeout(() => {
            setShowErrorText(false);
          }, 4000);
        }
      } else {
        if (mfaCode.length === 0) {
          setLoginValidationFields({
            email: false,
            mobileNumber: false,
            mfaCode: true,
          });
        }
      }
    }
    if (method === "contact") {
      if (mfaCode.length > 0) {
        setLoading(true);

        try {
          const response = await fetch(
            `https://pos.sswellness.com.my/app/login`,
            {
              method: "post",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                code: mfaCode,
                method: method,
                username: mobileNumber,
              }),
            }
          );

          const data = await response.json();
          setLoading(false);
          console.log(data);

          if (data.error) {
            setShowErrorText(true);
            setErrorText(data.error);

            setTimeout(() => {
              setShowErrorText(false);
            }, 4000);
          } else if (data.access_token) {
            // Storing token and expiration time (60 seconds after receiving the token)
            await AsyncStorage.setItem("accessToken", data.access_token);
            await AsyncStorage.setItem(
              "expiresIn",
              (Date.now() + data.expires_in * 60 * 1000).toString()
            );
            console.log(
              "Expiration Time Stored:",
              await AsyncStorage.getItem("expiresIn")
            ); // Log expiration time

            await AsyncStorage.setItem("appUserPhone", data.data.contact);
            await AsyncStorage.setItem("name", data.data.name);

            const response2 = await fetch(`${API_PATH}/add-user`, {
              method: "post",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                phone: data.data.contact,
              }),
            });
            const data2 = await response2.json();
            console.log(data2);
            setLoading(false);

            if (data2 === "success") {
              // Start the token monitor after login
              startTokenMonitor(navigation);

              navigation.navigate("Home");
            } else {
              Alert.alert("Login Fail", "Something wrong with the server", [
                { text: "OK" },
              ]);
            }
          }
        } catch (err) {
          setLoading(false);
          console.log(err);

          setShowErrorText(true);
          setErrorText(err.message);

          setTimeout(() => {
            setShowErrorText(false);
          }, 4000);
        }
      } else {
        setLoginValidationFields({
          email: false,
          mobileNumber: false,
          mfaCode: true,
        });
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.loginWrapper}>
          <View style={styles.logoSection}>
            <Image source={Images.logo} style={styles.logoImage} />
          </View>
          <View>
            <Text style={styles.customerLoginSectionText}>Customer Login</Text>
          </View>
          <View
            style={
              width > 300
                ? styles.loginFormSection
                : styles.loginFormSmallSection
            }
          >
            {showErrorText === true ? (
              <View style={styles.formField}>
                <View style={styles.responseTextSection}>
                  <Text style={styles.responseText}>{errorText}</Text>
                </View>
              </View>
            ) : null}
            <View style={styles.formField}>
              <View style={styles.formLabelField}>
                {method === "email" ? (
                  <Text style={styles.formLabelFieldMainText}>Email</Text>
                ) : (
                  <Text style={styles.formLabelFieldMainText}>
                    Mobile Number
                  </Text>
                )}
                {method === "email" && validEmailOrMobileNumber === false ? (
                  <Text
                    style={styles.formLabelFieldOtherText}
                    onPress={() => setMethod("contact")}
                  >
                    Use Mobile
                  </Text>
                ) : null}
                {method === "contact" && validEmailOrMobileNumber === false ? (
                  <Text
                    style={styles.formLabelFieldOtherText}
                    onPress={() => setMethod("email")}
                  >
                    Use Email
                  </Text>
                ) : null}
              </View>
              <View>
                {method === "email" ? (
                  <TextInput
                    style={styles.inputField}
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                  />
                ) : (
                  <TextInput
                    style={styles.inputField}
                    value={mobileNumber}
                    onChangeText={(text) => setMobileNumber(text)}
                  />
                )}
              </View>
              <View>
                {loginValidationFields.email === true ||
                loginValidationFields.mobileNumber === true ? (
                  <Text style={styles.validationText}>
                    This field is required
                  </Text>
                ) : null}
              </View>
            </View>
            {validEmailOrMobileNumber === true ? (
              <View style={styles.formField}>
                <View style={styles.formLabelField}>
                  <Text style={styles.formLabelFieldMainText}>
                    Two Factor Code
                  </Text>
                  {codeSendCoolDownTime > 0 ? (
                    <Text style={styles.formLabelFieldOtherText}>
                      Resend in {codeSendCoolDownTime} seconds
                    </Text>
                  ) : (
                    <Text
                      style={styles.formLabelFieldOtherText}
                      onPress={requestTwoFactorCode}
                    >
                      Resend
                    </Text>
                  )}
                </View>
                <View>
                  <TextInput
                    style={styles.inputField}
                    value={mfaCode}
                    onChangeText={(text) => setMfaCode(text)}
                  />
                </View>
                <View>
                  {loginValidationFields.mfaCode === true ? (
                    <Text style={styles.validationText}>
                      This field is required
                    </Text>
                  ) : null}
                </View>
              </View>
            ) : null}
            <View style={styles.formField}>
              <View>
                {validEmailOrMobileNumber === false ? (
                  <Pressable
                    style={styles.loginButton}
                    onPress={requestTwoFactorCode}
                    disabled={loading === true}
                  >
                    <Text style={styles.loginButtonText}>
                      {loading === true
                        ? "Requesting..."
                        : "Request Two Factor Code"}
                    </Text>
                  </Pressable>
                ) : (
                  <Pressable
                    style={styles.loginButton}
                    onPress={confirmTwoFactorCode}
                    disabled={loading === true}
                  >
                    <Text style={styles.loginButtonText}>
                      {loading === true
                        ? "Confirming..."
                        : "Confirm Two Factor Code"}
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
            <View style={styles.formField}>
              <View>
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => navigation.navigate("Login")}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3C3C3B",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  loginWrapper: {
    backgroundColor: "#3C3C3B",
    height: height,
    display: "flex",
    flexDirection: "column",
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logoSection: {
    display: "flex",
    alignItems: "center",
  },
  logoImage: {
    width: 100,
    height: 150,
  },
  customerLoginSectionText: {
    color: "#FFFFFF",
    fontFamily: "MontserratRegular",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 15,
  },
  loginFormSection: {
    width: 300,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    display: "flex",
    flexDirection: "column",
    gap: 25,
  },
  loginFormSmallSection: {
    width: width - 10,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    display: "flex",
    flexDirection: "column",
    gap: 25,
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
    fontFamily: "MontserratRegular",
    color: "#3C3C3B",
  },
  formLabelFieldOtherText: {
    fontSize: 12,
    fontFamily: "MontserratBold",
    color: "#3C3C3B",
  },
  inputField: {
    borderWidth: 1,
    height: 40,
    borderRadius: 6,
    borderColor: "#e5e7eb",
    fontSize: 16,
    paddingLeft: 15,
    color: "#1A202C",
  },
  loginButton: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "#3C3C3B",
    height: 40,
    borderRadius: 6,
  },
  loginButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "MontserratRegular",
  },
  cancelButton: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "#EDF2F7",
    height: 40,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: "#1A202C",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "MontserratRegular",
  },
  forgotpasswordText: {
    fontSize: 12,
    color: "#3C3C3B",
    textAlign: "center",
  },
  validationText: {
    fontSize: 14,
    color: "#E53E3E",
    fontFamily: "MontserratRegular",
  },
  responseTextSection: {
    backgroundColor: "#E53E3E",
    padding: 10,
    borderRadius: 6,
    fontFamily: "MontserratRegular",
  },
  responseText: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "MontserratRegular",
  },
});
