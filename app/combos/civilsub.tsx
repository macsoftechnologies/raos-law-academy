import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const NAVY = "#1B2559";
const GOLD = "#D4A537";
const BG = "#F1F3F9";

interface Lecture {
  id: string;
  lectureLabel: string; // e.g. "LECTURE 1"
  title: string;
  author: string;
  thumbnail: any; // URL or local require
  duration?: string;

}

const LECTURES: Lecture[] = [
  {
    id: "1",
    lectureLabel: "LECTURE 1",
    title: "Introduction Of Civil Procedure Code",
    author: "By Srinivas",
    thumbnail: require("../../assets/images/IMAGE.png"),
    duration: "30:15",
  },
  {
    id: "2",
    lectureLabel: "LECTURE 2",
    title: "Title Description",
    author: "By Srinivas",
    thumbnail: require("../../assets/images/civil2.png"),
    duration: "35:00",
  },
  {
    id: "3",
    lectureLabel: "LECTURE 3",
    title: "Section 1 - Section 25",
    author: "By Srinivas",
    thumbnail: require("../../assets/images/civil3.png"),
    duration: "26:44",
  },
];
export default function CivilSub() {
  const [search, setSearch] = useState("");

  const filteredLectures = LECTURES.filter((lecture) =>
    lecture.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color={NAVY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Civil Procedure Code</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#9AA0B4" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for.."
            placeholderTextColor="#9AA0B4"
            
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options-outline" size={20} color={NAVY} />
        </TouchableOpacity>
      </View>

      {/* Lecture List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {filteredLectures.map((lecture) => (
          <TouchableOpacity
            key={lecture.id}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname: "/combos/combolec",
                params: { id: lecture.id },
              })
            }
          >
            <View style={styles.thumbnailWrap}>
       <Image
  source={lecture.thumbnail}
  style={styles.thumbnail}
  resizeMode="cover"
/>
              {lecture.duration && (
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>{lecture.duration}</Text>
                </View>
              )}
            </View>
            <View style={styles.cardTextWrap}>
              <Text style={styles.lectureLabel}>{lecture.lectureLabel}</Text>
              <Text style={styles.lectureTitle} numberOfLines={2}>
                {lecture.title}
              </Text>
              <Text style={styles.lectureAuthor}>{lecture.author}</Text>
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
    backgroundColor: BG,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: NAVY,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 14,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: NAVY,
  },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 14,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  thumbnailWrap: {
    width: 130,
    height: 100,
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  durationBadge: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  durationText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  cardTextWrap: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  lectureLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: GOLD,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  lectureTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: NAVY,
    marginBottom: 4,
    lineHeight: 20,
  },
  lectureAuthor: {
    fontSize: 12,
    color: "#8A8FA3",
  },
});