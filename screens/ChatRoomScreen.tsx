import React, { useEffect, useState, useContext } from "react";
import { FlatList, ImageBackground } from "react-native";
import { useRoute } from "@react-navigation/native";
import ChatMessage from "../components/ChatMessage";
import backgroundImage from "../assets/images/backgroundImage.png";
import InputBox from "../components/InputBox";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { messagesByChatRoom } from "../src/graphql/queries";
import { onCreateMessage, onCreateChatRoom } from '../src/graphql/subscriptions';
import { SearchContext } from "../navigation";

const ChatRoomScreen = () => {
  const route = useRoute();
  const [messages, setMessages] = useState([]);
  const [myId, setMyId] = useState(null);
  const { show, setShow, search, setSearch } = useContext(SearchContext);

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
    setShow(false);
    setSearch("");
    const subscriptionOnCreateMessage = API.graphql(
      graphqlOperation(onCreateMessage, { owner: myId })
    ).subscribe({
      next: ({ provider, value }) => {
        const newMessage = value.data.onCreateMessage;
        if (newMessage.chatRoomID !== route.params.id) {
          console.log("Message is in another room");
          return;
        }
        setMessages((messages) => [newMessage, ...messages]);
      },
      error: (error) => console.error(error),
    });
    return () => subscriptionOnCreateMessage.unsubscribe();
  }, []);

  return (
    <ImageBackground
      style={{ width: "100%", height: "100%" }}
      source={backgroundImage}
    >
      <FlatList
        keyExtractor={(item) => item.id}
        data={messages.filter((x) =>
          x.content
            .toLowerCase()
            .includes(search.toLowerCase().trim().replace(/\s/g, ""))
        )}
        renderItem={({ item }) => <ChatMessage myId={myId} message={item} />}
        inverted
      />
      <InputBox chatRoomID={route.params.id} />
    </ImageBackground>
  );
};

export default ChatRoomScreen;
