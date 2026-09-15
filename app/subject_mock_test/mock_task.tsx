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

// ---- Data array driving the UI ----
const mockAttempts = [
  {
    id: "1",
    title: "Mock Test -1",
    subject: "Civil Procedure Code",
    icon: "🏛️",
    questions: 30,
    hours: 3,
    score: 75,
  },
  {
    id: "2",
    title: "Mock Test -1 (Attempt 2)",
    subject: "Civil Procedure Code",
    icon: "🏛️",
    questions: 30,
    hours: 3,
    score: 75,
  },
  {
    id: "3",
    title: "Mock Test -1 (Attempt 3)",
    subject: "Civil Procedure Code",
    icon: "🏛️",
    questions: 30,
    hours: 3,
    score: 75,
  },
];

// ---- Circular progress ring ----
function ScoreRing({ percentage = 75, size = 64 }: { percentage?: number; size?: number }) {
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (circumference * percentage) / 100;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1A1A1A"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#C9A227"
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
        <View style={styles.ringLabelWrap}>
          <Text style={styles.ringLabel}>{percentage}%</Text>
        </View>
      </View>
    </View>
  );
}

export default function MockTask() {
  const { categoryTitle } = useLocalSearchParams<{ categoryTitle?: string }>();

  // const handleViewResult = (attemptId: string) => {
  //   router.push(`/subject_mock_test/test_results`);
  // };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDEEF5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color="#0A1A3B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {categoryTitle || "AP Civil Procedure Code Mocks"}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {mockAttempts.map((attempt) => (
          <View key={attempt.id} style={styles.card}>
            <Text style={styles.cardTitle}>{attempt.title}</Text>

            <View style={styles.innerBox}>
              <View style={styles.innerLeft}>
                <View style={styles.iconRow}>
                  <Text style={styles.iconEmoji}>{attempt.icon}</Text>
                  <Text style={styles.subjectText}>{attempt.subject}</Text>
                </View>
                <Text style={styles.metaText}>
                  {attempt.questions} Questions | {attempt.hours} Hours
                </Text>
<TouchableOpacity
  style={styles.viewResultBtn}
  onPress={() => router.push("/subject_mock_test/view_result")} 
  activeOpacity={0.8}
>
  <Text style={styles.viewResultText}>View Result</Text>
</TouchableOpacity>
              </View>

              <ScoreRing percentage={attempt.score} />
            </View>
          </View>
        ))}
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
    color: NAVY,
    flexShrink: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 12,
  },
  innerBox: {
    backgroundColor: "#F1E6C9",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  innerLeft: {
    flex: 1,
    paddingRight: 12,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  iconEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  subjectText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111111",
  },
  metaText: {
    fontSize: 12,
    color: "#5A5A5A",
    marginBottom: 12,
  },
  viewResultBtn: {
    backgroundColor: GOLD,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
  },
  viewResultText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  ringLabelWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  ringLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111111",
  },
});