import React, { useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Text,
  Linking,
  Image,
  Dimensions,
  StyleSheet,
  Alert,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

//local imports
import NewsCarousel from "../components/NewsCarousel";
import Menu from "../components/Menu";
import { API_PATH } from "../../ApiPath";

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

const ClaimRewardModal = ({
  onPress,
  onRewardClaimed,
  reward,
  todayRewardDay,
  phone,
}) => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);

  const onPressClaim = (reward, todayRewardDay) => {
    setLoading(true);
    console.log("REWARD", reward);
    console.log("TODAY REWARD DAY", todayRewardDay);

    fetch(`${API_PATH}/claim-reward`, {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: phone,
        points: reward.points,
        day: todayRewardDay,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        console.log(data);
        if (data === "success") {
            Alert.alert("Success", "Your reward has been claimed!", [
              {
                text: "OK",
                onPress: () => {
                  navigation.navigate("Home");
                  onRewardClaimed();
                },
              },
            ]);
          onPress();
          navigation.navigate("DailyRewards");
          onRewardClaimed();
        } else {
          Alert.alert(
            "Error",
            "Failed to claim your reward. Please try again.",
            [{ text: "OK", onPress: () => navigation.navigate("DailyRewards") }]
          );
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        Alert.alert("Error", "Failed to claim your reward. Please try again.", [
          { text: "OK", onPress: () => navigation.navigate("DailyRewards") },
        ]);
      });
  };

  return (
    <View style={styles.modalOuterConatiner}>
      <View style={styles.modalConatiner}>
        <View style={styles.modalBody}>
          <AntDesign name="gift" size={50} color="#8BC53C" />
          <View style={styles.textContiner}>
            <Text style={styles.todayRewardText}>Todays Reward</Text>
            <Text style={styles.todayRewardPointsText}>
              {reward.points} Point
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.claimButton}
              onPress={() => onPressClaim(reward, todayRewardDay)}
              disabled={loading}
            >
              <Text style={styles.claimButtonText}>CLAIM NOW</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onPress}>
              <Text style={styles.cancelButtonText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ClaimRewardModal;

const styles = StyleSheet.create({
  modalOuterConatiner: {
    width: width,
    height: height,
    position: "absolute",
    bottom: 0,
    left: 0,
    zIndex: 999,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalConatiner: {
    width: width,
    height: 300,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    position: "absolute",
    bottom: 0,
    left: 0,
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  modalBody: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  textContiner: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  todayRewardText: {
    color: "#8BC53C",
    fontFamily: "MontserratBold",
    fontSize: 21,
    lineHeight: 21,
  },
  todayRewardPointsText: {
    color: "#8BC53C",
    fontFamily: "MontserratBold",
    fontSize: 16,
    lineHeight: 16,
  },
  claimButton: {
    backgroundColor: "#8BC53C",
    width: 150,
    height: 40,
    borderRadius: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  claimButtonText: {
    color: "#FFFFFF",
    fontFamily: "MontserratRegular",
    fontSize: 14,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  cancelButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "#8BC53C",
    width: 150,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#8BC53C",
    fontFamily: "MontserratRegular",
    fontSize: 14,
  },
});
