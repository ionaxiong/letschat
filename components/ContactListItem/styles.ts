import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
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
    status: {
        color: "grey",
    }
})

export default styles;