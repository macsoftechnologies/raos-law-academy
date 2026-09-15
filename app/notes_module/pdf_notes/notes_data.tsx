import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";

interface SubjectNote {
  _id: string;
  subject_notes_id: string;
  notes_id: string;
  lawId: string;
  subjectId: string;
  title: string;
  pdf_url: string;
  isLocked: boolean;
  presentation_image: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface SubjectNotesResponse {
  statusCode: number;
  message: string;
  data: SubjectNote[];
}

const COLORS = {
  navy: "#23408E",
  gold: "#D8AE24",
  goldDark: "#B8941C",
  pink: "#F6D9DC",
  pinkText: "#8A3B45",
  lightBlue: "#DCE6FB",
  background: "#EEF1FB",
  cardBg: "#FFFFFF",
  border: "#E7EAF2",
  redText: "#B23B3B",
  gray: "#8A8A8A",
};

const IMAGE_BASE_URL = "https://api.raoslawacademy.com/uploads/";
const FALLBACK_IMAGE = require("../../../assets/images/pdf1.png");

const bottomTabs = [
  { label: "Home", icon: "home", type: "Ionicons", route: "/dashboard" },
  { label: "Notes", icon: "note-edit-outline", type: "MaterialCommunityIcons", route: "/notes_module" },
  { label: "Prelims", icon: "clipboard-text-outline", type: "MaterialCommunityIcons", route: "/prelims" },
  { label: "Mains", icon: "book-open-variant", type: "MaterialCommunityIcons", route: "/mains" },
  { label: "Chat", icon: "chatbubble-outline", type: "Ionicons", route: "/chat" },
];

function PurchasedCard({
  item,
  onOpen,
}: {
  item: SubjectNote;
  onOpen: (item: SubjectNote) => void;
}) {
  const imageSource = item.presentation_image
    ? { uri: `${IMAGE_BASE_URL}${item.presentation_image}` }
    : FALLBACK_IMAGE;

  return (
    <View style={styles.card}>
      <View style={styles.previewBox}>
        <Image source={imageSource} style={styles.previewImage} resizeMode="cover" />
        {item.isLocked && (
          <View style={styles.printedBadge}>
            <Text style={styles.printedBadgeText}>Printed Notes</Text>
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.titleRow}>
          <Text style={styles.cardTitleMulti} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.monthsBadge}>
            <Text style={styles.monthsBadgeText}>—</Text>
          </View>
        </View>

        <View style={styles.durationRow}>
          <View style={styles.durationBadge}>
            <Text style={styles.durationBadgeText}>—</Text>
          </View>
        </View>

        <Text style={styles.endsOnText}>
          Updated {new Date(item.updatedAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </Text>

        <TouchableOpacity
          style={styles.openBtn}
          activeOpacity={0.9}
          onPress={() => onOpen(item)}
        >
          <Text style={styles.openBtnText}>Open</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function NotesData() {
  const { userId, lawId: lawIdParam } = useLocalSearchParams<{
    userId: string;
    lawId: string;
  }>();

  const [activeTab, setActiveTab] = useState("Notes");
  const [notes, setNotes] = useState<SubjectNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const renderTabIcon = (tab: (typeof bottomTabs)[number], isActive: boolean) => {
    const color = isActive ? COLORS.navy : "#fff";
    const size = isActive ? 24 : 21;
    if (tab.type === "Ionicons") {
      return <Ionicons name={tab.icon as any} size={size} color={color} />;
    }
    return <MaterialCommunityIcons name={tab.icon as any} size={size} color={color} />;
  };

  const handleTabPress = (tab: (typeof bottomTabs)[number]) => {
    setActiveTab(tab.label);
    router.push(tab.route as any);
  };

  const lawId = lawIdParam || "a816f02b-b03a-4e7a-a94c-bde6ba83c5f3";

  useEffect(() => {
    const fetchPurchasedNotes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post<SubjectNotesResponse>(
          "https://api.raoslawacademy.com/subject-notes/notesbylaw",
          {
            lawId: lawId,
            userId: userId,
          }
        );

        if (response.data?.statusCode === 200) {
          const purchased = response.data.data.filter((n) => !n.isLocked);
          setNotes(purchased);
        } else {
          setError("Couldn't load your notes right now.");
        }
      } catch (err) {
        console.log("API Error:", err);
        setError("Couldn't load your notes. Check your connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedNotes();
  }, [lawId, userId]);

  const handleOpen = (item: SubjectNote) => {
    router.push({
      pathname: "/notes_module/pdf_notes/notes_package",
      params: { subjectNotesId: item.subject_notes_id, userId },
    } as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notes</Text>
          <TouchableOpacity onPress={() => router.push("/notes_module/pdf_notes/cart" as any)}>
            <Ionicons name="cart-outline" size={26} color="#222" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color={COLORS.navy} />
          </View>
        ) : error ? (
          <View style={styles.centerState}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : notes.length === 0 ? (
          <View style={styles.centerState}>
            <Text style={styles.errorText}>You haven't purchased any notes yet.</Text>
          </View>
        ) : (
          <FlatList
            data={notes}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <PurchasedCard item={item} onOpen={handleOpen} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

        <View style={styles.bottomBar}>
          {bottomTabs.map((tab) => {
            const isActive = activeTab === tab.label;
            return (
              <TouchableOpacity
                key={tab.label}
                style={isActive ? styles.activeTabWrap : styles.tabWrap}
                onPress={() => handleTabPress(tab)}
                activeOpacity={0.8}
              >
                <View style={isActive ? styles.activeTab : styles.inactiveTab}>
                  {renderTabIcon(tab, isActive)}
                </View>
                <Text style={isActive ? styles.activeTabLabel : styles.tabLabel}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
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
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 49,
    paddingBottom: 15,
  },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#222" },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  centerState: { flex: 1, alignItems: "center", justifyContent: "center" },
  errorText: { color: COLORS.gray, fontSize: 14, textAlign: "center", paddingHorizontal: 40 },
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
    overflow: "hidden",
    justifyContent: "center",
  },
  previewImage: { width: "100%", height: "100%", borderRadius: 12 },
  printedBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: COLORS.goldDark,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomLeftRadius: 12,
  },
  printedBadgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  cardFooter: { paddingTop: 12, paddingHorizontal: 4 },
  titleRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  cardTitleMulti: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
    flex: 1,
    marginRight: 8,
    lineHeight: 22,
  },
  monthsBadge: {
    backgroundColor: COLORS.pink,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  monthsBadgeText: { color: COLORS.pinkText, fontSize: 12, fontWeight: "700" },
  durationRow: { flexDirection: "row", marginTop: 8 },
  durationBadge: {
    backgroundColor: COLORS.lightBlue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  durationBadgeText: { color: COLORS.navy, fontSize: 12, fontWeight: "700" },
  endsOnText: {
    color: COLORS.redText,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 12,
  },
  openBtn: {
    backgroundColor: COLORS.navy,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  openBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  bottomBar: {
    height: 78,
    backgroundColor: COLORS.navy,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  tabWrap: { alignItems: "center", justifyContent: "center" },
  activeTabWrap: { alignItems: "center", justifyContent: "center" },
  inactiveTab: { marginBottom: 2 },
  activeTab: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.gold,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -32,
    borderWidth: 4,
    borderColor: COLORS.background,
  },
  tabLabel: { color: "#fff", fontSize: 11, marginTop: 2 },
  activeTabLabel: { color: "#fff", fontSize: 11, marginTop: 2, fontWeight: "700" },
});