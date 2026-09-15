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

export interface MainsSubjectTest {
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

export interface MainsSubjectTestListResponse {
  statusCode: number;
  message: string;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  data: MainsSubjectTest[];
}

// ---------- View model the card actually renders ----------
interface TestItem {
  id: string;
  subjectTestId: string;
  title: string;
  totalQuestions: number;
  totalSubjects: number;
  duration: string;
  marks: number;
  questionPaperFile: string;
}

const NAVY = "#0A1A3B";
const API_BASE = "https://api.raoslawacademy.com";

// ---------- Mapper: raw API item -> TestItem the UI consumes ----------
function mapToTestItem(item: MainsSubjectTest): TestItem {
  const parentTest = item.mains_test_id?.[0];
  return {
    id: item._id,
    subjectTestId: item.mains_subject_test_id,
    title: item.title,
    totalQuestions: Number(item.no_of_qos) || 0,
    totalSubjects: Number(parentTest?.no_of_subjects) || 0,
    duration: item.duration,
    marks: item.marks,
    questionPaperFile: item.question_paper_file,
  };
}

export default function MainsTestSeriesScreen() {
  const { mains_id, mains_test_id } = useLocalSearchParams<{
    mains_id?: string;
    mains_test_id?: string;
  }>();

  const [tests, setTests] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTests = useCallback(async () => {
    try {
      setError(null);
      const params = new URLSearchParams({ page: "1", limit: "10" });
      if (mains_test_id) params.append("mains_test_id", mains_test_id);

      const res = await fetch(
        `https://api.raoslawacademy.com/mains/mainssubjecttests?page=1&limit=10&mains_test_id`
      );

      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

      const json: MainsSubjectTestListResponse = await res.json();

      if (json.statusCode !== 200) {
        throw new Error(json.message || "Failed to load tests");
      }

      setTests(json.data.map(mapToTestItem));
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [mains_test_id]);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTests();
  };

 const handleOpen = (item: TestItem) => {
  router.push({
    pathname: "mains/test_series/test_buy",
    params: {
      mains_test_id: item.subjectTestId,
      mains_id,
      title: item.title,
      total_questions: String(item.totalQuestions),
      total_subjects: String(item.totalSubjects),
      duration: item.duration,
      marks: String(item.marks),
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
        <Text style={styles.headerTitle}>
          AP JCJ Mains Preparation{"\n"}Mains Test Series
        </Text>
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={NAVY} />
        </View>
      ) : error ? (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchTests}>
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
          {tests.length === 0 ? (
            <View style={styles.centerBox}>
              <Text style={styles.emptyText}>No tests available yet.</Text>
            </View>
          ) : (
            tests.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.previewBox}>
                  <Text style={styles.previewTitle}>{item.title}</Text>
                  <Text style={styles.previewText}>
                    Duration: {item.duration} • Marks: {item.marks}
                  </Text>
                  <Text style={styles.watermark}>PDF</Text>
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
                    <View style={styles.subjectsBadge}>
                      <Ionicons
                        name="reader-outline"
                        size={13}
                        color="#8A6A0E"
                      />
                      <Text style={styles.subjectsBadgeText}>
                        {item.totalSubjects} Subjects
                      </Text>
                    </View>
                    <View style={styles.durationBadge}>
                      <Ionicons
                        name="time-outline"
                        size={13}
                        color="#23408E"
                      />
                      <Text style={styles.durationBadgeText}>
                        {item.duration}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.openBtn}
                    onPress={() => handleOpen(item)}
                  >
                    <Text style={styles.openBtnText}>Open</Text>
                  </TouchableOpacity>
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
    alignItems: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 14,
    paddingTop: 20,
  },
  backBtn: { padding: 10, marginRight: 4, marginTop: 2 },
  headerTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#111111",
    flex: 1,
    flexShrink: 1,
    lineHeight: 25,
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
    flexWrap: "wrap",
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
  subjectsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FBEBC7",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  subjectsBadgeText: { color: "#8A6A0E", fontSize: 12, fontWeight: "600" },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#DCE3F5",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  durationBadgeText: { color: "#23408E", fontSize: 12, fontWeight: "600" },
  openBtn: {
    backgroundColor: NAVY,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
  },
  openBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});