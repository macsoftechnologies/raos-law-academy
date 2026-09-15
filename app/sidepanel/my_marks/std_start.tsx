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

type SubjectStat = {
  id: string;
  label: string;
  percent: number;
  completed: number;
  pending: number;
};

type AnalysisSection = {
  id: string;
  title: string;
  total: number;
  color: string;
  trackColor: string;
  subjects: SubjectStat[];
};

const STUDENT_NAME = "Tony";

const COURSE_INFO = {
  name: "JCJ Full",
  joinedOn: "30/10/2025",
  lastActivity: "10 Hours ago",
};

const ANALYSIS_SECTIONS: AnalysisSection[] = [
  {
    id: "video-lessons",
    title: "Total Video lessons - 500",
    total: 500,
    color: "#C9A227",
    trackColor: "#F1E6C4",
    subjects: [
      { id: "civil", label: "Civil laws", percent: 48, completed: 12, pending: 13 },
      { id: "criminal", label: "Criminal laws", percent: 48, completed: 12, pending: 13 },
    ],
  },
  {
    id: "short-notes",
    title: "Total Short Notes - 500",
    total: 500,
    color: "#7A1F2B",
    trackColor: "#F0DCDC",
    subjects: [
      { id: "civil", label: "Civil laws", percent: 48, completed: 12, pending: 13 },
      { id: "criminal", label: "Criminal laws", percent: 48, completed: 12, pending: 13 },
    ],
  },
];

export default function StdStart() {
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
        <Text style={styles.headerTitle}>Hi {STUDENT_NAME},</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Course info card */}
        <View style={styles.courseCard}>
          <View style={styles.courseRow}>
            <Text style={styles.courseText}>
              Course name: {COURSE_INFO.name}
            </Text>
            <MaterialCommunityIcons name="book-open-variant" size={20} color="#23408E" />
          </View>

          <View style={styles.courseRow}>
            <Text style={styles.courseSubText}>
              Course Joined on: {COURSE_INFO.joinedOn}
            </Text>
          </View>

          <View style={styles.courseRow}>
            <Text style={styles.courseSubText}>
              Last Activity: {COURSE_INFO.lastActivity}
            </Text>
            <Ionicons name="time-outline" size={20} color="#23408E" />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Study Analysis</Text>

        {ANALYSIS_SECTIONS.map((section) => (
          <View key={section.id} style={styles.analysisCard}>
            <Text style={styles.analysisTitle}>{section.title}</Text>

            {section.subjects.map((subject) => (
              <View key={subject.id} style={styles.subjectBlock}>
                <Text style={styles.subjectLabel}>{subject.label}</Text>

                <View style={styles.progressRow}>
                  <View
                    style={[
                      styles.progressTrack,
                      { backgroundColor: section.trackColor },
                    ]}
                  >
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${subject.percent}%`,
                          backgroundColor: section.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressPercent}>{subject.percent}%</Text>
                </View>

                <View style={styles.statsRow}>
                  <Text style={styles.statsText}>
                    Completed-{subject.completed}
                  </Text>
                  <Text style={styles.statsText}>
                    Pending-{subject.pending}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}
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
  courseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  courseRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  courseText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  courseSubText: {
    fontSize: 14,
    color: "#374151",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0A1A3B",
    marginBottom: 14,
  },
  analysisCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  subjectBlock: {
    marginBottom: 14,
  },
  subjectLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 6,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    width: 34,
    textAlign: "right",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  statsText: {
    fontSize: 12,
    color: "#6B7280",
  },
});