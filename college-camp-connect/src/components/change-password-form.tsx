import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView } from 'react-native';
import * as z from 'zod';

import { Button, Text, View } from '@/components/ui';
import { InputPassword } from '@/components/ui/input-password';

const schema = z
  .object({
    newPassword: z
      .string({
        required_error: 'New password is required',
      })
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string({
      required_error: 'Please confirm your password',
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type FormType = z.infer<typeof schema>;

export const ChangePasswordForm = ({ onSubmit = () => {} }) => {
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
            <Text
              testID="form-title"
              className="pb-6 text-center text-3xl font-bold color-custom-golden"
            >
              Change Password
            </Text>
          </View>

          {/* New Password */}
          <Controller
            control={control}
            name="newPassword"
            render={({ field, fieldState }) => (
              <InputPassword
                label="New Password"
                placeholder="Enter new password"
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

          {/* Confirm Password */}
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <InputPassword
                label="Confirm Password"
                placeholder="Confirm new password"
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

          {/* Submit */}
          <View className="mt-6">
            <Button label="Update Password" onPress={handleSubmit(onSubmit)} />
          </View>

          <View className="mt-3 items-center">
            <Text className="color-custom-golden" onPress={() => router.back()}>
              Cancel
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
