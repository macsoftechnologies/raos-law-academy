import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  navy: "#0F2557",
  navyDark: "#081733",
  gold: "#C9A227",
  goldLight: "#F3E8C8",
  pink: "#F6D9DC",
  pinkText: "#8A3B45",
  goldText: "#8A6D1D",
  background: "#F4F6FB",
  cardBg: "#FFFFFF",
  lineGray: "#E3E7F0",
  border: "#E7EAF2",
};

interface NoteItem {
  id: string;
  title: string;
  locked: boolean;
}

const NOTES_DATA: NoteItem[] = [
  { id: "1", title: "Demo Notes", locked: false },
  { id: "2", title: "Civil Procedure Code Notes", locked: true },
  { id: "3", title: "Indian Evidence Act", locked: true },
  { id: "4", title: "Transfer Of Property Act", locked: true },
  { id: "5", title: "Specific Relief Act", locked: true },
];

function NotePreviewLines() {
  // Mock document preview using stacked lines to simulate text
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

function NoteCard({ item }: { item: NoteItem }) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => {
        if (item.locked) {
          // navigate to purchase / unlock flow
          router.push("/notes/notes_law");
        } else {
          router.push(`/notes/notes_law`);
        }
      }}
    >
      <View style={styles.previewBox}>
        <NotePreviewLines />
        {item.locked && (
          <View style={styles.lockOverlay}>
            <View style={styles.lockCircle}>
              <Ionicons name="lock-closed" size={20} color={COLORS.navy} />
            </View>
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.titleRow}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Ionicons name="bookmark-outline" size={22} color={COLORS.navy} />
        </View>

        <View style={styles.tagsRow}>
          <View style={[styles.tag, { backgroundColor: COLORS.pink }]}>
            <Ionicons name="time-outline" size={14} color={COLORS.pinkText} />
            <Text style={[styles.tagText, { color: COLORS.pinkText }]}>
              Real Time examples
            </Text>
          </View>
          <View style={[styles.tag, { backgroundColor: COLORS.goldLight }]}>
            <Ionicons name="eye-outline" size={14} color={COLORS.goldText} />
            <Text style={[styles.tagText, { color: COLORS.goldText }]}>
              100+ Views
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function NotesLaw() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={26} color={COLORS.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AP Civil Laws Notes</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {NOTES_DATA.map((item) => (
          <NoteCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: COLORS.background,
  },
  backBtn: {
    width: 32,
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: COLORS.navy,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 16,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 12,
    marginBottom: 4,
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
  previewLinesWrap: {
    width: "100%",
  },
  previewLine: {
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.lineGray,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  lockCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  cardFooter: {
    paddingTop: 12,
    paddingHorizontal: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.navy,
    flex: 1,
    marginRight: 8,
  },
  tagsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "600",
  },
});