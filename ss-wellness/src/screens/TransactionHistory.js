import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Fontisto from '@expo/vector-icons/Fontisto'; //date
import FontAwesome from '@expo/vector-icons/FontAwesome'; //amount

// local imports
import GreetingText from "../components/GreetingText";
import Menu from "../components/Menu";
import BottomMenu from "../components/BottomMenu";
import { API_PATH } from "../../ApiPath";

const { width } = Dimensions.get("window");

const TransactionHistory = ({ navigation }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      // Function to fetch user phone and rewards
      const getUserPhone = async () => {
        const userPhone = await AsyncStorage.getItem("appUserPhone");
        console.log(userPhone);
        if (userPhone) {
          try {
            const res = await fetch(`${API_PATH}/transaction-history/${userPhone}`, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            console.log(data);
            setAllTransaction(data);
          } catch (err) {
            console.log(err);
          }
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

  const transactionsArray = allTransaction.map((eachTransaction, index) => {
    return (
      <View key={index}>
        <View style={styles.rewardContainer}>
          <View style={styles.eachChildItem}>
            <Fontisto name="date" size={20} color="#FFFFFF" />
            <Text style={styles.rewardText}>DATE: {eachTransaction.date}</Text>
          </View>
          <View style={styles.eachChildItem}>
            <AntDesign name="gift" size={20} color="#FFFFFF" />
            <Text style={styles.rewardText}>ID: {eachTransaction.paymentid}</Text>
          </View>
          <View style={styles.eachChildItem}>
          <FontAwesome name="money" size={20} color="#FFFFFF" />
            <Text style={styles.rewardText}>AMOUNT: {eachTransaction.amount} RM</Text>
          </View>
          <View style={styles.eachChildItem}>
            <AntDesign name="gift" size={20} color="#FFFFFF" />
            <Text style={styles.rewardText}>POINTS: {eachTransaction.points}</Text>
          </View>
        </View>
      </View>
    );
  });

  const onPressShowMenu = () => {
    setShowMenu(true);
  };

  const onPressCloseMenu = () => {
    setShowMenu(false);
  };

  return (
    <>
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
          <Menu onPress={onPressCloseMenu} activePage={"transactionHistory"} />
        ) : null}
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          <View style={styles.outletSection}>
            <View>
              <Text style={styles.sectionHeading}>TRANSACTION HISTORY</Text>
            </View>
            {allTransaction.length > 0 ? (
              <View style={styles.outletItemListing}>{transactionsArray}</View>
            ) : (
              <View style={styles.outletItemListing}>
                <Text style={styles.rewardText}>No Data Found</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
      <BottomMenu />
    </>
  );
};

export default TransactionHistory;

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
    marginBottom: 120,
  },
  sectionHeading: {
    color: "#FFFFFF",
    fontFamily: "MontserratRegular",
    fontSize: 20,
  },
  outletItemListing: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "baseline",
    gap: 20,
  },
  //rewards css
  rewardContainer: {
    width: 300,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  rewardText: {
    fontFamily: "MontserratRegular",
    width: "90%",
    textAlign: "left",
    fontSize: 14,
    color: "#FFFFFF",
  },
  rewardDateText: {
    fontFamily: "MontserratRegular",
    textAlign: "left",
    fontSize: 14,
    color: "#FFFFFF",
    paddingLeft: 5,
  },
  eachChildItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'left',
    gap: 5,
  }
});
