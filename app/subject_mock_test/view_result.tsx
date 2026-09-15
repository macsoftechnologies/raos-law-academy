import React from "react";
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
import Svg, { Circle } from "react-native-svg";
import { router, useLocalSearchParams } from "expo-router";

// ---- Result data (swap with API response later) ----
const resultData = {
  examType: "Mock Test-1",
  subject: "Civil Laws",
  dateOfSubmission: "Nov 14, 2025",
  dateOfEvaluation: "Nov 27, 2025",
  marksSecured: 50,
  totalMarks: 100,
  overallPercentage: 50,
  performanceTag: "Average",
  teacherFeedback:
    "You have shown strong conceptual understanding in Property and Contract Law. However, answers can be structured better with proper case law citations and section references. Please focus on time management and clarity in handwriting for upcoming tests.",
  strengths: [
    "Strong knowledge of core civil law principles",
    "Clear reasoning and explanation",
  ],
  areasToImprove: ["Case law referencing", "Presentation & structure of long answers"],
  nextChallenge: "Master in Civil Laws",
  evaluator: "Prof. Ramesh",
  nextGoal: "Aim for 90+ Marks in test-2",
};

// ---- Circular progress ring (reusable, color configurable) ----
function ProgressRing({
  value,
  max,
  label,
  color,
  size = 96,
}: {
  value: number;
  max: number;
  label: string;
  color: string;
  size?: number;
}) {
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(value / max, 1);
  const progress = circumference - circumference * percentage;

  return (
    <View style={styles.ringOuter}>
      <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E7E7E7"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        <View style={StyleSheet.absoluteFill}>
          <View style={styles.ringCenter}>
            <Text style={styles.ringValue}>
              {value}/{max}
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.ringLabel}>{label}</Text>
    </View>
  );
}

