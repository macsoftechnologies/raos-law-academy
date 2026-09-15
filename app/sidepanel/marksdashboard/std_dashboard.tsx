import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";

// ---------- Shared progress shapes ----------

export interface CompletedPendingProgress {
  completed: number;
  pending: number;
  progress: number;
}

export interface CivilCriminalStat {
  total: number;
  civil: CompletedPendingProgress;
  criminal: CompletedPendingProgress;
}

export interface GoalTracker {
  progress: string;
  goal: string;
  studyTimeGoalMinutes: number;
  studyTimeProgressMinutes: number;
  mcqGoalCount: number;
  mcqProgressCount: number;
}

export interface CourseOverview {
  courseName: string;
  joinedOn: string;
  subjectsCompleted: string;
  lastActivity: string;
}

export interface SubjectProgress {
  jcjCourseProgress: number;
  prelimsProgress: number;
  mainsProgress: number;
}

export interface StudyAnalysis {
  videoLessons: CivilCriminalStat;
  shortNotes: CivilCriminalStat;
}

export interface SubjectMocks {
  total: number;
  civil: CompletedPendingProgress;
  criminal: CompletedPendingProgress;
}

export interface PrelimsPrep {
  pyqs: CompletedPendingProgress;
  grandTest: CompletedPendingProgress;
  subjectMocks: SubjectMocks;
}

export interface PdfVideoStat {
  pdf: CompletedPendingProgress;
  video: CompletedPendingProgress;
}

export interface MainsPrep {
  mainsQA: PdfVideoStat;
  essayTranslation: PdfVideoStat;
  mainsTestSeries: CompletedPendingProgress;
}

export interface Course {
  courseId: string;
  courseOverview: CourseOverview;
  subjectProgress: SubjectProgress;
  studyAnalysis: StudyAnalysis;
  prelimsPrep: PrelimsPrep;
  mainsPrep: MainsPrep;
}

export interface DashboardData {
  overallScore: number;
  goalTracker: GoalTracker;
  courses: Course[];
}

export interface DashboardStatsResponse {
  statusCode: number;
  message: string;
  data: DashboardData;
}

// ---------- Colors ----------
const COLORS = {
  bg: "#EEF0F6",
  navy: "#1B2A6E",
  gold: "#D4A72C",
  darkRed: "#7A1F24",
  white: "#FFFFFF",
  textDark: "#1A1A1A",
  textMuted: "#4A4A4A",
  trackLight: "#E3E6EF",
  barBlue: "#2540A8",
  barGold: "#D4A72C",
  barRed: "#7A1F24",
};

// ---------- Circular progress ring ----------
function ScoreRing({ score = 0, size = 96, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(score, 100)) / 100;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={COLORS.gold}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
          />
        </G>
      </Svg>
      <View style={StyleSheet.absoluteFillObject}>
        <View style={styles.ringCenter}>
          <Text style={styles.ringScoreText}>{score}</Text>
        </View>
      </View>
    </View>
  );
}

// ---------- Linear progress bar ----------
function ProgressBar({ percent, color }: { percent: number; color: string }) {
  const clamped = Math.max(0, Math.min(percent, 100));
  return (
    <View style={styles.barTrack}>
      <View
        style={[styles.barFill, { width: `${clamped}%`, backgroundColor: color }]}
      />
    </View>
  );
}

