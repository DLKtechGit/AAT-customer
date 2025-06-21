import React, { useEffect, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { AuthContext } from "./src/utils/AuthContext";
import Appstack from "./Appstack";
import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import EventHandling from "./src/utils/EventHandling";
import { AuthProvider } from "./src/utils/AuthContext";
import "react-native-get-random-values";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { v4 as uuidv4 } from "uuid";
import {
  registerForPushNotificationsAsync,
  configureNotificationHandler,
  listenForNotifications,
} from "./src/utils/notificaionSetup";
import { navigationRef } from "./src/utils/navigationRef";
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import { enableScreens } from "react-native-screens";
enableScreens();

function MainApp() {
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const setupNotifications = async () => {
      try {
        configureNotificationHandler();
        await registerForPushNotificationsAsync();
        listenForNotifications();
      } catch (error) {
        console.error("Error during notification setup:", error);
      }
    };

    if (isAuthenticated) {
      setupNotifications();
    }
  }, [isAuthenticated]);




  return (
    <>
    <StatusBar hidden={false}/>
    <Appstack />
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView >
      <AuthProvider>
        <NavigationContainer ref={navigationRef}>
          <Toast />
          {/* <EventHandling /> */}
          <MainApp />
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
