import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView } from 'react-native';
import * as z from 'zod';

import { Button, ControlledInput, Text, View } from '@/components/ui';

import { InputPassword } from './ui/input-password';

const schema = z.object({
  name: z.string().optional(),
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
});

export type FormType = z.infer<typeof schema>;

export type LoginFormProps = {
  onSubmit?: SubmitHandler<FormType>;
};

export const LoginForm = ({ onSubmit = () => {} }: LoginFormProps) => {
  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();

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
              Sign In
            </Text>
          </View>

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
          <View className="mt-3 items-end">
            <Text
              className="color-custom-golden"
              onPress={() => {
                router.push('/forgot-password');
              }}
            >
              Forgot your password?
            </Text>
          </View>
          <View className="mt-3">
            <Button
              testID="login-button"
              label="Sign In"
              onPress={handleSubmit(onSubmit)}
            />
          </View>

          <View className="mt-3 items-center">
            <Text className="text-center text-gray-600">
              Don't have an account?{' '}
              <Text
                className="color-custom-golden"
                onPress={() => {
                  router.replace('/register');
                }}
              >
                SIGN UP
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