export default function ViewResult() {
  const { attemptId } = useLocalSearchParams<{ attemptId?: string }>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDEEF5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color="#0A1A3B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {resultData.examType} Results
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Exam type / Subject pills */}
        <View style={styles.pillRow}>
          <View style={[styles.pill, styles.pillMaroon]}>
            <Text style={styles.pillTextMaroon}>Exam Type: {resultData.examType}</Text>
          </View>
          <View style={[styles.pill, styles.pillGold]}>
            <Text style={styles.pillTextGold}>Subject: {resultData.subject}</Text>
          </View>
        </View>

        {/* Date cards */}
        <View style={styles.dateRow}>
          <View style={styles.dateCard}>
            <View style={styles.dateIconWrap}>
              <Ionicons name="calendar" size={16} color="#0A1A3B" />
            </View>
            <Text style={styles.dateLabel}>Date of Submission:</Text>
            <Text style={styles.dateValue}>{resultData.dateOfSubmission}</Text>
          </View>
          <View style={styles.dateCard}>
            <View style={styles.dateIconWrap}>
              <Ionicons name="calendar" size={16} color="#0A1A3B" />
            </View>
            <Text style={styles.dateLabel}>Date of Evaluation:</Text>
            <Text style={styles.dateValue}>{resultData.dateOfEvaluation}</Text>
          </View>
        </View>

        {/* Performance overview */}
        <View style={styles.performanceCard}>
          <Text style={styles.performanceTitle}>Performance overview</Text>

          <View style={styles.ringsRow}>
            <ProgressRing
              value={resultData.marksSecured}
              max={resultData.totalMarks}
              label="Marks Secured"
              color="#2FBF9F"
            />
            <ProgressRing
              value={resultData.overallPercentage}
              max={100}
              label="Overall Percentage"
              color="#A83C9E"
            />
          </View>

          <View style={styles.tagBtn}>
            <Text style={styles.tagBtnText}>{resultData.performanceTag}</Text>
          </View>
        </View>

        {/* Teacher's feedback */}
        <View style={styles.feedbackCard}>
          <Text style={styles.feedbackTitle}>Teacher's Feedback:</Text>
          <Text style={styles.feedbackText}>“{resultData.teacherFeedback}”</Text>
        </View>

        {/* Strengths / Areas to improve */}
        <View style={styles.twoColRow}>
          <View style={styles.strengthsCard}>
            <View style={styles.strengthsHeader}>
              <Text style={styles.strengthsHeaderText}>Strengths</Text>
            </View>
            <View style={styles.listBody}>
              {resultData.strengths.map((item, idx) => (
                <View key={idx} style={styles.listRow}>
                  <Ionicons name="checkmark" size={14} color="#7A1F2B" />
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.improveCard}>
            <View style={styles.improveHeader}>
              <Text style={styles.improveHeaderText}>Areas to improve</Text>
            </View>
            <View style={styles.listBody}>
              {resultData.areasToImprove.map((item, idx) => (
                <View key={idx} style={styles.listRow}>
                  <Ionicons name="warning" size={14} color="#C9A227" />
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Next challenge banner */}
        <View style={styles.nextChallengeBanner}>
          <Text style={styles.trophyEmoji}>🏆</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.nextChallengeTitle}>
              Next Challenge: {resultData.nextChallenge}
            </Text>
            <Text style={styles.nextChallengeSub}>Evaluated by: {resultData.evaluator}</Text>
          </View>
        </View>

        <Text style={styles.nextGoalText}>{resultData.nextGoal}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const NAVY = "#0A1A3B";
const GOLD = "#C9A227";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EDEEF5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  backBtn: {
    padding: 6,
    marginRight: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111111",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  pillRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  pill: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  pillMaroon: {
    backgroundColor: "#D9B8B8",
  },
  pillGold: {
    backgroundColor: "#E9D9A8",
  },
  pillTextMaroon: {
    color: "#5A1F1F",
    fontSize: 12,
    fontWeight: "700",
  },
  pillTextGold: {
    color: "#7A5C10",
    fontSize: 12,
    fontWeight: "700",
  },
  dateRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  dateCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
  },
  dateIconWrap: {
    alignSelf: "flex-end",
    marginBottom: -18,
  },
  dateLabel: {
    fontSize: 12,
    color: "#5A5A5A",
    marginTop: 8,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111111",
    marginTop: 2,
  },
  performanceCard: {
    backgroundColor: NAVY,
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  performanceTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 16,
  },
  ringsRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 20,
  },
  ringOuter: {
    alignItems: "center",
  },
  ringCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  ringValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111111",
  },
  ringLabel: {
    marginTop: 8,
    fontSize: 11,
    color: "#FFFFFF",
    textAlign: "center",
    maxWidth: 100,
  },
  tagBtn: {
    backgroundColor: GOLD,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 28,
  },
  tagBtnText: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "700",
  },
  feedbackCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  feedbackTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 8,
  },
  feedbackText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#333333",
  },
  twoColRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  strengthsCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#7A1F2B33",
    overflow: "hidden",
  },
  strengthsHeader: {
    backgroundColor: "#7A1F2B",
    paddingVertical: 10,
    alignItems: "center",
  },
  strengthsHeaderText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  improveCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#C9A22733",
    overflow: "hidden",
  },
  improveHeader: {
    backgroundColor: GOLD,
    paddingVertical: 10,
    alignItems: "center",
  },
  improveHeaderText: {
    color: "#111111",
    fontSize: 13,
    fontWeight: "700",
  },
  listBody: {
    padding: 12,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginBottom: 8,
  },
  listText: {
    flex: 1,
    fontSize: 12,
    color: "#333333",
    lineHeight: 17,
  },
  nextChallengeBanner: {
    backgroundColor: NAVY,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  trophyEmoji: {
    fontSize: 22,
  },
  nextChallengeTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  nextChallengeSub: {
    color: "#D9D9D9",
    fontSize: 12,
    marginTop: 2,
  },
  nextGoalText: {
    textAlign: "center",
    fontSize: 12,
    color: "#5A5A5A",
    marginTop: 4,
  },
});