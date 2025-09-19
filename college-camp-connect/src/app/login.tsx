import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

import { API_PATH } from '@/api/api-path';
import type { LoginFormProps } from '@/components/login-form';
import { LoginForm } from '@/components/login-form';
import { FocusAwareStatusBar } from '@/components/ui';
import { useAuth } from '@/lib';

export default function Login() {
  const router = useRouter();
  const signIn = useAuth.use.signIn();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          // optionally validate token here
          signIn({ access: user.accessToken, refresh: 'refresh-token' });
          router.replace('/');
        }
      } catch (error) {
        console.log('Error reading user from AsyncStorage:', error);
      }
    };
    checkUser();
  }, []);

  const onSubmit: LoginFormProps['onSubmit'] = (data) => {
    console.log(data);

    setLoading(true);
    fetch(`${API_PATH}/user/signin`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
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
  };

  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm onSubmit={onSubmit} />
    </>
  );
}
