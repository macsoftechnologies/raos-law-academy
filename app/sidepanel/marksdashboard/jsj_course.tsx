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
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";

// ---------- Shared shapes (match real API) ----------

export interface CompletedPendingProgress {
  completed: number;
  pending: number;
  progress: number;
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

export interface Course {
  courseId: string;
  prelimsPrep: PrelimsPrep;
  // other course fields omitted here — not needed on this screen
  [key: string]: any;
}

export interface DashboardStatsResponse {
  statusCode: number;
  message: string;
  data: {
    overallScore: number;
    goalTracker: any;
    courses: Course[];
  };
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
  trackRed: "#F0DDDD",
  trackGold: "#F7ECCF",
};

function ProgressBar({
  percent,
  color,
  trackColor,
}: {
  percent: number;
  color: string;
  trackColor?: string;
}) {
  const clamped = Math.max(0, Math.min(percent, 100));
  return (
    <View style={[styles.barTrack, trackColor ? { backgroundColor: trackColor } : null]}>
      <View style={[styles.barFill, { width: `${clamped}%`, backgroundColor: color }]} />
    </View>
  );
}

function ProgressRow({
  label,
  progress,
  color,
  trackColor,
}: {
  label: string;
  progress: CompletedPendingProgress;
  color: string;
  trackColor?: string;
}) {
  return (
    <View style={styles.progressBlock}>
      <Text style={styles.progressBlockLabel}>{label}</Text>
      <View style={styles.barRow}>
        <ProgressBar percent={progress.progress} color={color} trackColor={trackColor} />
        <Text style={styles.progressPercent}>{progress.progress}%</Text>
      </View>
      <View style={styles.completedPendingRow}>
        <Text style={styles.completedPendingText}>Completed-{progress.completed}</Text>
        <Text style={styles.completedPendingText}>Pending-{progress.pending}</Text>
      </View>
    </View>
  );
}

export default function PrelimsPrepScreen() {
 const { data } = useLocalSearchParams<{ data?: string }>();

  const [prelimsPrep, setPrelimsPrep] = useState<PrelimsPrep | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      if (!data) {
        Toast.show({ type: "error", text1: "Error", text2: "No course data received." });
        return;
      }
      const course: Course = JSON.parse(data);
      setPrelimsPrep(course.prelimsPrep);
    } catch (error) {
      console.error("Error parsing course data:", error);
      Toast.show({ type: "error", text1: "Error", text2: "Couldn't load Prelims Prep." });
    } finally {
      setLoading(false);
    }
  }, [data]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centerFill]}>
        <ActivityIndicator size="large" color={COLORS.navy} />
      </SafeAreaView>
    );
  }

  if (!prelimsPrep) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centerFill]}>
        <Text style={styles.errorText}>No Prelims Prep data available.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="chevron-back" size={26} color={COLORS.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Prelims Prep</Text>
          <View style={{ width: 26 }} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeading}>PYQS</Text>
          <ProgressRow label="PYQs Modules" progress={prelimsPrep.pyqs} color={COLORS.navy} trackColor={COLORS.trackLight} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeading}>Grand Test</Text>
          <ProgressRow label="Grand test modules" progress={prelimsPrep.grandTest} color={COLORS.darkRed} trackColor={COLORS.trackRed} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeading}>Subject Wise Mocks</Text>
          <Text style={styles.mockTotal}>Total Mock Tests - {prelimsPrep.subjectMocks.total}</Text>
          <ProgressRow label="Civil laws" progress={prelimsPrep.subjectMocks.civil} color={COLORS.gold} trackColor={COLORS.trackGold} />
          <ProgressRow label="Criminal laws" progress={prelimsPrep.subjectMocks.criminal} color={COLORS.gold} trackColor={COLORS.trackGold} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  centerFill: { justifyContent: "center", alignItems: "center", padding: 20 },
  errorText: { color: COLORS.darkRed, fontSize: 14, fontWeight: "600", textAlign: "center" },
  container: { flex: 1, paddingHorizontal: 16 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 16 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: COLORS.textDark },
  card: { backgroundColor: COLORS.white, borderRadius: 20, padding: 18, marginBottom: 14 },
  cardHeading: { fontSize: 17, fontWeight: "700", color: COLORS.textDark, marginBottom: 14 },
  mockTotal: { fontSize: 13, fontWeight: "700", color: COLORS.textDark, marginBottom: 14 },
  progressBlock: { marginBottom: 14 },
  progressBlockLabel: { fontSize: 13, fontWeight: "700", color: COLORS.textDark, marginBottom: 8 },
  barRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  barTrack: { flex: 1, height: 8, borderRadius: 4, backgroundColor: COLORS.trackLight, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 4 },
  progressPercent: { width: 34, fontSize: 12, fontWeight: "700", color: COLORS.textDark, textAlign: "right" },
  completedPendingRow: { flexDirection: "row", justifyContent: "space-between" },
  completedPendingText: { fontSize: 12, fontWeight: "600", color: COLORS.textMuted },
});