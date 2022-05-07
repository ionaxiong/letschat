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
import React, { useState, createContext } from "react";
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
import { Dimensions } from "react-native";
import { BackgroundImage } from "react-native-elements/dist/config";

export const SearchContext = createContext("");

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
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");

  const updateSearch = (e) => {
    setSearch(e);
  };

  const toggleSearchButtonVisibility = () => {
    setShow(!show);
  };

  return (
    <SearchContext.Provider value={search}>
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
            headerRight: () => (
              <TouchableOpacity onPress={toggleSearchButtonVisibility}>
                <View
                  style={{
                    borderColor: Colors.light.background,
                    flexDirection: "row",
                    width: show ? Dimensions.get("window").width - 30 : 25,
                    justifyContent: "space-between",
                  }}
                >
                  {show ? (
                    <SearchBar
                      inputStyle={{
                        backgroundColor: Colors.light.background,
                      }}
                      inputContainerStyle={{
                        backgroundColor: Colors.light.background,
                      }}
                      placeholderTextColor={"#g5g5g5"}
                      containerStyle={{
                        backgroundColor: Colors.light.background,
                        borderWidth: 1,
                        borderRadius: 5,
                        flex: 1,
                        height: 50,
                        padding: 0,
                        marginTop: -5,
                      }}
                      placeholder="Type Here..."
                      onChangeText={updateSearch}
                      value={search}
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
            ),
          }}
        />
        <Stack.Screen
          name="NotFound"
          component={NotFoundScreen}
          options={{ title: "Oops!" }}
        />
      </Stack.Navigator>
    </SearchContext.Provider>
  );
}

export const MainTab = createMaterialTopTabNavigator<MainTabParamList>();

export function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
