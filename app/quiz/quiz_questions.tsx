import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import Toast from "react-native-toast-message";

interface Question {
  _id: string;
  questionId: string;
  prelimes_test_id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  marks: number;
  summary: string[];
  question_number: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface QuestionsListResponse {
  statusCode: number;
  message: string;
  totalCount: number;
  currentPage: number;
  limit: number;
  totalPages: number;
  data: Question[];
}

const TOTAL_TIME_SECONDS = 3 * 60;

const NAVY = "#0A1A3B";
const GOLD = "#C9A227";
const MAROON = "#7A1F2B";

type QuestionStatus = "answered" | "notAnswered" | "markedForReview" | "unvisited";

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

export default function QuizTest() {
  const { userId, prelimes_test_id, prelimes_id } = useLocalSearchParams<{
    userId?: string;
    prelimes_test_id: string;
    prelimes_id: string;
  }>();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  // answers: questionId -> selected option index
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [reviewMarked, setReviewMarked] = useState<Record<string, boolean>>({});
  const [visited, setVisited] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_SECONDS);
  const [navModalVisible, setNavModalVisible] = useState(false);
  const [summaryModalVisible, setSummaryModalVisible] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  // ---- Fetch questions for this test ----
  const fetchQuestions = async () => {
   
    try {
      setLoading(true);
      const response = await axios.get<QuestionsListResponse>(
        `https://api.raoslawacademy.com/prelimes-tests/getquestionlist?page=1&limit=10&prelimes_test_id=170c9e87-c655-4a88-b215-7753538cd55a`,
       
      );

      if (response.data.statusCode === 200) {
        const sorted = [...response.data.data].sort(
          (a, b) => a.question_number - b.question_number
        );
        setQuestions(sorted);
        if (sorted.length > 0) {
          setVisited({ [sorted[0].questionId]: true });
        }
      } else {
        setError("Couldn't load questions.");
      }
    } catch (err: any) {
      console.log(err?.response?.data || err.message);
      setError("Couldn't load questions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [prelimes_test_id]);

  // ---- Countdown timer ----
  useEffect(() => {
    if (loading || questions.length === 0) return;
    if (timeLeft <= 0) {
      handleFinalSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, loading, questions.length]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const getQuestionStatus = (question: Question): QuestionStatus => {
    if (reviewMarked[question.questionId]) return "markedForReview";
    if (answers[question.questionId] !== undefined) return "answered";
    if (visited[question.questionId]) return "notAnswered";
    return "unvisited";
  };

  const goToQuestion = (index: number) => {
    setCurrentIndex(index);
    setVisited((prev) => ({ ...prev, [questions[index].questionId]: true }));
    setNavModalVisible(false);
  };

  const handleSelectOption = (optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.questionId]: optionIndex }));
  };

  const handleToggleReview = () => {
    setReviewMarked((prev) => ({
      ...prev,
      [currentQuestion.questionId]: !prev[currentQuestion.questionId],
    }));
  };

  const handlePrevious = () => {
    if (currentIndex === 0) return;
    goToQuestion(currentIndex - 1);
  };

  const handleSaveNext = () => {
    if (isLastQuestion) {
      setSummaryModalVisible(true);
      return;
    }
    goToQuestion(currentIndex + 1);
  };

  const handleReport = () => {
    console.log(`Reported question ${currentQuestion.questionId}`);
  };

  const attemptedCount = questions.filter(
    (q) => answers[q.questionId] !== undefined
  ).length;
  const skippedCount = questions.length - attemptedCount;

  const handleFinalSubmit = async () => {
    setSummaryModalVisible(false);
   
   const response= await axios.post("https://api.raoslawacademy.com/prelimes-tests/a8caa633-41e2-401a-834d-72b1daca94cc/submit", {
      
    });
    // console.log(response.data.message+ " checking ")
   
  
  response.data.message || "your test has been submited."

    router.push({
      pathname: "/quiz/quiz_test_result",
      params: { prelimes_test_id, userId },
    });
  };

  // ---- Loading / error / empty states ----
  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centerContent]}>
        <ActivityIndicator size="large" color={NAVY} />
        <Text style={{ marginTop: 12, color: "#111111" }}>Loading questions…</Text>
      </SafeAreaView>
    );
  }

  if (error || questions.length === 0) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centerContent]}>
        <Ionicons name="alert-circle" size={32} color={MAROON} />
        <Text style={{ marginTop: 12, color: "#111111", textAlign: "center", paddingHorizontal: 24 }}>
          {error ?? "No questions found for this test."}
        </Text>
        <TouchableOpacity
          style={[styles.nextBtn, { marginTop: 20, paddingHorizontal: 24 }]}
          onPress={fetchQuestions}
        >
          <Text style={styles.nextBtnText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDEEF5" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Test</Text>
            <Text style={styles.timeLeftText}>
              Total Time Left: <Text style={styles.timeLeftValue}>{formatTime(timeLeft)}</Text>
            </Text>
          </View>
          <TouchableOpacity onPress={() => setNavModalVisible(true)} hitSlop={10}>
            <Ionicons name="menu" size={26} color="#111111" />
          </TouchableOpacity>
        </View>

        {/* Marks + review */}
        <View style={styles.metaRow}>
          <View style={styles.typePill}>
            <Text style={styles.typePillText}>Marks: {currentQuestion.marks}</Text>
          </View>
          <TouchableOpacity style={styles.reviewToggle} onPress={handleToggleReview} activeOpacity={0.7}>
            <Text style={styles.reviewToggleText}>Review</Text>
            <Ionicons
              name={reviewMarked[currentQuestion.questionId] ? "star" : "star-outline"}
              size={18}
              color={reviewMarked[currentQuestion.questionId] ? GOLD : "#111111"}
            />
          </TouchableOpacity>
        </View>

        {/* Question */}
        <View style={styles.questionRow}>
          <View style={styles.questionNumberBox}>
            <Text style={styles.questionNumberText}>{currentQuestion.question_number}</Text>
          </View>
          <Text style={styles.questionLabel}>Question</Text>
        </View>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>

        {/* Options */}
        <View style={styles.optionsWrap}>
          {currentQuestion.options.map((optionText, index) => {
            const selected = answers[currentQuestion.questionId] === index;
            return (
              <TouchableOpacity
                key={`${currentQuestion.questionId}-${index}`}
                style={[styles.optionRow, selected && styles.optionRowSelected]}
                onPress={() => handleSelectOption(index)}
                activeOpacity={0.8}
              >
                <View style={[styles.optionBullet, selected && styles.optionBulletSelected]}>
                  <Text style={[styles.optionBulletText, selected && styles.optionBulletTextSelected]}>
                    {OPTION_LETTERS[index] ?? index + 1}
                  </Text>
                </View>
                <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                  {optionText}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Report */}
        <TouchableOpacity style={styles.reportRow} onPress={handleReport} activeOpacity={0.7}>
          <Ionicons name="alert-circle" size={16} color="#D9534F" />
          <Text style={styles.reportText}>Report</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer nav buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.prevBtn, currentIndex === 0 && styles.prevBtnDisabled]}
          onPress={handlePrevious}
          disabled={currentIndex === 0}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={16} color={NAVY} />
          <Text style={styles.prevBtnText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextBtn} onPress={handleSaveNext} activeOpacity={0.85}>
          <Text style={styles.nextBtnText}>{isLastQuestion ? "Submit Test" : "Save & Next"}</Text>
        </TouchableOpacity>
      </View>

      {/* Question navigator modal */}
      <Modal visible={navModalVisible} transparent animationType="fade" onRequestClose={() => setNavModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.navModalSheet}>
            <View style={styles.navModalHeader}>
              <View>
                <Text style={styles.navModalTitle}>Test</Text>
                <View style={styles.navModalTitleUnderline} />
              </View>
              <TouchableOpacity onPress={() => setNavModalVisible(false)} hitSlop={10}>
                <Ionicons name="close" size={22} color="#111111" />
              </TouchableOpacity>
            </View>

            <View style={styles.questionsCountRow}>
              <Text style={styles.questionsCountText}>Questions: {questions.length}</Text>
              <Ionicons name="information-circle-outline" size={18} color="#111111" />
            </View>

            <View style={styles.numberGrid}>
              {questions.map((q, idx) => {
                const status = getQuestionStatus(q);
                return (
                  <TouchableOpacity
                    key={q.questionId}
                    style={[
                      styles.numberBox,
                      status === "answered" && styles.numberBoxAnswered,
                      status === "notAnswered" && styles.numberBoxNotAnswered,
                      status === "markedForReview" && styles.numberBoxReview,
                      idx === currentIndex && styles.numberBoxCurrent,
                    ]}
                    onPress={() => goToQuestion(idx)}
                  >
                    <Text
                      style={[
                        styles.numberBoxText,
                        (status === "answered" || status === "markedForReview") &&
                          styles.numberBoxTextLight,
                      ]}
                    >
                      {idx + 1}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.legendGrid}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: NAVY }]}>
                  <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                </View>
                <Text style={styles.legendText}>Answered</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: MAROON }]}>
                  <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                </View>
                <Text style={styles.legendText}>Not Answered</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: GOLD }]}>
                  <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                </View>
                <Text style={styles.legendText}>Marked For Review</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.submitFromNavBtn}
              onPress={() => {
                setNavModalVisible(false);
                setSummaryModalVisible(true);
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.submitFromNavBtnText}>Submit Test</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Pre-submit summary modal */}
      <Modal
        visible={summaryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSummaryModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.summaryModalCard}>
            <Text style={styles.summaryTitle}>Test Summary</Text>
            <Text style={styles.summarySubtitle}>Your responses are saved successfully!</Text>

            <View style={styles.summaryTable}>
              <View style={styles.summaryTableHeaderRow}>
                <Text style={[styles.summaryTableCell, styles.summaryTableHeaderText]}>Section</Text>
                <Text style={[styles.summaryTableCell, styles.summaryTableHeaderText]}>Attempted</Text>
                <Text style={[styles.summaryTableCell, styles.summaryTableHeaderText]}>Skipped</Text>
              </View>
              <View style={styles.summaryTableRow}>
                <Text style={styles.summaryTableCell}>Test</Text>
                <Text style={styles.summaryTableCell}>{attemptedCount}</Text>
                <Text style={styles.summaryTableCell}>{skippedCount}</Text>
              </View>
              <View style={styles.summaryTableRow}>
                <Text style={[styles.summaryTableCell, { fontWeight: "700" }]}>Total</Text>
                <Text style={[styles.summaryTableCell, { fontWeight: "700" }]}>{attemptedCount}</Text>
                <Text style={[styles.summaryTableCell, { fontWeight: "700" }]}>{skippedCount}</Text>
              </View>
            </View>

            <View style={styles.warningRow}>
              <Ionicons name="alert-circle" size={16} color={GOLD} />
              <Text style={styles.warningText}>Are you sure want to submit the test?</Text>
            </View>

            <View style={styles.summaryBtnRow}>
              <TouchableOpacity
                style={styles.summaryCancelBtn}
                onPress={() => setSummaryModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.summaryCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.summarySubmitBtn}
                onPress={handleFinalSubmit}
                activeOpacity={0.85}
              >
                <Text style={styles.summarySubmitBtnText}>Submit Test</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#EDEEF5" },
  centerContent: { justifyContent: "center", alignItems: "center", paddingHorizontal: 24 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111111" },
  timeLeftText: { fontSize: 13, color: "#111111", marginTop: 4 },
  timeLeftValue: { color: "#D9534F", fontWeight: "700" },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  typePill: {
    backgroundColor: "#D6DCEE",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  typePillText: { fontSize: 12, color: "#333333", fontWeight: "500" },
  reviewToggle: { flexDirection: "row", alignItems: "center", gap: 4 },
  reviewToggleText: { fontSize: 13, color: "#111111" },
  questionRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  questionNumberBox: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: "#D6DCEE",
    alignItems: "center",
    justifyContent: "center",
  },
  questionNumberText: { fontSize: 14, fontWeight: "700", color: "#111111" },
  questionLabel: { fontSize: 15, fontWeight: "700", color: "#111111" },
  questionText: { fontSize: 16, lineHeight: 24, color: "#111111", marginBottom: 20 },
  optionsWrap: { gap: 12, marginBottom: 24 },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#C7CCDA",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 12,
  },
  optionRowSelected: { backgroundColor: NAVY },
  optionBullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  optionBulletSelected: { backgroundColor: "#FFFFFF" },
  optionBulletText: { fontSize: 13, fontWeight: "700", color: "#111111" },
  optionBulletTextSelected: { color: NAVY },
  optionLabel: { fontSize: 14, color: "#111111", flex: 1 },
  optionLabelSelected: { color: "#FFFFFF", fontWeight: "500" },
  reportRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  reportText: { color: "#D9534F", fontSize: 14, fontWeight: "600" },
  footer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#EDEEF5",
  },
  prevBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#C7CCDA",
    borderRadius: 10,
    paddingVertical: 14,
  },
  prevBtnDisabled: { opacity: 0.6 },
  prevBtnText: { color: NAVY, fontSize: 14, fontWeight: "700" },
  nextBtn: {
    flex: 1,
    backgroundColor: NAVY,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  nextBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },

  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  navModalSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 28,
  },
  navModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  navModalTitle: { fontSize: 16, fontWeight: "700", color: "#111111" },
  navModalTitleUnderline: {
    height: 3,
    width: 60,
    backgroundColor: MAROON,
    marginTop: 6,
    borderRadius: 2,
  },
  questionsCountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  questionsCountText: { fontSize: 14, fontWeight: "700", color: "#111111" },
  numberGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  numberBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#B5B5B5",
    alignItems: "center",
    justifyContent: "center",
  },
  numberBoxAnswered: { backgroundColor: NAVY, borderColor: NAVY },
  numberBoxNotAnswered: { borderColor: MAROON },
  numberBoxReview: { backgroundColor: GOLD, borderColor: GOLD },
  numberBoxCurrent: { borderColor: GOLD, borderWidth: 2 },
  numberBoxText: { fontSize: 14, fontWeight: "700", color: "#111111" },
  numberBoxTextLight: { color: "#FFFFFF" },
  legendGrid: { gap: 12, marginBottom: 20 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  legendDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  legendText: { fontSize: 13, color: "#111111" },
  submitFromNavBtn: {
    backgroundColor: NAVY,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
  },
  submitFromNavBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },

  summaryModalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: "auto",
    marginTop: "auto",
  },
  summaryTitle: { fontSize: 18, fontWeight: "700", color: "#111111", marginBottom: 4 },
  summarySubtitle: { fontSize: 13, color: "#5A5A5A", marginBottom: 16 },
  summaryTable: { borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 10, overflow: "hidden", marginBottom: 16 },
  summaryTableHeaderRow: { flexDirection: "row", backgroundColor: "#F4F4F4", paddingVertical: 10 },
  summaryTableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  summaryTableCell: { flex: 1, textAlign: "center", fontSize: 13, color: "#111111" },
  summaryTableHeaderText: { fontWeight: "700" },
  warningRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FBF3D9",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 18,
  },
  warningText: { fontSize: 13, color: "#7A5C10", flex: 1 },
  summaryBtnRow: { flexDirection: "row", gap: 12 },
  summaryCancelBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: MAROON,
  },
  summaryCancelBtnText: { color: MAROON, fontSize: 14, fontWeight: "700" },
  summarySubmitBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: MAROON,
  },
  summarySubmitBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
});