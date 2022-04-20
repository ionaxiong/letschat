import React, { useEffect, useState } from "react";
import { FlatList, ImageBackground } from "react-native";
import { useRoute } from "@react-navigation/native";
import ChatMessage from "../components/ChatMessage";
import backgroundImage from "../assets/images/backgroundImage.png";
import InputBox from "../components/InputBox";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { messagesByChatRoom } from "../src/graphql/queries";
import { onCreateMessage } from "../src/graphql/subscriptions";
import { ConsoleLogger } from "@aws-amplify/core";

const ChatRoomScreen = () => {
  const route = useRoute();
  const [messages, setMessages] = useState([]);
  const [myId, setMyId] = useState(null);
  // let subscription;

  const fetchMessages = async () => {
    const messagesData = await API.graphql(
      graphqlOperation(messagesByChatRoom, {
        chatRoomID: route.params.id,
        sortDirection: "DESC",
      })
    );
    setMessages(messagesData.data.messagesByChatRoom.items);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    const getMyId = async () => {
      const userInfo = await Auth.currentAuthenticatedUser();
      setMyId(userInfo.attributes.sub);

    };
    getMyId();
  }, []);

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onCreateMessage, { owner: myId })
      ).subscribe({
        // next: ({ provider, value }) => console.log({ provider, value }),
        next: data => console.log("this data", data),
        error: (error) => console.error("!!!", error),
        // next: (data) => {
        //   console.log("!!!!!!!!!!!!!!!!!", data);
        // },
      });
      console.log("test")
      return () => subscription.unsubscribe();
  }, []);

  // useEffect(() => {
  //   const subscription = API.graphql(
  //     graphqlOperation(onCreateMessage)
  //   ).subscribe({
  //     next: (data) => {
  //       const newMessage = data.value.data.onCreateMessage;

  //       if (newMessage.chatRoomID !== route.params.id) {
  //         console.log("Message is in another room!");
  //         return;
  //       }

  //       fetchMessages();
  //       // setMessages([newMessage, ...messages]);
  //     },
  //   });

  //   return () => subscription.unsubscribe();
  // }, []);

  return (
    <ImageBackground
      style={{ width: "100%", height: "100%" }}
      source={backgroundImage}
    >
      <FlatList
        keyExtractor={(item) => item.id}
        data={messages}
        renderItem={({ item }) => <ChatMessage myId={myId} message={item} />}
        inverted
      />
      <InputBox chatRoomID={route.params.id} />
    </ImageBackground>
  );
};

export default ChatRoomScreen;
