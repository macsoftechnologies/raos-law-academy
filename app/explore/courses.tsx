import React, { useState, useEffect, useCallback } from "react";
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
import { useCartWishlist } from "@/src/context/CartWishlistContext";
import { getImageUrl, FALLBACK_COURSE_IMAGE, apiClient } from "@/src/api/client";
import { parseApiError } from "@/src/api/errorHandler";

interface Category {
  _id: string;
  categoryId: string;
  category_name: string;
  tag_text: string;
  presentation_file: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface SubCategory {
  _id: string;
  subcategory_id: string;
  presentation_image: string;
  title: string;
  about_course: string;
  terms_conditions: string;
  categoryId: Category[] | string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function Courses() {
  const { sub_categoryId } = useLocalSearchParams<{ sub_categoryId: string }>();

  const {
    cartCount,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
  } = useCartWishlist();

  const [courselist, setCourselist] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const fetchSubcategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (sub_categoryId && sub_categoryId.trim()) {
        response = await apiClient.post(
          "/subcategories/getbycategory",
          { categoryId: sub_categoryId }
        );
      } else {
        response = await apiClient.get(
          "/subcategories?page=1&limit=10"
        );
      }

      if (
        response.data?.statusCode === 200 ||
        response.data?.statusCode === 201 ||
        response.status === 200 ||
        response.status === 201
      ) {
        setCourselist(response.data.data || []);
      } else {
        setError(response.data?.message || "Failed to load courses");
      }
    } catch (err: any) {
      console.log("Subcategories API Error:", err?.response?.data || err.message);
      const parsed = parseApiError(err);
      setError(parsed.message);
    } finally {
      setLoading(false);
    }
  }, [sub_categoryId]);

  useEffect(() => {
    fetchSubcategories();
  }, [fetchSubcategories]);

  const handleBuyNow = (course: SubCategory) => {
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

  const handleViewDetails = (course: SubCategory) => {
    router.push({
      pathname: "/explore/courseoverview",
      params: {
        sub_categoryId: course.subcategory_id,
        subcategoryId: course.subcategory_id,
        courseId: course.subcategory_id,
        id: course._id,
        title: course.title,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Courses</Text>

        <TouchableOpacity
          onPress={() => router.push("/sidepanel/wish_cart/wish_buy")}
          style={{ position: "relative", padding: 4 }}
          hitSlop={10}
        >
          <Ionicons name="cart-outline" size={26} color="#000" />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#23408E" />
            <Text style={styles.statusText}>Loading courses...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Ionicons name="alert-circle-outline" size={44} color="#E53935" />
            <Text style={[styles.statusText, { color: "#E53935", textAlign: "center" }]}>
              {error}
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchSubcategories}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : courselist.length === 0 ? (
          <View style={styles.centerContainer}>
            <Ionicons name="folder-open-outline" size={44} color="#888" />
            <Text style={styles.statusText}>No courses available in this category.</Text>
          </View>
        ) : (
          courselist.map((item) => {
            const courseId = item.subcategory_id || item._id;
            const isWishlisted = isInWishlist(courseId);
            const imgUri = getImageUrl(item.presentation_image);
            const isImgError = !imgUri || imageErrors[item._id];
            return (
              <View key={item._id} style={styles.card}>
                <View style={{ position: "relative" }}>
                  <Image
                    source={isImgError ? FALLBACK_COURSE_IMAGE : { uri: imgUri }}
                    onError={() =>
                      setImageErrors((prev) => ({ ...prev, [item._id]: true }))
                    }
                    defaultSource={FALLBACK_COURSE_IMAGE}
                    style={styles.image}
                  />

                  <TouchableOpacity
                    style={styles.heartButton}
                    onPress={async () => {
                      if (isWishlisted) {
                        await removeFromWishlist(courseId);
                      } else {
                        await addToWishlist(courseId, "prelimes");
                      }
                    }}
                    hitSlop={10}
                  >
                    <Ionicons
                      name={isWishlisted ? "heart" : "heart-outline"}
                      size={22}
                      color={isWishlisted ? "#E53935" : "#111"}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.content}>
                  <Text style={styles.title}>{item.title}</Text>

                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.buyButton}
                      onPress={() => handleBuyNow(item)}
                    >
                      <Text style={styles.buyText}>Buy Now</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.detailsButton}
                      onPress={() => handleViewDetails(item)}
                    >
                      <Text style={styles.detailsText}>View Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF1F8",
    paddingHorizontal: 16,
    paddingTop: 50,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  image: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },

  content: {
    padding: 14,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 14,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },

  buyButton: {
    flex: 1,
    backgroundColor: "#23408E",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  buyText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  detailsButton: {
    flex: 1,
    backgroundColor: "#E8EDFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  detailsText: {
    color: "#23408E",
    fontSize: 15,
    fontWeight: "700",
  },

  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },

  statusText: {
    fontSize: 15,
    color: "#666",
    marginTop: 12,
  },

  retryButton: {
    marginTop: 14,
    paddingHorizontal: 20,
    paddingVertical: 9,
    backgroundColor: "#23408E",
    borderRadius: 8,
  },

  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  cartBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#E53935",
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },

  cartBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },

  heartButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
});