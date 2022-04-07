import { View, Text, Image, TouchableWithoutFeedback } from "react-native";
import { ChatRoom } from "../../types";
import styles from "./styles";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";

export type ChatListItemProps = {
  chatRoom: ChatRoom;
};

const ChatListItem = (props: ChatListItemProps) => {
  const { chatRoom } = props;

  const navigation = useNavigation();

  const user = chatRoom.users[1];

  const users = chatRoom.users;

  const onClick = () => {
    navigation.navigate("ChatRoom", { id: chatRoom.id, names: users.toString() });
  };

  return (
    <TouchableWithoutFeedback onPress={onClick}>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <Image source={{ uri: user.imageUri }} style={styles.avatar}></Image>
          <View style={styles.midContainer}>
            <Text style={styles.username}>{user.name}</Text>
            <Text style={styles.lastMessage}>
              {chatRoom.lastMessage.content}
            </Text>
          </View>
        </View>
        <Text numberOfLines={2} style={styles.time}>
          {moment(chatRoom.lastMessage.createdAt).format("DD/MM/YYYY")}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ChatListItem;
