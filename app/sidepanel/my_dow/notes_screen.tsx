import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const NOTES = [
  {
    id: "1",
    title: "Introduction Notes",
    lecture: "Lecture 1",
    // image: require("../../assets/images/pdf.png"),
  },
  {
    id: "2",
    title: "Introduction Notes",
    lecture: "Lecture 2",
    // image: require("../../assets/images/pdf.png"),
  },
  {
    id: "3",
    title: "Introduction Notes",
    lecture: "Lecture 3",
    // image: require("../../assets/images/pdf.png"),
  },
  {
    id: "4",
    title: "Introduction Notes",
    lecture: "Lecture 4",
    // image: require("../../assets/images/pdf.png"),
  },
];

export default function NotesScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ECEFF6" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={25} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Downloads</Text>

        <View style={{ width: 25 }} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => router.push("/sidepanel/my_dow/video_screen")}
        >
          <Text style={styles.inactive}>Videos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={styles.active}>Notes</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={NOTES}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 15 }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/sidepanel/my_dow/notes_screen",
                params: { id: item.id },
              })
            }
          >
            {/* <Image source={item.image} style={styles.image} /> */}

            <Text style={styles.title}>{item.title}</Text>

            <View style={styles.button}>
              <Text style={styles.buttonText}>{item.lecture}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECEFF6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 15,
    borderRadius: 18,
    padding: 5,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 15,
  },
  activeTab: {
    backgroundColor: "#23408E",
  },
  active: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  inactive: {
    color: "#23408E",
    fontWeight: "700",
    fontSize: 16,
  },
  card: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 18,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  title: {
    fontWeight: "700",
    fontSize: 15,
    marginHorizontal: 10,
    marginTop: 10,
  },
  button: {
    backgroundColor: "#D4A51C",
    margin: 10,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});