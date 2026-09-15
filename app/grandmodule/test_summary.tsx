import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";

// ===== Test Attempts API Response Types =====

export interface Option {
  selectedAnswer: number;
  isCorrect: boolean;
  _id: string;
  questionId?: string; // present on some answer entries, not all
}

export interface QuestionSummary {
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
}

export interface TestInfo {
  _id: string;
  prelimes_test_id: string;
  prelimes_id: string;
  test_type: string;
  test_number: string;
  title: string;
  no_of_qos: string;
  duration: string;
  mocktest_subject_id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttemptResult {
  _id: string;
  userId: string;
  testId: string;
  attemptId: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  skipped: number;
  score: number;
  percentage: number;
  accuracy: number;
  timeSpent: number;
  totalTime: number;
  prelimes_result_id: string;
  createdAt: string;
  updatedAt: string;
  percentile: number;
  rank: number;
  totalParticipants: number;
}

export interface TestAttempt {
  _id: string;
  userId: string;
  testId: string;
  answers: Option[];
  startedAt: string;
  submittedAt?: string; // absent on abandoned/incomplete attempts
  attemptNumber: number;
  prelimes_attempt_id: string;
  testInfo: TestInfo;
  questions: QuestionSummary[];
  result?: AttemptResult; // absent on abandoned/incomplete attempts
}

export interface TestAttemptsResponse {
  statusCode: number;
  message: string;
  data: TestAttempt[];
}

const API_BASE = "https://api.raoslawacademy.com";
const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

interface OptionData {
  id: string;
  text: string;
}

interface QuestionReviewProps {
  subjectTitle: string;
  timeTaken: string;
  questionNumber: number;
  questionText: string;
  options: OptionData[];
  correctOptionId: string;
  selectedOptionId: string;
  explanation: string;
  onBack?: () => void;
  onReport?: () => void;
  onTestSummary?: () => void;
}

function QuestionReview({
  subjectTitle,
  timeTaken,
  questionNumber,
  questionText,
  options,
  correctOptionId,
  selectedOptionId,
  explanation,
  onBack,
  onReport,
  onTestSummary,
}: QuestionReviewProps) {
  const isCorrect = selectedOptionId === correctOptionId;

  const getOptionStyle = (optionId: string) => {
    if (optionId === correctOptionId) return [styles.optionButton, styles.optionCorrect];
    if (optionId === selectedOptionId && !isCorrect) return [styles.optionButton, styles.optionWrong];
    return [styles.optionButton, styles.optionDefault];
  };

  const isHighlighted = (optionId: string) =>
    optionId === correctOptionId || (optionId === selectedOptionId && !isCorrect);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDEEF5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color="#0A1A3B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{subjectTitle}</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Time chip */}
        <View style={styles.timeChip}>
          <Text style={styles.timeChipText}>You : {timeTaken}</Text>
        </View>

        {/* Question */}
        <View style={styles.questionRow}>
          <View style={styles.questionNumberBadge}>
            <Text style={styles.questionNumberText}>{questionNumber}</Text>
          </View>
          <Text style={styles.questionLabel}>Question</Text>
        </View>
        <Text style={styles.questionText}>{questionText}</Text>

        {/* Options */}
        {options.map((option) => (
          <View key={option.id} style={getOptionStyle(option.id)}>
            <View
              style={[
                styles.optionCircle,
                isHighlighted(option.id) && styles.optionCircleSelected,
              ]}
            >
              <Text
                style={[
                  styles.optionCircleTextDefault,
                  isHighlighted(option.id) && styles.optionCircleTextSelected,
                ]}
              >
                {option.id}
              </Text>
            </View>
            <Text
              style={[
                styles.optionText,
                isHighlighted(option.id) ? styles.optionTextSelected : styles.optionTextDefault,
              ]}
            >
              {option.text}
            </Text>
          </View>
        ))}

        {/* Result */}
        <View style={styles.resultRow}>
          <Ionicons
            name={isCorrect ? "checkmark" : "close"}
            size={18}
            color={isCorrect ? "#23408E" : "#7A1F2B"}
          />
          <Text
            style={[
              styles.resultText,
              { color: isCorrect ? "#23408E" : "#7A1F2B" },
            ]}
          >
            {isCorrect ? "Correct" : "Incorrect"}
          </Text>
        </View>

        {/* Explanation */}
        <Text style={styles.explanationText}>{explanation}</Text>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.reportButton} onPress={onReport}>
          <Ionicons name="alert-circle-outline" size={18} color="#B3261E" />
          <Text style={styles.reportButtonText}>Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.summaryButton} onPress={onTestSummary}>
          <Text style={styles.summaryButtonText}>Test Summary</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function mapQuestionToProps(
  question: QuestionSummary,
  selectedIndex: number | undefined
): {
  questionNumber: number;
  questionText: string;
  options: OptionData[];
  correctOptionId: string;
  selectedOptionId: string;
  explanation: string;
} {
  const options: OptionData[] = question.options.map((text, index) => ({
    id: OPTION_LETTERS[index],
    text,
  }));

  return {
    questionNumber: question.question_number,
    questionText: question.question,
    options,
    correctOptionId: OPTION_LETTERS[question.correctAnswer],
    selectedOptionId:
      selectedIndex !== undefined ? OPTION_LETTERS[selectedIndex] : "",
    explanation: question.summary.join("\n\n"),
  };
}

