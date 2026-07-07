import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const trending = [
  "JCJ Notes",
  "Guest Lectures",
  "Mains Test",
];

export default function SearchScreen() {
  const [search, setSearch] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Search Bar */}
        <View style={styles.searchRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>

          <View style={styles.searchBox}>
            <Ionicons
              name="search-outline"
              size={20}
              color="#B0B0B0"
              style={{ marginHorizontal: 10 }}
            />

            <TextInput
              placeholder="Type to search..."
              placeholderTextColor="#B5B5B5"
              value={search}
              onChangeText={setSearch}
              style={styles.input}
              autoFocus
            />
          </View>
        </View>

        {/* Trending Card */}
        <View style={styles.card}>
          <View style={styles.yellowBar} />

          <Text style={styles.heading}>Trending</Text>

          {trending.map((item, index) => (
            <TouchableOpacity key={index} style={styles.item}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name="trending-up"
                  size={18}
                  color="#2E5AAC"
                />
              </View>

              <Text style={styles.itemText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF1F7",
    paddingHorizontal: 20,
    paddingTop: 30,
    marginTop: 50
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  searchBox: {
    flex: 1,
    height: 48,
    backgroundColor: "#fff",
    marginLeft: 12,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#222",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    paddingTop: 14,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,

    position: "relative",
  },

  yellowBar: {
    position: "absolute",
    left: 0,
    top: 10,
    width: 4,
    height: 30,
    backgroundColor: "#E4B221",
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },

  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: "#8A8A8A",
    marginBottom: 18,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#EEF3FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  itemText: {
    fontSize: 18,
    color: "#111",
  },
});