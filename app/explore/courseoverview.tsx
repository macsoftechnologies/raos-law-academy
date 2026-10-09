import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { getImageUrl, FALLBACK_COURSE_IMAGE, apiClient } from "@/src/api/client";
import { parseApiError } from "@/src/api/errorHandler";

// ---- Types ----
interface SubCategoryData {
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

interface SubCategoryResponse {
  statusCode: number;
  message: string;
  data: SubCategoryData;
}

export default function SubCategoryScreen() {
  const params = useLocalSearchParams<{
    sub_categoryId?: string;
    subcategoryId?: string;
    subcategory_id?: string;
    courseId?: string;
    id?: string;
  }>();

  const effectiveSubcategoryId =
    params.subcategory_id ||
    params.sub_categoryId ||
    params.subcategoryId ||
    (params.courseId && params.courseId.includes("-") ? params.courseId : undefined) ||
    "37634c0a-1deb-4cee-aaa9-888f60af09c9";

  const [subCategory, setSubCategory] = useState<SubCategoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const fetchSubCategory = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.post<SubCategoryResponse>(
        "/subcategories/details",
        {
          subcategory_id: effectiveSubcategoryId,
        }
      );

      if (
        response.data?.statusCode === 200 ||
        response.data?.statusCode === 201 ||
        response.status === 200
      ) {
        setSubCategory(response.data.data);
      } else {
        setError(response.data?.message || "Couldn't load course.");
      }
    } catch (err: any) {
      console.log("Subcategory fetch error:", err?.response?.data || err.message);
      const parsed = parseApiError(err);
      setError(parsed.message || "Couldn't load course.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategory();
  }, [effectiveSubcategoryId]);

  // ---- Handlers ----
  const handleViewDetails = (course: SubCategoryData) => {
    router.push({
      pathname: "/explore/coursepackage",
      params: {
        sub_categoryId: course.subcategory_id,
        subcategoryId: course.subcategory_id,
        courseId: course.subcategory_id,
        id: course._id,
        title: course.title,
      },
    });
  };

  const handleBuyNow = (course: SubCategoryData) => {
    console.log("Buy Now clicked for course:", {
      _id: course._id,
      subcategory_id: course.subcategory_id,
      title: course.title,
      categoryId: course.categoryId,
    });

    router.push({
      pathname: "/explore/coursepackage",
      params: {
        sub_categoryId: course.subcategory_id,
        subcategoryId: course.subcategory_id,
        courseId: course.subcategory_id,
        id: course._id,
        title: course.title,
        buyNow: "true",
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={26} color="#0A1A3B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Course</Text>

        <View style={{ width: 26 }} />
      </View>

      {/* {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#0A1A3B" />
        </View>
      ) : error ? (
        <View style={styles.centerState}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : subCategoryList.length === 0 ? (
        <View style={styles.centerState}>
          <Text style={styles.emptyText}>No courses available right now.</Text>
        </View>
      ) : ( */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
       {loading ? (
  <View style={styles.centerState}>
    <ActivityIndicator size="large" color="#0A1A3B" />
  </View>
) : error ? (
  <View style={styles.centerState}>
    <Text style={styles.errorText}>{error}</Text>
  </View>
) : subCategory ? (
  <ScrollView
    contentContainerStyle={styles.scrollContent}
    showsVerticalScrollIndicator={false}
  >
    <View style={styles.card}>
      <Image
        source={
          (!getImageUrl(subCategory.presentation_image) || imageError)
            ? FALLBACK_COURSE_IMAGE
            : { uri: getImageUrl(subCategory.presentation_image) }
        }
        onError={() => setImageError(true)}
        defaultSource={FALLBACK_COURSE_IMAGE}
        style={styles.cardImage}
        resizeMode="cover"
      />

      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>
          {subCategory.title}
        </Text>


        <Text style={styles.cardDescription}  ellipsizeMode="tail">
   {subCategory.about_course}
</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.exploreButton]}
            onPress={() => handleViewDetails(subCategory)}
          >
            <Text style={styles.exploreButtonText}>
              Explore More
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.buyButton]}
            onPress={() => handleBuyNow(subCategory)}
          >
            <Text style={styles.buyButtonText}>
              Buy Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </ScrollView>
) : (
  <View style={styles.centerState}>
    <Text>No course found.</Text>
  </View>
)}
        </ScrollView>
      {/* )} */}
    </View>
  );
}

// ---- Styles ----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF0F4",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0A1A3B",
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 15,
    color: "#B00020",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#F3F4F6",
  },
  cardBody: {
    padding: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0A1A3B",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  exploreButton: {
    backgroundColor: "#F1F4FA",
    borderWidth: 1,
    borderColor: "#0A1A3B",
  },
  exploreButtonText: {
    color: "#0A1A3B",
    fontWeight: "600",
    fontSize: 13,
  },
  buyButton: {
    backgroundColor: "#0A1A3B",
  },
  buyButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
});