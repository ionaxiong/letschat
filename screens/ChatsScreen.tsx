import { FlatList, StyleSheet } from "react-native";
import ChatListItem from "../components/ChatListItem";
import { Text, View } from "../components/Themed";
import ChatRooms from "../data/ChatRooms";

export default function ChatsScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatList}
        keyExtractor={(item) => item.id}
        data={ChatRooms}
        renderItem={({ item }) => <ChatListItem chatRoom={item} />}
      ></FlatList>
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
