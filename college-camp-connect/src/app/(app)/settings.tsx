import { Env } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Platform, Share as RNShare } from 'react-native';

import { Item } from '@/components/settings/item';
import { ItemsContainer } from '@/components/settings/items-container';
import {
  colors,
  FocusAwareStatusBar,
  ScrollView,
  Text,
  View,
} from '@/components/ui';
import { Rate, Share, Support } from '@/components/ui/icons';
import { useAuth } from '@/lib';

const iosAppLink = 'https://apps.apple.com/app/id1234567890';
const androidAppLink =
  'https://play.google.com/store/apps/details?id=com.collegecampconnect';

export default function Settings() {
  const signOut = useAuth.use.signOut();
  const { colorScheme } = useColorScheme();
  const iconColor =
    colorScheme === 'dark' ? colors.neutral[400] : colors.neutral[500];
  const router = useRouter();

  const handleShare = async () => {
    try {
      const link = Platform.OS === 'ios' ? iosAppLink : androidAppLink;

      await RNShare.share({
        message: `${link}`,
      });
    } catch (error) {
      console.log('Error sharing the app:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      signOut();
      router.replace('/login');
    } catch (err) {
      console.log('Logout error:', err);
    }
  };

  return (
    <>
      <FocusAwareStatusBar />

      <ScrollView>
        <View className="flex-1 items-center px-4 pt-16 ">
          <View className="w-full max-w-md">
            <Text className="text-xl color-custom-golden">{'Settings'}</Text>
            {/* <ItemsContainer title="settings.generale">
              <LanguageItem />
              <ThemeItem />
            </ItemsContainer> */}

            <ItemsContainer title="About">
              <Item text="App name" value={Env.NAME} />
              <Item text="Version" value={Env.VERSION} />
            </ItemsContainer>

            <ItemsContainer title="Support Us">
              <Item
                text="Share"
                icon={<Share color={iconColor} />}
                onPress={handleShare}
              />
              <Item
                text="Rate"
                icon={<Rate color={iconColor} />}
                onPress={handleShare}
              />
              <Item
                text="Support"
                icon={<Support color={iconColor} />}
                onPress={handleShare}
              />
            </ItemsContainer>

            <ItemsContainer title="Links">
              <Item text="Privacy" onPress={() => {}} />
              <Item text="Terms" onPress={() => handleShare} />
              {/* <Item
                text="settings.github"
                icon={<Github color={iconColor} />}
                onPress={() => {}}
              />
              <Item
                text="settings.website"
                icon={<Website color={iconColor} />}
                onPress={() => {}}
              /> */}
            </ItemsContainer>

            <View className="my-8">
              <ItemsContainer title="Account">
                <Item
                  text="Change Password"
                  onPress={() => router.push('/change-password')}
                />
                <Item text="Logout" onPress={handleLogout} />
              </ItemsContainer>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
