import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";

interface MainsItem {
  _id: string;
  mains_id: string;
  title: string;
  sub_title: string;
  presentation_image: string;
  subcategory_id: string;
  isEnrolled: boolean;
  remaining_duration: number | null;
  availablePlans: unknown[];
  enroll_date?: string;
  expiry_date: string | null;
}

interface MainsListResponse {
  statusCode: number;
  message: string;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  data: MainsItem[];
}

// TODO: confirm the actual host that serves these image filenames
const IMAGE_BASE_URL = "https://api.raoslawacademy.com/uploads/";
const FALLBACK_PRICE = 499;

const TABS = [
  { key: "home", label: "Home", icon: "home-outline" as const },
  { key: "notes", label: "Notes", icon: "document-text-outline" as const },
  { key: "prelims", label: "Prelims", icon: "book-outline" as const },
  { key: "mains", label: "Mains", icon: "reader-outline" as const },
  { key: "chat", label: "Chat", icon: "chatbubble-outline" as const },
];

export default function MainsPreparation() {
  const { userId } = useLocalSearchParams<{ userId?: string }>();

  const [mainsList, setMainsList] = useState<MainsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMainsList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get<MainsListResponse>(
        `https://api.raoslawacademy.com/mains?page=1&limit=10&userId=4237c5bb-30d1-495a-96f8-d70ba48ec110`,
        { params: { userId } }
      );

      setMainsList(res.data.data ?? []);
    } catch (err) {
      console.error("Failed to fetch mains list:", err);
      setError("Couldn't load mains courses. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetchMainsList();
  }, [userId, fetchMainsList]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDEEF5" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mains Preparation</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.testSeriesBtn}
            onPress={() => {
              router.push({
                pathname: "/mains/test_series/main_test", // TODO: confirm actual route
              });
            }}
          >
            <Text style={styles.testSeriesBtnText}> Main Test Series</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="cart-outline" size={26} color="#0A1A3B" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerWrap}>
          <ActivityIndicator size="large" color="#0A1A3B" />
        </View>
      ) : error ? (
        <View style={styles.centerWrap}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchMainsList}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : mainsList.length === 0 ? (
        <View style={styles.centerWrap}>
          <Text style={styles.emptyText}>No mains courses available.</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {mainsList.map((course) => (
            <View key={course._id} style={styles.card}>
              <View style={styles.previewBox}>
                {course.presentation_image ? (
                  <Image
                    source={{ uri: `https://api.raoslawacademy.com/${course.presentation_image}` }}
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                ) : (
                  <>
                    <View style={styles.previewHeader} />
                    {Array.from({ length: 8 }).map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.previewLine,
                          { width: i % 3 === 0 ? "55%" : "88%" },
                        ]}
                      />
                    ))}
                    <Text style={styles.watermark}>PREVIEW</Text>
                  </>
                )}
              </View>

              <View style={styles.cardBody}>
                <View style={styles.titleRow}>
                  <View style={{ flexShrink: 1 }}>
                    <Text style={styles.courseTitle}>{course.title}</Text>
                    <Text style={styles.courseSubtitle}>{course.sub_title}</Text>
                  </View>
                  {!course.isEnrolled && (
                    <TouchableOpacity style={styles.addToCartBtn}>
                      <Text style={styles.addToCartText}>Add to cart</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {course.isEnrolled ? (
                  <>
                    {course.remaining_duration !== null && (
                      <Text style={styles.durationText}>
                        {course.remaining_duration} days remaining
                      </Text>
                    )}
                    <TouchableOpacity style={styles.exploreFullBtn}>
                      <Text style={styles.exploreFullBtnText}>Continue</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={styles.price}>₹{FALLBACK_PRICE}</Text>
                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        style={styles.exploreBtn}
                        onPress={() => {
                          console.log("received mains id" + course.mains_id);
                          router.push({
                            pathname: "/mains/before_buying/prepartion",
                            params: {
                              mains_id: course.mains_id ?? "",
                            },
                          });
                        }}
                      >
                        <Text style={styles.exploreBtnText}>Explore More</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.buyBtn}>
                        <Text style={styles.buyBtnText}>Buy Now</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.bottomNav}>
        {TABS.map((tab) => {
          const isActive = tab.key === "mains";
          if (isActive) {
            return (
              <TouchableOpacity key={tab.key} style={styles.activeTabWrap}>
                <View style={styles.activeTabCircle}>
                  <Ionicons name={tab.icon} size={24} color="#0A1A3B" />
                </View>
                <Text style={styles.activeTabLabel}>{tab.label}</Text>
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity key={tab.key} style={styles.tabItem}>
              <Ionicons name={tab.icon} size={22} color="#8A8FA3" />
              <Text style={styles.tabLabel}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#EDEEF5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 43,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#0A1A3B" },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  testSeriesBtn: {
    backgroundColor: "#0A1A3B",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  testSeriesBtnText: {
    color: "rgb(221, 214, 192)",
    fontSize: 12,
    fontWeight: "700",
  },
  centerWrap: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  errorText: { color: "#7A1F2B", fontSize: 14, textAlign: "center", paddingHorizontal: 24 },
  retryBtn: {
    backgroundColor: "#0A1A3B",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  retryBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
  emptyText: { color: "#8A8FA3", fontSize: 14 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  previewBox: {
    backgroundColor: "#F7F8FC",
    paddingHorizontal: 16,
    paddingVertical: 14,
    height: 170,
    justifyContent: "flex-start",
  },
  previewImage: { width: "100%", height: "100%", borderRadius: 8 },
  previewHeader: {
    height: 8,
    width: "40%",
    backgroundColor: "#D9DCEA",
    borderRadius: 4,
    marginBottom: 10,
  },
  previewLine: {
    height: 6,
    backgroundColor: "#E3E5F1",
    borderRadius: 3,
    marginBottom: 8,
  },
  watermark: {
    position: "absolute",
    alignSelf: "center",
    top: "45%",
    fontSize: 22,
    fontWeight: "700",
    color: "#0A1A3B",
    opacity: 0.08,
    letterSpacing: 4,
    transform: [{ rotate: "-20deg" }],
  },
  cardBody: { padding: 16 },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  courseTitle: { fontSize: 17, fontWeight: "700", color: "#0A1A3B" },
  courseSubtitle: { fontSize: 12, color: "#8A8FA3", marginTop: 2 },
  addToCartBtn: {
    borderWidth: 1,
    borderColor: "#7A1F2B",
    backgroundColor: "#FBEAEC",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  addToCartText: { color: "#7A1F2B", fontSize: 12, fontWeight: "600" },
  durationText: { fontSize: 13, color: "#23408E", marginTop: 6, marginBottom: 10 },
  price: { fontSize: 16, fontWeight: "700", color: "#23408E", marginTop: 6, marginBottom: 14 },
  buttonRow: { flexDirection: "row", gap: 12 },
  exploreBtn: {
    flex: 1,
    backgroundColor: "#DCE7FA",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  exploreBtnText: { color: "#0A1A3B", fontSize: 14, fontWeight: "600" },
  buyBtn: {
    flex: 1,
    backgroundColor: "#0A1A3B",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  buyBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
  exploreFullBtn: {
    backgroundColor: "#0A1A3B",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 4,
  },
  exploreFullBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#0A1A3B",
    paddingTop: 10,
    paddingBottom: 18,
    paddingHorizontal: 8,
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
  tabItem: { alignItems: "center", gap: 4, flex: 1 },
  tabLabel: { fontSize: 11, color: "#8A8FA3" },
  activeTabWrap: { alignItems: "center", flex: 1, marginTop: -28 },
  activeTabCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#D8AE24",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#0A1A3B",
    marginBottom: 4,
  },
  activeTabLabel: { fontSize: 11, color: "#D8AE24", fontWeight: "600" },
});