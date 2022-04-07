import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    messageBox: {
        borderRadius: 10,
        padding: 10,
    },
    name: {
        fontWeight: "bold",
        color: Colors.light.tint,
        marginBottom: 2
    },
    message: {

    },
    time: {
        alignSelf: "flex-end",
        color: "grey",
        fontSize: 12,
    }
})

export default styles;