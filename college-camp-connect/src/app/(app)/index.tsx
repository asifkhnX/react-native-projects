import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlashList } from '@shopify/flash-list';
import { useStripe } from '@stripe/stripe-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Linking, TextInput, TouchableOpacity } from 'react-native';
import { Agenda } from 'react-native-calendars';
import Toast from 'react-native-toast-message';
import { router } from 'react-query-kit';

import { usePosts } from '@/api';
import { API_PATH } from '@/api/api-path';
import { Card } from '@/components/card';
import { SubscribeCard } from '@/components/subscribe-card';
import {
  Button,
  EmptyList,
  FocusAwareStatusBar,
  Text,
  View,
} from '@/components/ui';
import { signOut } from '@/lib';

type ViewMode = 'list' | 'calendar';

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function Feed() {
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const { data, isPending, isError } = usePosts();
  const [subscribed, setSubscribed] = useState(false);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [camps, setCamps] = useState([]);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  useEffect(() => {
    const init = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const userId = user.id;
        console.log('User Id:', userId);

        // Fetch from backend if you want the latest premium status
        try {
          const res = await fetch(`${API_PATH}/user/${userId}`, {
            headers: {
              method: 'get',
              Authorization: `Bearer ${user.accessToken}`,
            },
          });
          const data = await res.json();
          if (data.status === 'success') {
            console.log('IS PREMIUM:', data.isPremium);
            setSubscribed(data.isPremium);
          }
        } catch (err) {
          console.error('Error fetching premium status:', err);
        }
      }

      getAllCamps(); // also fetch camps
    };

    init();

    const interval = setInterval(() => {
      getAllCamps();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getAllCamps = async () => {
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

    fetch(`${API_PATH}/camps`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then(async (data) => {
        console.log('Camps data:', data);
        setLoading(false);
        if (data.status === 'success') {
          setCamps(data.camps);
        } else if (data.status === 'token-expired') {
          await AsyncStorage.removeItem('user');
          signOut(); // clear auth state if you're using useAuth

          Toast.show({
            type: 'error',
            text1: 'Your session has been expired.',
            text2: 'Please log in again.',
          });

          router.replace('/login');
        } else {
          console.error('Error fetching camps:', data.message);
          Toast.show({
            type: 'error',
            text1: 'Error Loading Camps',
            text2: 'Please try again later.',
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error fetching camps:', error);
        Toast.show({
          type: 'error',
          text1: 'Error Loading Camps',
          text2: 'Please try again later.',
        });
      });
  };

  const handleSubscribe = async () => {
    try {
      setSubscribeLoading(true);
      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) {
        setSubscribeLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Not logged in',
          text2: 'Please log in again.',
        });
        router.replace('/login');
        return;
      }

      const user = JSON.parse(storedUser);

      // 1. Ask backend to create subscription + payment intent
      const response = await fetch(
        `${API_PATH}/create-payment-sheet-subscription`,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.accessToken}`,
          },
          body: JSON.stringify({
            userId: user.id,
            email: user.email,
          }),
        }
      );

      if (!response.ok) {
        setSubscribeLoading(false);
        throw new Error(await response.text());
      }

      const { paymentIntent, ephemeralKey, customer } = await response.json();

      // 2. Initialize payment sheet
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'college camp connect',
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
      });

      if (initError) {
        setSubscribeLoading(false);
        throw new Error(initError.message);
      }

      // 3. Present payment sheet
      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        setSubscribeLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Payment Failed',
          text2: paymentError.message,
        });
        return;
      }

      // 4. Verify with backend
      const verifyResponse = await fetch(`${API_PATH}/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({
          userId: user.id,
          paymentIntentId: paymentIntent,
        }),
      });

      const verification = await verifyResponse.json();

      if (verification.status === 'success') {
        setSubscribed(true);
        setSubscribeLoading(false);
        Toast.show({
          type: 'success',
          text1: 'Subscription Activated',
          text2: 'You now have access to all camps and colleges.',
        });
      } else {
        setSubscribeLoading(false);
        throw new Error('Payment verification failed');
      }
    } catch (err: any) {
      setSubscribeLoading(false);
      console.error('Subscription error:', err);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: err.message || 'Something went wrong.',
      });
    }
  };

  // Filter camps based on search query
  const filteredCamps = useMemo(() => {
    if (!search) return camps;
    return camps.filter(
      (camp) =>
        camp.college.toLowerCase().includes(search.toLowerCase()) ||
        camp.camp.toLowerCase().includes(search.toLowerCase()) ||
        camp.location.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, camps]);

  // Convert camps data to agenda format
  const agendaItems = useMemo(() => {
    const items: { [key: string]: any[] } = {};

    filteredCamps.forEach((camp) => {
      const campDate = camp.dates;
      if (!items[campDate]) {
        items[campDate] = [];
      }
      items[campDate].push({
        ...camp,
        name: `${camp.camp} - ${camp.college}`,
        height: 120,
      });
    });

    return items;
  }, [filteredCamps]);

  // Generate marked dates for the calendar
  const markedDates = useMemo(() => {
    const marked: { [key: string]: any } = {};

    filteredCamps.forEach((camp) => {
      marked[camp.dates] = {
        marked: true,
        dotColor: '#d4af37',
        selectedColor: '#d4af37',
      };
    });

    return marked;
  }, [filteredCamps]);

  // Get sorted result dates for navigation
  const resultDates = useMemo(() => {
    return Object.keys(agendaItems).sort();
  }, [agendaItems]);

  // Get current date index for navigation
  const currentDateIndex = useMemo(() => {
    if (!resultDates.length || !selectedDate) return -1;
    const index = resultDates.indexOf(selectedDate);
    return index >= 0 ? index : 0; // Default to first date if current not found
  }, [resultDates, selectedDate]);

  const isValidDate = (dateStr: string) => {
    // must match YYYY-MM-DD
    return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
  };

  const goToPreviousDate = () => {
    if (resultDates.length > 0 && currentDateIndex > 0) {
      const newIndex = Math.max(0, currentDateIndex - 1);
      if (resultDates[newIndex]) {
        setSelectedDate(resultDates[newIndex]);
      }
    }
  };

  const goToNextDate = () => {
    console.log('goToNextDate called');
    console.log('resultDates.length:', resultDates.length);
    console.log('currentDateIndex:', currentDateIndex);
    console.log('resultDates:', resultDates);
    console.log('selectedDate:', selectedDate);

    if (resultDates.length > 0 && currentDateIndex < resultDates.length - 1) {
      const newIndex = Math.min(resultDates.length - 1, currentDateIndex + 1);
      console.log('newIndex:', newIndex);
      console.log('resultDates[newIndex]:', resultDates[newIndex]);

      const nextDate = resultDates[newIndex];

      if (isValidDate(nextDate)) {
        setSelectedDate(nextDate);
      } else {
        console.warn('Invalid date skipped:', nextDate);
      }
    }
  };

  const resetToFirstDate = () => {
    if (resultDates.length > 0) {
      setSelectedDate(resultDates[0]);
    } else {
      setSelectedDate(getCurrentDate());
    }
  };

  // Call this if navigation fails
  useEffect(() => {
    // Only reset if user is in calendar view AND there are no camps on selected date
    // AND they haven't manually selected a different date
    if (
      viewMode === 'calendar' &&
      currentDateIndex === -1 &&
      resultDates.length > 0 &&
      selectedDate === getCurrentDate()
    ) {
      // Only auto-navigate if we're still on today's date and today has no camps
      resetToFirstDate();
    }
  }, [currentDateIndex, resultDates, viewMode]);

  // Remove the automatic date selection useEffect - keep only the reset to today when search is cleared
  useEffect(() => {
    if (!search) {
      // Only reset to today if we're transitioning from having a search to no search
      // Don't reset if user manually selected a date
      const hasValidSelectedDate =
        selectedDate && resultDates.includes(selectedDate);
      if (!hasValidSelectedDate && resultDates.length > 0) {
        // If current selected date is not valid anymore, go to first available date
        setSelectedDate(resultDates[0]);
      } else if (!hasValidSelectedDate && resultDates.length === 0) {
        // If no camps available, reset to today
        setSelectedDate(getCurrentDate());
      }
      // If user has a valid selected date, don't change it
    } else {
      // When searching, only set to first available date if current selection is not valid
      if (resultDates.length > 0 && !resultDates.includes(selectedDate)) {
        setSelectedDate(resultDates[0]);
      }
    }
  }, [search]); // Remove resultDates from dependencies

  const loadItemsForMonth = (month: any) => {
    // This function is required by Agenda but we're using static data
    // so we don't need to load anything dynamically
  };

  const SearchResultsInfo = () => {
    if (!search || viewMode !== 'calendar') return null;

    if (resultDates.length === 0) {
      return (
        <View className="mb-2 rounded-lg bg-yellow-100 p-3">
          <Text className="text-center text-yellow-800">
            No camps found for "{search}"
          </Text>
        </View>
      );
    }

    return (
      <View className="mb-2 rounded-lg bg-black p-3">
        <Text className="text-center text-[#d4af37]">
          Found {filteredCamps.length} camps on {resultDates.length} dates
        </Text>

        {/* Navigation Controls */}
        <View className="mt-3 flex-row items-center justify-center">
          {/* Previous Button */}
          <TouchableOpacity
            onPress={goToPreviousDate}
            disabled={resultDates.length === 0 || currentDateIndex <= 0}
            className={`mx-2 rounded-full p-2 ${
              resultDates.length === 0 || currentDateIndex <= 0
                ? 'bg-gray-200'
                : 'bg-[#d4af37]'
            }`}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={
                resultDates.length === 0 || currentDateIndex <= 0
                  ? '#9CA3AF'
                  : '#000000'
              }
            />
          </TouchableOpacity>

          {/* Center Date Info */}
          <View className="mx-2">
            <Text className="text-center font-semibold text-[#d4af37]">
              {selectedDate || 'No date selected'}
            </Text>
            <Text className="text-center text-sm text-gray-300">
              {resultDates.length > 0 && currentDateIndex >= 0
                ? `Date ${currentDateIndex + 1} of ${resultDates.length}`
                : 'No dates available'}
            </Text>
          </View>

          {/* Next Button */}
          <TouchableOpacity
            onPress={goToNextDate}
            disabled={
              resultDates.length === 0 ||
              currentDateIndex >= resultDates.length - 1 ||
              currentDateIndex === -1
            }
            className={`mx-2 rounded-full p-2 ${
              resultDates.length === 0 ||
              currentDateIndex >= resultDates.length - 1 ||
              currentDateIndex === -1
                ? 'bg-gray-200'
                : 'bg-[#d4af37]'
            }`}
          >
            <Ionicons
              name="chevron-forward"
              size={22}
              color={
                resultDates.length === 0 ||
                currentDateIndex >= resultDates.length - 1 ||
                currentDateIndex === -1
                  ? '#9CA3AF'
                  : '#000000'
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-lg text-red-500">Error Loading data</Text>
        <Text className="mt-2 text-gray-500">Please try again later</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: any }) => <Card {...item} />;

  const renderAgendaItem = (item: any) => {
    return (
      <View className="my-2 mr-2 w-full overflow-hidden rounded-xl border border-neutral-300 bg-white p-4 shadow-sm dark:bg-neutral-900">
        <Text className="text-center text-xl color-custom-golden">
          {item.college}
        </Text>
        <Text className="mt-2 text-center text-2xl color-custom-golden">
          ${item.cost}
        </Text>

        <View className="mt-4 space-y-2">
          <View className="mb-2 flex flex-row items-start">
            <Ionicons name={'school-outline'} size={18} color="#d4af37" />
            <Text className="ml-2 flex-1 text-left text-base" numberOfLines={2}>
              {item.camp}
            </Text>
          </View>
          <View className="mb-2 flex flex-row items-start">
            <Ionicons name={'calendar-outline'} size={18} color="#d4af37" />
            <Text className="ml-2 flex-1 text-left text-base">
              {item.dates}
            </Text>
          </View>
          <View className="mb-2 flex flex-row items-start">
            <Ionicons name={'time-outline'} size={18} color="#d4af37" />
            <Text className="ml-2 flex-1 text-left text-base">
              {item.times}
            </Text>
          </View>
          <View className="mb-2 flex flex-row items-start">
            <Ionicons name={'location-outline'} size={18} color="#d4af37" />
            <Text className="ml-2 flex-1 text-left text-base">
              {item.location}
            </Text>
          </View>
          <View className="mb-2 flex flex-row items-start">
            <Ionicons name={'people-outline'} size={18} color="#d4af37" />
            <Text className="ml-2 flex-1 text-left text-base">{item.ages}</Text>
          </View>
        </View>

        <View className="mt-3">
          <Button
            label="Register now"
            onPress={() => {
              if (item.reg_link) {
                Linking.openURL(item.reg_link).catch((err) =>
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

  const renderEmptyDate = () => {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-custom-golden">
          No camps scheduled for this date
        </Text>
      </View>
    );
  };

  const ViewToggleButtons = () => (
    <View className="mb-4 flex-row rounded-lg bg-gray-100 p-1">
      <TouchableOpacity
        className={`mr-1 flex-1 rounded-md p-2 ${
          viewMode === 'list' ? 'bg-white shadow-sm' : ''
        }`}
        onPress={() => setViewMode('list')}
      >
        <Text
          className={`text-center  ${
            viewMode === 'list'
              ? 'font-semibold color-custom-golden dark:color-custom-golden'
              : 'text-gray-600 dark:text-black'
          }`}
        >
          List view
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`ml-1 flex-1 rounded-md p-2 ${
          viewMode === 'calendar' ? 'bg-white shadow-sm' : ''
        }`}
        onPress={() => setViewMode('calendar')}
      >
        <Text
          className={`text-center ${
            viewMode === 'calendar'
              ? 'font-semibold color-custom-golden dark:color-custom-golden'
              : 'text-gray-600 dark:text-black'
          }`}
        >
          Calendar view
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      {subscribed ? (
        <View className="flex-1 p-4">
          <View className="w-full max-w-md flex-1">
            <FocusAwareStatusBar />

            <ViewToggleButtons />

            <TextInput
              placeholder="Search camps..."
              value={search}
              onChangeText={setSearch}
              className="mb-4 rounded-lg border border-gray-300 bg-white p-3 font-roboto"
              placeholderTextColor="#000"
            />

            {filteredCamps.length === 0 && search ? (
              <View className="flex-1 items-center justify-center">
                <Text className="text-lg text-gray-500">No camps found</Text>
                <Text className="mt-2 text-gray-400">
                  Try adjusting your search
                </Text>
              </View>
            ) : viewMode === 'list' ? (
              <FlashList
                data={filteredCamps}
                renderItem={renderItem}
                keyExtractor={(item, index) => `camp-${item.id}-${index}`}
                ListEmptyComponent={<EmptyList isLoading={isPending} />}
                estimatedItemSize={300}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <>
                <SearchResultsInfo />

                <Agenda
                  items={agendaItems}
                  loadItemsForMonth={loadItemsForMonth}
                  selected={selectedDate}
                  onDayPress={(day) => {
                    setSelectedDate(day.dateString);
                  }}
                  renderItem={renderAgendaItem}
                  renderEmptyDate={renderEmptyDate}
                  rowHasChanged={(r1, r2) => r1.id !== r2.id}
                  showClosingKnob={true}
                  markedDates={markedDates}
                  pastScrollRange={50}
                  futureScrollRange={50}
                  renderEmptyData={() => renderEmptyDate()}
                  theme={{
                    calendarBackground: '#000000',
                    reservationsBackgroundColor: '#000000',
                    textDayColor: '#ffffff',
                    textDisabledColor: '#ffffff',
                    selectedDayBackgroundColor: '#d4af37',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#ffffff',
                    textSectionTitleColor: '#d4af37',
                    textDayHeaderColor: '#d4af37',
                    agendaDayTextColor: '#d4af37',
                    agendaDayNumColor: '#d4af37',
                    agendaTodayColor: '#d4af37',
                    agendaKnobColor: '#d4af37',
                    dotColor: '#d4af37',
                    selectedDotColor: '#ffffff',
                    arrowColor: '#d4af37',
                    monthTextColor: '#d4af37',
                    indicatorColor: '#d4af37',
                    textDayFontWeight: '300',
                    textDayFontSize: 16,
                    textDayHeaderFontWeight: '300',
                    textDayHeaderFontSize: 13,
                    textMonthFontFamily: 'SedgwickAve',
                    textMonthFontWeight: 'bold',
                    textMonthFontSize: 16,
                    dayTextColor: '#ffffff',
                  }}
                />
              </>
            )}
          </View>
        </View>
      ) : (
        <View className="flex-1 items-center justify-center p-4">
          <View className="w-full max-w-md">
            <FocusAwareStatusBar />
            <SubscribeCard
              title="Premium"
              price="$7.99 / month"
              features={[
                {
                  icon: 'calendar-outline',
                  text: `Comprehensive nationwide camp listings`,
                },
                {
                  icon: 'location-outline',
                  text: `Quick search by school, age group, or keyword`,
                },
                {
                  icon: 'school-outline',
                  text: 'List and calendar views for easy planning',
                },
                {
                  icon: 'link-outline',
                  text: `Full event details with direct registration links`,
                },
              ]}
              onPress={handleSubscribe}
              loading={subscribeLoading}
            />
          </View>
        </View>
      )}
    </>
  );
}
