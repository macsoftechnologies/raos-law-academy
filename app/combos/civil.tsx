import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

export interface Category {
  _id: string;
  categoryId: string;
  category_name: string;
  tag_text: string;
  presentation_file: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Subcategory {
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

export interface LectureConfig {
  access_type: "law-based" | "subject-based";
  law_id: string;
  subject_ids?: string[]; // only present when access_type is "subject-based"
}

export interface NotesConfig {
  access_type: "law-based" | "subject-based";
  law_id: string;
  subject_ids?: string[]; // only present when access_type is "subject-based"
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
  subcategory_id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PrelimesDetail {
  _id: string;
  prelimes_id: string;
  title: string;
  sub_title: string;
  about_course: string;
  course_points: string[];
  terms_conditions: string;
  presentation_image: string;
  subcategory_id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ComboListItem {
  _id: string;
  combo_id: string;
  title: string;
  description: string;
  presentation_image?: string;
  categoryId: string;
  subcategory_id: string;
  includes_lectures: boolean;
  includes_notes: boolean;
  includes_prelimes: boolean;
  includes_mains: boolean;
  mains_ids: string[];
  prelimes_ids: string[];
  lecture_config?: LectureConfig;
  notes_config?: NotesConfig;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  category: Category;
  subcategory: Subcategory;
  mains_details: MainsDetail[];
  prelimes_details: PrelimesDetail[];
}

export interface ComboListResponse {
  statusCode: number;
  message: string;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  data: ComboListItem[];
}

// Fallback image used when a combo has no presentation_image from the API
const FALLBACK_IMAGE = require("../../assets/images/civil.png");

export default function Civil() {

  
  const { userId} = useLocalSearchParams<{  userId: string }>();

   console.log( userId + "RECEIVED DATA");

  const [combolist, setCombolist] = useState<ComboListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("[Civil] useEffect fired, about to fetch combo list");

    const fetchCombolist = async () => {
      console.log("[Civil] fetchCombolist started");
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get<ComboListResponse>(
          "https://api.raoslawacademy.com/combos/list?page=1&limit=10"
        );

        console.log("[Civil] response received, status:", response.data?.statusCode);

        if (response.data?.statusCode === 200) {
          const comboId = response.data.data[0]?.combo_id;
          console.log("[Civil] comboId fetched:", comboId);
          setCombolist(response.data.data);
        } else {
          setError("Couldn't load courses right now.");
        }
      } catch (err: any) {
        console.log(
          "[Civil] Combo list API Error:",
          err?.response?.status,
          err?.response?.data || err.message
        );
        setError("Couldn't load courses right now.");
      } finally {
        setLoading(false);
        console.log("[Civil] fetchCombolist finished");
      }
    };

    fetchCombolist();
  }, []);



  
  const handleBuyNow = (course: ComboListItem) => {
      const comboId = course.combo_id;

      console.log(comboId + "received comboId")
 
    router.push({
      pathname: "/combos/criminal",
      params: { combo_id: comboId, userId: userId},
    });


 
     
  // console.log(comboId + "recived combo id");


  };

  const handleViewDetails = (course: ComboListItem) => {
    router.push({
      pathname: "/combos/criminal",
      params: { combo_id: course.combo_id },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={26} color="#1B2559" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Civil Laws</Text>

        <View style={{ width: 26 }} />
      </View>

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#1B2559" />
        </View>
      ) : error ? (
        <View style={styles.centerState}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : combolist.length === 0 ? (
        <View style={styles.centerState}>
          <Text style={styles.emptyText}>No courses available right now.</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {combolist.map((course) => (
            <View key={course._id} style={styles.card}>
              <Image
                source={
                  course.presentation_image
                    ? { uri: course.presentation_image }
                    : FALLBACK_IMAGE
                }
                style={styles.cardImage}
                resizeMode="cover"
              />

              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{course.title}</Text>
                {!!course.description && (
                  <Text style={styles.cardDescription} numberOfLines={2}>
                    {course.description}
                  </Text>
                )}

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.exploreButton]}
                    onPress={() => handleViewDetails(course)}
                  >
                    <Text style={styles.exploreButtonText}>Explore more</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.buyButton]}
                    onPress={() => handleBuyNow(course)}
                  >
                    <Text style={styles.buyButtonText}>Buy Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F3F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1B2559",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 15,
    color: "#7A1F2B",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 180,
  },
  cardBody: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1B2559",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  exploreButton: {
    backgroundColor: "#EEF1FB",
    borderWidth: 1,
    borderColor: "#1B2559",
  },
  exploreButtonText: {
    color: "#1B2559",
    fontSize: 15,
    fontWeight: "600",
  },
  buyButton: {
    backgroundColor: "#1B2559",
  },
  buyButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});