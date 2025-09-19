import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import Toast from 'react-native-toast-message';

import { API_PATH } from '@/api/api-path';
import { ChangePasswordForm } from '@/components/change-password-form';
import type { LoginFormProps } from '@/components/login-form';
import { FocusAwareStatusBar } from '@/components/ui';
import { signOut, useAuth } from '@/lib';

export default function ChangePassword() {
  const router = useRouter();
  const signIn = useAuth.use.signIn();
  const [loading, setLoading] = useState(false);

  const onSubmit: LoginFormProps['onSubmit'] = async (data) => {
    console.log(data);
    setLoading(true);

    const storedUser = await AsyncStorage.getItem('user');
    if (!storedUser) {
      Toast.show({
        type: 'error',
        text1: 'Not logged in',
        text2: 'Please log in again.',
      });
      setLoading(false);
      router.replace('/login');
      return;
    }

    const user = JSON.parse(storedUser);

    fetch(`${API_PATH}/user/change-password`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify({
        userId: user.id,
        password: data.confirmPassword,
      }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        console.log(data);
        setLoading(false);
        if (data.status === 'success') {
          await AsyncStorage.removeItem('user');
          signOut(); // clear auth state if you’re using useAuth

          Toast.show({
            type: 'success',
            text1: 'Password changed successfully.',
            text2: 'Please log in again.',
          });

          router.replace('/login');
          return;
        } else if (data.status === 'invalid-details') {
          Toast.show({
            type: 'error',
            text1: 'Incorrect email or password.',
            text2: 'Please try again.',
          });
          return;
        } else if (data.status === 'token-expired') {
          await AsyncStorage.removeItem('user');
          signOut(); // clear auth state if you’re using useAuth

          Toast.show({
            type: 'error',
            text1: 'Your session has been expired.',
            text2: 'Please log in again.',
          });

          router.replace('/login');
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
  };

  return (
    <>
      <FocusAwareStatusBar />
      <ChangePasswordForm onSubmit={onSubmit} loading={loading} />
    </>
  );
}
