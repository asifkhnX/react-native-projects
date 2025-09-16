import React, { useEffect } from "react";
import {Dimensions, View, Image, Text, StyleSheet} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

// Local imports
import Images from "../../assets/images/index";

const { width, height } = Dimensions.get("window");

const Splash = () => {

    const navigation = useNavigation();

    useEffect(() => {

        setTimeout(() => {
            navigation.navigate('Promo');
        }, 3000);

    }, []);

    return (
        <LinearGradient
        start={{x: 1, y: 0}}
        end={{x: 1, y: 1}}
        colors={['#3C3C3B', '#3C3C3B']}>
            <View style={styles.outerMainContainer}>
                <View style={styles.mainContainer}>
                    <Image source={Images.logo} style={styles.logoImage}/>
                </View>
                <View style={styles.splashTextContiner}>
                    <Text style={styles.splashText}>RELAX</Text>
                    <View style={styles.borderCircle}></View>
                    <Text style={styles.splashText}>REVIVE</Text>
                    <View style={styles.borderCircle}></View>
                    <Text style={styles.splashText}>RENEW</Text>
                </View>
            </View>
        </LinearGradient>
    );

};

export default Splash;

const styles = StyleSheet.create({
    outerMainContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: height,
        gap: 15,
        position: 'relative',
    },
    mainContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        padding: 15,
        borderRadius: 10,
        // shadowOffset: {
        //   width: 1,
        //   height: 1,
        // },
        // shadowOpacity: 0.1,
        // elevation: 5,
    },
    logoImage: {
        width: 100,
        height: 150,
      },
    splashTextContiner: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        width: width,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    splashText: {
        fontFamily: "MontserratRegular",
        fontSize: 10,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    borderCircle: {
        width: 3,
        height: 3,
        borderRadius: 300,
        backgroundColor: '#FFFFFF',
    },
});