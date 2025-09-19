import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { Video } from "expo-av";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

//local imports
import { API_PATH, FILE_PATH } from "../../ApiPath";

const { width, height } = Dimensions.get("window");

const Promo = () => {
  const videoRef = useRef(null);
  const navigation = useNavigation();
  const [promo, setPromo] = useState({});

  useEffect(() => {
    fetch(`${API_PATH}/all-promo`, {
      method: "get",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPromo(data);
      })
      .catch((err) => console.log(err));

    // Cleanup function to unload the video when component unmounts
    return () => {
      if (videoRef.current) {
        videoRef.current.unloadAsync(); // Unloads the video
      }
    };

  }, []);

  useFocusEffect(
    useCallback(() => {
      // Start the video when the screen is focused
      if (videoRef.current) {
        videoRef.current.playAsync();
      }

      // Pause/unload the video when the screen is unfocused
      return () => {
        if (videoRef.current) {
          videoRef.current.pauseAsync(); // Pause the video
          videoRef.current.unloadAsync(); // Unload the video to stop playback
        }
      };
    }, [])
  );

  const onPressContinue = () => {
    navigation.navigate("Login");
  };

  return (
    <LinearGradient
      start={{ x: 1, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={["#3C3C3B", "#3C3C3B"]}
    >
      <View style={styles.outerMainContainer}>
        <View style={styles.mainContainer}>
          <Text style={styles.promoText}>PROMO</Text>
          {promo.file ? <Video
            ref={videoRef}
            source={{ uri: `${FILE_PATH}/${promo.file}` }}
            style={styles.video}
            useNativeControls={false}
            resizeMode="contain"
            isLooping={true} // Loops the video
            shouldPlay={true} // Autoplay the video
            onError={(error) => console.error('Video playback error:', error)}
          /> : null}
          <Pressable style={styles.buttonContainer} onPress={onPressContinue}>
            <Text style={styles.buttonText}>Continue</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Promo;

const styles = StyleSheet.create({
  outerMainContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: height,
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    borderRadius: 20,
    padding: 15,
    borderRadius: 10,
  },
  video: {
    width: width,
    height: width,
  },
  promoText: {
    color: "#FFFFFF",
    fontFamily: "MontserratRegular",
    fontSize: 20,
  },
  buttonContainer: {
    backgroundColor: "#FFFFFF",
    width: 100,
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
