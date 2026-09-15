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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const COLORS = {
  navy: "#23408E",
  gold: "#D8AE24",
  goldLight: "#F3E7C5",
  goldText: "#8A6D1C",
  pink: "#F6D9DC",
  pinkText: "#8A3B45",
  background: "#EEF1FB",
  cardBg: "#FFFFFF",
  lineGray: "#E3E7F0",
  border: "#E7EAF2",
  textDark: "#222222",
};

interface MockTopic {
  id: string;
  title: string;
  questions: number;
  minutes: number;
  route: string;
}

const CIVIL_LAWS_TOPICS: MockTopic[] = [
  {
    id: "1",
    title: "Civil Procedure Code",
    questions: 200,
    minutes: 150,
    route: "/prelims_module/mock_tests/civil-procedure-code",
  },
  {
    id: "2",
    title: "Indian Evidence Act",
    questions: 200,
    minutes: 150,
    route: "/prelims_module/mock_tests/indian-evidence-act",
  },
  {
    id: "3",
    title: "Transfer of property",
    questions: 200,
    minutes: 150,
    route: "/prelims_module/mock_tests/transfer-of-property",
  },
];

function NotePreviewLines() {
  const lineWidths = ["92%", "78%", "88%", "60%", "85%", "70%", "90%", "55%"];
  return (
    <View style={styles.previewLinesWrap}>
      {lineWidths.map((w, i) => (
        <View
          key={i}
          style={[
            styles.previewLine,
            { width: w as any, marginTop: i === 0 ? 0 : 8 },
          ]}
        />
      ))}
    </View>
  );
}

function MockTopicCard({ item }: { item: MockTopic }) {
  return (
    <TouchableOpacity
  style={styles.card}
  activeOpacity={0.8}
  onPress={() => router.push("/subject_mock_test/mock_test")} 
>
  <View style={styles.previewBox}>
    <NotePreviewLines />
  </View>


      <View style={styles.cardFooter}>
        <Text style={styles.cardTitle}>{item.title}</Text>

        <View style={styles.badgeRow}>
          <View style={styles.quesBadge}>
            <MaterialCommunityIcons name="text-box-check-outline" size={16} color={COLORS.pinkText} />
            <Text style={styles.quesBadgeText}>{item.questions} Ques</Text>
          </View>
          <View style={styles.timeBadge}>
            <Ionicons name="time-outline" size={16} color={COLORS.goldText} />
            <Text style={styles.timeBadgeText}>{item.minutes} mins</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.viewBtn}
          activeOpacity={0.9}
          onPress={() => router.push("/subject_mock_test/view.mock")}
        >
          <Text style={styles.viewBtnText}>View</Text>
        </TouchableOpacity>
      </View>
    
      </TouchableOpacity>
  );
}

export default function CivilMock() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            AP Civil Laws Mocks
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {CIVIL_LAWS_TOPICS.map((item) => (
            <MockTopicCard key={item.id} item={item} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 45,
    paddingBottom: 15,
  },
  backBtn: { width: 32, height: 32, justifyContent: "center" },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textDark,
    marginLeft: 6,
    flex: 1,
  },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  previewBox: {
    height: 150,
    borderRadius: 12,
    backgroundColor: "#FAFBFD",
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    overflow: "hidden",
    justifyContent: "center",
  },
  previewLinesWrap: { width: "100%" },
  previewLine: { height: 7, borderRadius: 4, backgroundColor: COLORS.lineGray },
  cardFooter: { paddingTop: 12, paddingHorizontal: 4 },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  quesBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.pink,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    gap: 6,
  },
  quesBadgeText: { color: COLORS.pinkText, fontSize: 13, fontWeight: "700" },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.goldLight,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    gap: 6,
  },
  timeBadgeText: { color: COLORS.goldText, fontSize: 13, fontWeight: "700" },
  viewBtn: {
    backgroundColor: COLORS.navy,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  viewBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});