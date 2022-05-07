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
import { listUsers } from "../../src/graphql/queries";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  Entypo,
  Fontisto,
  MaterialIcons,
} from "@expo/vector-icons";

export type SearchButtonProps = {
  query: string;
};

const SearchButton = (props: SearchButtonProps) => {
  const { query } = props;

  useEffect(() => {
    const listUsersByQuery = async () => {
      try {
        await API.graphql(
          graphqlOperation(listUsers, {
            filter: { name: { eq: query } },
          })
        );
      } catch (e) {
        console.error("something wrong while searching the contact", e);
      }
    };
    listUsersByQuery();
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
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        {/* <FontAwesome5 name="laugh-beam" size={24} color="grey"></FontAwesome5> */}
        <TextInput
          placeholder="Message"
          style={styles.textInput}
          multiline
          value={message}
          onChangeText={setMessage}
        />
        {/* <Entypo
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
          )} */}
      </View>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.buttonContainer}>
          {!query ? (
            <Octicons name="search" size={20} color={Colors.light.background} />
          ) : (
            <TextInput
              placeholder="Search..."
              style={styles.textInput}
              multiline
              value={query}
              onChangeText={setMessage}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SearchButton;
