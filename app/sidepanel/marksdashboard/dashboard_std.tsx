import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

// ---------- Colors ----------
const COLORS = {
  bg: "#DDE1EE",
  cardWhite: "#FFFFFF",
  textDark: "#1A1A1A",
  textMuted: "#5A5A5A",
  gold: "#B8860B",
  goldTrack: "#EFE3C0",
  darkRed: "#7A1F24",
  redTrack: "#EED9DA",
  navy: "#1B2A6E",
};

// ---------- Linear progress bar with % label above ----------
function StatBar({
  label,
  percent,
  completed,
  pending,
  color,
  trackColor,
}: {
  label: string;
  percent: number;
  completed: number;
  pending: number;
  color: string;
  trackColor: string;
}) {
  return (
    <View style={styles.statBlock}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.barRow}>
        <View style={[styles.barTrack, { backgroundColor: trackColor }]}>
          <View
            style={[
              styles.barFill,
              { width: `${percent}%`, backgroundColor: color },
            ]}
          />
        </View>
        <Text style={styles.percentText}>{percent}%</Text>
      </View>
      <View style={styles.statFooterRow}>
        <Text style={styles.statFooterText}>Completed-{completed}</Text>
        <Text style={styles.statFooterText}>Pending-{pending}</Text>
      </View>
    </View>
  );
}

export default function STDStudyAnalysis({ navigation, route }: any) {
  const studentName = route?.params?.studentName ?? "Tony";
  const { data } = useLocalSearchParams<{ data?: string }>();

  console.log("Received data:", data);

  const videoLessons = [
    { label: "Civil laws", percent: 48, completed: 12, pending: 13 },
    { label: "Criminal laws", percent: 48, completed: 12, pending: 13 },
  ];

  const shortNotes = [
    { label: "Civil laws", percent: 48, completed: 12, pending: 13 },
    { label: "Criminal laws", percent: 48, completed: 12, pending: 13 },
  ];

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
            onPress={() => navigation?.goBack?.()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={26} color={COLORS.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hi {studentName},</Text>
          <View style={{ width: 26 }} />
        </View>

        {/* Course Info Card */}
        <View style={[styles.card, styles.courseInfoCard]}>
          <View style={styles.courseInfoRow}>
            <Text style={styles.courseInfoBold}>Course name: JCJ Full</Text>
            <Ionicons name="book-outline" size={20} color={COLORS.navy} />
          </View>
          <View style={styles.courseInfoRow}>
            <View>
              <Text style={styles.courseInfoText}>
                Course Joined on: 30/10/2025
              </Text>
              <Text style={styles.courseInfoText}>
                Last Activity: 10 Hours ago
              </Text>
            </View>
            <Ionicons name="time-outline" size={20} color={COLORS.navy} />
          </View>
        </View>

        {/* Section title */}
        <Text style={styles.sectionTitle}>Study Analysis</Text>

        {/* Total Video Lessons card */}
        <View style={[styles.card, styles.analysisCard]}>
          <Text style={styles.analysisHeading}>Total Video lessons - 500</Text>
          {videoLessons.map((item) => (
            <StatBar
              key={item.label}
              label={item.label}
              percent={item.percent}
              completed={item.completed}
              pending={item.pending}
              color={COLORS.gold}
              trackColor={COLORS.goldTrack}
            />
          ))}
        </View>

        {/* Total Short Notes card */}
        <View style={[styles.card, styles.analysisCard]}>
          <Text style={styles.analysisHeading}>Total Short Notes - 500</Text>
          {shortNotes.map((item) => (
            <StatBar
              key={item.label}
              label={item.label}
              percent={item.percent}
              completed={item.completed}
              pending={item.pending}
              color={COLORS.darkRed}
              trackColor={COLORS.redTrack}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  card: {
    backgroundColor: COLORS.cardWhite,
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
  },
  courseInfoCard: {
    gap: 10,
  },
  courseInfoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  courseInfoBold: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  courseInfoText: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 12,
  },
  analysisCard: {},
  analysisHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 18,
  },
  statBlock: {
    marginBottom: 18,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 8,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  barTrack: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 5,
  },
  percentText: {
    marginLeft: 10,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
    width: 36,
    textAlign: "right",
  },
  statFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  statFooterText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.textMuted,
  },
});