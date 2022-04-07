import React from "react";
import { FlatList, ImageBackground } from "react-native";
import { useRoute } from "@react-navigation/native";
import ChatMessage from "../components/ChatMessage";
import ChatRoomData from "../data/Chats";
import backgroundImage from "../assets/images/backgroundImage.png";

const ChatRoomScreen = () => {
  const route = useRoute();

  return (
    <ImageBackground style={{width:"100%", height:"100%"}} source={backgroundImage}>
      <FlatList
        data={ChatRoomData.messages}
        renderItem={({ item }) => <ChatMessage message={item} />}
        inverted
      />
    </ImageBackground>
  );
};

export default ChatRoomScreen;
