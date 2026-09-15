import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

// ---------- API types (match the actual response shape) ----------
export interface MainsTest {
  _id: string;
  mains_test_id: string;
  mains_id: string;
  title: string;
  no_of_qs: string;
  no_of_subjects: string;
  presentation_image: string;
  terms_conditions: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface MainsSubjectTestDetail {
  _id: string;
  mains_subject_test_id: string;
  mains_test_id: MainsTest[];
  title: string;
  no_of_qos: string;
  duration: string;
  question_paper_file: string;
  marks: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface MainsSubjectTestDetailsResponse {
  statusCode: number;
  message: string;
  data: MainsSubjectTestDetail[];
}

// ---------- View model the card actually renders ----------
interface QAItem {
  id: string;
  subjectTestId: string;
  title: string;
  totalQuestions: number;
  duration: string;
  marks: number;
  questionPaperFile: string;
  fileType: "pdf" | "video" | "unknown";
}

const NAVY = "#0A1A3B";
const API_BASE = "https://api.raoslawacademy.com";

function getFileType(url: string): "pdf" | "video" | "unknown" {
  if (!url) return "unknown";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "video";
  if (url.endsWith(".pdf") || url.includes("scribd.com")) return "pdf";
  return "unknown";
}

// ---------- Mapper: raw API item -> QAItem the UI consumes ----------
function mapToQAItem(item: MainsSubjectTestDetail): QAItem {
  return {
    id: item._id,
    subjectTestId: item.mains_subject_test_id,
    title: item.title,
    totalQuestions: Number(item.no_of_qos) || 0,
    duration: item.duration,
    marks: item.marks,
    questionPaperFile: item.question_paper_file,
    fileType: getFileType(item.question_paper_file),
  };
}

export default function MainsQAScreen() {
  const { mains_id, mains_subject_test_id } = useLocalSearchParams<{
    mains_id?: string;
    mains_subject_test_id?: string;
  }>();

  const [items, setItems] = useState<QAItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async () => {
    if (!mains_subject_test_id) {
      setError("Missing mains_subject_test_id");
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const res = await fetch(`https://api.raoslawacademy.com/mains/mainssubjecttestdetails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mains_subject_test_id }),
      });

      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

      const json: MainsSubjectTestDetailsResponse = await res.json();

      if (json.statusCode !== 200) {
        throw new Error(json.message || "Failed to load test details");
      }

      setItems(json.data.map(mapToQAItem));
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [mains_subject_test_id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDetails();
  };

  const handleWatchNow = (item: QAItem) => {
    router.push({
      pathname: "/mains-qa/video", 
      params: {
        subject_test_id: item.subjectTestId,
        mains_id,
        question_paper_file: item.questionPaperFile,
      },
    } as any);
  };

  const handleViewPdf = (item: QAItem) => {
    router.push({
      pathname: "/mains-qa/pdf-viewer", // adjust to your actual route
      params: {
        subject_test_id: item.subjectTestId,
        mains_id,
        question_paper_file: item.questionPaperFile,
      },
    } as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDEEF5" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#111111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AP JCJ Mains Preparation Q & A</Text>
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={NAVY} />
        </View>
      ) : error ? (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchDetails}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {items.length === 0 ? (
            <View style={styles.centerBox}>
              <Text style={styles.emptyText}>No details available.</Text>
            </View>
          ) : (
            items.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.previewBox}>
                  <Text style={styles.previewTitle}>{item.title}</Text>
                  <Text style={styles.previewText}>
                    Marks: {item.marks} • Duration: {item.duration}
                  </Text>
                  <Text style={styles.watermark}>
                    {item.fileType === "video" ? "VIDEO" : "PDF"}
                  </Text>
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{item.title}</Text>

                  <View style={styles.badgeRow}>
                    <View style={styles.quesBadge}>
                      <Ionicons
                        name="document-text-outline"
                        size={13}
                        color="#7A1F2B"
                      />
                      <Text style={styles.quesBadgeText}>
                        {item.totalQuestions} Ques
                      </Text>
                    </View>
                    <View style={styles.durationBadge}>
                      <Ionicons name="time-outline" size={13} color="#8A6A0E" />
                      <Text style={styles.durationBadgeText}>
                        {item.duration}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.watchBtn}
                      onPress={() => handleWatchNow(item)}
                    >
                      <Text style={styles.watchBtnText}>Watch now</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.pdfBtn}
                      onPress={() => handleViewPdf(item)}
                    >
                      <Text style={styles.pdfBtnText}>View Pdf</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#EDEEF5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 14,
    paddingTop: 20,
  },
  backBtn: { padding: 10, marginRight: 4 },
  headerTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#111111",
    flex: 1,
    flexShrink: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  centerBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  errorText: {
    color: "#7A1F2B",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },
  emptyText: { color: "#6B7086", fontSize: 14 },
  retryBtn: {
    backgroundColor: NAVY,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  retryBtnText: { color: "#FFFFFF", fontWeight: "700" },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  previewBox: {
    backgroundColor: "#F7F8FC",
    paddingHorizontal: 14,
    paddingVertical: 12,
    height: 160,
    overflow: "hidden",
    justifyContent: "center",
  },
  previewTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#3A3F55",
    marginBottom: 6,
  },
  previewText: {
    fontSize: 11,
    color: "#6B7086",
    lineHeight: 15,
  },
  watermark: {
    position: "absolute",
    alignSelf: "center",
    top: "40%",
    fontSize: 30,
    fontWeight: "700",
    color: NAVY,
    opacity: 0.1,
    letterSpacing: 4,
    transform: [{ rotate: "-20deg" }],
  },
  cardBody: { padding: 16 },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  quesBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#F6DADE",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  quesBadgeText: { color: "#7A1F2B", fontSize: 12, fontWeight: "600" },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FBEBC7",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  durationBadgeText: { color: "#8A6A0E", fontSize: 12, fontWeight: "600" },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  watchBtn: {
    flex: 1,
    backgroundColor: "#D8E3F7",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
  },
  watchBtnText: { color: NAVY, fontSize: 14, fontWeight: "700" },
  pdfBtn: {
    flex: 1,
    backgroundColor: NAVY,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
  },
  pdfBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
});