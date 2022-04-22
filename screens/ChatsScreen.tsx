import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import ChatListItem from "../components/ChatListItem";
import NewMessageButton from "../components/NewMessageButton";
import { View } from "../components/Themed";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { getUser } from "./queries";
import {
  onUpdateChatRoom,
  onUpdateChatRoomUser,
  onCreateMessage,
} from "../src/graphql/subscriptions";

export default function ChatsScreen() {
  const [chatRooms, setChatRooms] = useState([]);
  const [myId, setMyId] = useState(null);

  useEffect(() => {
    const getMyId = async () => {
      try {
        const userInfo = await Auth.currentAuthenticatedUser();
        setMyId(userInfo.attributes.sub);
      } catch (e) {
        console.log("something wrong while fetching userInfo", e);
      }
    };
    getMyId();
  }, []);

  const fetchChatRooms = async () => {
    try {
      const userInfo = await Auth.currentAuthenticatedUser();
      const userData = await API.graphql(
        graphqlOperation(getUser, {
          id: userInfo.attributes.sub,
        })
      );

      const chatRoomsData = userData.data.getUser.chatRoomUser.items;
      const removeDuplications = (duplicates) => {
        const flag = {};
        const unique = [];
        duplicates.forEach((item) => {
          // console.log("**************", item);
          if (!flag[item.chatRoomID]) {
            flag[item.chatRoomID] = true;
            unique.push(item);
          }
        });
        return unique;
      };

      const uniqueChatRoomList = removeDuplications(chatRoomsData);
      setChatRooms(uniqueChatRoomList);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);
  // subscribe chatroom deletion

  // subscribe chatroom creation

  // subscribe chatroom update
  // useEffect(() => {
  //   const subscription = API.graphql(
  //     graphqlOperation(onUpdateChatRoom, { owner: myId })
  //   ).subscribe({
  //     next: ({provider, value}) => {
  //       const testProvider = provider
  //       const testValue = value
  //       console.log("!!!!!!!!!!!! provider", testProvider, "!!!!! value", testValue)
  //     },
  //     error: (error) => console.error(error)
  //   });
  //   return () => subscription.unsubscribe();
  // }, []);
  // console.log("chatrooms data...",chatRooms[0])

  // useEffect(() => {
  //   const subscription = API.graphql(
  //     graphqlOperation(onCreateMessage, { owner: myId })
  //   ).subscribe({
  //     next: (event) =>{
  //       console.log(event)
  //     },
  //     error: (error) => console.error(error),
  //   });
  //   return () => subscription.unsubscribe();
  // }, []);

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatList}
        keyExtractor={(item) => item.id}
        data={chatRooms}
        renderItem={({ item }) => (
          <ChatListItem myId={myId} chatRoom={item.chatRoom} />
        )}
      ></FlatList>
      <NewMessageButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  flatList: {
    width: "100%",
    marginRight: 5,
  },
});
