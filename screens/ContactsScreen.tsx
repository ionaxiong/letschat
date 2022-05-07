import React, { useEffect } from "react";
import { FlatList, StyleSheet } from "react-native";
import { View } from "../components/Themed";
import ContactListItem from "../components/ContactListItem/index";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { listUsers } from "../src/graphql/queries";
import { useState, useContext } from "react";
import { SearchContext } from "../navigation";

export default function ContactsScreen() {
  const [users, setUsers] = useState([]);
  const { show, setShow, search, setSearch } = useContext(SearchContext);

  useEffect(() => {
    setSearch("");
    setShow(false);
    const fetchUsers = async () => {
      try {
        const userInfo = await Auth.currentAuthenticatedUser();
        const usersData = await API.graphql(
          graphqlOperation(listUsers, {
            filter: { id: { notContains: userInfo.attributes.sub } },
          })
        );
        setUsers(usersData.data.listUsers.items);
      } catch (e) {
        console.log("something went wrong!", e);
      }
    };
    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={(item) => item.id}
        style={styles.flatList}
        data={users.filter((x) =>
          x.name
            .toLowerCase()
            .includes(search.toLowerCase().trim().replace(/\s/g, ""))
        )}
        renderItem={({ item }) => <ContactListItem user={item} />}
      ></FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  flatList: {
    width: "100%",
    marginRight: 5,
  },
});
