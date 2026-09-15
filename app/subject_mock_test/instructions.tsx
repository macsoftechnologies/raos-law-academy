import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { Toast } from "react-native-toast-message/lib/src/Toast";

interface AttemptData {
  userId: string;
  testId: string;
  answers: any[];
  startedAt: string;
  attemptNumber: number;
  _id: string;
  prelimes_attempt_id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface StartAttemptResponse {
  statusCode: number;
  message: string;
  data: AttemptData;
}

const quizData = {
  title: "Civil Procedure code Quizz",
  totalQuestions: 10,
  totalMarks: 10,
  duration: "5 mins",
};

const instructions = [
  "You have 05 Minutes to complete the test.",
  "The test contains a total of 10 Questions for 10 Marks.",
  "There is only one correct answer to each question. Click on the most appropriate option to mark it as your answer.",
  "There is 1/4 penalty for each wrong answer.",
  "You can change your answer by clicking on some other option.",
  'You can unmark your answer by clicking on the "Clear Response" button.',
  "A Number list of all questions appears at the right-hand side of the screen. You can access the questions in any order within a section or across sections by clicking on the question number given on the number list.",
  "You can use rough sheets while taking the test. Do not use calculators, log tables, dictionaries, or any other printed/online reference material during the test.",
  'Do not click the "Submit test" button before completing the test. A test once submitted cannot be resumed.',
];

const NAVY = "#0A1A3B";

export default function Instructions() {
  const { mocktest_subject_id } = useLocalSearchParams<{ mocktest_subject_id?: string; }>();
  const { userId } = useLocalSearchParams<{ userId: string; }>();
  const { lawId } = useLocalSearchParams<{ lawId: string; }>();
  const { prelimsId, prelimes_test_id } = useLocalSearchParams<{ prelimsId: string; prelimes_test_id: string; }>();

  const [startAttemptResponse, setStartAttemptResponse] = useState<StartAttemptResponse | null>(null);
  const [starting, setStarting] = useState(false);

  console.log("received mocktest_subject_id:", mocktest_subject_id);
  console.log("received userId:", userId);
  console.log("received lawId:", lawId);
  console.log("received prelimsId:", prelimsId);
  console.log("received prelimes_test_id:", prelimes_test_id);

  const handleStartTest = async () => {
    setStarting(true);
    try {
      const response = await axios.post(
        "https://api.raoslawacademy.com/prelimes-tests/start_attempt",
        {
          userId: userId,
          testId: prelimes_test_id,
        }
      );

      if (response.data.statusCode === 200) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: response.data.message || "Your test has been started.",
        });

        setStartAttemptResponse(response.data.data);
        console.log("Start Attempt Response:", response.data.data);

        router.push({
          pathname: "/subject_mock_test/test_performance",
          params: {
            mocktest_subject_id: mocktest_subject_id,
            userId: userId,
            lawId: lawId,
            prelimsId: prelimsId,
            prelimes_test_id: prelimes_test_id,
            prelimes_attempt_id: response.data.data.prelimes_attempt_id,
          },
        } as any);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: response.data.message || "Couldn't start the test.",
        });
      }
    } catch (error: any) {
      console.error("Error starting test attempt:", error?.response?.data || error.message);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Couldn't start the test. Please try again.",
      });
    } finally {
      setStarting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDEEF5" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#111111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Instructions</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.quizTitle}>{quizData.title}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Text style={styles.statValue}>{quizData.totalQuestions}</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statValue}>{quizData.totalMarks}</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statValue}>{quizData.duration}</Text>
          </View>
        </View>
        <View style={styles.statsLabelRow}>
          <Text style={styles.statLabel}>Total Questions</Text>
          <Text style={styles.statLabel}>Total Marks</Text>
          <Text style={styles.statLabel}>Duration</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.instructionsHeading}>
          Please read the following instruction very carefully
        </Text>

        {instructions.map((item, idx) => (
          <View key={idx} style={styles.instructionRow}>
            <Text style={styles.instructionNumber}>{idx + 1}.</Text>
            <Text style={styles.instructionText}>{item}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startBtn}
          onPress={handleStartTest}
          activeOpacity={0.85}
          disabled={starting}
        >
          <Text style={styles.startBtnText}>
            {starting ? "Starting..." : "Start Test"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#EDEEF5" },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 14, paddingTop: 34 },
  backBtn: { padding: 22, marginRight: 8 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#111111" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 24 },
  quizTitle: { fontSize: 20, fontWeight: "700", color: "#111111", marginTop: 4, marginBottom: 16 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 6 },
  statPill: { flex: 1, backgroundColor: "#C7CCDA", borderRadius: 10, paddingVertical: 14, alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "700", color: "#111111" },
  statsLabelRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  statLabel: { flex: 1, textAlign: "center", fontSize: 12, color: "#5A5A5A" },
  divider: { height: 1, backgroundColor: "#D3D3D3", marginBottom: 16 },
  instructionsHeading: { fontSize: 15, fontWeight: "700", color: "#111111", marginBottom: 14 },
  instructionRow: { flexDirection: "row", marginBottom: 14 },
  instructionNumber: { fontSize: 14, color: "#111111", marginRight: 6, fontWeight: "500" },
  instructionText: { flex: 1, fontSize: 14, lineHeight: 21, color: "#111111" },
  footer: { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: "#EDEEF5" },
  startBtn: { backgroundColor: NAVY, borderRadius: 10, paddingVertical: 15, alignItems: "center" },
  startBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});