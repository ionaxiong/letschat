import React from "react";
import { FlatList, ImageBackground } from "react-native";
import { useRoute } from "@react-navigation/native";
import ChatMessage from "../components/ChatMessage";
import ChatRoomData from "../data/Chats";
import backgroundImage from "../assets/images/backgroundImage.png";
import InputBox from "../components/InputBox";
import { messagesByChatRoom } from "../src/graphql/queries";
import { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";

const ChatRoomScreen = () => {
  const route = useRoute();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const messagesData = await API.graphql(
        graphqlOperation(messagesByChatRoom, {
          chatRoomID: route.params.id,
          sortDirection: "DESC",
        })
      );
      console.log("Fetch Messages");
      console.log(messagesData);
      setMessages(messagesData.data.messagesByChatRoom.items)
    };
    fetchMessages();
  }, []);

  return (
    <ImageBackground
      style={{ width: "100%", height: "100%" }}
      source={backgroundImage}
    >
      <FlatList
        keyExtractor={(item) => item.id}
        data={messages}
        renderItem={({ item }) => <ChatMessage message={item} />}
        inverted
      />
      <InputBox chatRoomID={route.params.id} />
    </ImageBackground>
  );
};

export default ChatRoomScreen;