export default function TestSummaryScreen() {
  const { userId, prelimes_test_id, prelimes_id } = useLocalSearchParams<{
    userId?: string;
    prelimes_test_id?: string;
    prelimes_id?: string;
  }>();

  const [attempt, setAttempt] = useState<TestAttempt | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTestSummary();
  }, [userId, prelimes_test_id, prelimes_id]);

  const fetchTestSummary = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post<TestAttemptsResponse>(
        `https://api.raoslawacademy.com/prelimes-tests/user_attempts`,
        {  "testId": "0c7a889d-e09b-48e5-874f-183081fa91b8",
    "userId": "9325e7d0-b08f-4e7c-9d8d-7d4adadf101d"}
      );

      const attempts = response.data.data;
  

      setAttempt(attempts[0]);
      setQuestionIndex(0);
    } catch (err) {
      setError("Could not load test summary. Please try again.");
      setAttempt(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => router.back();

  const handleReport = () => {
    console.log("Report pressed for question index", questionIndex);
  };

  const handleTestSummary = () => {
    if (!attempt) return;
    if (questionIndex < attempt.questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      router.back();
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#23408E" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !attempt) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={{ color: "#7A1F2B" }}>
            {error ?? "Could not load test summary."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const question = attempt.questions[questionIndex];
  const answer = attempt.answers[questionIndex];
  const timeTaken = attempt.result
    ? `${Math.round(attempt.result.timeSpent)}s`
    : "00:00";

  const questionProps = mapQuestionToProps(question, answer?.selectedAnswer);

  return (
    <QuestionReview
      {...questionProps}
      subjectTitle={attempt.testInfo.title}
      timeTaken={timeTaken}
      onBack={handleBack}
      onReport={handleReport}
      onTestSummary={handleTestSummary}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#EDEEF5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0A1A3B",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  timeChip: {
    alignSelf: "flex-start",
    backgroundColor: "#DADCE8",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 16,
  },
  timeChipText: {
    fontSize: 12,
    color: "#3A3F55",
    fontWeight: "500",
  },
  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  questionNumberBadge: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: "#DADCE8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  questionNumberText: {
    fontWeight: "700",
    color: "#0A1A3B",
    fontSize: 14,
  },
  questionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0A1A3B",
  },
  questionText: {
    fontSize: 17,
    color: "#1A1D2E",
    lineHeight: 24,
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  optionDefault: {
    backgroundColor: "#C7CBDE",
  },
  optionCorrect: {
    backgroundColor: "#23408E",
  },
  optionWrong: {
    backgroundColor: "#7A1F2B",
  },
  optionCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    backgroundColor: "#FFFFFF",
  },
  optionCircleSelected: {
    backgroundColor: "#FFFFFF",
  },
  optionCircleTextDefault: {
    color: "#0A1A3B",
    fontWeight: "700",
    fontSize: 13,
  },
  optionCircleTextSelected: {
    color: "#23408E",
    fontWeight: "700",
    fontSize: 13,
  },
  optionText: {
    fontSize: 15,
    fontWeight: "500",
  },
  optionTextDefault: {
    color: "#0A1A3B",
  },
  optionTextSelected: {
    color: "#FFFFFF",
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#23408E",
    alignSelf: "flex-start",
    paddingBottom: 6,
  },
  resultText: {
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 4,
  },
  explanationText: {
    fontSize: 14.5,
    color: "#2A2D3E",
    lineHeight: 22,
    paddingBottom: 24,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  reportButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#B3261E",
    borderRadius: 12,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
  },
  reportButtonText: {
    color: "#B3261E",
    fontWeight: "700",
    fontSize: 15,
    marginLeft: 6,
  },
  summaryButton: {
    flex: 1.4,
    backgroundColor: "#0A1A3B",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
});