import { FontAwesome } from "@expo/vector-icons";
import * as React from "react";
import { Pressable } from "react-native";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import ChatsScreen from "../screens/ChatsScreen";
import TabTwoScreen from "../screens/TabTwoScreen";
import { RootTabScreenProps } from "../types";
import { MainTab } from "./index";
import { Fontisto } from "@expo/vector-icons";

export function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <MainTab.Navigator
      initialRouteName="Chats"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].background,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme].tint,
        },
        tabBarIndicatorStyle: {
          backgroundColor: Colors[colorScheme].background,
          height: 3,
        },
        tabBarLabelStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <MainTab.Screen
        name="Camera"
        component={ChatsScreen}
        options={{
          tabBarIcon: ({ color }) => <Fontisto name="camera" color={color} size={16} />,
          tabBarLabel: () => null,
          tabBarShowIcon: true,
          tabBarIconStyle: {justifyContent: "center", alignItems: "center", flex: 1},
        }}        
      />
      <MainTab.Screen name="Chats" component={ChatsScreen} />
      <MainTab.Screen name="Status" component={TabTwoScreen} />
      <MainTab.Screen name="Calls" component={TabTwoScreen} />
    </MainTab.Navigator>
  );
}
