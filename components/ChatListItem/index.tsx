import { View, Text, Image} from "react-native";
import { ChatRoom } from "../../types";
import style from './style';

export type ChatListItemProps = {
    chatRoom: ChatRoom;
  }

const ChatListItem = (props: ChatListItemProps) => {
    const {chatRoom} = props;

    const user = chatRoom.users[0];
    console.log(user.imageUri)
    return (
        <View>
            <Image source={{ uri: user.imageUri}} style={style.image} ></Image>
            <Text >{chatRoom.lastMessage.content}</Text>
        </View>
    )
}

export default ChatListItem;