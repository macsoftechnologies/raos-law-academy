import React, { useEffect, useState } from "react";
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
import { Toast } from "react-native-toast-message/lib/src/Toast";

export interface MainsResponse {
  statusCode: number;
  message: string;
  data: MainsDetail[];
}

export interface MainsDetail {
  _id: string;
  mains_id: string;
  title: string;
  sub_title: string;
  about_course: string;
  course_points: string[];
  terms_conditions: string;
  presentation_image: string;
  subcategory_id: MainsSubcategory[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface MainsSubcategory {
  _id: string;
  subcategory_id: string;
  presentation_image: string;
  title: string;
  about_course: string;
  terms_conditions: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const NAVY = "#0A1A3B";
const IMAGE_BASE_URL = "https://api.raoslawacademy.com/uploads/"; // adjust to your real image base path

const TABS = [
  { key: "home", label: "Home", icon: "home-outline" as const },
  { key: "notes", label: "Notes", icon: "document-text-outline" as const },
  { key: "prelims", label: "Prelims", icon: "book-outline" as const },
  { key: "mains", label: "Mains", icon: "reader-outline" as const },
  { key: "chat", label: "Chat", icon: "chatbubble-outline" as const },
];

export default function MainsPreparationEnrolled() {
  const { mains_id } = useLocalSearchParams<{ mains_id: string }>();

  const [mainsData, setMainsData] = useState<MainsDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  console.log("received mains_id:", mains_id);

  const fetchMainsDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.post<MainsResponse>(
        "https://api.raoslawacademy.com/mains/details",
        { mains_id }
      );

      if (response.data.statusCode === 200) {
        setMainsData(response.data.data);
        console.log("Mains Details Response:", response.data.data);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: response.data.message || "Couldn't load mains details.",
        });
      }
    } catch (error: any) {
      console.error("Error fetching mains details:", error?.response?.data || error.message);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Couldn't load mains details. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mains_id) {
      fetchMainsDetails();
    }
  }, [mains_id]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDEEF5" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mains Preparation</Text>
        <Ionicons name="cart-outline" size={26} color={NAVY} />
      </View>

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={NAVY} />
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {mainsData.map((course) => (
            <View key={course._id} style={styles.card}>
              <View style={styles.previewBox}>
                {course.presentation_image ? (
                  <Image
                    source={{ uri: `${IMAGE_BASE_URL}${course.presentation_image}` }}
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                ) : (
                  <>
                    <View style={styles.previewHeader} />
                    {Array.from({ length: 6 }).map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.previewLine,
                          { width: i % 3 === 0 ? "55%" : "88%" },
                        ]}
                      />
                    ))}
                  </>
                )}
                <Text style={styles.watermark}>PREVIEW</Text>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.subTitle}>{course.sub_title}</Text>

                <View style={styles.pointsWrap}>
                  {course.course_points.map((point, idx) => (
                    <View key={idx} style={styles.pointRow}>
                      <Ionicons name="checkmark-circle" size={14} color={NAVY} />
                      <Text style={styles.pointText}>{point}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.openBtn}
                onPress={() =>
  router.push({
    pathname: "/mains/before_buying/instruction_main",
    params: {
      mains_id: course.mains_id,
      mainsData: JSON.stringify(course),
    },
  } as any)
}
                >
                  <Text style={styles.openBtnText}>Open</Text>
                </TouchableOpacity>
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
                  <Ionicons name={tab.icon} size={24} color={NAVY} />
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
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 22, fontWeight: "700", color: NAVY },
  centerState: { flex: 1, alignItems: "center", justifyContent: "center" },
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
    overflow: "hidden",
  },
  previewImage: { ...StyleSheet.absoluteFill },
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
    color: NAVY,
    opacity: 0.08,
    letterSpacing: 4,
    transform: [{ rotate: "-20deg" }],
  },
  cardBody: { padding: 16 },
  courseTitle: { fontSize: 17, fontWeight: "700", color: NAVY },
  subTitle: { fontSize: 13, color: "#5B6178", marginTop: 4, marginBottom: 10 },
  pointsWrap: { marginBottom: 14, gap: 6 },
  pointRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  pointText: { fontSize: 12.5, color: "#3A3F55" },
  openBtn: {
    backgroundColor: NAVY,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
  },
  openBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: NAVY,
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
    borderColor: NAVY,
    marginBottom: 4,
  },
  activeTabLabel: { fontSize: 11, color: "#D8AE24", fontWeight: "600" },
});