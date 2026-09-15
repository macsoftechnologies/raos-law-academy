import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

export interface ComboNote {
  _id: string;
  subject_notes_id: string;
  title: string;
  pdf_url: string;
  isLocked: boolean;
  presentation_image: string;
}

export interface ComboSubject {
  _id: string;
  subjectId: string;
  title: string;
  subject_image: string;
  lectures: any[];
  notes: ComboNote[];
}

export interface ComboLaw {
  _id: string;
  lawId: string;
  title: string;
  law_image: string;
  subcategory_id: string;
  categoryId: string;
  subjects_count: number;
  subjects: ComboSubject[];
}

export interface ComboContent {
  combo_id: string;
  title: string;
  description: string;
  enroll_date: string;
  expiry_date: string;
  laws: ComboLaw[];
}

export interface ComboContentResponse {
  statusCode: number;
  message: string;
  data: ComboContent;
}

// const IMAGE_BASE_URL = "https://api.raoslawacademy.com/uploads/";

// // Static fallback covers, keyed by subject title, for subjects whose
// // subject_image field is empty (as in the sample API response).
// const SUBJECT_IMAGE_FALLBACKS: Record<string, any> = {
//   "CODE OF CIVIL PROCEDURE,1908": require("../../assets/images/civil-procedure-code.png"),
//   "INDIAN EVIDENCE ACT, 1872": require("../../assets/images/indian-evidence-act.png"),
// };

// const DEFAULT_FALLBACK_IMAGE = require("../../assets/images/Rectangle4367.png");

export default function ComboLawSubjects() {
  const { combo_id, userId} = useLocalSearchParams<{
    combo_id: string;
    userId: string;
  }>();
  console.log("comboId:", combo_id,  "userId:", userId  + "recived data in crimminalscreen");

  const [law, setLaw] = useState<ComboLaw | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchCombo = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<ComboContentResponse>(
        "https://api.raoslawacademy.com/combos/user/content",
        {
          params: {
            combo_id: combo_id || "aaaa974c-cdf2-4dee-903b-6a3915cdc8b8",
            userId: userId || "4237c5bb-30d1-495a-96f8-d70ba48ec110",
          },
        }
      );

      if (response.data.statusCode === 200) {
        const civilLaw = response.data.data.laws.find((l) =>
          l.title.toLowerCase().includes("civil")
        );
        if (civilLaw) {
          setLaw(civilLaw);
        } else {
          setError("Civil law section not found in this combo.");
        }
      } else {
        setError(response.data.message || "Failed to load subjects.");
      }
    } catch (err: any) {
      console.log("fetchCombo error:", err?.response?.data || err.message);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  fetchCombo();
}, [combo_id, userId]);

  // const getSubjectImage = (subject: ComboSubject) => {
  //   if (subject.subject_image) {
  //     return { uri: IMAGE_BASE_URL + subject.subject_image };
  //   }
  //   return SUBJECT_IMAGE_FALLBACKS[subject.title] ?? DEFAULT_FALLBACK_IMAGE;
  // };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{law?.title ?? "Subjects"}</Text>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#23408E" />
        </View>
      ) : error ? (
        <View style={styles.centerBox}>
          <Text style={styles.statusText}>{error}</Text>
        </View>
      ) : !law || law.subjects.length === 0 ? (
        <View style={styles.centerBox}>
          <Text style={styles.statusText}>No subjects found.</Text>
        </View>
      ) : (
        <FlatList
          data={law.subjects}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
  <View style={styles.card}>
    <View style={styles.cardBody}>
      <Text style={styles.subjectTitle} numberOfLines={2}>
        {item.title}
      </Text>

      {item.notes.length > 0 && (
        <Text style={styles.notesBadge}>
          {item.notes.length} note{item.notes.length > 1 ? "s" : ""} available
        </Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          router.push({
            pathname: "/combos/civilsub",
            params: {
              lawId: law?.lawId,
              subjectId: item.subjectId,
              userId: userId,
            },
          })
        }
      >
        <Text style={styles.buttonText}>Explore more</Text>
      </TouchableOpacity>
    </View>
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
notesBadge: {
  fontSize: 12,
  color: "#23408E",
  marginBottom: 10,
  fontWeight: "600",
},
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginLeft: 16,
  },

  centerBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  statusText: {
    fontSize: 14,
    color: "#666",
  },

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 170,
  },

  cardBody: {
    padding: 14,
  },

  subjectTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
  },

  button: {
    backgroundColor: "#23408E",
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});