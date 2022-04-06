import { View, Text, Image } from "react-native";
import { ChatRoom } from "../../types";
import style from "./style";
import moment from "moment";

export type ChatListItemProps = {
  chatRoom: ChatRoom;
};

const ChatListItem = (props: ChatListItemProps) => {
  const { chatRoom } = props;
  const user = chatRoom.users[1];

  return (
    <View style={style.container}>
      <View style={style.leftContainer}>
        <Image source={{ uri: user.imageUri }} style={style.avatar}></Image>
        <View style={style.midContainer}>
          <Text style={style.username} >{user.name}</Text>
          <Text style={style.lastMessage} >{chatRoom.lastMessage.content}</Text>
        </View>
      </View>
      <Text numberOfLines={2} style={style.time}>{moment(chatRoom.lastMessage.createdAt).format("DD/MM/YYYY")}</Text>
    </View>
  );
};

export default ChatListItem;
