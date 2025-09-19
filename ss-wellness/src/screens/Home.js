import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native"; // Import this hook
import {
  View,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Text,
  Dimensions,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

// Local imports
import GreetingText from "../components/GreetingText";
import PrepaidBalanceText from "../components/PrepaidBalanceText";
import Menu from "../components/Menu";
import BottomMenu from "../components/BottomMenu";
import NewsCarousel from "../components/NewsCarousel";
import { API_PATH } from "../../ApiPath";

const Home = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigation = useNavigation();
  const [allNews, setAllNews] = useState([]);
  const [userAppPoints, setUserAppPoints] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      // Function to fetch all news
      const fetchNews = async () => {
        try {
          const res = await fetch(`${API_PATH}/all-news`, {
            method: "get",
            headers: { "Content-Type": "application/json" },
          });
          const data = await res.json();
          console.log(data);
          setAllNews(data);
        } catch (err) {
          console.log(err);
        }
      };

      // Function to fetch user phone and points
      const getUserPhone = async () => {
        const userPhone = await AsyncStorage.getItem("appUserPhone");
        console.log(userPhone);
        if (userPhone) {
          try {
            const res = await fetch(
              `${API_PATH}/total-user-points/${userPhone}`,
              {
                method: "GET",
                headers: { "Content-Type": "application/json" },
              }
            );
            const data = await res.json();
            console.log(data);
            if (data.totalPoints) {
              setUserAppPoints(Number(data.totalPoints)); // Set the points to the state
            } else {
              console.log("Error fetching points");
            }
          } catch (err) {
            console.log(err);
          }
        } else {
          await AsyncStorage.removeItem("accessToken");
          await AsyncStorage.removeItem("expiresIn");
          navigation.navigate("Login");
        }
      };

      fetchNews();
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
          <Menu onPress={onPressCloseMenu} activePage={"home"} />
        ) : null}
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
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
            <Text style={styles.containerHeadingText}>NEWS FEED</Text>
            {allNews.length > 0 ? (
              <NewsCarousel allNews={allNews} />
            ) : (
              <Text style={{ textAlign: "center", color: "#FFFFFF" }}>
                Data Not Found
              </Text>
            )}
          </View>

          {/* <WebView
          source={{
            uri: " https://docs.google.com/forms/d/e/1FAIpQLScq3WX_KGozgLyAwxtpFy4wB_wSv-PGjbXFqo9fy1xy0gOG1Q/viewform?usp=sf_link",
          }}
          style={{ height: 4180 }}
          //nestedScrollEnabled={true}
        /> */}
          <View style={styles.feedbackMainContainer}>
            <Pressable
              style={styles.feedbackButton}
              onPress={() => navigation.navigate("Feedback")}
            >
              <Text style={styles.buttonText}>Feedback</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
      <BottomMenu />
    </>
  );
};

export default Home;

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
    marginBottom: 20,
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
  },
  feedbackMainContainer: {
    marginBottom: 120,
    display: "flex",
    alignItems: "center",
    marginTop: 15,
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
    fontFamily: "MontserratRegular",
    fontSize: 14,
  },
});
