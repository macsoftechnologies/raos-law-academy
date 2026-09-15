import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface WishlistLecture {
  id: string;
  thumbnail: string;
  title: string;
  lectureLabel: string;
}

const WISHLIST_LECTURES: WishlistLecture[] = [
  {
    id: "1",
    thumbnail: "https://via.placeholder.com/300x180",
    title: "Introduction",
    lectureLabel: "Lecture 1",
  },
  {
    id: "2",
    thumbnail: "https://via.placeholder.com/300x180",
    title: "Introduction",
    lectureLabel: "Lecture 2",
  },
  {
    id: "3",
    thumbnail: "https://via.placeholder.com/300x180",
    title: "Introduction",
    lectureLabel: "Lecture 3",
  },
  {
    id: "4",
    thumbnail: "https://via.placeholder.com/300x180",
    title: "Introduction",
    lectureLabel: "Lecture 4",
  },
];

export default function WishCart() {
  const [search, setSearch] = useState("");

  const filteredLectures = WISHLIST_LECTURES.filter((lecture) =>
    lecture.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDEEF5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#0A1A3B" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Wish List</Text>
          <Text style={styles.headerSubtitle}>
            Organize & Review Saved Content
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#8A8FA3"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search folders"
          placeholderTextColor="#8A8FA3"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Lecture Grid */}
      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {filteredLectures.map((lecture) => (
          <TouchableOpacity
            key={lecture.id}
            style={styles.lectureCard}
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname: "/sidepanel/wish_list/wishlist",
                params: { id: lecture.id },
              })
            }
          >
            <Image
              source={{ uri: lecture.thumbnail }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            <View style={styles.cardBody}>
              <Text style={styles.lectureTitle} numberOfLines={1}>
                {lecture.title}
              </Text>
              <View style={styles.lectureBadge}>
                <Text style={styles.lectureBadgeText}>
                  {lecture.lectureLabel}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEEF5",
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0A1A3B",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#6B7089",
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 24,
    shadowColor: "#0A1A3B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#0A1A3B",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 24,
  },
  lectureCard: {
    width: "47%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#0A1A3B",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  thumbnail: {
    width: "100%",
    height: 90,
    backgroundColor: "#1A1210",
  },
  cardBody: {
    padding: 12,
  },
  lectureTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0A1A3B",
    marginBottom: 8,
  },
  lectureBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#C9A227",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    width: "100%",
    alignItems: "center",
  },
  lectureBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});