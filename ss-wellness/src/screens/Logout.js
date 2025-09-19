import React, { useEffect } from "react";
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Logout = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('expiresIn');
        navigation.navigate('Login');
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };

    logoutUser();
  }, [navigation]);

  // You can return null or a simple loading indicator
  return <View />;
};

export default Logout;