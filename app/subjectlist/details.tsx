import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCartWishlist } from "@/src/context/CartWishlistContext";
import { getImageUrl, FALLBACK_COURSE_IMAGE, apiClient } from "@/src/api/client";
import { parseApiError } from "@/src/api/errorHandler";

export interface AvailablePlan {
  _id: string;
  planId: string;
  original_price: string;
  strike_price: string;
  duration: string;
  handling_fee: string;
  course_id: string;
  discount_percent: string;
  course_type: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Subject {
  _id: string;
  subjectId: string;
  title: string;
  subject_image: string;
  law_id: any;
  categoryId: any;
  subcategory_id?: any;
  isEnrolled?: boolean;
  remaining_duration?: number | null;
  availablePlans?: AvailablePlan[];
  enroll_date?: string | null;
  expiry_date?: string | null;
}

export interface SubjectEnrollmentResponse {
  statusCode: number;
  message: string;
  data: Subject[];
}

const FALLBACK_IMAGE = FALLBACK_COURSE_IMAGE;

export default function Details() {
  const params = useLocalSearchParams<{
    subjectId?: string;
    subject_id?: string;
    law_id?: string;
    lawId?: string;
    userId?: string;
    title?: string;
    lawTitle?: string;
    categoryName?: string;
  }>();

  const { cartCount, currentUserId } = useCartWishlist();

  const effectiveLawId =
    params.law_id ||
    params.lawId ||
    "a816f02b-b03a-4e7a-a94c-bde6ba83c5f3";

  const effectiveUserId = params.userId || currentUserId || "";

  const selectedSubjectId = params.subject_id || params.subjectId || "";

  const headerTitle = params.lawTitle
    ? `${params.lawTitle} Subject List`
    : params.categoryName
      ? `${params.categoryName} Subject List`
      : params.title
        ? `${params.title}`
        : "Subject List";

  const [subjectlist, setSubjectlist] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const fetchUsercourselist = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!effectiveLawId) {
      setError("No law identifier found. Please return to the dashboard and try again.");
      setLoading(false);
      return;
    }

