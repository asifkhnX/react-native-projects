import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image } from 'react-native';

import {
  Button,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import { useIsFirstTime } from '@/lib/hooks';

export default function Onboarding() {
  const [_, setIsFirstTime] = useIsFirstTime();
  const router = useRouter();
  return (
    <View className="flex h-full items-center justify-center">
      <FocusAwareStatusBar />
      <View className="flex-1 items-center justify-center">
        <Image
          source={require('../../assets/logo.png')}
          className="mb-3 h-[100px] w-[300px]"
          resizeMode="contain"
        />
        <View className="mx-auto w-4/5 items-center">
          <Text className="my-3 text-center font-sedgwick text-4xl color-custom-golden">
            College Softball Camps & Clinics
          </Text>
          <Text className="mb-6 text-justify text-lg text-gray-600">
            Easily find and register for college softball camps and clinics
            nationwide. Browse verified events with key details — host school,
            age group, cost, dates — plus direct links to sign up fast. Search
            by school or keyword, view in list or calendar mode, and never miss
            a chance to get noticed.
          </Text>
          <View>
            {/* Comprehensive Listings */}
            <View className="mb-3 flex flex-row items-start">
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#d4af37"
                style={{ marginTop: 0 }}
              />
              <Text className="ml-2 text-base text-gray-700">
                Comprehensive nationwide camp listings
              </Text>
            </View>

            {/* Search Function */}
            <View className="mb-3 flex flex-row items-start">
              <Ionicons
                name="search-outline"
                size={20}
                color="#d4af37"
                style={{ marginTop: 0 }}
              />
              <Text className="ml-2 text-base text-gray-700">
                Quick search by school, age group, or keyword
              </Text>
            </View>

            {/* List & Calendar Views */}
            <View className="mb-3 flex flex-row items-start">
              <Ionicons
                name="list-outline"
                size={20}
                color="#d4af37"
                style={{ marginTop: 0 }}
              />
              <Text className="ml-2 text-base text-gray-700">
                List and calendar views for easy planning
              </Text>
            </View>

            {/* Event Details */}
            <View className="mb-3 flex flex-row items-start">
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#d4af37"
                style={{ marginTop: 3 }}
              />
              <Text className="ml-2 text-base text-gray-700">
                Full event details with direct registration links
              </Text>
            </View>
          </View>

          <Text className="mb-3 text-justify text-lg text-gray-600">
            Stay ahead of the game — discover, plan, and register in one place.
          </Text>

          <SafeAreaView>
            <Button
              label="Let's get started "
              onPress={() => {
                setIsFirstTime(false);
                router.replace('/login');
              }}
            />
          </SafeAreaView>
        </View>
      </View>
    </View>
  );
}
