import React, { useState, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native"; // Import this hook
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Svg, {
  G,
  Path,
  Text as SvgText,
  Image as SvgImage,
  TSpan,
} from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_PATH, FILE_PATH } from "../../ApiPath";

const { width } = Dimensions.get("window");
const wheelSize = width * 0.8;

// Update prizes array to include both text and image
// Prizes array with weights (higher weight means higher chance of being selected)

const colors = [
  "#FF5733",
  "#FF8D1A",
  "#FA812F",
  "#FFC300",
  "#33FF57",
  "#33C4FF",
];

const SpinWheel = ({ luckyWheelData }) => {
  const navigation = useNavigation();
  const [reward, setReward] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [phone, setPhone] = useState("");
  const [userHavefreeSpin, setUserHaveFreeSpin] = useState("no");
  const spinValue = useRef(new Animated.Value(0)).current;
  const [userAppPoints, setUserAppPoints] = useState(-1);
  const [spinPoints, setSpinPoints] = useState(20);

  useFocusEffect(
    React.useCallback(() => {
      spinValue.setValue(0); // Reset the spin animation
      setIsSpinning(false); // Reset the spinning state

      const getUserPhone = async () => {
        const userPhone = await AsyncStorage.getItem("appUserPhone");
        console.log(userPhone);
        if (userPhone) {
          setPhone(userPhone);
          // fetch(`${API_PATH}/free-spin/${userPhone}`, {
          //   method: "get",
          //   headers: { "Content-Type": "application/json" },
          // })
          //   .then((res) => res.json())
          //   .then((data) => {
          //     console.log(data);
          //     if (data.freeSpinStatus) {
          //       setUserHaveFreeSpin(data.freeSpinStatus);
          //     } else {
          //       console.log("something wrong");
          //     }
          //   })
          //   .catch((err) => console.log(err));

          // Fetch the user app points
          fetch(`${API_PATH}/total-user-points/${userPhone}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              if (data.totalPoints) {
                setUserAppPoints(Number(data.totalPoints)); // Set the points to the state
              } else {
                console.log("Error fetching points");
              }
            })
            .catch((err) => console.log(err));
        }
      };
      getUserPhone();

      // Return a cleanup function if needed when the screen goes out of focus
      return () => {
        console.log("Cleanup if necessary");
      };
    }, []) // Empty dependency array ensures the effect runs every time screen is focused
  );

  // Function to split lengthy Text
  const splitText = (text, maxWidth) => {
    console.log("MAX WIDTH:", maxWidth);
    if (typeof text !== "string") {
      console.error("Invalid text input:", text);
      return []; // Return an empty array if text is not a string
    }

    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (testLine.length <= maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  };

  // Function to get a random prize based on weights
  const getRandomPrize = () => {
    // Calculate the total weight
    const totalWeight = prizes.reduce(
      (sum, prize) => sum + Number(prize.weight),
      0
    );
    console.log("Total weight:", totalWeight);

    // Generate a random number between 0 and the total weight
    const randomNum = Math.random() * totalWeight;

    // Determine the prize based on the random number and weight distribution
    let cumulativeWeight = 0;
    for (let i = 0; i < prizes.length; i++) {
      cumulativeWeight = cumulativeWeight + Number(prizes[i].weight);
      console.log(cumulativeWeight);
      console.log(randomNum);
      if (randomNum < cumulativeWeight) {
        return prizes[i];
      }
    }
  };

  // Free Spin
  const freeSpinWheel = () => {
    if (isSpinning) return; // Prevent multiple spins

    setIsSpinning(true);

    // Set a random angle (to spin the wheel multiple times)
    const randomAngle = Math.floor(Math.random() * 360 + 1440); // Random angle, at least 4 full spins

    Animated.loop(
      Animated.timing(spinValue, {
        toValue: randomAngle,
        duration: 4000, // Adjust duration as needed
        easing: Easing.linear, // Smooth spinning
        useNativeDriver: true,
      })
    ).start();

    setTimeout(() => {
      const randomPrize = getRandomPrize(); // Get the random prize
      console.log(randomPrize); // Log it to the console for debugging

      console.log(randomPrize.text.toLowerCase() === "try again"); //reward is try again so dont insert free spin in db

      // if (randomPrize.text.toLowerCase() === "try again") {
      //   navigation.navigate("ClaimWheelReward", { prize: randomPrize }); // Pass the prize to the screen
      // } else {
        //add data to db
        fetch(`${API_PATH}/user-free-spin-reward`, {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: phone,
            reward: randomPrize,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            setIsSpinning(false); // Stop the spinning animation
            if (data === "success") {
              navigation.navigate("ClaimWheelReward", { prize: randomPrize }); // Pass the prize to the screen
            } else {
              Alert.alert(
                "Error",
                "Failed to claim your reward. Please try again.",
                [{ text: "OK", onPress: () => navigation.navigate("Game") }]
              );
            }
          })
          .catch((err) => {
            console.log(err);
            Alert.alert(
              "Error",
              "Failed to claim your reward. Please try again.",
              [{ text: "OK", onPress: () => navigation.navigate("Game") }]
            );
          });
      // }
    }, 4000);
  };

  //Paid Spin
  const paidSpinWheel = () => {
    if (isSpinning) return; // Prevent multiple spins

    console.log("USER POINT: ", userAppPoints);
    console.log("SPIN POINTS REQUIRED: ", spinPoints);

    if (Number(userAppPoints) < spinPoints) {
      console.log("Insufficient Points");
      Alert.alert(
        "Insufficient Points",
        "You don't have enough points to claim this reward. Please try again later.",
        [{ text: "OK", onPress: () => navigation.navigate("Game") }]
      );
    } else {
      setIsSpinning(true);

      // Set a random angle (to spin the wheel multiple times)
      const randomAngle = Math.floor(Math.random() * 360 + 1440); // Random angle, at least 4 full spins

      Animated.loop(
        Animated.timing(spinValue, {
          toValue: randomAngle,
          duration: 4000, // Adjust duration as needed
          easing: Easing.linear, // Smooth spinning
          useNativeDriver: true,
        })
      ).start();

      setTimeout(() => {
        const randomPrize = getRandomPrize(); // Get the random prize
        console.log(randomPrize); // Log it to the console for debugging

        console.log(randomPrize.text.toLowerCase() === "try again"); //reward is try again so dont insert paid spin, or deduct points, in db
        
        // if(randomPrize.text.toLowerCase() === "try again"){
        //   navigation.navigate("ClaimWheelReward", { prize: randomPrize }); // Pass the prize to the screen
        // }
        // else{
        //add data to db
        fetch(`${API_PATH}/user-paid-spin-reward`, {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: phone,
            reward: randomPrize,
            spinPoints: spinPoints,
            userPoints: userAppPoints,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            setIsSpinning(false); // Stop the spinning animation
            if (data === "success") {
              navigation.navigate("ClaimWheelReward", { prize: randomPrize }); // Pass the prize to the screen
            } else {
              Alert.alert(
                "Error",
                "Failed to claim your reward. Please try again.",
                [{ text: "OK", onPress: () => navigation.navigate("Game") }]
              );
            }
          })
          .catch((err) => {
            console.log(err);
            Alert.alert(
              "Error",
              "Failed to claim your reward. Please try again.",
              [{ text: "OK", onPress: () => navigation.navigate("Home") }]
            );
          });
        // }
      }, 4000);
    }
  };

  const spinInterpolation = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  const prizes = [
    {
      text: luckyWheelData.rewardonename,
      image: luckyWheelData.rewardonefile,
      weight: luckyWheelData.rewardoneweight,
    },
    {
      text: luckyWheelData.rewardtwoname,
      image: luckyWheelData.rewardtwofile,
      weight: luckyWheelData.rewardtwoweight,
    },
    {
      text: luckyWheelData.rewardthreename,
      image: luckyWheelData.rewardthreefile,
      weight: luckyWheelData.rewardthreeweight,
    },
    {
      text: luckyWheelData.rewardfourname,
      image: luckyWheelData.rewardfourfile,
      weight: luckyWheelData.rewardfourweight,
    },
    {
      text: luckyWheelData.rewardfivename,
      image: luckyWheelData.rewardfivefile,
      weight: luckyWheelData.rewardfiveweight,
    },
    {
      text: luckyWheelData.rewardsixname,
      image: luckyWheelData.rewardsixfile,
      weight: luckyWheelData.rewardsixweight,
    },
  ];

  const renderText = (text, x, y, maxWidth, lineHeight) => {
    const lines = splitText(text, maxWidth);
    return lines.map((line, index) => (
      <TSpan key={index} x={x} dy={index === 0 ? 0 : lineHeight}>
        {line}
      </TSpan>
    ));
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.wheelContainer}>
        <Animated.View style={{ transform: [{ rotate: spinInterpolation }] }}>
          <Svg height={wheelSize} width={wheelSize} viewBox="0 -2 298 306">
            {prizes.map((prize, index) => {
              const angle = (360 / prizes.length) * index;
              const startAngle = (Math.PI / 180) * angle;
              const endAngle = (Math.PI / 180) * (angle + 360 / prizes.length);

              const x1 = 150 + 150 * Math.sin(startAngle);
              const y1 = 150 - 150 * Math.cos(startAngle);
              const x2 = 150 + 150 * Math.sin(endAngle);
              const y2 = 150 - 150 * Math.cos(endAngle);

              // Coordinates for placing the image
              const imageX =
                150 + 90 * Math.sin(startAngle + Math.PI / (prizes.length * 2));
              const imageY =
                150 - 90 * Math.cos(startAngle + Math.PI / (prizes.length * 2));

              return (
                <G key={index}>
                  <Path
                    d={`M150 150 L${x1} ${y1} A150 150 0 0 1 ${x2} ${y2} Z`}
                    fill={colors[index % colors.length]}
                    stroke="#FFF"
                    strokeWidth="2"
                  />
                  <SvgText
                    x="150"
                    y="30"
                    fontSize="12"
                    //fontFamily="MontserratRegular"
                    fill="#fff"
                    textAnchor="middle"
                    transform={`rotate(${angle + 30}, 150, 150)`}
                  >
                    {renderText(prize.text, 150, 40, 15, 12)}
                  </SvgText>
                  <SvgImage
                    href={`${FILE_PATH}/${prize.image}`}
                    x="130"
                    y="50"
                    width="40"
                    height="40"
                    preserveAspectRatio="xMidYMid meet"
                    transform={`rotate(${angle + 30}, 150, 150)`}
                  />
                </G>
              );
            })}
          </Svg>
        </Animated.View>
        <View style={styles.centerPin} />
      </View>
      {/* {userHavefreeSpin === "yes" && Number(userAppPoints) !== -1 ? (
        <TouchableOpacity
          onPress={freeSpinWheel}
          disabled={isSpinning}
          style={styles.button}
        >
          <Text style={styles.buttonText}>FREE SPIN</Text>
        </TouchableOpacity>
      ) : null} */}
      {userHavefreeSpin === "no" && Number(userAppPoints) !== -1 ? (
        <TouchableOpacity
          onPress={paidSpinWheel}
          disabled={isSpinning}
          style={styles.button}
        >
          <Text style={styles.buttonText}>{spinPoints} PTS SPIN</Text>
        </TouchableOpacity>
      ) : null}

      {/* Display the prize image and text */}
      {reward && (
        <View style={styles.rewardContainer}>
          <Image source={reward.image} style={styles.rewardImage} />
          <Text style={styles.rewardText}>{reward.text}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  wheelContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  centerPin: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#d35400",
    borderWidth: 3,
    borderColor: "#fff",
    zIndex: 10,
  },
  button: {
    backgroundColor: "#FFFFFF",
    width: 130,
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
  rewardContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  rewardImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 10,
  },
  rewardText: {
    fontSize: 18,
    color: "#1abc9c",
  },
});

export default SpinWheel;
