import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView } from 'react-native';
import Toast from 'react-native-toast-message';
import * as z from 'zod';

import { API_PATH } from '@/api/api-path';
import { Button, ControlledInput, Text, View } from '@/components/ui';
import { InputPassword } from '@/components/ui/input-password';
const schema = z
  .object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(1, 'Name is required'),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email format'),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string({
      required_error: 'Confirm Password is required',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type FormType = z.infer<typeof schema>;

export type LoginFormProps = {
  onSubmit?: SubmitHandler<FormType>;
};

export const RegisterForm = ({ onSubmit = () => {} }: LoginFormProps) => {
  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const onFormSubmit: SubmitHandler<FormType> = (values) => {
    console.log('Form values:', values);

    setLoading(true);
    fetch(`${API_PATH}/user/exists`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: values.email }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.status === 'success' && data.exists === true) {
          Toast.show({
            type: 'error',
            text1: 'Email already exists.',
            text2: 'Please use a different email.',
          });
          return;
        } else if (data.status === 'success' && data.exists === false) {
          router.push({
            pathname: '/verify-email',
            params: {
              name: values.name,
              email: values.email,
              password: values.password,
            },
          });
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
        setLoading(true);
        console.error('Error checking email existence:', error);
        Toast.show({
          type: 'error',
          text1: 'Something went wrong.',
          text2: 'Please try again later.',
        });
      });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={10}
    >
      <View className="flex-1 items-center justify-center p-4">
        <View className="w-full max-w-md">
          <View className="items-center justify-center">
            <Text className="pb-6 text-center text-4xl color-custom-golden">
              Sign Up
            </Text>
          </View>

          <ControlledInput
            testID="name"
            control={control}
            name="name"
            label="Name"
            placeholder="Enter your name"
          />

          <ControlledInput
            testID="email-input"
            control={control}
            name="email"
            label="Email"
            placeholder="Enter your email"
          />

          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <InputPassword
                label="Password"
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error?.message}
                rightIcon={
                  showPassword ? (
                    <Ionicons name="eye" size={20} color="#d4af37" />
                  ) : (
                    <Ionicons name="eye-off" size={20} color="#d4af37" />
                  )
                }
                onRightIconPress={() => setShowPassword((prev) => !prev)}
              />
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <InputPassword
                label="Confirm password"
                placeholder="Confirm your password"
                secureTextEntry={!showConfirmPassword}
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error?.message}
                rightIcon={
                  showConfirmPassword ? (
                    <Ionicons name="eye" size={20} color="#d4af37" />
                  ) : (
                    <Ionicons name="eye-off" size={20} color="#d4af37" />
                  )
                }
                onRightIconPress={() => setShowConfirmPassword((prev) => !prev)}
              />
            )}
          />

          <View className="mt-3">
            <Button
              testID="register-button"
              label="Sign Up"
              onPress={handleSubmit(onFormSubmit)}
              disabled={loading}
              loading={loading}
            />
          </View>
          <View className="mt-3 items-center">
            <Text className="text-center text-gray-600">
              Have an account?{' '}
              <Text
                className="color-custom-golden"
                onPress={() => {
                  router.replace('/login');
                }}
              >
                SIGN IN
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
