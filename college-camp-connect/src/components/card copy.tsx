import { Ionicons } from '@expo/vector-icons';
import React from 'react';

import { Button, Text, View } from '@/components/ui';

type CardProps = {
  college: string;
  campName: string;
  dates: string;
  times: string;
  location: string;
  eligibility: string;
  registrationLink: string;
  cost: string;
};

export const CardCopy: React.FC<CardProps> = ({
  college,
  campName,
  dates,
  times,
  location,
  eligibility,
  registrationLink,
  cost,
}) => {
  return (
    <View className="my-2 w-full overflow-hidden rounded-xl border border-neutral-300 bg-white p-9 dark:bg-neutral-900">
      <Text className="color-custom-golden text-center text-2xl font-bold">
        {college}
      </Text>
      <Text className="color-custom-golden mt-2 text-center text-4xl font-bold">
        {cost}
      </Text>

      <View className="mt-6 space-y-2">
        <View className="mb-3 flex flex-row items-center">
          <Ionicons name={'school-outline'} size={20} color="#d4af37" />
          <Text className="ml-2 text-left text-lg">{campName}</Text>
        </View>
        <View className="mb-3 flex flex-row items-center">
          <Ionicons name={'calendar-outline'} size={20} color="#d4af37" />
          <Text className="ml-2 text-left text-lg">{dates}</Text>
        </View>
        <View className="mb-3 flex flex-row items-center">
          <Ionicons name={'time-outline'} size={20} color="#d4af37" />
          <Text className="ml-2 text-left text-lg">{times}</Text>
        </View>
        <View className="mb-3 flex flex-row items-center">
          <Ionicons name={'location-outline'} size={20} color="#d4af37" />
          <Text className="ml-2 text-left text-lg">{location}</Text>
        </View>
        <View className="mb-3 flex flex-row items-center">
          <Ionicons name={'people-outline'} size={20} color="#d4af37" />
          <Text className="ml-2 text-left text-lg">{eligibility}</Text>
        </View>
      </View>

      <View className="mt-3">
        <Button label="Register Now" />
      </View>
    </View>
  );
};
