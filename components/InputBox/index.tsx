import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import styles from "./styles";
import { useState } from "react";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  Entypo,
  Fontisto,
  MaterialIcons,
} from "@expo/vector-icons";

const InputBox = () => {
  const [message, setMessage] = useState("");

  const onMicrophonePress = () => {
    console.warn("Microphone");
  };

  const onSendPress = () => {
    console.warn("Send");
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
