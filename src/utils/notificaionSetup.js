import * as Notifications from 'expo-notifications';
import { Platform, Alert, Linking } from 'react-native';
import AxiosService from './AxiosService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from './navigationRef';

// Request permissions and configure notification handler
export function configureNotificationHandler() {
  Notifications.requestPermissionsAsync();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function registerForPushNotificationsAsync() {
  let token;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert(
      'Notification Permission',
      'Please allow notifications to stay updated.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Allow Notifications',
          onPress: async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status === 'granted') {
              await registerForPushNotificationsAsync();
            }

            if (Platform.OS === 'ios') {
              Linking.openURL('app-settings:'); 
            } else {
              Linking.openSettings(); 
            }
          },
        },
      ]
    );
    return;
  }

  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Expo push token:', token);

  const user = await AsyncStorage.getItem('user');
  const customer = JSON.parse(user);
  const customerId = customer._id;

  try {
    const res = await AxiosService.post('customer/storeFCMTokenToCustomer', {
        customerId,
      expoPushToken: token,
    });

    if (res.status === 200) {
      console.log('Token stored successfully');
    }
  } catch (error) {
    console.error('Failed to send token to backend:', error);
  }

  return token;
}

export function listenForNotifications() {
    Notifications.addNotificationResponseReceivedListener(response => {

      const notificationData = response.notification.request.content.data;
      if (notificationData && notificationData.screen) {
        navigate(notificationData.screen, notificationData.params);
      } else {
        console.log('No screen found in notification data');
      }
    });
  }