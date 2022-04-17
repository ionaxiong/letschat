import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import styles from "./styles";
import { useState, useEffect } from "react";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { createMessage } from "../../src/graphql/mutations";
import { ChatRoom } from "../../src/API";
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
  const [messages, setMessages] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await Auth.currentAuthenticatedUser();
      setUserId(userInfo.attributes.sub);
    };

    const fetchMessages = async () => {};
    fetchUser();
    fetchMessages();
  }, []);

  const onMicrophonePress = () => {
    console.warn("Recording");
  };

  const onSendPress = async () => {
    try {
      await API.graphql(
        graphqlOperation(createMessage, {
          input: {
            content: message,
            userID: userId,
            chatRoomID,
          },
        })
      );
    } catch (e) {
      console.log("something wrong with inputting messages", e);
    }
    // send the message to the backend
    setMessage(message);
  };

  const onPress = () => {
    if (!message) {
      onMicrophonePress();
    } else {
      onSendPress();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
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
            <MaterialIcons name="send" size={24} color="white"></MaterialIcons>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default InputBox;
