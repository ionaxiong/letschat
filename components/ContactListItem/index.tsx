import { View, Text, Image, TouchableWithoutFeedback } from "react-native";
import { User } from "../../types";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { API, graphqlOperation, Auth } from "aws-amplify";
import {
  createChatRoom,
  createChatRoomUser,
} from "../../src/graphql/mutations";
import { listChatRoomUsers } from "../../src/graphql/queries";

export type ContactListItemProps = {
  user: User;
};

const ContactListItem = (props: ContactListItemProps) => {
  const { user } = props;

  const navigation = useNavigation();

  // function to check whether there is chatroom with the onclick contact
  const checkForDuplicateChat = async (userID1, userID2) => {
    // 1. get the chatroom array for both users
    // user1
    const user1ChatRoomInfo = await API.graphql(
      graphqlOperation(listChatRoomUsers, {
        filter: { userID: { eq: userID1 } },
      })
    );
    // user2
    const user2ChatRoomInfo = await API.graphql(
      graphqlOperation(listChatRoomUsers, {
        filter: { userID: { eq: userID2 } },
      })
    );

    // 2. through both arrays, find the common chatroom id
    // (get the chatroom user length with the chatroom id
    // if checkCommonChatRoomForUsers is true & chatroom length === 2, return true, else return false)
    const user1ChatRoomIDList =
      user1ChatRoomInfo.data.listChatRoomUsers.items.map(
        (item) => item.chatRoomID
      );

    const user2ChatRoomIDList =
      user2ChatRoomInfo.data.listChatRoomUsers.items.map(
        (item) => item.chatRoomID
      );

    // const filteredArray = array1.filter(value => array2.includes(value));
    const result = user2ChatRoomIDList.filter((item) =>
      user1ChatRoomIDList.includes(item)
    );
    if (result.length === 1) {
      return result[0];
    } else {
      return undefined;
    }
  };

  const onClick = async () => {
    try {
      const userInfo = await Auth.currentAuthenticatedUser();
      // 1. check whether the chatroom already existed,
      // if not, create a new chatroom
      const result = await checkForDuplicateChat(
        userInfo.attributes.sub,
        user.id
      );
      console.log("this is the result!!!!!!!!!!!!!!!!!!!!!", result);
      if (result) {
        navigation.navigate("ChatRoom", {
          id: result,
          name: user.name,
        });
      } else {
        const newChatRoomData = await API.graphql(
          graphqlOperation(createChatRoom, { input: {} })
        );
        if (!newChatRoomData.data) {
          console.log("Failed to create a chatroom");
          return;
        }
        const newChatRoom = newChatRoomData.data.createChatRoom;

        // 2 add the user to the chatroom
        await API.graphql(
          graphqlOperation(createChatRoomUser, {
            input: {
              userID: user.id,
              chatRoomID: newChatRoom.id,
            },
          })
        );
        // 3. add the authenticated user to the chatroom
        await API.graphql(
          graphqlOperation(createChatRoomUser, {
            input: {
              userID: userInfo.attributes.sub,
              chatRoomID: newChatRoom.id,
            },
          })
        );
        navigation.navigate("ChatRoom", {
          id: newChatRoom.id,
          name: user.name,
        });
      }
    } catch (e) {
      console.log("something went wrong", e);
      // console.log("something went wrong", e.errors[0]["message"]);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={onClick}>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <Image source={{ uri: user.imageUri }} style={styles.avatar}></Image>
          <View style={styles.midContainer}>
            <Text style={styles.username}>{user.name}</Text>
            <Text style={styles.status}> {user.status} </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ContactListItem;
