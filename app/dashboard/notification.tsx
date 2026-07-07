import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,  
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const notifications = {
  Today: [
    { id: 1 },
    { id: 2 },
    { id: 3 },
  ],
  Yesterday: [
    { id: 4 },
    { id: 5 },
    { id: 6 },
  ],
};

const NotificationCard = () => (
  <TouchableOpacity style={styles.card} activeOpacity={0.8}>
    <View style={styles.iconContainer}>
      <Text style={styles.icon}>⚖️</Text>
    </View>

    <View style={{ flex: 1 }}>
      <Text style={styles.title}>🔥 MEGA PRICE DROP ALERT</Text>
      <Text style={styles.subtitle}>
        👉 Get All-In-One AP & TG MegaPack
      </Text>
    </View>
  </TouchableOpacity>
);

export default function NotificationScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notifications</Text>

        <View style={{ width: 26 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <Text style={styles.sectionTitle}>Today</Text>

        {notifications.Today.map((item) => (
          <NotificationCard key={item.id} />
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 18 }]}>
          Yesterday
        </Text>

        {notifications.Yesterday.map((item) => (
          <NotificationCard key={item.id} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF1F7",
    paddingHorizontal: 18,
    paddingTop: 10,
    marginTop: 30,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 18,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginLeft: 12,
    color: "#222",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#8A8A8A",
    marginBottom: 14,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#173B8D",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  icon: {
    fontSize: 20,
    color: "#fff",
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 14,
    color: "#555",
  },
});