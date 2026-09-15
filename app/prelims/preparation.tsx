import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";

interface Prelim {
  _id: string;
  prelimes_id: string;
  title: string;
  sub_title: string;
  presentation_image: string;
  subcategory_id: string;
  isEnrolled: boolean;
  remaining_duration: number | null;
  availablePlans: unknown[]; // update this once you know what a populated plan object looks like
  enroll_date?: string; // only present when isEnrolled is true
  expiry_date: string | null;
}

interface PrelimesListResponse {
  statusCode: number;
  message: string;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  data: Prelim[];
}

const COLORS = {
  navy: "#23408E",
  gold: "#D8AE24",
  pink: "#F6D9DC",
  pinkText: "#8A3B45",
  lightBlue: "#DCE6FB",
  background: "#EEF1FB",
  cardBg: "#FFFFFF",
  lineGray: "#E3E7F0",
  border: "#E7EAF2",
  gray: "#8A8A8A",
};

const DEFAULT_SUBCATEGORY_ID = "37634c0a-1deb-4cee-aaa9-888f60af09c9";

function PrelimsPreviewLines() {
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

function PrelimsCard({ item }: { item: Prelim }) {
  return (
    <View style={styles.card}>
      <View style={styles.previewBox}>
        <Image
          source={{ uri: `https://api.raoslawacademy.com/${item.presentation_image}` }}
          style={styles.cardImage}
        />
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.cardTitle}>{item.title}</Text>

       <TouchableOpacity
  style={styles.exploreFullBtn}
  activeOpacity={0.9}
  onPress={() => {
    console.log("Explore more pressed for item:", item.prelimes_id);
    router.push({
      pathname: "/prelims/prelims_preparation",
      params: { prelimes_id: item.prelimes_id },
    } as any);
  }}
>
  <Text style={styles.exploreFullText}>Explore more</Text>
</TouchableOpacity>
      </View>
    </View>
  );
}

const bottomTabs = [
  { label: "Home", icon: "home", type: "Ionicons", route: "/dashboard" },
  { label: "Notes", icon: "note-edit-outline", type: "MaterialCommunityIcons", route: "/notes_module" },
  { label: "Prelims", icon: "clipboard-text-outline", type: "MaterialCommunityIcons", route: "/prelims" },
  { label: "Mains", icon: "book-open-variant", type: "MaterialCommunityIcons", route: "/mains" },
  { label: "Chat", icon: "chatbubble-outline", type: "Ionicons", route: "/chat" },
];

export default function Preparation() {
  const { subcategoryId } = useLocalSearchParams<{ subcategoryId?: string }>();
  const [activeTab, setActiveTab] = useState("Prelims");
  const [subCategoryList, setSubCategoryList] = useState<Prelim[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchSubCategory = async () => {
    setError(null);
    try {
      const response = await axios.get<PrelimesListResponse>(
        "https://api.raoslawacademy.com/prelimes?page=1&limit=10&userId=4237c5bb-30d1-495a-96f8-d70ba48ec110",
    
      );

      if (response.data.statusCode === 200) {
        setSubCategoryList(response.data.data);
      } else {
        setError("Couldn't load course.");
      }
    } catch (err: any) {
      console.log(err?.response?.data || err.message);
      setError("Couldn't load course.");
    }
  };

  useEffect(() => {
    fetchSubCategory();
  }, [subcategoryId]);

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
          <Text style={styles.headerTitle}>Prelims Preparation</Text>
          <TouchableOpacity onPress={() => router.push("/notes_module/pdf_notes/Notes")}>
            <Ionicons name="cart-outline" size={26} color="#222" />
          </TouchableOpacity>
        </View>

        {error ? (
          <View style={styles.centerWrap}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchSubCategory}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={subCategoryList}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <PrelimsCard item={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
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
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 15,
  },
    cardImage: { width: "100%", height: 150, borderRadius: 12, marginBottom: 12 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#222" },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  centerWrap: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  errorText: { color: COLORS.gray, fontSize: 14 },
  retryBtn: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: { color: "#fff", fontWeight: "700" },
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
    color: "#222",
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  priceText: { fontSize: 16, fontWeight: "700", color: "#222" },
  addToCartBtn: {
    backgroundColor: COLORS.pink,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  addToCartText: { color: COLORS.pinkText, fontSize: 13, fontWeight: "700" },
  exploreFullBtn: {
    backgroundColor: COLORS.navy,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  exploreFullText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  buttonRow: { flexDirection: "row", gap: 10 },
  exploreBtn: {
    flex: 1,
    backgroundColor: COLORS.lightBlue,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
  },
  exploreBtnText: { color: COLORS.navy, fontSize: 14, fontWeight: "700" },
  buyBtn: {
    flex: 1,
    backgroundColor: COLORS.navy,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
  },
  buyBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
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