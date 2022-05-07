import React, { useEffect, useState, useContext } from "react";
import { FlatList, StyleSheet, RefreshControl,  SafeAreaView, ScrollView } from "react-native";
import ChatListItem from "../components/ChatListItem";
import NewMessageButton from "../components/NewMessageButton";
import { View } from "../components/Themed";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { getUser } from "./queries";
import { onUpdateChatRoom } from "../src/graphql/subscriptions";
import { SearchContext } from "../navigation";

export default function ChatsScreen() {
  const [chatRooms, setChatRooms] = useState([]);
  const [myId, setMyId] = useState(null);
  const { show, setShow, search, setSearch } = useContext(SearchContext);

  useEffect(() => {
    setSearch("");
    setShow(false);
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
    console.log("fetching chat rooms");
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

  useEffect(() => {
    const subscriptionOnUpdateChatRoom = API.graphql(
      graphqlOperation(onUpdateChatRoom, { owner: myId })
    ).subscribe({
      next: ({ provider, value }) => {
        const chatRoomUpdate = value.data.onUpdateChatRoom;
        if (chatRoomUpdate) {
          fetchChatRooms();
        }
      },
      error: (error) => console.error(error),
    });
    return () => subscriptionOnUpdateChatRoom.unsubscribe();
  }, []);

  // useEffect(() => {
  //   const subscriptionOnCreateChatRoom = API.graphql(
  //     graphqlOperation(onCreateChatRoom, { owner: myId })
  //   ).subscribe({
  //     next: ({ provider, value }) => {
  //       const chatRoomUpdate = value.data.onCreateChatRoom;
  //       if (chatRoomUpdate) {
  //         fetchChatRooms();
  //       }
  //     },
  //     error: (error) => console.error(error),
  //   });
  //   return () => subscriptionOnCreateChatRoom.unsubscribe();
  // }, []);
  
  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={(item) => item.id}
        style={styles.flatList}
        data={
          chatRooms.filter((x) =>
            x.chatRoom.chatRoomUsers.items
              .filter((obj) => obj.user.id !== myId)
              .map((obj) => obj.user.name)
              .some((chatRoomUserName) =>
                chatRoomUserName
                  .toLowerCase()
                  .includes(search.toLowerCase().trim().replace(/\s/g, ""))
              )
          )
        }
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
