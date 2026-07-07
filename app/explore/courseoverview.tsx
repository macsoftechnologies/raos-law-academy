import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const courses = [
  {
    id: "1",
    title: "Andhra Pradesh Junior Civil Judge",
    image: require("../../assets/images/Rectangle40.png"),
    endDate: "Ends on 26th Jan",
    duration: "2 years Course",
    left: "2months left",
  },
  {
    id: "2",
    title: "Telangana Junior Civil Judge",
    image: require("../../assets/images/Rectangle41.png"),
    endDate: "Ends on 26th Jan",
    duration: "2 years Course",
    left: "2months left",
  },
];

export default function CourseOverview() {
  const renderItem = ({ item }: { item: typeof courses[number] }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.endDate}>{item.endDate}</Text>
          </View>

          <View>
            <View style={styles.redBadge}>
              <Text style={styles.redBadgeText}>{item.left}</Text>
            </View>

            <View style={styles.blueBadge}>
              <Text style={styles.blueBadgeText}>{item.duration}</Text>
            </View>
          </View>
        </View>

     <TouchableOpacity
  style={styles.button}
  onPress={() => router.push("/explore/coursepackage")}
>
  <Text style={styles.buttonText}>Open</Text>
</TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Junior Civil Judge</Text>

        <View style={{ width: 28 }} />
      </View>

      {/* Course List */}
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF2F8",
    paddingHorizontal: 25,
    paddingTop: 30,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    justifyContent: "space-between",
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 22,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },

  image: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },

  content: {
    padding: 14,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 25,
    fontWeight: "700",
    color: "#222",
    paddingRight: 10,
  },

  endDate: {
    marginTop: 8,
    fontSize: 16,
    color: "#8B2020",
    fontWeight: "600",
  },

  redBadge: {
    backgroundColor: "#F9E9EA",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    marginBottom: 8,
    alignItems: "center",
  },

  redBadgeText: {
    color: "#8B2020",
    fontSize: 14,
    fontWeight: "600",
  },

  blueBadge: {
    backgroundColor: "#E9F0FF",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    alignItems: "center",
  },

  blueBadgeText: {
    color: "#2048B5",
    fontSize: 14,
    fontWeight: "600",
  },

  button: {
    marginTop: 18,
    height: 52,
    backgroundColor: "#24469C",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,
  },
});