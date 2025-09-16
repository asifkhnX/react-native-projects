import React, { useState, useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GreetingText = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const getUserName = async () => {
      const userName = await AsyncStorage.getItem("name");
      console.log(userName);
      if (userName) {
        setUserName(userName);
      } else {
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("expiresIn");
        navigation.navigate("Login");
      }
    };

    getUserName();
  }, []);

  return (
    <Text style={styles.greetingText}>Greeting, {userName}!</Text>
    );
};

export default GreetingText;

const styles = StyleSheet.create({
  greetingText: {
    color: "#FFFFFF",
    fontFamily: "MontserratRegular",
    fontSize: 16,
  },
});
