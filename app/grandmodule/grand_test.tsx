import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";

interface TestData {
  _id: string;
  prelimes_test_id: string;
  prelimes_id: string;
  test_type: string;
  test_number: string;
  title: string;
  no_of_qos: string;
  duration: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  attempts_count: number;
}

interface TestsListResponse {
  statusCode: number;
  message: string;
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  data: TestData[];
}

const NAVY = "#0A1A3B";
const NAVY_LIGHT = "#23408E";
const GOLD = "#D8AE24";
const GOLD_DARK = "#C9A227";
const MAROON = "#7A1F2B";
const BG = "#EEF1FB";

const BASE_URL = "https://api.raoslawacademy.com";
// Fallback only for local/dev testing when no userId param is passed in.
// TODO: remove once every navigation to this screen passes a real userId.
const FALLBACK_USER_ID = "4237c5bb-30d1-495a-96f8-d70ba48ec110";

const SUBJECT_ICONS: {
  name: keyof typeof Ionicons.glyphMap;
  bg: string;
  style: any;
}[] = [
  { name: "school", bg: "#D64550", style: { top: 0, left: "50%", marginLeft: -26 } },
  { name: "laptop-outline", bg: NAVY, style: { top: 40, right: 8 } },
  { name: "library-outline", bg: "#E8930C", style: { bottom: 10, right: 20 } },
  { name: "business-outline", bg: "#2C8CC9", style: { bottom: 10, left: 20 } },
  { name: "radio-button-on-outline", bg: MAROON, style: { top: 40, left: 8 } },
];

export default function GrandTest() {
  const { userId } = useLocalSearchParams<{ userId?: string }>();
  const activeUserId = userId ?? FALLBACK_USER_ID;

  const [tests, setTests] = useState<TestData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [noResultsVisible, setNoResultsVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchGrandTests = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get<TestsListResponse>(
          `${BASE_URL}/prelimes-tests`,
          {
            params: {
              page: 1,
              limit: 10,
              test_type: "GT",
              userId: activeUserId,
            },
          }
        );

        if (response.data?.statusCode === 200 && !cancelled) {
          setTests(response.data.data);
        }
      } catch (err: any) {
        console.log("Grand Test API Error:", err?.response?.data || err.message);
        if (!cancelled) {
          setError(err?.response?.data?.message || "Failed to load Grand Test");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchGrandTests();

    return () => {
      cancelled = true;
    };
  }, [activeUserId]);

  // Use the first available test to drive the summary card.
  const primaryTest = tests[0];
  const totalQuestions = primaryTest?.no_of_qos ?? "200";
  const timeLimitMins = primaryTest?.duration ?? "150";
  const hasAttempts = tests.some((t) => t.attempts_count > 0);

  const handleResults = () => {
    if (!hasAttempts) {
      setNoResultsVisible(true);
      return;
    }
    // Change this to the real results/history route once available
    router.push("/mock-test/GrandTestResults" as any);
  };

  const handleStartTest = () => {
    if (!primaryTest) return;
    router.push({
      pathname: "/grandmodule/grand_instructions" as any,
      params: {
        prelimes_test_id: primaryTest.prelimes_test_id,
        prelimes_id: primaryTest.prelimes_id,
        userId: userId??""
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Grand Test Information</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Illustration cluster */}
        <View style={styles.illustrationWrap}>
          <View style={styles.dashedCircle} />

          {SUBJECT_ICONS.map((icon, idx) => (
            <View
              key={idx}
              style={[
                styles.subjectIconCircle,
                { backgroundColor: icon.bg },
                icon.style,
              ]}
            >
              <Ionicons name={icon.name} size={22} color="#fff" />
            </View>
          ))}

          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={64} color={NAVY} />
            <View style={styles.capBadge}>
              <Ionicons name="school" size={26} color={NAVY} />
            </View>
          </View>
        </View>

        {/* Info card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>All Subjects One Challenge</Text>

          {loading ? (
            <ActivityIndicator size="small" color={NAVY} style={{ marginVertical: 8 }} />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Total Questions :</Text>
                <Text style={styles.infoValue}>{totalQuestions}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Time Limit :</Text>
                <Text style={styles.infoValue}>{timeLimitMins} Mins</Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Bottom action buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.resultsBtn}
          onPress={handleResults}
          activeOpacity={0.85}
        >
          <Text style={styles.resultsBtnText}>Results</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.startBtn, !primaryTest && styles.startBtnDisabled]}
          onPress={handleStartTest}
          activeOpacity={0.85}
          disabled={!primaryTest || loading}
        >
          <Text style={styles.startBtnText}>Start Test</Text>
        </TouchableOpacity>
      </View>

      {/* Shown if there are no previous grand-test results yet */}
      <Modal visible={noResultsVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Ionicons name="document-text-outline" size={40} color={NAVY_LIGHT} />
            <Text style={styles.modalTitle}>No Results Yet</Text>
            <Text style={styles.modalText}>
              Attempt the Grand Test to see your performance here.
            </Text>
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => setNoResultsVisible(false)}
            >
              <Text style={styles.modalBtnText}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  illustrationWrap: {
    width: 260,
    height: 260,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  dashedCircle: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: "#B9C0D6",
    borderStyle: "dashed",
  },
  subjectIconCircle: {
    position: "absolute",
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  avatarCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#F3D9C4",
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },
  capBadge: {
    position: "absolute",
    top: -6,
    width: 60,
    height: 30,
    borderRadius: 15,
    backgroundColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
  },
  infoCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: NAVY_LIGHT,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 24,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3A3A3A",
  },
  errorText: {
    fontSize: 13,
    color: "#B00020",
    textAlign: "center",
    marginVertical: 8,
  },
  bottomBar: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    gap: 14,
  },
  resultsBtn: {
    flex: 1,
    backgroundColor: GOLD_DARK,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  resultsBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  startBtn: {
    flex: 1,
    backgroundColor: NAVY,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  startBtnDisabled: {
    opacity: 0.5,
  },
  startBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 10,
  },
  modalText: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 16,
  },
  modalBtn: {
    backgroundColor: NAVY,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 28,
  },
  modalBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});