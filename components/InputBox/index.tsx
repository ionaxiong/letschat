import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import styles from "./styles";
import { useState, useEffect } from "react";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { updateChatRoom, createMessage } from "../../src/graphql/mutations";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  Entypo,
  Fontisto,
  MaterialIcons,
} from "@expo/vector-icons";

const InputBox = (props) => {
  const { chatRoomID } = props;
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await Auth.currentAuthenticatedUser();
      setUserId(userInfo.attributes.sub);
    };
    fetchUser();
  }, []);

  const onMicrophonePress = () => {
    console.warn("Recording");
  };

  const updateChatRoomLastMessage = async (messageId: string) => {
    try {
      await API.graphql(
        graphqlOperation(updateChatRoom, {
          input: {
            id: chatRoomID,
            lastMessageID: messageId,
          },
        })
      );
    } catch (e) {
      console.log("something wrong while updating chat room last message", e);
    }
  };
  const onSendPress = async () => {
    try {
      const newMessageData = await API.graphql(
        graphqlOperation(createMessage, {
          input: {
            content: message,
            userID: userId,
            chatRoomID,
          },
        })
      );
      setMessage("");
      await updateChatRoomLastMessage(newMessageData.data.createMessage.id);
    } catch (e) {
      console.log("something wrong with inputting messages", e);
    }
    // send the message to the backend
  };

  const onPress = () => {
    if (!message) {
      onMicrophonePress();
    } else {
      onSendPress();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          {/* oijoijasd */}
          <FontAwesome5 name="laugh-beam" size={24} color="grey"></FontAwesome5>
          <TextInput
            placeholder="Message"
            style={styles.textInput}
            multiline
            value={message}
            onChangeText={setMessage}
          />
          <Entypo
            name="attachment"
            size={24}
            color="grey"
            style={styles.icon}
          ></Entypo>
          {!message && (
            <Fontisto
              name="camera"
              size={24}
              color="grey"
              style={styles.icon}
            ></Fontisto>
          )}
        </View>
        <TouchableOpacity onPress={onPress}>
          <View style={styles.buttonContainer}>
            {!message ? (
              <MaterialCommunityIcons
                name="microphone"
                size={24}
                color="white"
              ></MaterialCommunityIcons>
            ) : (
              <MaterialIcons
                name="send"
                size={24}
                color="white"
              ></MaterialIcons>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default InputBox;
