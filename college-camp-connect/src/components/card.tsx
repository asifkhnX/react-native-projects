import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking } from 'react-native';

import { Button, Text, View } from '@/components/ui';

type CardProps = {
  college: string;
  camp: string;
  location: string;
  dates?: string;
  times?: string;
  ages?: string;
  reg_link?: string;
  cost?: string;
};

export const Card: React.FC<CardProps> = ({
  college,
  camp,
  dates,
  times,
  location,
  ages,
  reg_link,
  cost,
}) => {
  return (
    <View className="my-2 w-full overflow-hidden rounded-xl border border-neutral-300 bg-white p-9 dark:bg-neutral-900">
      <Text className="text-center text-2xl color-custom-golden">
        {college}
      </Text>
      <Text className="mt-2 text-center text-4xl color-custom-golden">
        ${cost}
      </Text>

      <View className="mt-6 space-y-2">
        <View className="mb-3 flex flex-row items-start">
          <Ionicons name={'school-outline'} size={20} color="#d4af37" />
          <Text className="ml-2 text-left text-lg">{camp}</Text>
        </View>
        <View className="mb-3 flex flex-row items-start">
          <Ionicons name={'calendar-outline'} size={20} color="#d4af37" />
          <Text className="ml-2 text-left text-lg">{dates}</Text>
        </View>
        <View className="mb-3 flex flex-row items-start">
          <Ionicons name={'time-outline'} size={20} color="#d4af37" />
          <Text className="ml-2 text-left text-lg">{times}</Text>
        </View>
        <View className="mb-3 flex flex-row items-start">
          <Ionicons name={'location-outline'} size={20} color="#d4af37" />
          <Text className="ml-2 text-left text-lg">{location}</Text>
        </View>
        <View className="mb-3 flex flex-row items-start">
          <Ionicons name={'people-outline'} size={20} color="#d4af37" />
          <Text className="ml-2 text-left text-lg">{ages}</Text>
        </View>
      </View>

      <View className="mt-3">
        <Button
          label="Register now"
          onPress={() => {
            if (reg_link) {
              Linking.openURL(reg_link).catch((err) =>
                console.error('Failed to open URL:', err)
              );
            } else {
              console.warn('No registration link provided');
            }
          }}
        />
      </View>
    </View>
  );
};
