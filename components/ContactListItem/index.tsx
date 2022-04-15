import { View, Text, Image, TouchableWithoutFeedback } from "react-native";
import { User } from "../../types";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { API, graphqlOperation, Auth } from "aws-amplify";
import {
  createChatRoom,
  createChatRoomUser,
} from "../../src/graphql/mutations";
import { listChatRoomUsers, getChatRoom } from "../../src/graphql/queries";

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
      graphqlOperation(listChatRoomUsers, { userID: userID1 })
    );
    // user2
    const user2ChatRoomInfo = await API.graphql(
      graphqlOperation(listChatRoomUsers, { userID: userID2 })
    );

    const user1ChatRoomIDList =
      user1ChatRoomInfo.data.listChatRoomUsers.items.map((item) => item.chatRoomID);
    user2ChatRoomInfo.data.listChatRoomUsers.items.filter((item) =>
      console.log(user1ChatRoomIDList.includes(item.chatRoomID))
    );

    // const user1ChatRoomList = user1ChatRoomInfo.chatRoomID.map(
    //   (item) => item.id
    // );
    // const user2ChatRoomList = user2ChatRoomInfo.chatRoomID;

    // 2. through both arrays, find the common chatroom id
    // const checkCommonChatRoomForUsers = () => {
    // };

    // 3. get the chatroom user length with the chatroom id
    // 4. if checkCommonChatRoomForUsers is true & chatroom length === 2, return true, else return false

    // const chatRoomUser = await API.graphql(
    //   graphqlOperation(getChatRoom, { id: chatRoomUserInfo.chatRoom.id })
    // );
    // if authenticated user has the chatroom id === onclick user id
    // and the chatroom user length === 2
    // return
    // if () {
    //   return true;
    // } else {
    //   return false;
    // }
  };

  // papu: 15945538-c1e6-4715-a549-74d403eeb955
  // admin: ac9d38dd-d910-4d8d-adf1-c1e7bf6738d8
  // wendy: f41403e2-fbae-4dd1-b01b-c23d71049162
  // cindy: b2383e59-0e60-4fab-90f4-e06d9dde14de
  // chatroom id: dad83f0e-650c-4024-8684-d3ca220e9d11

  const onClick = async () => {
    try {
      const userInfo = await Auth.currentAuthenticatedUser();

      // 1. check whether the chatroom already existed,
      // if not, create a new chatroom
      // if (!checkForDuplicateChat(userInfo.attributes.sub, user.id)) {
      checkForDuplicateChat(userInfo.attributes.sub, user.id);
      const newChatRoomData = await API.graphql(
        graphqlOperation(createChatRoom, { input: {} })
      );
      console.log("new chatroom data", newChatRoomData);
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