export default function STDDashboard({ navigation }: any) {
  const { userId: paramUserId } = useLocalSearchParams<{ userId?: string }>();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const userId = paramUserId ?? (await AsyncStorage.getItem("userId"));

   

      const response = await axios.post<DashboardStatsResponse>(
        `https://api.raoslawacademy.com/marksdashboard/stats`,
        { userId:"a8915aa7-c650-49fb-b3bd-697ff49d0837" },
      );

      if (response.data.statusCode === 200) {
        setData(response.data.data ?? null);
        console.log("Dashboard Stats Response:", response.data.data);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: response.data.message || "Couldn't load your dashboard.",
        });
      }
    } catch (error: any) {
      console.error("Error fetching dashboard stats:", error?.response?.data || error.message);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Couldn't load your dashboard. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [paramUserId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centerFill]}>
        <ActivityIndicator size="large" color={COLORS.navy} />
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centerFill]}>
        <Text style={styles.errorText}>No dashboard data available.</Text>
      </SafeAreaView>
    );
  }

  const course = data.courses?.[0];
  const overview = course?.courseOverview;
  const subjectProgress = course?.subjectProgress;

 const subjects = subjectProgress
  ? [
      {
        label: "JCJ full course",
        percent: subjectProgress.jcjCourseProgress,
        color: COLORS.barBlue,
        onPress: () =>
          router.push({
            pathname: "/sidepanel/marksdashboard/dashboard_std",
            params: { data: JSON.stringify(course) },
          }),
      },
      {
        label: "Prelims prepa",
        percent: subjectProgress.prelimsProgress,
        color: COLORS.barGold,
        onPress: () =>
          router.push({
            pathname: "/sidepanel/marksdashboard/jsj_course",
            params: { data: JSON.stringify(course) },
          }),
      },
      {
        label: "Mains prepa",
        percent: subjectProgress.mainsProgress,
        color: COLORS.barRed,
        onPress: () =>
          router.push({
            pathname: "/sidepanel/marksdashboard/mains_course",
            params: { data: JSON.stringify(course) },
          }),
      },
    ]
  : [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation?.goBack?.() ?? router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={26} color={COLORS.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <View style={{ width: 26 }} />
        </View>

        {/* Overall Score Card */}
        <View style={[styles.card, styles.scoreCard]}>
          <ScoreRing score={data.overallScore} />
          <View style={styles.scoreTextWrap}>
            <Text style={styles.scoreTitle}>Overall Score</Text>
            <Text style={styles.scoreSubtitle}>Next Challenge:</Text>
            <Text style={styles.scoreSubtitle}>Unlock your best!</Text>
            <TouchableOpacity
              style={styles.startButton}
              activeOpacity={0.85}
              onPress={() =>
               console.log("start pressed")
              }
            >
              <Text style={styles.startButtonText}>Start Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Course Overview + Goal Tracker */}
        <View style={styles.row}>
          <View style={[styles.card, styles.halfCard, styles.courseCard]}>
            <Text style={styles.courseHeading}>Course Overview</Text>
            <View style={styles.iconCircle}>
              <Ionicons name="shield-checkmark" size={40} color={COLORS.navy} />
            </View>
            <Text style={styles.courseTitle}>
              {overview?.courseName ?? "—"}
            </Text>
            <Text style={styles.courseDetail}>
              Joined on: {overview?.joinedOn ?? "—"}
            </Text>
            <Text style={styles.courseDetail}>
              Subject Completed: {overview?.subjectsCompleted ?? "—"}
            </Text>
            <Text style={styles.courseDetail}>
              Last Activity: {overview?.lastActivity ?? "—"}
            </Text>
          </View>

          <View style={[styles.card, styles.halfCard, styles.goalCard]}>
            <Text style={styles.goalHeading}>Goal Tracker</Text>
            <View style={styles.iconCircle}>
              <Ionicons name="locate" size={40} color={COLORS.darkRed} />
            </View>
            <Text style={styles.goalLabel}>Today's Goal:</Text>
            <Text style={styles.goalDetail}>{data.goalTracker.goal}</Text>
            <Text style={styles.goalLabel}>Progress:</Text>
            <Text style={styles.goalDetail}>{data.goalTracker.progress}</Text>
          </View>
        </View>

        {/* Subject Progress */}
        <View style={[styles.card, styles.progressCard]}>
          <Text style={styles.progressHeading}>Subject Progress</Text>
        {subjects.map((s) => (
  <View key={s.label} style={styles.progressRow}>
    <Text style={styles.progressLabel}>{s.label}</Text>
    <ProgressBar percent={s.percent} color={s.color} />
    <Text style={styles.progressPercent}>{s.percent}%</Text>
    <TouchableOpacity
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      onPress={s.onPress}
    >
      <Ionicons name="open-outline" size={16} color={COLORS.textMuted} />
    </TouchableOpacity>
  </View>
))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  centerFill: { justifyContent: "center", alignItems: "center", padding: 20 },
  errorText: {
    color: COLORS.darkRed,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  container: { flex: 1, paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: COLORS.textDark },
  card: { borderRadius: 20, padding: 18 },
  scoreCard: {
    backgroundColor: COLORS.navy,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  ringCenter: { flex: 1, alignItems: "center", justifyContent: "center" },
  ringScoreText: { color: COLORS.white, fontSize: 26, fontWeight: "700" },
  scoreTextWrap: { flex: 1, marginLeft: 16 },
  scoreTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  scoreSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontWeight: "600",
  },
  startButton: {
    marginTop: 10,
    backgroundColor: COLORS.gold,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  startButtonText: { color: COLORS.navy, fontWeight: "700", fontSize: 13 },
  row: { flexDirection: "row", gap: 12, marginBottom: 14 },
  halfCard: { flex: 1 },
  courseCard: { backgroundColor: COLORS.gold },
  goalCard: { backgroundColor: COLORS.darkRed },
  courseHeading: {
    color: COLORS.textDark,
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 10,
  },
  goalHeading: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 10,
  },
  iconCircle: {
    alignSelf: "center",
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.55)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  courseTitle: {
    color: COLORS.textDark,
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 8,
  },
  courseDetail: {
    color: COLORS.textDark,
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 2,
  },
  goalLabel: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 2,
  },
  goalDetail: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 2,
  },
  progressCard: { backgroundColor: COLORS.white },
  progressHeading: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  progressLabel: { width: 90, fontSize: 12, fontWeight: "600", color: COLORS.textDark },
  barTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.trackLight,
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: 3 },
  progressPercent: {
    width: 34,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textDark,
    textAlign: "right",
  },
});