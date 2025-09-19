import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { OtpInput } from 'react-native-otp-entry';
import Toast from 'react-native-toast-message';

import { API_PATH } from '@/api/api-path';
import { Button, FocusAwareStatusBar, Text, View } from '@/components/ui';

export default function VerifyEmail() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState(null);
  const [serverOtp, setServerOtp] = useState(null);

  const { name, email, password } = useLocalSearchParams<{
    name: string;
    email: string;
    password: string;
  }>();

  console.log('Received params:', name, email, password);

  useEffect(() => {
    sendOtp();
  }, []);

  const sendOtp = () => {
    if (email) {
      const otp = generateOtp();
      setServerOtp(otp);

      setLoading(true);
      fetch(`${API_PATH}/user/send-otp`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otp: otp,
          email: email,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          if (data.status === 'success') {
            console.log('code sent successfully');
            return;
          } else {
            Toast.show({
              type: 'error',
              text1: 'Something went wrong.',
              text2: 'Please try again later.',
            });
            return;
          }
        })
        .catch((_error) => {
          setLoading(true);
          Toast.show({
            type: 'error',
            text1: 'Something went wrong.',
            text2: 'Please try again later.',
          });
        });
    }
  };

  // Generate a 6-digit OTP
  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const onSubmitOtp = (enteredOtp: string) => {
    console.log('a', enteredOtp);
    console.log('b', serverOtp);
    if (Number(enteredOtp) === Number(serverOtp)) {
      console.log('OTP verified!');
      setLoading(true);
      fetch(`${API_PATH}/user/signup`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setLoading(false);
          if (data.status === 'success') {
            Toast.show({
              type: 'success',
              text1: 'Account created Successfully',
            });
            router.replace('/login');
            return;
          } else {
            Toast.show({
              type: 'error',
              text1: 'Something went wrong.',
              text2: 'Please try again later.',
            });
            return;
          }
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          Toast.show({
            type: 'error',
            text1: 'Something went wrong.',
            text2: 'Please try again later.',
          });
        });
    } else {
      console.log('Invalid OTP!');
      Toast.show({
        type: 'error',
        text1: 'Invalid OTP.',
        text2: 'Please try again.',
      });
    }
  };

  return (
    <>
      <FocusAwareStatusBar />
      <View className="flex-1 items-center justify-center p-4">
        <View className="w-full max-w-md">
          <View className="items-center justify-center">
            <Text className="pb-6 text-center text-4xl color-custom-golden">
              verify email
            </Text>
            <Text className="mb-6 text-center text-gray-600">
              enter the 6-digit code sent to your email.
            </Text>
          </View>
          <View className="mt-3 items-center">
            <OtpInput
              numDigits={6}
              onTextChange={(text) => setEnteredOtp(text)}
            />
            <View className="mt-3 w-full">
              <Button
                label="submit otp"
                onPress={() => onSubmitOtp(enteredOtp)}
                loading={loading}
                disabled={loading}
              />
            </View>
            <Text
              className="mt-3 color-custom-golden"
              onPress={() => {
                setEnteredOtp('');
                sendOtp();
              }}
            >
              resend code
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}
