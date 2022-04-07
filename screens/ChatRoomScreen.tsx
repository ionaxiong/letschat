import React from "react";
import { FlatList, ImageBackground } from "react-native";
import { useRoute } from "@react-navigation/native";
import ChatMessage from "../components/ChatMessage";
import ChatRoomData from "../data/Chats";
import backgroundImage from "../assets/images/backgroundImage.png";
import InputBox from "../components/InputBox";

const ChatRoomScreen = () => {
  const route = useRoute();

  return (
    <ImageBackground
      style={{ width: "100%", height: "100%" }}
      source={backgroundImage}
    >
      <FlatList
        keyExtractor={(item) => item.id}
        data={ChatRoomData.messages}
        renderItem={({ item }) => <ChatMessage message={item} />}
        inverted
      />
      <InputBox />
    </ImageBackground>
  );
};

export default ChatRoomScreen;
