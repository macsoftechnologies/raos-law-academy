import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const COMPLETED_COURSES = [
  {
    id: "1",
    title: "Andhra Pradesh Junior Civil Judge",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f",
    progress: 100,
  },
];

const DELIVERED_ITEMS = [
  {
    id: "1",
    title: "DDJ Printed Notes",
    deliveredOn: "Dec 23, 2025",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f",
  },
];

export default function CourseCom() {
  const [activeTab, setActiveTab] = useState<"active" | "completed">(
    "completed"
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDEEF5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={26} color="#0A1A3B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Courses</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabSwitcher}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "active" && styles.tabButtonActive]}
          onPress={() => setActiveTab("active")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "active" ? styles.tabTextActive : styles.tabTextInactive,
            ]}
          >
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "completed" && styles.tabButtonActive]}
          onPress={() => setActiveTab("completed")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "completed" ? styles.tabTextActive : styles.tabTextInactive,
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "completed" ? (
          <>
            {COMPLETED_COURSES.map((course) => (
              <View key={course.id} style={styles.courseCard}>
                <Image source={{ uri: course.image }} style={styles.courseImage} />
                <View style={styles.courseCardBody}>
                  <Text style={styles.courseTitle}>{course.title}</Text>

                  <View style={styles.progressTrack}>
                    <View
                      style={[styles.progressFill, { width: `${course.progress}%` }]}
                    />
                  </View>

                  <View style={styles.progressRow}>
                    <Text style={styles.progressText}>
                      {course.progress}% Completed
                    </Text>
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedBadgeText}>Completed</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}

            {DELIVERED_ITEMS.map((item) => (
              <View key={item.id} style={styles.deliveredCard}>
                <Image source={{ uri: item.image }} style={styles.deliveredImage} />
                <View style={styles.deliveredBody}>
                  <Text style={styles.deliveredDate}>
                    Delivered on {item.deliveredOn}
                  </Text>
                  <Text style={styles.deliveredTitle}>{item.title}</Text>
                </View>
              </View>
            ))}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No active courses</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEEF5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0A1A3B",
  },
  tabSwitcher: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: "#23408E",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "700",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  tabTextInactive: {
    color: "#23408E",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  courseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  courseImage: {
    width: "100%",
    height: 150,
  },
  courseCardBody: {
    padding: 14,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0A1A3B",
    marginBottom: 12,
  },
  progressTrack: {
    height: 6,
    backgroundColor: "#E3E6F0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
    backgroundColor: "#23408E",
    borderRadius: 3,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0A1A3B",
  },
  completedBadge: {
    backgroundColor: "#D8AE24",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  completedBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  deliveredCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 10,
  },
  deliveredImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
    marginRight: 12,
  },
  deliveredBody: {
    flex: 1,
  },
  deliveredDate: {
    fontSize: 13,
    color: "#7A8199",
    marginBottom: 4,
  },
  deliveredTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0A1A3B",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  emptyStateText: {
    fontSize: 15,
    color: "#7A8199",
  },
});