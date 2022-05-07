/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome, Octicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  ColorSchemeName,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Colors from "../constants/Colors";
import NotFoundScreen from "../screens/NotFoundScreen";
import { RootStackParamList, MainTabParamList } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import ChatRoomScreen from "../screens/ChatRoomScreen";
import ContactsScreen from "../screens/ContactsScreen";
import ChatsScreen from "../screens/ChatsScreen";
import SearchButton from "../components/SearchButton";
import { SearchBar } from "react-native-elements";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const [show, setShow] = useState(true);

  const toggleSearchButtonVisibility = () => {
    console.log("test");
    setShow(!show);
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.light.tint,
        },
        headerShadowVisible: false,
        headerTintColor: Colors.light.background,
        headerTitleAlign: "left",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="Root"
        component={ChatsScreen}
        options={{
          title: "LetsChat",
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
                width: 25,
                justifyContent: "space-between",
              }}
            >
              <Octicons
                name="search"
                size={20}
                color={Colors.light.background}
              />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={({ route }) => ({
          title: route.params.name,
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
                width: 100,
                justifyContent: "space-between",
              }}
            ></View>
          ),
        })}
      />

      <Stack.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{
          title: "Contacts",
          header: () => (
            <View>
              <SearchBar
                containerStyle={{
                  backgroundColor: Colors.light.tint,
                  borderWidth: 1,
                  borderRadius: 5,
                }}
                placeholder="Type Here..."
                // onChangeText={this.updateSearch}
                // value={search}
              />
            </View>
          ),
          headerRight: () => (
            // <KeyboardAvoidingView
            //   behavior={Platform.OS === "ios" ? "padding" : "height"}
            // >
            <TouchableOpacity onPress={toggleSearchButtonVisibility}>
              {/* {Boolean(show) ? ( // show -> Boolean(show) https://stackoverflow.com/questions/69674823/text-strings-must-be-rendered-within-text-react-native */}
              <View
                style={{
                  flexDirection: "row",
                  width: 25,
                  justifyContent: "space-between",
                }}
              >
                {show ? (
                  <SearchBar
                    containerStyle={{
                      backgroundColor: Colors.light.tint,
                      borderWidth: 1,
                      borderRadius: 5,
                    }}
                    placeholder="Type Here..."
                    // onChangeText={this.updateSearch}
                    // value={search}
                  />
                ) : (
                  <Octicons
                    name="search"
                    size={20}
                    color={Colors.light.background}
                  />
                )}
              </View>
            </TouchableOpacity>
            // </KeyboardAvoidingView>
          ),
        }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
    </Stack.Navigator>
  );
}

export const MainTab = createMaterialTopTabNavigator<MainTabParamList>();

export function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
