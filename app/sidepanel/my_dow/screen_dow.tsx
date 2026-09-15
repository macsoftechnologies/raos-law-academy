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

const DOWNLOADED_VIDEOS = [
  {
    id: "1",
    lecture: "LECTURE 1",
    title: "Introduction Of Civil Procedure Code",
    author: "By Srinivas",
    duration: "35:22",
    thumbnail: "https://images.unsplash.com/photo-1521791136064-7986c2920216",
  },
  {
    id: "2",
    lecture: "LECTURE 2",
    title: "Title Description",
    author: "By Srinivas",
    duration: "35:22",
    thumbnail: "https://images.unsplash.com/photo-1521791136064-7986c2920216",
  },
  {
    id: "3",
    lecture: "LECTURE 3",
    title: "Section 1 - Section 25",
    author: "By Srinivas",
    duration: "26:44",
    thumbnail: "https://images.unsplash.com/photo-1521791136064-7986c2920216",
  },
];

const DOWNLOADED_NOTES: {
  id: string;
  title: string;
  author: string;
}[] = [];

export default function ScreenDow() {
  const [activeTab, setActiveTab] = useState<"videos" | "notes">("videos");

  const handleDelete = (id: string) => {
    // TODO: hook up delete logic (remove from downloads store / storage)
    console.log("delete", id);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDEEF5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={26} color="#0A1A3B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Downloads</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabSwitcher}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "videos" && styles.tabButtonActive]}
          onPress={() => setActiveTab("videos")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "videos" ? styles.tabTextActive : styles.tabTextInactive,
            ]}
          >
            Videos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
  style={[
    styles.tabButton,
    activeTab === "notes" && styles.tabButtonActive,
  ]}
  onPress={() => {
    setActiveTab("notes");
    router.push("/sidepanel/my_dow/notes_screen"); // Replace with your actual route
  }}
>
  <Text
    style={[
      styles.tabText,
      activeTab === "notes"
        ? styles.tabTextActive
        : styles.tabTextInactive,
    ]}
  >
    Notes
  </Text>
</TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "videos" ? (
          DOWNLOADED_VIDEOS.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No downloaded videos</Text>
            </View>
          ) : (
            DOWNLOADED_VIDEOS.map((video) => (
              <View key={video.id} style={styles.videoCard}>
                <View style={styles.thumbnailWrap}>
                  <Image
                    source={{ uri: video.thumbnail }}
                    style={styles.thumbnail}
                  />
                  <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>{video.duration}</Text>
                  </View>
                </View>

                <View style={styles.videoBody}>
                  <View style={styles.videoBodyTop}>
                    <Text style={styles.lectureLabel}>{video.lecture}</Text>
                   <TouchableOpacity
  onPress={() => {
    handleDelete(video.id);

    router.push({
      pathname: "/sidepanel/my_dow/video_screen",
      params: { id: video.id },
    });
  }}
  hitSlop={8}
>
  <Ionicons name="trash-outline" size={18} color="#0A1A3B" />
</TouchableOpacity>
                  </View>
                  <Text style={styles.videoTitle} numberOfLines={2}>
                    {video.title}
                  </Text>
                  <Text style={styles.videoAuthor}>{video.author}</Text>
                </View>
              </View>
            ))
          )
        ) : DOWNLOADED_NOTES.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No downloaded notes</Text>
          </View>
        ) : (
          DOWNLOADED_NOTES.map((note) => (
            <View key={note.id} style={styles.videoCard}>
              <View style={styles.videoBody}>
                <Text style={styles.videoTitle}>{note.title}</Text>
                <Text style={styles.videoAuthor}>{note.author}</Text>
              </View>
            </View>
          ))
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
  videoCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 10,
    marginBottom: 14,
  },
  thumbnailWrap: {
    width: 108,
    height: 76,
    borderRadius: 10,
    overflow: "hidden",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  durationBadge: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  durationText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  videoBody: {
    flex: 1,
    marginLeft: 12,
  },
  videoBodyTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lectureLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#C9A227",
    letterSpacing: 0.4,
  },
  videoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0A1A3B",
    marginTop: 4,
  },
  videoAuthor: {
    fontSize: 13,
    color: "#7A8199",
    marginTop: 4,
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