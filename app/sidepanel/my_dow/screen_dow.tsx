import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import {
  DownloadedVideo,
  DownloadedNote,
  getDownloadedVideos,
  getDownloadedNotes,
  deleteDownloadedVideo,
  deleteDownloadedNote,
} from "./downloadsStore";

export default function ScreenDow({ initialTab }: { initialTab?: "videos" | "notes" }) {
  const params = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<"videos" | "notes">(
    initialTab ?? (params?.tab === "notes" ? "notes" : "videos")
  );
  const [videos, setVideos] = useState<DownloadedVideo[]>([]);
  const [notes, setNotes] = useState<DownloadedNote[]>([]);
  const [loading, setLoading] = useState(true);

  // Delete modal state
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{
    type: "video" | "note";
    id: string;
    title: string;
  } | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [fetchedVideos, fetchedNotes] = await Promise.all([
        getDownloadedVideos(),
        getDownloadedNotes(),
      ]);
      setVideos(fetchedVideos);
      setNotes(fetchedNotes);
    } catch (err) {
      console.error("Failed loading downloads:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const requestDelete = (type: "video" | "note", id: string, title: string) => {
    setPendingDelete({ type, id, title });
    setDeleteModalVisible(true);
  };

  const closeModal = () => {
    setDeleteModalVisible(false);
    setPendingDelete(null);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    try {
      if (pendingDelete.type === "video") {
        const updated = await deleteDownloadedVideo(pendingDelete.id);
        setVideos(updated);
        Toast.show({
          type: "success",
          text1: "Video Removed",
          text2: `"${pendingDelete.title}" deleted from downloads.`,
        });
      } else {
        const updated = await deleteDownloadedNote(pendingDelete.id);
        setNotes(updated);
        Toast.show({
          type: "success",
          text1: "Note Removed",
          text2: `"${pendingDelete.title}" deleted from downloads.`,
        });
      }
    } catch (error) {
      console.error("Delete failed:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to delete item.",
      });
    } finally {
      closeModal();
    }
  };

  const handleOpenVideo = (video: DownloadedVideo) => {
    // Navigate to video lecture player
    router.push("/combos/combolec");
  };

  const handleOpenNote = (note: DownloadedNote) => {
    Toast.show({
      type: "info",
      text1: note.title,
      text2: `${note.pages ?? "Notes"} downloaded and available offline.`,
    });
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
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "videos" ? styles.tabTextActive : styles.tabTextInactive,
            ]}
          >
            Videos ({videos.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === "notes" && styles.tabButtonActive]}
          onPress={() => setActiveTab("notes")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "notes" ? styles.tabTextActive : styles.tabTextInactive,
            ]}
          >
            Notes ({notes.length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#23408E" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === "videos" ? (
            videos.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="film-outline" size={54} color="#A9AEC0" />
                <Text style={styles.emptyStateTitle}>No downloaded videos</Text>
                <Text style={styles.emptyStateSub}>
                  Videos you download will appear here for offline access.
                </Text>
              </View>
            ) : (
              videos.map((video) => (
                <TouchableOpacity
                  key={video.id}
                  style={styles.videoCard}
                  activeOpacity={0.9}
                  onPress={() => handleOpenVideo(video)}
                >
                  <View style={styles.thumbnailWrap}>
                    <Image
                      source={{ uri: video.thumbnail }}
                      style={styles.thumbnail}
                    />
                    <View style={styles.durationBadge}>
                      <Text style={styles.durationText}>{video.duration}</Text>
                    </View>
                    <View style={styles.playIconOverlay}>
                      <Ionicons name="play" size={18} color="#FFFFFF" />
                    </View>
                  </View>

                  <View style={styles.videoBody}>
                    <View style={styles.videoBodyTop}>
                      <Text style={styles.lectureLabel}>{video.lecture}</Text>
                      <TouchableOpacity
                        onPress={() => requestDelete("video", video.id, video.title)}
                        hitSlop={10}
                        style={styles.trashBtn}
                      >
                        <Ionicons name="trash-outline" size={18} color="#C92A2A" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.videoTitle} numberOfLines={2}>
                      {video.title}
                    </Text>
                    <Text style={styles.videoAuthor}>{video.author}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )
          ) : notes.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={54} color="#A9AEC0" />
              <Text style={styles.emptyStateTitle}>No downloaded notes</Text>
              <Text style={styles.emptyStateSub}>
                Notes and PDF materials you download will appear here.
              </Text>
            </View>
          ) : (
            notes.map((note) => (
              <TouchableOpacity
                key={note.id}
                style={styles.noteCard}
                activeOpacity={0.9}
                onPress={() => handleOpenNote(note)}
              >
                <View style={styles.noteIconWrap}>
                  <Ionicons name="document-text" size={28} color="#D4A51C" />
                </View>

                <View style={styles.noteBody}>
                  <View style={styles.videoBodyTop}>
                    <Text style={styles.lectureLabel}>{note.lecture.toUpperCase()}</Text>
                    <TouchableOpacity
                      onPress={() => requestDelete("note", note.id, note.title)}
                      hitSlop={10}
                      style={styles.trashBtn}
                    >
                      <Ionicons name="trash-outline" size={18} color="#C92A2A" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.videoTitle} numberOfLines={2}>
                    {note.title}
                  </Text>
                  <Text style={styles.videoAuthor}>
                    {note.author ?? "Rao's Law Academy"} • {note.pages ?? "PDF"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

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
            {pendingDelete?.title ? (
              <Text style={styles.modalItemTitle} numberOfLines={1}>
                {pendingDelete.title}
              </Text>
            ) : null}
            <Text style={styles.modalSubtext}>
              This item will be removed from your downloads.
            </Text>

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
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  thumbnailWrap: {
    width: 108,
    height: 76,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  durationBadge: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.75)",
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  durationText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  playIconOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -12 }, { translateY: -12 }],
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  videoBody: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  videoBodyTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lectureLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#C9A227",
    letterSpacing: 0.4,
  },
  trashBtn: {
    padding: 4,
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
  noteCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  noteIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#FDF8E8",
    alignItems: "center",
    justifyContent: "center",
  },
  noteBody: {
    flex: 1,
    marginLeft: 12,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  emptyStateTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0A1A3B",
    marginTop: 14,
  },
  emptyStateSub: {
    fontSize: 13,
    color: "#7A8199",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
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
    marginTop: 20,
  },
  modalItemTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#23408E",
    marginTop: 6,
    paddingHorizontal: 12,
  },
  modalSubtext: {
    fontSize: 13,
    color: "#A9AEC0",
    marginTop: 6,
  },
  modalActions: {
    flexDirection: "row",
    marginTop: 24,
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
    color: "#8C7126",
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