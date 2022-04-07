import { StyleSheet } from "react-native";

const style = StyleSheet.create({
    avatar: {
        width: 50,
        height: 50,
        marginRight: 10,
        marginLeft: 5,
        borderRadius: 400/2,
    },
    container: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        padding: 10,
    },
    leftContainer: {
        flexDirection: "row",
    },
    midContainer: {
        justifyContent: "space-around",
    },
    username: {
        fontSize: 15,
        fontWeight: "bold",
    },
    lastMessage: {
        fontSize: 15,
        color: "grey",
    },
    time: {
        fontSize: 12,
        color: "grey",
        padding: 5,
    }
})

export default style;