import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

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

// Prepend to presentation_image filenames returned by the API.
// Replace with your actual S3 / CDN base URL.
const IMAGE_BASE_URL = "https://api.raoslawacademy.com/uploads/";

const FALLBACK_IMAGE = require("../../assets/images/c1.png");

export default function CourseOverviewDetails() {
  const { lawId, userId } = useLocalSearchParams<{
    lawId: string;
    userId: string;
  }>();
  console.log("lawId:", lawId, "userId:", userId   + "received the data"); 

  const [subjectNotes, setSubjectNotes] = useState<SubjectNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsercourselist = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post<SubjectNotesOfLawResponse>(
          "https://api.raoslawacademy.com/subject-notes/notesbylaw",
          {
           lawId: lawId??"a816f02b-b03a-4e7a-a94c-bde6ba83c5f3",
            userId: userId ?? "4237c5bb-30d1-495a-96f8-d70ba48ec110",
          }
        );

        if (response.data?.statusCode === 200) {
          setSubjectNotes(response.data.data);
        }
      } catch (error: any) {
        console.log("User API Error:", error?.response?.data || error.message);
        setError("Failed to load subjects");
      } finally {
        setLoading(false);
      }
    };
    fetchUsercourselist();
  }, [lawId, userId]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Civil Laws</Text>

        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {loading ? (
          <Text style={styles.statusText}>Loading subjects...</Text>
        ) : error ? (
          <Text style={styles.statusText}>{error}</Text>
        ) : subjectNotes.length === 0 ? (
          <Text style={styles.statusText}>No subjects found.</Text>
        ) : (
          subjectNotes.map((item) => {
            // NOTE: this API response has no enrollment/expiry/duration
            // fields (isEnrolled, expiry_date, remaining_duration etc).
            // "purchased" below is a placeholder derived from isLocked —
            // swap in the real enrollment field once it's available,
            // otherwise every card renders as "Explore more".
            const purchased = item.isLocked === false && false; // always false until real field exists

            return (
              <View key={item._id} style={styles.card}>
                <Image
                  source={
                    item.presentation_image
                      ? { uri: IMAGE_BASE_URL + item.presentation_image }
                      : FALLBACK_IMAGE
                  }
                  style={styles.image}
                />

                <View style={styles.content}>
                  <View style={styles.titleRow}>
                    <Text style={styles.title}>{item.title}</Text>

                    {purchased && (
                      <View style={styles.expiryBadge}>
                        <Text style={styles.expiryText}>-- left</Text>
                      </View>
                    )}
                  </View>

                  {purchased && (
                    <View style={styles.bottomRow}>
                      <Text style={styles.endsText}>Ends on --</Text>

                      <View style={styles.durationBadge}>
                        <Text style={styles.durationText}>-- Course</Text>
                      </View>
                    </View>
                  )}

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      router.push({
                        pathname: "/explore/coursepackage",
                        params: { subjectNotesId: item.subject_notes_id },
                      })
                    }
                  >
                    <Text style={styles.buttonText}>
                      {purchased ? "Open" : "Explore more"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {!purchased && (
                  <TouchableOpacity style={styles.heart}>
                    <Ionicons name="heart-outline" size={24} color="#000" />
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
    fontSize: 30,
    fontWeight: "700",
    color: "#111",
    marginRight: 28,
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
    fontSize: 24,
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
    fontSize: 20,
    fontWeight: "700",
  },

  heart: {
    position: "absolute",
    right: 20,
    bottom: 90,
  },

  statusText: {
    fontSize: 14,
    color: "#666",
    marginTop: 20,
  },
});