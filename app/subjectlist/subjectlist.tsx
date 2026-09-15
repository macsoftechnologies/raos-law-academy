import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

export interface AboutBookSection {
  title: string;
  topics: string[];
}

export interface AboutBook {
  description: string;
  sections: AboutBookSection[];
}

export interface NotesItem {
  _id: string;
  notes_id: string;
  title: string;
  sub_title: string;
  about_book: AboutBook;
  presentation_image: string;
  isPrintAvail: boolean;
  printNotes_image: string;
  terms_conditions: string;
  subcategory_id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface LawItem {
  _id: string;
  lawId: string;
  title: string;
  law_image: string;
  subcategory_id: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SubjectRef {
  _id: string;
  subjectId: string;
  title: string;
  subject_image: string;
  law_id: string;
  subcategory_id: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SubjectNote {
  _id: string;
  subject_notes_id: string;
  notes_id: NotesItem[];
  lawId: LawItem[];
  title: string;
  pdf_url: string;
  isLocked: boolean;
  presentation_image: string;
  subjectId: SubjectRef[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SubjectNotesListResponse {
  statusCode: number;
  message: string;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  data: SubjectNote[];
}

// Prepend to presentation_image filenames returned by the API.
// Replace with your actual S3 / CDN base URL.
const IMAGE_BASE_URL = "https://api.raoslawacademy.com/uploads/";

const FALLBACK_IMAGE = require("../../assets/images/Rectangle4367.png");

const LAW_ID = "a816f02b-b03a-4e7a-a94c-bde6ba83c5f3";

// Subcategory that identifies "Criminal Laws" content — adjust to match
// the actual subcategory_id your backend uses for criminal notes.
const CRIMINAL_SUBCATEGORY_ID = "5bb52f35-5eb4-47f7-b292-4b31f62d0bb9";

export default function SubjectList() {
  const { userId } = useLocalSearchParams<{ userId: string }>();

  const [selectedTab, setSelectedTab] = useState<"Civil" | "Criminal">(
    "Civil"
  );
  const [notesList, setNotesList] = useState<SubjectNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjectNotes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<SubjectNotesListResponse>(
          `https://api.raoslawacademy.com/subject-notes?page=1&limit=10&userId=2087594a-f461-4e54-9803-4d8924c5440c`
        );

        if (response.data?.statusCode === 200) {
          setNotesList(response.data.data);
        }
      } catch (err: any) {
        console.log("Subject notes API error:", err?.response?.data || err.message);
        setError("Failed to load subjects");
      } finally {
        setLoading(false);
      }
    };
    fetchSubjectNotes();
  }, [userId]);

  const isCriminal = (item: SubjectNote) =>
    item.notes_id?.[0]?.subcategory_id === CRIMINAL_SUBCATEGORY_ID;

  const data = notesList.filter((item) =>
    selectedTab === "Civil" ? !isCriminal(item) : isCriminal(item)
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={styles.title}>Choose Your Subject</Text>
          <Text style={styles.subtitle}>AP JCJ Subjects</Text>
        </View>

        <TouchableOpacity>
          <Ionicons name="cart-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "Civil" && styles.activeTab]}
          onPress={() => setSelectedTab("Civil")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Civil" && styles.activeTabText,
            ]}
          >
            Civil Laws
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === "Criminal" && styles.activeTab]}
          onPress={() => setSelectedTab("Criminal")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Criminal" && styles.activeTabText,
            ]}
          >
            Criminal Laws
          </Text>
        </TouchableOpacity>
      </View>

      {/* Grid */}
      {loading ? (
        <Text style={styles.statusText}>Loading subjects...</Text>
      ) : error ? (
        <Text style={styles.statusText}>{error}</Text>
      ) : data.length === 0 ? (
        <Text style={styles.statusText}>No subjects found.</Text>
      ) : (
        <FlatList
          data={data}
          numColumns={2}
          keyExtractor={(item) => item._id}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={
                  item.presentation_image
                    ? { uri: IMAGE_BASE_URL + item.presentation_image }
                    : FALLBACK_IMAGE
                }
                style={styles.image}
              />

              <Text style={styles.subject}>{item.title}</Text>

              <TouchableOpacity
                style={[
                  styles.button,
                  item.isLocked && { backgroundColor: "#D3A622" },
                ]}
                onPress={() => {
                  if (!item.isLocked) {
                    router.push({
                      pathname: "/subjectlist/courseoverviewdetails",
                      params: { LAW_ID: LAW_ID, subjectId: item._id, userId: userId },
                    });
                  }
                }}
              >
                <Text style={styles.buttonText}>
                  {item.isLocked ? "Purchased" : "Open Now"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF1FB",
    paddingTop: 55,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  subtitle: {
    color: "#444",
    marginTop: 3,
  },

  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 18,
    padding: 6,
  },

  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 14,
  },

  activeTab: {
    backgroundColor: "#23408E",
  },

  tabText: {
    color: "#23408E",
    fontWeight: "700",
    fontSize: 18,
  },

  activeTabText: {
    color: "#fff",
  },

  card: {
    backgroundColor: "#fff",
    width: "48%",
    borderRadius: 12,
    marginBottom: 18,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: 100,
  },

  subject: {
    fontSize: 16,
    fontWeight: "600",
    margin: 10,
  },

  button: {
    backgroundColor: "#23408E",
    margin: 8,
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  statusText: {
    fontSize: 14,
    color: "#666",
    marginTop: 20,
    marginHorizontal: 20,
  },
});