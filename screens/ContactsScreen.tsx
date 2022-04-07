import { FlatList, StyleSheet } from "react-native";
import ChatListItem from "../components/ChatListItem";
import NewMessageButton from "../components/NewMessageButton";
import { Text, View } from "../components/Themed";
import ChatRooms from "../data/ChatRooms";
import Contacts from '../components/Contacts/index';

export default function ContactsScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatList}
        keyExtractor={(item) => item.id}
        data={ChatRooms}
        renderItem={({ item }) => <ChatListItem chatRoom={item} />}
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
