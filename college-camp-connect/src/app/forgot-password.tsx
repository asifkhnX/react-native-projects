import { zodResolver } from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { OtpInput } from 'react-native-otp-entry';
import Toast from 'react-native-toast-message';
import * as z from 'zod';

import { API_PATH } from '@/api/api-path';
import {
  Button,
  ControlledInput,
  FocusAwareStatusBar,
  Text,
  View,
} from '@/components/ui';
import { useAuth } from '@/lib';

const schema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format'),
});

export type ForgotPasswordFormType = z.infer<typeof schema>;

export default function ForgotPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState(null);
  const [serverOtp, setServerOtp] = useState(null);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [email, setEmail] = useState(null);
  const signIn = useAuth.use.signIn();

  const { handleSubmit, control, getValues } = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(schema),
  });

  // Generate a 6-digit OTP
  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const reSendOtp = () => {
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

  const onSubmitEmail = (values: ForgotPasswordFormType) => {
    const otp = generateOtp();
    setServerOtp(otp);
    console.log('Email:', values.email);
    console.log('OTP sent:', otp);

    setLoading(true);
    fetch(`${API_PATH}/user/forgot-pasword-otp`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        otp: otp,
        email: values.email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.status === 'success') {
          console.log('code sent successfully');
          setEmail(values.email);
          setIsCodeSent(true);
          return;
        } else if (data.status === 'user-doesnt-exist') {
          Toast.show({
            type: 'error',
            text1: 'User does not exist.',
            text2: 'This email is not linked with any account.',
          });
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
  };

  const onSubmitOtp = (enteredOtp: string) => {
    console.log('a', enteredOtp);
    console.log('b', serverOtp);
    if (Number(enteredOtp) === Number(serverOtp)) {
      console.log('OTP verified!');

      setLoading(true);
      fetch(`${API_PATH}/user/otp-signin`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      })
        .then((res) => res.json())
        .then(async (data) => {
          console.log(data);
          setLoading(false);
          if (data.status === 'success') {
            await AsyncStorage.setItem(
              'user',
              JSON.stringify({
                id: data.id,
                email: data.email,
                accessToken: data.accessToken,
              })
            );
            signIn({ access: data.accessToken, refresh: 'refresh-token' });
            router.replace('/');
            return;
          } else if (data.status === 'invalid-details') {
            Toast.show({
              type: 'error',
              text1: 'Incorrect email or password.',
              text2: 'Please try again.',
            });
            return;
          } else {
            Toast.show({
              type: 'error',
              text1: 'Something went wrong.',
              text2: 'Please try again later.',
            });
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
              Forgot password
            </Text>
            <Text className="mb-6 text-center text-gray-600">
              {isCodeSent
                ? 'Enter the 6-digit code sent to your email.'
                : "Enter your email and we'll send you a 6-digit verification code."}
            </Text>
          </View>

          {!isCodeSent && (
            <>
              <ControlledInput
                testID="email-input"
                control={control}
                name="email"
                label="Email"
                placeholder="Enter your email"
              />
              <View className="mt-3">
                <Button
                  label="Send code"
                  onPress={handleSubmit(onSubmitEmail)}
                  loading={loading}
                  disabled={loading}
                />
              </View>
            </>
          )}

          {isCodeSent && (
            <View className="mt-3 items-center">
              <OtpInput
                numDigits={6}
                onTextChange={(text) => setEnteredOtp(text)}
              />
              <View className="mt-3 w-full">
                <Button
                  label="Submit otp"
                  onPress={() => onSubmitOtp(enteredOtp)}
                  loading={loading}
                  disabled={loading}
                />
              </View>
              <Text
                className="mt-3 color-custom-golden"
                onPress={() => {
                  setEnteredOtp('');
                  reSendOtp();
                }}
              >
                Resend code
              </Text>
            </View>
          )}

          {!isCodeSent && (
            <View className="mt-3 items-center">
              <Text
                className="color-custom-golden"
                onPress={() => router.replace('/login')}
              >
                Back to login
              </Text>
            </View>
          )}
        </View>
      </View>
    </>
  );
}
