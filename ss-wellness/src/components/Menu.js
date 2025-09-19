import React, { useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  Text,
  Linking,
  Image,
  Dimensions,
  StyleSheet,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

const Menu = ({onPress, activePage}) => {
    const navigation = useNavigation();

    const onPressOutlets = () => {
        onPress();
        navigation.navigate('Outlets');
    };

    const onPressContactUs = () => {
      onPress();
      navigation.navigate('ContactUs');
    };

    const onPressFeedback = () => {
        onPress();
        navigation.navigate('Feedback');
    };

    const onStoreButtonCLick = () => {
        // const url = 'https://hitpay.shop/sswellness';
        // // Open the URL in the browser
        // Linking.openURL(url)
        //   .catch(err => console.error('Error opening website:', err));
        onPress();
        navigation.navigate('Store');
    };
    
    const onAccountButtonCLick = () => {
        // const url = 'https://app.sswellness.com.my/home';
        // // Open the URL in the browser
        // Linking.openURL(url)
        //   .catch(err => console.error('Error opening website:', err));
        onPress();
        navigation.navigate('Account');
    };

    const onPressPurchaseButtonCLick = () => {
      onPress();
      navigation.navigate('PurchasePoints');
    };

    const onPressTransactionHistory = () => {
      onPress();
      navigation.navigate('TransactionHistory');
    };

    const onPressLogOut = async () => {
        try {
            onPress();
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('expiresIn');
            navigation.navigate('Login');
          } catch (error) {
            console.error('Error logging out:', error);
          }
    };

    return (
        <View style={styles.mobileMenuSection}>
        <Pressable style={styles.mobileMenuSectionClose}>
            <Entypo
            name="cross"
            size={30}
            color="white"
            onPress={onPress}
            />
        </Pressable>
        <Pressable
            style={activePage === 'home' ? styles.mobileMenuSectionActiveItem : styles.mobileMenuSectionItem}
            onPress={() => navigation.navigate("Home")}
        >
            <Feather name="home" size={22} color={activePage === 'home' ? "#3C3C3B": "white"} />
            <Text style={activePage === 'home' ? styles.mobileMenuSectionActiveText : styles.mobileMenuSectionText}>Home</Text>
        </Pressable>
        <Pressable
            style={activePage === 'outlets' ? styles.mobileMenuSectionActiveItem : styles.mobileMenuSectionItem}
            onPress={onPressOutlets}
        >
            <Entypo name="shop" size={22} color={activePage === 'outlets' ? "#3C3C3B": "white"} />
            <Text style={activePage === 'outlets' ? styles.mobileMenuSectionActiveText : styles.mobileMenuSectionText}>Outlets</Text>
        </Pressable>
        <Pressable
            style={activePage === 'contactUs' ? styles.mobileMenuSectionActiveItem : styles.mobileMenuSectionItem}
            onPress={onPressContactUs}
        >
            <AntDesign name="contacts" size={22} color={activePage === 'contactUs' ? "#3C3C3B": "white"} />
            <Text style={activePage === 'contactUs' ? styles.mobileMenuSectionActiveText : styles.mobileMenuSectionText}>Contact Us</Text>
        </Pressable>
        <Pressable
            style={activePage === 'feedback' ? styles.mobileMenuSectionActiveItem : styles.mobileMenuSectionItem}
            onPress={onPressFeedback}
        >
            <FontAwesome name="wpforms" size={22} color={activePage === 'feedback' ? "#3C3C3B": "white"} />
            <Text style={activePage === 'feedback' ? styles.mobileMenuSectionActiveText : styles.mobileMenuSectionText}>Feedback</Text>
        </Pressable>
        <Pressable
            style={activePage === 'store' ? styles.mobileMenuSectionActiveItem : styles.mobileMenuSectionItem}
            onPress={onStoreButtonCLick}
        >
            <Feather name="shopping-bag" size={22} color={activePage === 'store' ? "#3C3C3B": "white"} />
            <Text style={activePage === 'store' ? styles.mobileMenuSectionActiveText : styles.mobileMenuSectionText}>SS Store</Text>
        </Pressable>
        <Pressable
            style={activePage === 'account' ? styles.mobileMenuSectionActiveItem : styles.mobileMenuSectionItem}
            onPress={onAccountButtonCLick}
        >
            <FontAwesome6 name="contact-card" size={22} color={activePage === 'account' ? "#3C3C3B": "white"} />
            <Text style={activePage === 'account' ? styles.mobileMenuSectionActiveText : styles.mobileMenuSectionText}>Account</Text>
        </Pressable>
        <Pressable
            style={activePage === 'purchasePoints' ? styles.mobileMenuSectionActiveItem : styles.mobileMenuSectionItem}
            onPress={onPressPurchaseButtonCLick}
        >
            <Feather name="shopping-cart" size={22} color={activePage === 'purchasePoints' ? "#3C3C3B": "white"} />
            <Text style={activePage === 'purchasePoints' ? styles.mobileMenuSectionActiveText : styles.mobileMenuSectionText}>Purchase Points</Text>
        </Pressable>
        <Pressable
            style={activePage === 'transactionHistory' ? styles.mobileMenuSectionActiveItem : styles.mobileMenuSectionItem}
            onPress={onPressTransactionHistory}
        >
            <FontAwesome name="wpforms" size={22} color={activePage === 'transactionHistory' ? "#3C3C3B": "white"} />
            <Text style={activePage === 'transactionHistory' ? styles.mobileMenuSectionActiveText : styles.mobileMenuSectionText}>Transaction History</Text>
        </Pressable>
        <Pressable
            style={styles.mobileMenuSectionItem}
            onPress={onPressLogOut}
        >
            <MaterialIcons name="logout" size={22} color="white" />
            <Text style={styles.mobileMenuSectionText}>Logout</Text>
        </Pressable>
        </View>
    );
};

export default Menu;

const styles = StyleSheet.create({

  mobileMenuSection: {
    height: height,
    width: width,
    backgroundColor: "#3C3C3B",
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    top: 0,
    left: 0,
    padding: 25,
    zIndex: 9,
  },
  mobileMenuSectionClose: {
    alignItems: "flex-end",
    paddingBottom: 20,
  },
  mobileMenuTabSection: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    paddingTop: 10,
    paddingBottom: 15,
  },
  mobileMenuTab: {
    width: 120,
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#6E594B",
    gap: 25,
    borderWidth: 1,
    borderColor: "#7B695D",
    borderRadius: 10,
    padding: 12,
  },
  mobileMenuTabActive: {
    width: 120,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7B695D",
    gap: 25,
    borderWidth: 0,
    borderColor: "#6E594B",
    borderRadius: 10,
    padding: 12,
  },
  mobileMenuSectionItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 25,
    borderRadius: 10,
    padding: 15,
  },
  mobileMenuSectionActiveItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    gap: 25,
    borderWidth: 0,
    borderColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
  },
  mobileMenuSectionActiveText: {
    color: "#3C3C3B",
    fontFamily: "MontserratRegular",
    fontSize: 16,
  },
  mobileMenuSectionText: {
    color: "#FFFFFF",
    fontFamily: "MontserratRegular",
    fontSize: 16,
  },

});
