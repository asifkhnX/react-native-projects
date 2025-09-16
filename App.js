import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import NetInfo from "@react-native-community/netinfo";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

//Notification imports
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { API_PATH } from "./ApiPath";

SplashScreen.preventAutoHideAsync();

//Notification Handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

//Register Push Notification Function
const registerForPushNotificationsAsync = async () => {
  if (!Device.isDevice) {
    console.log("Push notifications are only supported on physical devices.");
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  console.log('Final/Existing Status: ', existingStatus);

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    alert("Failed to get push token for push notifications!");
    return;
  }

  try {
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);

    // Send token to your server
    await fetch(`${API_PATH}/save-push-token`, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ pushToken: token }),
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));

    return token;
  } catch (error) {
    console.error("Error getting push token:", error);
  }
};

const App = () => {
  const [loaded, error] = useFonts({
    MontserratBold: require("./assets/fonts/Montserrat-Bold.ttf"),
    MontserratRegular: require("./assets/fonts/Montserrat-Regular.ttf"),
    MontserratLight: require("./assets/fonts/Montserrat-Light.ttf"),
  });

  const [isConnected, setIsConnected] = useState(true);
  
  // Declare refs for listeners
  const notificationListener = useRef(null);
  const responseListener = useRef(null);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Monitor internet connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  //Use Effect FOr Notication
  useEffect(() => {
    registerForPushNotificationsAsync();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response:", response);
      });

    return () => {
      if (notificationListener.current)
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      if (responseListener.current)
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#3C3C3B" }}>
        <StatusBar barStyle="light-content" backgroundColor="#3C3C3B" />

        {/* Show No Internet Message when offline */}
        {!isConnected && (
          <View style={styles.noInternetContainer}>
            <Text style={styles.noInternetText}>No Internet Connection</Text>
          </View>
        )}

        <AppNavigator />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};


const styles = StyleSheet.create({
  noInternetContainer: {
    backgroundColor: "red",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  noInternetText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default App;
