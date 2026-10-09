import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCartWishlist } from "@/src/context/CartWishlistContext";
import { getImageUrl, FALLBACK_NOTE_IMAGE, apiClient } from "@/src/api/client";
import { parseApiError } from "@/src/api/errorHandler";

export interface SubjectNote {
  _id: string;
  subject_notes_id: string;
  notes_id: string;
  lawId: string;
  title: string;
  pdf_url: string;
  isLocked: boolean;
  presentation_image: string;
  subjectId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SubjectNotesOfLawResponse {
  statusCode: number;
  message: string;
  data: SubjectNote[];
}

const FALLBACK_IMAGE = FALLBACK_NOTE_IMAGE;

export default function CourseOverviewDetails() {
  const params = useLocalSearchParams<{
    lawId?: string;
    LAW_ID?: string;
    law_id?: string;
    userId?: string;
    title?: string;
    subject?: string;
  }>();

  const effectiveLawId =
    params.lawId || params.LAW_ID || params.law_id || "a816f02b-b03a-4e7a-a94c-bde6ba83c5f3";

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    cartCount,
    currentUserId,
  } = useCartWishlist();

  const effectiveUserId = params.userId || currentUserId;
  const headerTitle = params.title || params.subject || "Civil Laws";

  const [subjectNotes, setSubjectNotes] = useState<SubjectNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const fetchUsercourselist = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<SubjectNotesOfLawResponse>(
        "/subject-notes/notesbylaw",
        {
          lawId: effectiveLawId,
          userId: effectiveUserId,
        }
      );

      if (
        response.data?.statusCode === 200 ||
        response.data?.statusCode === 201 ||
        response.status === 200 ||
        response.status === 201
      ) {
        setSubjectNotes(response.data.data || []);
      } else {
        setError(response.data?.message || "Failed to load subjects");
      }
    } catch (err: any) {
      console.log("Subject Notes API Error:", err?.response?.data || err.message);
      const parsed = parseApiError(err);
      setError(parsed.message);
    } finally {
      setLoading(false);
    }
  }, [effectiveLawId, effectiveUserId]);

  useEffect(() => {
    fetchUsercourselist();
  }, [fetchUsercourselist]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{headerTitle}</Text>

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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#23408E" />
            <Text style={styles.statusText}>Loading subjects...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Ionicons name="alert-circle-outline" size={44} color="#E53935" />
            <Text style={[styles.statusText, { color: "#E53935", textAlign: "center" }]}>
              {error}
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchUsercourselist}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : subjectNotes.length === 0 ? (
          <View style={styles.centerContainer}>
            <Ionicons name="folder-open-outline" size={44} color="#888" />
            <Text style={styles.statusText}>No subjects found.</Text>
          </View>
        ) : (
          subjectNotes.map((item) => {
            const purchased = item.isLocked === false;
            const noteId = item.notes_id || item.subject_notes_id;
            const isWishlisted = noteId
              ? isInWishlist(noteId) || isInWishlist(item.subject_notes_id)
              : false;
            const imgUri = getImageUrl(item.presentation_image);
            const isImgError = !imgUri || imageErrors[item._id];

            return (
              <View key={item._id} style={styles.card}>
                <Image
                  source={isImgError ? FALLBACK_IMAGE : { uri: imgUri }}
                  onError={() =>
                    setImageErrors((prev) => ({ ...prev, [item._id]: true }))
                  }
                  defaultSource={FALLBACK_IMAGE}
                  style={styles.image}
                />

                <View style={styles.content}>
                  <View style={styles.titleRow}>
                    <Text style={styles.title}>{item.title}</Text>

                    {purchased && (
                      <View style={styles.expiryBadge}>
                        <Text style={styles.expiryText}>Purchased</Text>
                      </View>
                    )}
                  </View>

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      if (purchased) {
                        router.push({
                          pathname: "/notes_module/pdf_notes/notes_package",
                          params: {
                            subjectNotesId: item.subject_notes_id,
                            notesId: item.notes_id,
                            title: item.title,
                            pdf_url: item.pdf_url,
                            userId: effectiveUserId,
                          },
                        } as any);
                      } else {
                        router.push({
                          pathname: "/explore/coursepackage",
                          params: {
                            subjectNotesId: item.subject_notes_id,
                            courseId: item.notes_id,
                            title: item.title,
                            pdf_url: item.pdf_url,
                          },
                        });
                      }
                    }}
                  >
                    <Text style={styles.buttonText}>
                      {purchased ? "Open" : "Explore more"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {!purchased && (
                  <TouchableOpacity
                    style={styles.heart}
                    onPress={async () => {
                      if (!noteId) return;
                      if (isWishlisted) {
                        await removeFromWishlist(noteId);
                      } else {
                        await addToWishlist(noteId, "notes");
                      }
                    }}
                    hitSlop={10}
                  >
                    <Ionicons
                      name={isWishlisted ? "heart" : "heart-outline"}
                      size={24}
                      color={isWishlisted ? "#E53935" : "#000"}
                    />
                  </TouchableOpacity>
                )}
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
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 26,
    fontWeight: "700",
    color: "#111",
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

  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 24,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },

  image: {
    width: "100%",
    height: 220,
    resizeMode: "cover",
  },

  content: {
    padding: 14,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    flex: 1,
    color: "#111",
  },

  expiryBadge: {
    backgroundColor: "#F5E7E7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },

  expiryText: {
    color: "#8B2B2B",
    fontWeight: "600",
    fontSize: 14,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    alignItems: "center",
  },

  endsText: {
    color: "#8B2B2B",
    fontWeight: "600",
    fontSize: 16,
  },

  durationBadge: {
    backgroundColor: "#E8EDFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  durationText: {
    color: "#23408E",
    fontWeight: "700",
  },

  button: {
    backgroundColor: "#23408E",
    height: 52,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  heart: {
    position: "absolute",
    right: 20,
    bottom: 90,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
});