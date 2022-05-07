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
import { ColorSchemeName, View, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";
import NotFoundScreen from "../screens/NotFoundScreen";
import { RootStackParamList, MainTabParamList } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import ChatRoomScreen from "../screens/ChatRoomScreen";
import ContactsScreen from "../screens/ContactsScreen";
import ChatsScreen from "../screens/ChatsScreen";
import { SearchBar } from "react-native-elements";
import { Dimensions } from "react-native";

export const SearchContext = createContext({
  show: false,
  setShow: () => {},
  search: "",
  setSearch: () => {},
});

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
    <SearchContext.Provider value={{ show, setShow, search, setSearch }}>
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
              <TouchableOpacity onPress={toggleSearchButtonVisibility}>
                <View
                  style={{
                    flexDirection: "row",
                    width: show ? Dimensions.get("window").width - 30 : 25,
                    justifyContent: "space-between",
                  }}
                >
                  {show ? (
                    <SearchBar
                      inputContainerStyle={{
                        backgroundColor: Colors.light.background,
                      }}
                      containerStyle={{
                        backgroundColor: Colors.light.background,
                        borderWidth: 1,
                        borderRadius: 5,
                        flex: 1,
                        height: 50,
                        padding: 0,
                        marginTop: -5,
                      }}
                      placeholder="Search ... "
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
                    flexDirection: "row",
                    width: show ? Dimensions.get("window").width - 30 : 25,
                    justifyContent: "space-between",
                  }}
                >
                  {show ? (
                    <SearchBar
                      inputContainerStyle={{
                        backgroundColor: Colors.light.background,
                      }}
                      containerStyle={{
                        backgroundColor: Colors.light.background,
                        borderWidth: 1,
                        borderRadius: 5,
                        flex: 1,
                        height: 50,
                        padding: 0,
                        marginTop: -5,
                      }}
                      placeholder="Search ... "
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
