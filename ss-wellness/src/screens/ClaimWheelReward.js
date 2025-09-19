import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  StyleSheet,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

const ClaimWheelReward = ({ route }) => {
  const navigation = useNavigation();
  const { prize } = route.params;

  console.log(prize);

  const onPressOk = () => {
    navigation.navigate("MyAllRewards");
  };

  return (
    <View style={styles.modalOuterConatiner}>
      <View style={styles.modalConatiner}>
        <View style={styles.modalBody}>
          <AntDesign name="gift" size={50} color="#8BC53C" />
          <View style={styles.textContiner}>
            {prize.text.toLowerCase() !== "try again" ? (
              <Text style={styles.todayRewardText}>
                Congratulation! You Won
              </Text>
            ) : (
              <Text style={styles.todayRewardText}>
                Oops, Better luck next time!
              </Text>
            )}
            <Text style={styles.todayRewardPointsText}>{prize.text}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onPressOk}>
              <Text style={styles.cancelButtonText}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ClaimWheelReward;

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
    height: height,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    position: "absolute",
    bottom: 0,
    left: 0,
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    zIndex: 999,
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
