import React, { useState, useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PrepaidBalanceText = () => {
  const [prepaidBalance, setPrepaidBalance] = useState("");

  useEffect(() => {
    const getUserName = async () => {
      const accessToken = await AsyncStorage.getItem("accessToken");
      console.log(accessToken);
      if (accessToken) {
        const response = await fetch('https://pos.sswellness.com.my/app/stats', {
          method: 'get',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
          }
      });

      const data = await response.json();

      console.log(data);

      setPrepaidBalance(data.WELLNESS.total_credit);

      } else {
        navigation.navigate("Login");
      }
    };

    getUserName();
  }, []);

  return (
    <Text style={styles.appPointDescriptionText}>RM {prepaidBalance}</Text>
    );
};

export default PrepaidBalanceText;

const styles = StyleSheet.create({
  appPointDescriptionText: {
    color: "#FFFFFF",
    fontFamily: "MontserratBold",
    fontSize: 14,
  },
});
