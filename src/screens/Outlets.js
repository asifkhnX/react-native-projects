import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";

// Local imports
import GreetingText from "../components/GreetingText";
import Menu from "../components/Menu";
import BottomMenu from "../components/BottomMenu";
import { API_PATH, FILE_PATH } from "../../ApiPath";

const { width } = Dimensions.get("window");

const Outlets = ({ navigation }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [allOutlets, setAllOutlets] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      fetch(`${API_PATH}/all-outlets`, {
        method: "get",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setAllOutlets(data);
        })
        .catch((err) => console.log(err));
      // Return a cleanup function if needed when the screen goes out of focus
      return () => {
        console.log("Cleanup if necessary");
      };
    }, []) // Empty dependency array ensures the effect runs every time screen is focused
  );

  const outletsArray = allOutlets.map((eachOutlet, index) => {
    return (
      <View style={styles.outletItem} key={index}>
        <Image
          source={{ uri: `${FILE_PATH}/${eachOutlet.file}` }}
          style={styles.outletItemImage}
          resizeMode="cover"
        />
        <View style={styles.outletTextSection}>
          <AntDesign name="home" size={20} color="white" />
          <Text style={styles.outletText}>{eachOutlet.name}</Text>
        </View>
        <View style={styles.outletTextSection}>
          <Ionicons name="location-outline" size={20} color="white" />
          <Text style={styles.outletText}>{eachOutlet.location}</Text>
        </View>
        <View style={styles.outletTextSection}>
          <AntDesign name="clockcircleo" size={20} color="white" />
          <Text style={styles.outletText}>
            Opens {eachOutlet.opentime} . Closes {eachOutlet.closetime}
          </Text>
        </View>
        <View style={styles.outletTextSection}>
          <Feather name="phone" size={20} color="white" />
          <Text style={styles.outletText}>{eachOutlet.phonenumber}</Text>
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
          <Menu onPress={onPressCloseMenu} activePage={"outlets"} />
        ) : null}
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          <View style={styles.outletSection}>
            <View>
              <Text style={styles.sectionHeading}>OUTLETS</Text>
            </View>
            <View style={styles.outletItemListing}>
              {outletsArray.length > 0 ? (
                outletsArray
              ) : (
                <Text style={{ textAlign: "center", color: "#FFFFFF" }}>
                  No Any Outlet Found :)
                </Text>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
      <BottomMenu />
    </>
  );
};

export default Outlets;

const styles = StyleSheet.create({
  outerMainContainer: {
    flex: 1,
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
  //Outlet css
  outletSection: {
    width: width,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
    marginTop: 20,
    paddingBottom: 120,
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
  outletItem: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
    width: width - 30,
    borderRadius: 10,
    borderWidth: 0,
    paddingBottom: 20,
    overflow: "hidden",
    borderRadius: 10,
  },
  outletItemImage: {
    width: "100%",
    height: width,
    objectFit: "cover",
  },
  outletTextSection: {
    display: "flex",
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  outletText: {
    fontFamily: "MontserratLight",
    width: "90%",
    textAlign: "left",
    fontSize: 14,
    color: "#FFFFFF",
  },
});