    try {
      let subjectsData: Subject[] | null = null;
      let apiErrorMessage = "";

      // 1. Primary endpoint: POST /subjects/listbylawforuser
      try {
        const payload: { law_id: string; userId?: string } = {
          law_id: effectiveLawId,
        };
        if (effectiveUserId) {
          payload.userId = effectiveUserId;
        }

        const response = await apiClient.post<SubjectEnrollmentResponse>(
          "/subjects/listbylawforuser",
          payload
        );

        const resData = response.data;
        const isSuccessStatus =
          resData?.statusCode === 200 ||
          resData?.statusCode === 201 ||
          response.status === 200 ||
          response.status === 201;

        if (isSuccessStatus && Array.isArray(resData?.data)) {
          subjectsData = resData.data;
        } else if (resData?.statusCode === 404 || typeof resData?.message === "string") {
          apiErrorMessage = resData.message || "";
        }
      } catch (err: any) {
        console.log("[listbylawforuser] Attempt error:", err?.response?.data || err.message);
        const parsed = parseApiError(err);
        apiErrorMessage = parsed.message;
      }

      // 2. Secondary fallback endpoint: POST /subjects/listbylaw
      if (!subjectsData || subjectsData.length === 0) {
        try {
          const fallbackRes = await apiClient.post<any>("/subjects/listbylaw", {
            law_id: effectiveLawId,
          });

          const fbData = fallbackRes.data;
          const isFallbackSuccess =
            fbData?.statusCode === 200 ||
            fbData?.statusCode === 201 ||
            fallbackRes.status === 200 ||
            fallbackRes.status === 201;

          if (isFallbackSuccess && Array.isArray(fbData?.data) && fbData.data.length > 0) {
            subjectsData = fbData.data;
            apiErrorMessage = "";
          } else if (fbData?.statusCode === 404) {
            apiErrorMessage = fbData.message || apiErrorMessage;
          }
        } catch (fallbackErr: any) {
          console.log("[listbylaw] Fallback error:", fallbackErr?.response?.data || fallbackErr.message);
        }
      }

      if (subjectsData !== null && subjectsData.length > 0) {
        // If a specific subject was clicked on the dashboard, sort it to the top
        if (selectedSubjectId) {
          subjectsData = [...subjectsData].sort((a, b) => {
            const aMatches =
              a._id === selectedSubjectId || a.subjectId === selectedSubjectId;
            const bMatches =
              b._id === selectedSubjectId || b.subjectId === selectedSubjectId;
            if (aMatches && !bMatches) return -1;
            if (!aMatches && bMatches) return 1;
            return 0;
          });
        }

        setSubjectlist(subjectsData);
        setError(null);
      } else if (subjectsData !== null && subjectsData.length === 0) {
        setSubjectlist([]);
        setError(null);
      } else {
        setSubjectlist([]);
        setError(apiErrorMessage || "Subjects not found for this law.");
      }
    } catch (err: any) {
      console.log("Details fetch general error:", err);
      const parsed = parseApiError(err);
      setError(parsed.message || "Failed to load subjects. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [effectiveLawId, effectiveUserId, selectedSubjectId]);

  useEffect(() => {
    fetchUsercourselist();
  }, [fetchUsercourselist]);

  const handleExploreMore = (subject: Subject) => {
    router.push({
      pathname: "/subjectlist/subjectlist",
      params: {
        userId: effectiveUserId,
        lawId: effectiveLawId,
        law_id: effectiveLawId,
        subjectId: subject._id,
        subject_id: subject.subjectId,
        title: subject.title,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={26} color="#0A1A3B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {headerTitle}
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/sidepanel/wish_cart/wish_buy")}
          style={styles.cartIconWrapper}
          hitSlop={12}
        >
          <Ionicons name="cart-outline" size={26} color="#0A1A3B" />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          <View style={styles.stateContainer}>
            <ActivityIndicator size="large" color="#24479C" />
            <Text style={styles.loadingText}>Loading subjects...</Text>
          </View>
        ) : error ? (
          <View style={styles.stateContainer}>
            <Ionicons name="alert-circle-outline" size={52} color="#E53935" />
            <Text style={styles.errorTitle}>Unable to Load Data</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchUsercourselist}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh" size={18} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : subjectlist.length === 0 ? (
          <View style={styles.stateContainer}>
            <Ionicons name="folder-open-outline" size={52} color="#888" />
            <Text style={styles.emptyTitle}>No Subjects Available</Text>
            <Text style={styles.emptyText}>
              There are currently no subjects listed for this law.
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchUsercourselist}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : (
          subjectlist.map((subject, index) => {
            const cardKey = subject._id || subject.subjectId || `subject-${index}`;
            const imgUri = getImageUrl(subject.subject_image);
            const isImgError = !imgUri || imageErrors[cardKey];
            const isSelected =
              selectedSubjectId &&
              (subject._id === selectedSubjectId ||
                subject.subjectId === selectedSubjectId);

            return (
              <View
                key={cardKey}
                style={[
                  styles.card,
                  isSelected && styles.selectedCardBorder,
                ]}
              >
                <View style={styles.imageContainer}>
                  <Image
                    source={isImgError ? FALLBACK_IMAGE : { uri: imgUri }}
                    onError={() =>
                      setImageErrors((prev) => ({ ...prev, [cardKey]: true }))
                    }
                    defaultSource={FALLBACK_IMAGE}
                    style={styles.image}
                  />
                  {subject.isEnrolled && (
                    <View style={styles.enrolledBadge}>
                      <Ionicons
                        name="checkmark-circle"
                        size={14}
                        color="#fff"
                        style={{ marginRight: 4 }}
                      />
                      <Text style={styles.enrolledText}>Enrolled</Text>
                    </View>
                  )}
                  {isSelected && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedBadgeText}>Selected</Text>
                    </View>
                  )}
                </View>

                <View style={styles.content}>
                  <Text style={styles.title}>{subject.title}</Text>

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleExploreMore(subject)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.buttonText}>Explore more</Text>
                  </TouchableOpacity>
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
    backgroundColor: "#EEF2FB",
    paddingTop: 55,
    paddingHorizontal: 18,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  backButton: {
    padding: 4,
  },

  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: "#0A1A3B",
    textAlign: "center",
    marginHorizontal: 10,
  },

  cartIconWrapper: {
    position: "relative",
    padding: 4,
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

  scrollContent: {
    paddingBottom: 40,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  selectedCardBorder: {
    borderWidth: 2,
    borderColor: "#24479C",
  },

  imageContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    backgroundColor: "#E2E8F0",
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  enrolledBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E7D32",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  enrolledText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  selectedBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#24479C",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  selectedBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  content: {
    padding: 18,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0A1A3B",
    marginBottom: 16,
    lineHeight: 24,
  },

  button: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "#24479C",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  stateContainer: {
    paddingVertical: 60,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 14,
    fontSize: 15,
    color: "#555",
    fontWeight: "500",
  },

  errorTitle: {
    marginTop: 14,
    fontSize: 17,
    fontWeight: "700",
    color: "#E53935",
  },

  errorText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },

  emptyTitle: {
    marginTop: 14,
    fontSize: 17,
    fontWeight: "700",
    color: "#333",
  },

  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },

  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: "#24479C",
    borderRadius: 8,
  },

  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});