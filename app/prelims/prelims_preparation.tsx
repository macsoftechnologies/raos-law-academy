import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

// ---------- Types (match the API response exactly) ----------

interface MockTestPrelims {
  prelimes_id: string;
  title: string;
}

interface MockTestLaw {
  lawId: string;
  title: string;
}

interface MockTestCourse {
  subcategory_id: string;
  title: string;
}

interface MockTestSubject {
  _id: string;
  mocktest_subject_id: string;
  presentation_image: string;
  title: string;
  no_of_qos: string;
  duration: string;
  prelimes: MockTestPrelims | Record<string, never>;
  law: MockTestLaw | Record<string, never>;
  course: MockTestCourse | Record<string, never>;
}

interface MockTestSubjectsResponse {
  statusCode: number;
  message: string;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  data: MockTestSubject[];
}

// ---------- Config ----------

const API_BASE_URL = "https://api.raoslawacademy.com";
// Update this if presentation_image is served from a different path/CDN.
const IMAGE_BASE_URL = `${API_BASE_URL}/uploads/`;

const COLORS = {
  navy: "#23408E",
  gold: "#D8AE24",
  background: "#EEF1FB",
  cardBg: "#FFFFFF",
  border: "#E7EAF2",
  textDark: "#222222",
  muted: "#8A8FA3",
  danger: "#B3261E",
};

const bottomTabs = [
  { label: "Home", icon: "home", type: "Ionicons", route: "/dashboard" },
  { label: "Notes", icon: "note-edit-outline", type: "MaterialCommunityIcons", route: "/notes_module" },
  { label: "Prelims", icon: "clipboard-text-outline", type: "MaterialCommunityIcons", route: "/prelims" },
  { label: "Mains", icon: "book-open-variant", type: "MaterialCommunityIcons", route: "/mains" },
  { label: "Chat", icon: "chatbubble-outline", type: "Ionicons", route: "/chat" },
];


function hasLaw(law: MockTestSubject["law"]): law is MockTestLaw {
  return "lawId" in law;
}



function SubjectCard({ item }: { item: MockTestSubject }) {
  const imageUri = item.presentation_image
    ? `${IMAGE_BASE_URL}${item.presentation_image}`
    : null;

  return (
    <View style={styles.card}>
      <View style={styles.coverBox}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.coverImage} resizeMode="cover" />
        ) : (
          <View style={styles.coverPlaceholder}>
            <MaterialCommunityIcons name="gavel" size={36} color="#fff" />
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="help-circle-outline" size={15} color={COLORS.muted} />
            <Text style={styles.metaText}>{item.no_of_qos} Qs</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={15} color={COLORS.muted} />
            <Text style={styles.metaText}>{item.duration} min</Text>
          </View>
          {hasLaw(item.law) && (
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="scale-balance" size={15} color={COLORS.muted} />
              <Text style={styles.metaText} numberOfLines={1}>
                {item.law.title}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.exploreBtn}
          activeOpacity={0.9}
          onPress={() =>
            router.push({
              pathname: "/subject_mock_test/civil_mock",
              params: {
                mocktestSubjectId: item.mocktest_subject_id,
                title: item.title,
              },
            })
          }
        >
          <Text style={styles.exploreBtnText}>Explore more</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ---------- Screen ----------

export default function MockPreparation() {
  const { examTitle } = useLocalSearchParams<{ examTitle?: string }>();
  const [activeTab, setActiveTab] = useState("Prelims");

  const [data, setData] = useState<MockTestSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjects = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE_URL}/prelimes/mocktestsubjects?page=1&limit=10`
      );
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      const json: MockTestSubjectsResponse = await res.json();
      setData(json.data ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong while loading subjects."
      );
    } finally {
      isRefresh ? setRefreshing(false) : setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const renderTabIcon = (tab: any, isActive: boolean) => {
    const color = isActive ? COLORS.navy : "#fff";
    const size = isActive ? 24 : 21;
    if (tab.type === "Ionicons") {
      return <Ionicons name={tab.icon} size={size} color={color} />;
    }
    return <MaterialCommunityIcons name={tab.icon} size={size} color={color} />;
  };

  const handleTabPress = (tab: any) => {
    setActiveTab(tab.label);
    router.push(tab.route);
  };

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
            {examTitle ?? "AP JCJ Subject Wise Mocks"}
          </Text>
        </View>

        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color={COLORS.navy} />
          </View>
        ) : error ? (
          <View style={styles.centerState}>
            <MaterialCommunityIcons name="alert-circle-outline" size={40} color={COLORS.danger} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => fetchSubjects()}>
              <Text style={styles.retryBtnText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : data.length === 0 ? (
          <View style={styles.centerState}>
            <MaterialCommunityIcons name="folder-open-outline" size={40} color={COLORS.muted} />
            <Text style={styles.emptyText}>No mock test subjects available yet.</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => fetchSubjects(true)}
                colors={[COLORS.navy]}
                tintColor={COLORS.navy}
              />
            }
          >
            {data.map((item) => (
              <SubjectCard key={item._id} item={item} />
            ))}
          </ScrollView>
        )}

        {/* Bottom Navigation */}
        <View style={styles.bottomBar}>
          {bottomTabs.map((tab, index) => {
            const isActive = activeTab === tab.label;
            return (
              <TouchableOpacity
                key={index}
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
    paddingHorizontal: 16,
    paddingTop: 54,
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
  centerState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 10,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 14,
    textAlign: "center",
  },
  retryBtn: {
    marginTop: 6,
    backgroundColor: COLORS.navy,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  retryBtnText: { color: "#fff", fontWeight: "700" },
  emptyText: { color: COLORS.muted, fontSize: 14, textAlign: "center" },
  listContent: { paddingHorizontal: 20, paddingBottom: 20, paddingTop: 4 },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  coverBox: {
    height: 170,
    backgroundColor: "#0E1B3D",
  },
  coverImage: { width: "100%", height: "100%" },
  coverPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.navy,
  },
  cardFooter: { padding: 16 },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginBottom: 14,
  },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 12, color: COLORS.muted },
  exploreBtn: {
    backgroundColor: COLORS.navy,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  exploreBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
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