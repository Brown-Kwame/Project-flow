import { useRouter } from "expo-router";
import { SafeAreaView, View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";

export default function MessageScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Direct Messages</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            activeOpacity={0.7}
            onPress={() =>
              router.push({
                pathname: "/chat/ChatScreen",
                params: {
                  name: item.name,
                  text: item.text,
                },
              })
            }
          >
            <View style={styles.avatar}>
              <Text style={styles.text}>{item.name[0]}</Text>
            </View>
            <View style={styles.textContainer}>
              <View style={styles.row}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <Text style={styles.message}>{item.text}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

export const messages = [
  {
    id: "1",
    name: "Rawuf",
    time: "4 mins ago",
    text: "Hey there, let's finish this project!.",
  },
  {
    id: "2",
    name: "Mariano",
    time: "2 hours ago",
    text: "Hey there, let's finish this project!.",
  },
  {
    id: "3",
    name: "James",
    time: "1 hour ago",
    text: "Hey there, let's finish this project!.",
  },
  {
    id: "4",
    name: "Brown",
    time: "1 day ago",
    text: "Hey there, let's finish this project!.",
  },
  {
    id: "5",
    name: "Shaddy",
    time: "2 days ago",
    text: "Hey there, let's finish this project!.",
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 12,
    paddingLeft: 10,
  },
  item: {
    flexDirection: "row",
    marginBottom: 20,
  },
  messageContainer: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#668cff33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#668cff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    color: '#668cff',
    fontWeight: "600",
    fontSize: 16,
  },
  time: {
    fontSize: 12,
    color: "#888",
  },
  message: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
});





