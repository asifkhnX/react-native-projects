import { Ionicons } from '@expo/vector-icons';
import React from 'react';

import { Button, Text, View } from '@/components/ui';

type Feature = {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
};

type SubscribeCardProps = {
  title: string;
  price: string;
  features: Feature[];
  onPress?: () => void;
  loading?: boolean;
};

export const SubscribeCard: React.FC<SubscribeCardProps> = ({
  title,
  price,
  features,
  onPress,
  loading = false,
}) => {
  return (
    <View className="items-center justify-center">
      <Text className="mb-6 px-2 text-center text-lg">
        To explore camps, colleges, and registration details, please subscribe
        to our Premium plan.
      </Text>

      <View className="w-full overflow-hidden rounded-xl border border-neutral-300 bg-white p-9 dark:bg-neutral-900">
        <Text className="text-center text-2xl color-custom-golden">
          {title}
        </Text>
        <Text className="mt-2 text-center text-4xl color-custom-golden">
          {price}
        </Text>

        <View className="mt-6 space-y-2">
          {features.map((feature, index) => (
            <View key={index} className="mb-3 flex flex-row items-start">
              <Ionicons
                name={feature.icon}
                size={20}
                color="#d4af37"
                style={{ marginTop: 5 }}
              />
              <Text className="ml-2 text-left text-lg">{feature.text}</Text>
            </View>
          ))}
        </View>

        <View className="mt-3">
          <Button
            label="Subscribe"
            onPress={onPress}
            loading={loading}
            disabled={loading}
          />
        </View>
      </View>
    </View>
  );
};
