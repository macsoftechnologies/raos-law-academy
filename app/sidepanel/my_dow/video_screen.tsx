import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Modal,
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

export default function VideoScreen() {
  const [activeTab, setActiveTab] = useState<"videos" | "notes">("videos");
  const [videos, setVideos] = useState(DOWNLOADED_VIDEOS);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const requestDelete = (id: string) => {
    setPendingDeleteId(id);
    setDeleteModalVisible(true);
  };

  const closeModal = () => {
    setDeleteModalVisible(false);
    setPendingDeleteId(null);
  };

  const confirmDelete = () => {
    if (pendingDeleteId) {
      setVideos((prev) => prev.filter((v) => v.id !== pendingDeleteId));
    }
    closeModal();
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
          style={[styles.tabButton, activeTab === "notes" && styles.tabButtonActive]}
          onPress={() => setActiveTab("notes")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "notes" ? styles.tabTextActive : styles.tabTextInactive,
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
          videos.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No downloaded videos</Text>
            </View>
          ) : (
            videos.map((video) => (
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
                      onPress={() => requestDelete(video.id)}
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

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={closeModal}
          />
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={closeModal}
              hitSlop={10}
            >
              <Ionicons name="close" size={22} color="#0A1A3B" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Delete</Text>
            <View style={styles.modalDivider} />

            <Text style={styles.modalQuestion}>Are you sure want to Delete?</Text>
            <Text style={styles.modalSubtext}>Thank you and see you again!❤️</Text>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={confirmDelete}
              >
                <Text style={styles.deleteButtonText}>Yes, Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(10, 26, 59, 0.55)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E3E6F0",
    marginBottom: 8,
  },
  modalCloseButton: {
    position: "absolute",
    top: 18,
    left: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#7A1F2B",
    marginTop: 12,
  },
  modalDivider: {
    width: "100%",
    height: 1,
    backgroundColor: "#EDEEF5",
    marginTop: 16,
  },
  modalQuestion: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0A1A3B",
    marginTop: 24,
  },
  modalSubtext: {
    fontSize: 13,
    color: "#A9AEC0",
    marginTop: 6,
  },
  modalActions: {
    flexDirection: "row",
    marginTop: 28,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#E9DFB8",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#B79A4A",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#D8AE24",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginLeft: 10,
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0A1A3B",
  },
});