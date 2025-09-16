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

// local imports
import GreetingText from "../components/GreetingText";
import Menu from "../components/Menu";
import BottomMenu from "../components/BottomMenu";
import { API_PATH } from "../../ApiPath";

const { width } = Dimensions.get("window");

const MyAllRewards = ({ navigation }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [allRewards, setAllRewards] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      
      const getUserPhone = async () => {
        const userPhone = await AsyncStorage.getItem("appUserPhone");
        console.log(userPhone);
        if (userPhone) {
          try {
            const res = await fetch(
              `${API_PATH}/user-rewards/${userPhone}`,
              {
                method: "GET",
                headers: { "Content-Type": "application/json" },
              }
            );
            const data = await res.json();
            console.log(data);
            setAllRewards(data);
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

  const rewardsArray = allRewards.map((eachReward, index) => {
    return (
      <View key={index}>
        <Text style={styles.rewardDateText}>{eachReward.date}</Text>
          <View style={styles.rewardContainer}>
            <AntDesign name="gift" size={30} color="#FFFFFF" />
            <Text style={styles.rewardText}>{eachReward.reward}</Text>
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
          <Menu onPress={onPressCloseMenu} activePage={"my-all-rewards"} />
        ) : null}
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          <View style={styles.outletSection}>
            <View>
              <Text style={styles.sectionHeading}>MY ALL REWARDS</Text>
            </View>
            {allRewards.length > 0 ? <View style={styles.outletItemListing}>{rewardsArray}</View> : <View style={styles.outletItemListing}><Text style={styles.rewardText}>No Reward Found</Text></View>}
          </View>
        </ScrollView>
      </View>
      <BottomMenu />
    </>
  );
};

export default MyAllRewards;

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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 5,
  },
  rewardText: {
    fontFamily: "MontserratRegular",
    width: "90%",
    textAlign: "center",
    fontSize: 16,
    color: "#FFFFFF",
  },
  rewardDateText: {
    fontFamily: "MontserratRegular",
    textAlign: "left",
    fontSize: 14,
    color: "#FFFFFF",
    paddingLeft: 5,
  },
});
