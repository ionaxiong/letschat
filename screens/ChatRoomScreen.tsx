import React from "react";
import { View, Text, FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";
import ChatMessage from "../components/ChatMessage";
import Chats from "../data/Chats";

const ChatRoomScreen = () => {
  const route = useRoute();

  return (
    <FlatList
      data={Chats.messages}
      renderItem={({ item }) => <ChatMessage message={item} />}
    />
  );
};

export default ChatRoomScreen;
