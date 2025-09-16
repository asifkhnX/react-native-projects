import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import WebView from "react-native-webview";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

//local imports
import GreetingText from "../components/GreetingText";
import Menu from "../components/Menu";
import BottomMenu from "../components/BottomMenu";

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

const Account = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [token, setToken] = useState("");
  const navigation = useNavigation();
  console.log(width);

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        console.log("Auto Login: ", accessToken);
        setToken(accessToken);
      } catch (error) {
        console.error("Failed to load data from AsyncStorage:", error);
      }
    };

    loadStoredData();
  }, []);

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
          <Menu onPress={onPressCloseMenu} activePage={"account"} />
        ) : null}
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          <WebView
            source={{
              uri: `https://app.sswellness.com.my/token_login?token=${token}`,
            }}
            style={{ height: height - 160 }}
            //nestedScrollEnabled={true}
          />
        </ScrollView>
      </View>
      <BottomMenu />
    </>
  );
};

export default Account;

const styles = StyleSheet.create({
  outerMainContainer: {
    backgroundColor: "#3C3C3B",
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
    alignItems: "center",
    padding: 15,
    marginTop: 10,
    marginBottom: 20,
  },
  PointsAndBalanceMainConatinerSmall: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    gap: 15,
    marginTop: 25,
    marginBottom: 25,
  },
  appPointContainer: {
    width: "30%",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  appPointContainerSmall: {
    width: "30%",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  appPointHeadingText: {
    color: "#FFFFFF",
    fontFamily: "MontserratMedium",
    fontSize: 16,
  },
  appPointDescriptionText: {
    color: "#FFFFFF",
    fontFamily: "MontserratRegular",
    fontSize: 14,
  },
  newsFeedMainConatiner: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  containerHeadingText: {
    color: "#FFFFFF",
    fontFamily: "MontserratMedium",
    fontSize: 16,
    textAlign: "center",
  },
  feedbackMainContainer: {
    marginBottom: 120,
    display: "flex",
    alignItems: "center",
    marginTop: 10,
  },
  feedbackButton: {
    backgroundColor: "#FFFFFF",
    width: 200,
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
  },
  buttonText: {
    color: "#3C3C3B",
    fontFamily: "MontserratMedium",
    fontSize: 14,
  },
});
