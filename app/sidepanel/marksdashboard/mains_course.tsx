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

export interface CompletedPendingProgress {
  completed: number;
  pending: number;
  progress: number;
}

export interface PdfVideoStat {
  pdf: CompletedPendingProgress;
  video: CompletedPendingProgress;
}

// Matches the real API: mainsTestSeries is flat, not a 3-row breakdown.
export interface MainsPrep {
  mainsQA: PdfVideoStat;
  essayTranslation: PdfVideoStat;
  mainsTestSeries: CompletedPendingProgress;
}

export interface Course {
  courseId: string;
  mainsPrep: MainsPrep;
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
  icon,
}: {
  label: string;
  progress: CompletedPendingProgress;
  color: string;
  trackColor?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.progressBlock}>
      <View style={styles.labelRow}>
        <Text style={styles.progressBlockLabel}>{label}</Text>
        {icon ? <Ionicons name={icon} size={14} color={COLORS.textMuted} style={{ marginLeft: 6 }} /> : null}
      </View>
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

export default function MainsPrepScreen() {
 const { data } = useLocalSearchParams<{ data?: string }>();

  const [mainsPrep, setMainsPrep] = useState<MainsPrep | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      if (!data) {
        Toast.show({ type: "error", text1: "Error", text2: "No course data received." });
        return;
      }
      const course: Course = JSON.parse(data);
      setMainsPrep(course.mainsPrep);
    } catch (error) {
      console.error("Error parsing course data:", error);
      Toast.show({ type: "error", text1: "Error", text2: "Couldn't load Mains Prep." });
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

  if (!mainsPrep) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centerFill]}>
        <Text style={styles.errorText}>No Mains Prep data available.</Text>
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
          <Text style={styles.headerTitle}>Mains Prep</Text>
          <View style={{ width: 26 }} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeading}>Mains Q & A</Text>
          <ProgressRow label="PDFs" icon="document-text-outline" progress={mainsPrep.mainsQA.pdf} color={COLORS.navy} trackColor={COLORS.trackLight} />
          <ProgressRow label="Videos" icon="play-circle-outline" progress={mainsPrep.mainsQA.video} color={COLORS.navy} trackColor={COLORS.trackLight} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeading}>Essay & Translation</Text>
          <ProgressRow label="PDFs" icon="document-text-outline" progress={mainsPrep.essayTranslation.pdf} color={COLORS.darkRed} trackColor={COLORS.trackRed} />
          <ProgressRow label="Videos" icon="play-circle-outline" progress={mainsPrep.essayTranslation.video} color={COLORS.darkRed} trackColor={COLORS.trackRed} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeading}>Mains Test Series</Text>
          <ProgressRow label="Mains test series" progress={mainsPrep.mainsTestSeries} color={COLORS.gold} trackColor={COLORS.trackGold} />
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
  progressBlock: { marginBottom: 14 },
  labelRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  progressBlockLabel: { fontSize: 13, fontWeight: "700", color: COLORS.textDark },
  barRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  barTrack: { flex: 1, height: 8, borderRadius: 4, backgroundColor: COLORS.trackLight, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 4 },
  progressPercent: { width: 34, fontSize: 12, fontWeight: "700", color: COLORS.textDark, textAlign: "right" },
  completedPendingRow: { flexDirection: "row", justifyContent: "space-between" },
  completedPendingText: { fontSize: 12, fontWeight: "600", color: COLORS.textMuted },
});