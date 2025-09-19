import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native"; // Import this hook
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";

// Local imports
import GreetingText from "../components/GreetingText";
import Menu from "../components/Menu";
import BottomMenu from "../components/BottomMenu";
import ClaimRewardModal from "../components/ClaimRewardModal";
import { API_PATH } from "../../ApiPath";

const { width } = Dimensions.get("window");

const allRewards = [
  {
    points: 1,
    day: 1,
  },
  {
    points: 1,
    day: 2,
  },
  {
    points: 1,
    day: 3,
  },
  {
    points: 1,
    day: 4,
  },
  {
    points: 1,
    day: 5,
  },
  {
    points: 1,
    day: 6,
  },
  {
    points: 2,
    day: 7,
  },
];

const firstRowRewards = allRewards.slice(0, 3);
const secondRowRewards = allRewards.slice(3, 6);

const DailyRewards = ({ navigation }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [reward, setReward] = useState({});
  const [todayRewardDay, setTodayRewardDay] = useState(0);
  const [lastClaimedDay, setLastClaimedDay] = useState(0);
  const [phone, setPhone] = useState("");
  const [rewardClaimed, setRewardClaimed] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const getUserPhone = async () => {
        const userPhone = await AsyncStorage.getItem("appUserPhone");
        console.log(userPhone);
        if (userPhone) {
          setPhone(userPhone);
          fetch(`${API_PATH}/today-reward-day/${userPhone}`, {
            method: "get",
            headers: { "Content-Type": "application/json" },
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              setTodayRewardDay(data.day); //eg: 0, 1, 2, 3, 4, 5, 6, 7
              setLastClaimedDay(data.currentDay);
              if (Number(data.day) === 0) {
                Alert.alert(
                  "Attention",
                  "Daily check-in is limited to once per day. Please come back tomorrow. Thank you for your understanding!",
                  [{ text: "OK", onPress: () => navigation.navigate("Home") }]
                );
              }
            })
            .catch((err) => {
              console.log(err);
              Alert.alert(
                "Error",
                "We’re sorry, but you cannot check in right now",
                [{ text: "OK", onPress: () => navigation.navigate("Home") }]
              );
            });
        }
      };
      getUserPhone();

      // Return a cleanup function if needed when the screen goes out of focus
      return () => {
        console.log("Cleanup if necessary");
      };
    }, [rewardClaimed]) // Empty dependency array ensures the effect runs every time screen is focused
  );

  const onPressShowMenu = () => {
    setShowMenu(true);
  };

  const onPressCloseMenu = () => {
    setShowMenu(false);
  };

  const onPressShowClaimModal = (eachReward) => {
    console.log(eachReward);
    setReward(eachReward);
    setShowClaimModal(true);
  };

  const onPressCloseClaimModal = () => {
    setShowClaimModal(false);
  };

  const onRewardClaimed = () => {
    setRewardClaimed(true);
  };

  const renderRewards = (rewards) => {
    return rewards.map((eachReward, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => {
          Number(eachReward.day) === Number(todayRewardDay)
            ? onPressShowClaimModal(eachReward)
            : null;
        }}
      >
        <View style={styles.rewardItem}>
          <LinearGradient
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 1 }}
            colors={
              Number(todayRewardDay) !== 0 &&
              Number(eachReward.day) === Number(todayRewardDay)
                ? ["#8BC53C", "#AEF4A4"]
                : Number(todayRewardDay) === 0 &&
                  Number(eachReward.day) === Number(lastClaimedDay)
                ? ["#FFF", "#000"]
                : ["#D3D3D3", "#A9A9A9"]
            }
          >
            <View style={styles.rewardItemHeader}>
              <AntDesign name="gift" size={30} color="#FFFFFF" />
            </View>
          </LinearGradient>
          <View style={styles.rewardItemFooter}>
            <Text style={styles.rewardPointText}>
              {eachReward.points} Point
            </Text>
            <Text style={styles.rewardDayText}>Day {eachReward.day}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ));
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
          <Menu onPress={onPressCloseMenu} activePage={"daily-points"} />
        ) : null}
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          <View style={styles.outletSection}>
            <View>
              <Text style={styles.sectionHeading}>DAILY REWARDS</Text>
            </View>
            <View style={styles.rewardsMainSection}>
              <View style={styles.firstRowRewardsSection}>
                {renderRewards(firstRowRewards)}
              </View>
              <View style={styles.firstRowRewardsSection}>
                {renderRewards(secondRowRewards)}
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    Number(allRewards[6].day) === Number(todayRewardDay)
                      ? onPressShowClaimModal(allRewards[6])
                      : null;
                  }}
                >
                  <View style={styles.rewardGrandItem}>
                    <LinearGradient
                      start={{ x: 1, y: 1 }}
                      end={{ x: 0, y: 1 }}
                      colors={
                        Number(todayRewardDay) !== 0 &&
                        Number(allRewards[6].day) === Number(todayRewardDay)
                          ? ["#8BC53C", "#AEF4A4"]
                          : Number(todayRewardDay) === 0 &&
                            Number(allRewards[6].day) === Number(lastClaimedDay)
                          ? ["#FFF", "#000"]
                          : ["#D3D3D3", "#A9A9A9"]
                      }
                    >
                      <View style={styles.rewardGrandItemHeader}>
                        <AntDesign name="gift" size={30} color="#FFFFFF" />
                        <View style={styles.GrandRewardTextSection}>
                          <Text style={styles.grandText}>GRAND</Text>
                          <Text style={styles.grandText}>REWARD</Text>
                        </View>
                      </View>
                    </LinearGradient>
                    <View style={styles.rewardItemFooter}>
                      <Text style={styles.rewardPointText}>
                        {allRewards[6].points} Points
                      </Text>
                      <Text style={styles.rewardDayText}>
                        Day {allRewards[6].day}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
      <BottomMenu />
      {showClaimModal === true ? (
        <ClaimRewardModal
          onPress={onPressCloseClaimModal}
          onRewardClaimed={onRewardClaimed}
          reward={reward}
          todayRewardDay={todayRewardDay}
          phone={phone}
        />
      ) : null}
    </>
  );
};

export default DailyRewards;

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
    paddingBottom: 170,
  },
  sectionHeading: {
    color: "#FFFFFF",
    fontFamily: "MontserratRegular",
    fontSize: 20,
  },
  rewardsMainSection: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: 15,
    paddingTop: 0,
    width: width,
  },
  firstRowRewardsSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    gap: 10,
  },
  rewardItem: {
    width: width / 3.5,
    borderRadius: 10,
    overflow: "hidden",
  },
  rewardGrandItem: {
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
  },
  rewardItemHeader: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    paddingTop: 15,
    paddingBottom: 15,
  },
  rewardGrandItemHeader: {
    // backgroundColor: "rgba(255, 255, 255, 0.2)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    gap: 10,
    paddingTop: 15,
    paddingBottom: 15,
  },
  rewardItemFooter: {
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    gap: 0,
    paddingTop: 10,
    paddingBottom: 10,
  },
  rewardPointText: {
    color: "#3C3C3B",
    fontFamily: "MontserratBold",
    fontSize: 14,
    lineHeight: 18,
  },
  rewardDayText: {
    color: "#3C3C3B",
    fontFamily: "MontserratRegular",
    fontSize: 14,
    lineHeight: 18,
  },
  grandText: {
    color: "#FFFFFF",
    fontFamily: "MontserratBold",
    fontSize: 14,
    margin: 0,
    padding: 0,
    lineHeight: 16,
  },
});
