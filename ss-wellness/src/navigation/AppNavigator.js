import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Splash from '../screens/Splash';
import Promo from '../screens/Promo';
import Login from '../screens/Login';
import ForgotPassword from '../screens/ForgotPassword';
import Home from '../screens/Home';
import Outlets from '../screens/Outlets';
import ContactUs from '../screens/ContactUs';
import Feedback from '../screens/Feedback';
import Store from '../screens/Store';
import Account from '../screens/Account';
import Notifications from '../screens/Notifications';
import DailyRewards from '../screens/DailyRewards';
import Game from '../screens/Game';
import ClaimWheelReward from '../screens/ClaimWheelReward';
import MyAllRewards from '../screens/MyAllRewards';
import PurchasePoints from '../screens/PurchasePoints';
import TransactionHistory from '../screens/TransactionHistory';

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
      <Stack.Screen name="Promo" component={Promo} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="Outlets" component={Outlets} options={{ headerShown: false }} />
      <Stack.Screen name="ContactUs" component={ContactUs} options={{ headerShown: false }} />
      <Stack.Screen name="Feedback" component={Feedback} options={{ headerShown: false }} />
      <Stack.Screen name="Store" component={Store} options={{ headerShown: false }} />
      <Stack.Screen name="Account" component={Account} options={{ headerShown: false }} />
      <Stack.Screen name="MyAllRewards" component={MyAllRewards} options={{ headerShown: false }} />
      <Stack.Screen name="TransactionHistory" component={TransactionHistory} options={{ headerShown: false }} />
      <Stack.Screen name="DailyRewards" component={DailyRewards} options={{ headerShown: false }} />
      <Stack.Screen name="Game" component={Game} options={{ headerShown: false }} />
      <Stack.Screen name="ClaimWheelReward" component={ClaimWheelReward} options={{ headerShown: false }} />
      <Stack.Screen name="PurchasePoints" component={PurchasePoints} options={{ headerShown: false }} />
      <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: false }} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;