import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

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
  law_id: string;
  categoryId: string;
  isEnrolled: boolean;
  remaining_duration: number | null;
  availablePlans: AvailablePlan[];
  enroll_date: string | null;
  expiry_date: string | null;
}

export interface SubjectEnrollmentResponse {
  statusCode: number;
  message: string;
  data: Subject[];
}

const { width } = Dimensions.get("window");

// Fallback image shown when a subject has no subject_image from the API
const FALLBACK_IMAGE = require("../../assets/images/Rectangle40.png");

export default function Details() {
  const { subjectId, userId } = useLocalSearchParams<{
    subjectId: string;
    userId: string;
  }>();

  const [subjectlist, setSubjectlist] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsercourselist = async () => {
      setLoading(true);
      setError(null);
      try {



        const response = await axios.post<SubjectEnrollmentResponse>(
          "https://api.raoslawacademy.com/subjects/listbylawforuser",
          {
            law_id: "a816f02b-b03a-4e7a-a94c-bde6ba83c5f3",
            userId: userId ?? "4237c5bb-30d1-495a-96f8-d70ba48ec110",
          }
        );

        if (response.data?.statusCode === 200) {
          setSubjectlist(response.data.data);
        }

  
      } catch (error: any) {
        console.log("User API Error:", error?.response?.data || error.message);
        setError("Failed to load subjects");
      } finally {
        setLoading(false);
      }
    };
    fetchUsercourselist();
  }, [userId]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>JCJ Subject List</Text>

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
        ) : subjectlist.length === 0 ? (
          <Text style={styles.statusText}>No subjects found.</Text>
        ) : (
          subjectlist.map((subject) => (
            <View key={subject._id} style={styles.card}>
              <Image
                source={
                  subject.subject_image
                    ? { uri: subject.subject_image }
                    : FALLBACK_IMAGE
                }
                style={styles.image}
              />

              <View style={styles.content}>
                <Text style={styles.title}>{subject.title}</Text>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() =>
                    router.push({
                      pathname: "/subjectlist/subjectlist",
                      params: { userId: userId },
                    })
                  }
                >
                  <Text style={styles.buttonText}>Explore more</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
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
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#111",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 22,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },

  image: {
    width: "100%",
    height: 220,
    resizeMode: "cover",
  },

  content: {
    padding: 16,
  },

  title: {
    fontSize: 21,
    fontWeight: "700",
    color: "#111",
    marginBottom: 18,
  },

  button: {
    height: 50,
    borderRadius: 10,
    backgroundColor: "#24479C",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },

  statusText: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
    marginBottom: 16,
  },
});