import React from "react";
import { View, Text, TextInput } from "react-native";
import styles from "./styles";
import { useState } from "react";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  Entypo,
  Fontisto,
} from "@expo/vector-icons";

const InputBox = () => {
  const [message, setMessage] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <FontAwesome5 name="laugh-beam" size={24} color="grey"></FontAwesome5>
        <TextInput
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
        <Fontisto
          name="camera"
          size={24}
          color="grey"
          style={styles.icon}
        ></Fontisto>
      </View>
      <View style={styles.buttonContainer}>
        <MaterialCommunityIcons
          name="microphone"
          size={24}
          color="white"
        ></MaterialCommunityIcons>
      </View>
    </View>
  );
};

export default InputBox;
