import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Dimensions,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";

import { API_PATH } from "../../ApiPath";
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  console.log(width);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      const getUserPhone = async () => {
        const userPhone = await AsyncStorage.getItem("appUserPhone");
        if (userPhone) {
          setPhone(userPhone);
          fetch(`${API_PATH}/all-notifications/${userPhone}`, {
            method: "get",
            headers: { "Content-Type": "application/json" },
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              setNotifications(data);
            })
            .catch((err) => console.log(err));
        }
      };

      getUserPhone();

      setLoading(false);
      // Return a cleanup function if needed when the screen goes out of focus
      return () => {
        console.log("Cleanup if necessary");
      };
    }, []) // Empty dependency array ensures the effect runs every time screen is focused
  );

  const onPressBack = () => {
    navigation.goBack();
  };

  const deleteNotification = (id) => {
    setLoading(true);
    console.log("NOTIFICATION ID TO BE DELETED: ", id);
    console.log("USER Phone: ", phone);

    fetch(`${API_PATH}/delete-notification`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notificationId: id,
        phone: phone,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        console.log(data);
        if (data === "success") {
          // Filter out the deleted notification from the state
          setNotifications((prevNotifications) =>
            prevNotifications.filter((notification) => notification.id !== id)
          );
          Alert.alert("Success", "Notification deleted successfully", [
            { text: "OK" },
          ]);
        } else {
          Alert.alert("Error", "Unable to delete notification", [
            { text: "OK" },
          ]);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        Alert.alert("Error", "Unable to delete notification", [{ text: "OK" }]);
      });
  };

  const notificationsArray = notifications.map((eachNotication, index) => {
    return (
      <View style={styles.notificationMainContainer}>
        {/* <Ionicons name="notifications-outline" size={24} color="white" /> */}
        <View style={styles.notificationTextContainer}>
          <Text style={styles.notificationTitleText}>
            {eachNotication.title}
          </Text>
          <Text style={styles.notificationBodyText}>{eachNotication.body}</Text>
          <Text style={styles.notificationDateText}>{eachNotication.date}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteIconContainer}
          onPress={() => deleteNotification(eachNotication.id)}
          disabled={loading}
        >
          <AntDesign name="delete" size={24} color="#3C3C3B" />
        </TouchableOpacity>
      </View>
    );
  });

  return (
    <>
      <View style={styles.outerMainContainer}>
        <View style={styles.greetingMainContainer}>
          <TouchableOpacity onPress={onPressBack}>
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <View>
            <Text style={styles.greetingText}>Notifications</Text>
          </View>
          <TouchableOpacity>
            {/* <FontAwesome name="calendar-check-o" size={24} color="white" /> */}
          </TouchableOpacity>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          <View style={styles.newsFeedMainConatiner}>
            <View style={styles.notificationListing}>
              {notificationsArray.length > 0 ? (
                notificationsArray
              ) : (
                <Text
                  style={{
                    textAlign: "center",
                    color: "#FFFFFF",
                    fontSize: 14,
                    fontFamily: "MontserratRegular",
                  }}
                >
                  No Data Found
                </Text>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  outerMainContainer: {
    backgroundColor: "#3C3C3B",
    minHeight: height,
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
    fontFamily: "MontserratMedium",
    fontSize: 16,
  },
  newsFeedMainConatiner: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
    marginTop: 25,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationListing: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    width: "100%",
  },
  notificationMainContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 10,
    overflow: "hidden",
  },
  notificationTitleText: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    color: "#FFFFFF",
  },
  notificationBodyText: {
    fontFamily: "MontserratLight",
    fontSize: 14,
    color: "#FFFFFF",
  },
  notificationDateText: {
    fontFamily: "MontserratLight",
    fontSize: 12,
    color: "#FFFFFF",
  },
  notificationTextContainer: {
    width: "80%",
    backgroundColor: "#3C3C3B",
    padding: 15,
  },
  notificationText: {
    width: "100%",
    color: "#FFFFFF",
    fontFamily: "MontserratRegular",
    fontSize: 12,
  },
  deleteIconContainer: {
    backgroundColor: "#FFFFFF",
    width: "20%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});
