import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import Svg, { Circle } from "react-native-svg";

type SubjectProgress = {
  id: string;
  label: string;
  percent: number;
  color: string;
  route: string;
};

const SUBJECT_PROGRESS: SubjectProgress[] = [
  {
    id: "jcj",
    label: "JCJ full course",
    percent: 50,
    color: "#23408E",
    route: "/sidepanel/courses/jcj",
  },
  {
    id: "prelims",
    label: "Prelims prepa",
    percent: 40,
    color: "#D8AE24",
    route: "/sidepanel/courses/prelims",
  },
  {
    id: "mains",
    label: "Mains prepa",
    percent: 70,
    color: "#7A1F2B",
    route: "/sidepanel/courses/mains",
  },
];

const RING_SIZE = 84;
const RING_STROKE = 8;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function ScoreRing({ score, max = 100 }: { score: number; max?: number }) {
  const progress = Math.min(score / max, 1);
  const dashOffset = RING_CIRCUMFERENCE * (1 - progress);

  return (
    <View style={styles.ringWrap}>
      <Svg width={RING_SIZE} height={RING_SIZE}>
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          stroke="#3A5AA8"
          strokeWidth={RING_STROKE}
          fill="none"
        />
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          stroke="#D8AE24"
          strokeWidth={RING_STROKE}
          fill="none"
          strokeDasharray={`${RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
        />
      </Svg>
      <View style={styles.ringLabelWrap}>
        <Text style={styles.ringLabel}>{score}</Text>
      </View>
    </View>
  );
}

export default function StdDashboard() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDEEF5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={26} color="#0A1A3B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Overall Score */}
        <View style={styles.scoreCard}>
          <ScoreRing score={56} />

          <View style={styles.scoreInfo}>
            <Text style={styles.scoreTitle}>Overall Score</Text>
            <Text style={styles.scoreSubtitle}>
              Next Challenge:{"\n"}Unlock your best!
            </Text>

            <TouchableOpacity
              style={styles.startButton}
              activeOpacity={0.85}
              onPress={() => router.push("/sidepanel/my_courses/std_start")}
            >
              <Text style={styles.startButtonText}>Start Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Course Overview + Goal Tracker */}
        <View style={styles.rowCards}>
          <TouchableOpacity
            style={[styles.infoCard, styles.courseCard]}
            activeOpacity={0.85}
            onPress={() => router.push("/sidepanel/my_courses/std_start")}
          >
            <Text style={styles.courseCardTitle}>Course Overview</Text>

            <View style={styles.shieldWrap}>
              <MaterialCommunityIcons
                name="shield-check"
                size={54}
                color="#1D4ED8"
              />
            </View>

            <Text style={styles.courseCourseName}>JCJ Full Course</Text>
            <Text style={styles.courseCardLine}>Joined on: 30/12/2023</Text>
            <Text style={styles.courseCardLine}>Subject Completed: 12/21</Text>
            <Text style={styles.courseCardLine}>Last Activity: 10 Hours ago</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.infoCard, styles.goalCard]}
            activeOpacity={0.85}
            onPress={() => router.push("/sidepanel/my_courses/std_start")}
          >
            <Text style={styles.goalCardTitle}>Goal Tracker</Text>

            <View style={styles.targetWrap}>
              <MaterialCommunityIcons
                name="target"
                size={54}
                color="#E5E7EB"
              />
              <MaterialCommunityIcons
                name="arrow-top-right"
                size={26}
                color="#D8AE24"
                style={styles.targetArrow}
              />
            </View>

            <Text style={styles.goalCardLine}>Today's Goal:</Text>
            <Text style={styles.goalCardLine}>2Hrs Stud + 20MCQ's</Text>
            <Text style={styles.goalCardLine}>Progress: 1Hr 15 mins done**</Text>
          </TouchableOpacity>
        </View>

        {/* Subject Progress */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Subject Progress</Text>

          {SUBJECT_PROGRESS.map((item) => (
            <View key={item.id} style={styles.progressRow}>
              <Text style={styles.progressLabel}>{item.label}</Text>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${item.percent}%`, backgroundColor: item.color },
                  ]}
                />
              </View>

              <Text style={styles.progressPercent}>{item.percent}%</Text>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push("/sidepanel/my_courses/std_start")}
              >
                <Feather name="external-link" size={16} color="#374151" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
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
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 12,
    gap: 8,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0A1A3B",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  scoreCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0A1A3B",
    borderRadius: 18,
    padding: 18,
    gap: 16,
    marginBottom: 16,
  },
  ringWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  ringLabelWrap: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  ringLabel: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  scoreInfo: {
    flex: 1,
  },
  scoreTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  scoreSubtitle: {
    fontSize: 13,
    color: "#D6DCF0",
    lineHeight: 18,
    marginBottom: 12,
  },
  startButton: {
    backgroundColor: "#D8AE24",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 20,
  },
  startButtonText: {
    color: "#0A1A3B",
    fontSize: 14,
    fontWeight: "700",
  },
  rowCards: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 16,
  },
  infoCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
  },
  courseCard: {
    backgroundColor: "#D8AE24",
  },
  goalCard: {
    backgroundColor: "#7A1F2B",
  },
  courseCardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 10,
  },
  goalCardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  shieldWrap: {
    alignItems: "center",
    justifyContent: "center",
    height: 64,
    marginBottom: 8,
  },
  targetWrap: {
    alignItems: "center",
    justifyContent: "center",
    height: 64,
    marginBottom: 8,
  },
  targetArrow: {
    position: "absolute",
    transform: [{ rotate: "45deg" }],
  },
  courseCourseName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 6,
  },
  courseCardLine: {
    fontSize: 11.5,
    color: "#3F3312",
    lineHeight: 16,
  },
  goalCardLine: {
    fontSize: 11.5,
    color: "#F3E1E1",
    lineHeight: 16,
  },
  progressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  progressTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0A1A3B",
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 13,
    color: "#1F2937",
    width: 88,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F2937",
    width: 36,
    textAlign: "right",
  },
});