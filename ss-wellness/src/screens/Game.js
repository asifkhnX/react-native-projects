import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native"; // Import this hook
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";

//local imports
import GreetingText from "../components/GreetingText";
import PrepaidBalanceText from "../components/PrepaidBalanceText";
import Menu from "../components/Menu";
import BottomMenu from "../components/BottomMenu";
import SpinWheel from "../components/SpinWheel";
import { API_PATH } from "../../ApiPath";

const Game = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [luckyWheelData, setluckyWheelData] = useState('');
  const [userAppPoints, setUserAppPoints] = useState(0);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      fetch(`${API_PATH}/lucky-wheel`, {
        method: "get",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setluckyWheelData(data);
        })
        .catch((err) => console.log(err));
      // Return a cleanup function if needed when the screen goes out of focus
      return () => {
        console.log("Cleanup if necessary");
      };
    }, []) // Empty dependency array ensures the effect runs every time screen is focused
  );

  useFocusEffect(
    React.useCallback(() => {
      const getUserPhone = async () => {
        const userPhone = await AsyncStorage.getItem("appUserPhone");
        console.log(userPhone);
        if (userPhone) {
          // Fetch the user app points
          fetch(`${API_PATH}/total-user-points/${userPhone}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              if (data.totalPoints) {
                setUserAppPoints(Number(data.totalPoints)); // Set the points to the state
              } else {
                console.log("Error fetching points");
              }
            })
            .catch((err) => console.log(err));
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
          <Menu onPress={onPressCloseMenu} activePage={"game"} />
        ) : null}
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          <View style={styles.mainContainer}>
          <View style={styles.PointsAndBalanceMainConatiner}>
            <View style={styles.appPointContainer}>
              <MaterialCommunityIcons
                name="wallet-outline"
                size={25}
                color="white"
              />
              <Text style={styles.appPointHeadingText}>Prepaid Balance</Text>
              <PrepaidBalanceText />
            </View>
            <View style={styles.appPointContainer}>
              <AntDesign name="gift" size={25} color="white" />
              <Text style={styles.appPointHeadingText}>App Points</Text>
              <Text style={styles.appPointDescriptionText}>
                {userAppPoints} pts
              </Text>
            </View>
          </View>
          <View style={styles.newsFeedMainConatiner}>
            <Text style={styles.containerHeadingText}>LUCKY WHEEL</Text>
            {luckyWheelData !== '' ? <SpinWheel luckyWheelData={luckyWheelData} /> : null}
          </View>
          </View>
        </ScrollView>
      </View>
      <BottomMenu />
    </>
  );
};

export default Game;

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
  PointsAndBalanceMainConatiner: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    padding: 15,
    marginTop: 20,
  },
  appPointContainer: {
    width: "49%",
    borderWidth: 0,
    borderColor: "#FFFFFF",
    borderRadius: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    display: "flex",
    flexDirection: "column",
    gap: 5,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
    overflow: "hidden",
  },
  appPointHeadingText: {
    color: "#FFFFFF",
    fontFamily: "MontserratRegular",
    fontSize: 14,
  },
  appPointDescriptionText: {
    color: "#FFFFFF",
    fontFamily: "MontserratBold",
    fontSize: 14,
  },
  newsFeedMainConatiner: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  containerHeadingText: {
    color: "#FFFFFF",
    fontFamily: "MontserratRegular",
    fontSize: 20,
    textAlign: "center",
    paddingTop: 20,
    paddingBottom: 10,
  },
  mainContainer: {
    marginBottom: 120,
  }
});
