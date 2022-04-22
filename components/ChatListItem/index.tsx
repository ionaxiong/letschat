import { View, Text, Image, TouchableWithoutFeedback } from "react-native";
import { ChatRoom } from "../../types";
import styles from "./styles";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { API, Auth, graphqlOperation } from "aws-amplify";
import {onUpdateChatRoom} from "../../src/graphql/subscriptions"

export type ChatListItemProps = {
  myId: string,
  chatRoom: ChatRoom;
};

const ChatListItem = (props: ChatListItemProps) => {
  const { myId, chatRoom } = props;
  const [otherUser, setOtherUser] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const getOtherUser = async () => {
      if (chatRoom.chatRoomUsers.items[0].user.id === myId) {
        setOtherUser(chatRoom.chatRoomUsers.items[1].user);
      } else {
        setOtherUser(chatRoom.chatRoomUsers.items[0].user);
      }
    };
    getOtherUser();
  }, []);

  const onClick = () => {
    navigation.navigate("ChatRoom", {
      id: chatRoom.id,
      name: otherUser.name,
    });
  };
  
  if (!otherUser) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={onClick}>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <Image
            source={{ uri: otherUser.imageUri }}
            style={styles.avatar}
          ></Image>
          <View style={styles.midContainer}>
            <Text style={styles.username}>{otherUser.name}</Text>
            <Text style={styles.lastMessage}>
              {chatRoom.lastMessage
                ? `${chatRoom.lastMessage.user.name}: ${chatRoom.lastMessage.content}`
                : ""} 
            </Text>
          </View>
        </View>
        <Text numberOfLines={2} style={styles.time}>
          {chatRoom.lastMessage &&
            moment(chatRoom.lastMessage.createdAt).format("DD/MM/YYYY")}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ChatListItem;
