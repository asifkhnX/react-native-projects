import React from "react";
import { View, Pressable, Text, Dimensions, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const { width } = Dimensions.get("window");

const BottomMenu = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.menuSection}>
      <Pressable
        style={styles.menuItem}
        onPress={() => navigation.navigate("Home")}
      >
        <Feather name="home" size={22} color="white" />
        <Text style={styles.menuItemText}>Home</Text>
      </Pressable>
      <Pressable
        style={styles.menuItem}
        onPress={() => navigation.navigate("MyAllRewards")}
      >
        <AntDesign name="gift" size={22} color="#FFFFFF" />
        <Text style={styles.menuItemText}>My Rewards</Text>
      </Pressable>
      <Pressable
        style={styles.menuItem}
        onPress={() => navigation.navigate("Game")}
      >
        <MaterialCommunityIcons name="ferris-wheel" size={22} color="white" />
        <Text style={styles.menuItemText}>Game</Text>
      </Pressable>
      <Pressable
        style={styles.menuItem}
        onPress={() => navigation.navigate("DailyRewards")}
      >
        <FontAwesome name="calendar-check-o" size={22} color="white" />
        <Text style={styles.menuItemText}>Daily Points</Text>
      </Pressable>
    </View>
  );
};

export default BottomMenu;

const styles = StyleSheet.create({
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
});
