import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import axios from "axios";

interface Student {
  _id: string;
  name: string;
  email: string;
  mobile_number: string;
  otp: string;
  referral_code: string;
  role: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  activeTokenSessionId: string;
  sessionExpiresAt: string;
  certificates: string[];
  idProofs: string[];
}

interface StudentDetailsResponse {
  statusCode: number;
  message: string;
  data: Student[];
}

const API_BASE_URL = "https://api.raoslawacademy.com";

const COLORS = {
  navyDark: "#0A1A3B",
  navy: "#23408E",
  gold: "#C9A227",
  goldLight: "#D8AE24",
  maroon: "#7A1F2B",
  background: "#EDEEF5",
  card: "#FFFFFF",
  textPrimary: "#0A1A3B",
  textMuted: "#9AA0B4",
  chevron: "#B9BDCB",
};

type ProfileRow = {
  key: string;
  label: string;
  route: string;
};

const PROFILE_ROWS: ProfileRow[] = [
  { key: "personal", label: "Personal Information", route: "/sidepanel/profile/personal_info" },
  { key: "education", label: "Educational Information", route: "/sidepanel/profile/educational_info" },
  { key: "id-proofs", label: "ID Proofs", route: "/sidepanel/profile/id_proof" },
];

export default function MainProfile() {
  const { userId } = useLocalSearchParams<{ userId: string }>();

  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("received userId:", userId);

  const scaleRefs = useRef<Record<string, Animated.Value>>(
    PROFILE_ROWS.reduce((acc, row) => {
      acc[row.key] = new Animated.Value(1);
      return acc;
    }, {} as Record<string, Animated.Value>)
  );

  useEffect(() => {
    fetchStudentDetails();
  }, [userId]);

  const fetchStudentDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.post<StudentDetailsResponse>(
        `https://api.raoslawacademy.com/users/details`,
        { userId: "7b682881-2d36-41b4-aca9-a9540bff291f" }
      );

      if (response.data.statusCode === 200 && response.data.data?.length > 0) {
        setStudent(response.data.data[0]);
        console.log("Student Details Response:", response.data.data[0]);
        // Uncomment once the backend returns an avatar field:
        // setAvatarUri(response.data.data[0].avatarUrl ?? null);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: response.data.message || "Couldn't load student details.",
        });
      }
    } catch (error: any) {
      console.error("Error fetching student details:", error?.response?.data || error.message);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Couldn't load student details. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePressIn = (key: string) => {
    setPressedKey(key);
    Animated.spring(scaleRefs.current[key], { toValue: 0.97, useNativeDriver: true, speed: 40, bounciness: 4 }).start();
  };

  const handlePressOut = (key: string) => {
    setPressedKey(null);
    Animated.spring(scaleRefs.current[key], { toValue: 1, useNativeDriver: true, speed: 40, bounciness: 4 }).start();
  };

  const guardNavigation = () => {
    if (!student) {
      Toast.show({
        type: "error",
        text1: "Please wait",
        text2: "Student details are still loading.",
      });
      return false;
    }
    return true;
  };

  const handleEditAvatar = () => {
    if (!guardNavigation()) return;
    router.push({
      pathname: "/sidepanel/profile/personal_info",
      params: { student: JSON.stringify(student), userId },
    });
  };

  const handlePersonalInfo = () => {
    if (!guardNavigation()) return;
    router.push({
      pathname: "/sidepanel/profile/personal_info",
      params: { student: JSON.stringify(student), userId },
    });
  };

  const handleEducationalInfo = () => {
    if (!guardNavigation()) return;
    router.push({
      pathname: "/sidepanel/profile/educational_info",
      params: { student: JSON.stringify(student), userId },
    });
  };

  const handleIdProofs = () => {
    if (!guardNavigation()) return;
    router.push({
      pathname: "/sidepanel/profile/id_proof",
      params: { student: JSON.stringify(student), userId },
    });
  };

  const handleRowPress = (rowKey: string) => {
    switch (rowKey) {
      case "personal":
        handlePersonalInfo();
        break;
      case "education":
        handleEducationalInfo();
        break;
      case "id-proofs":
        handleIdProofs();
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} style={styles.backButton}>
          <Ionicons name="chevron-back" size={26} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Feather name="user" size={54} color="#FFFFFF" />
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.editBadge} onPress={handleEditAvatar} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Feather name="edit-2" size={14} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="small" color={COLORS.navy} style={{ marginBottom: 20 }} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : student ? (
          <View style={styles.nameBlock}>
            <Text style={styles.studentName}>{student.name}</Text>
            <Text style={styles.studentEmail}>{student.email}</Text>
          </View>
        ) : null}

        <View style={styles.rowsContainer}>
          {PROFILE_ROWS.map((row) => (
            <Animated.View key={row.key} style={{ transform: [{ scale: scaleRefs.current[row.key] }] }}>
              <Pressable
                onPress={() => handleRowPress(row.key)}
                onPressIn={() => handlePressIn(row.key)}
                onPressOut={() => handlePressOut(row.key)}
                style={[styles.row, pressedKey === row.key && styles.rowPressed]}
              >
                <Text style={styles.rowLabel}>{row.label}</Text>
                <Ionicons name="chevron-forward" size={20} color={COLORS.chevron} />
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: "row", alignItems: "center", paddingTop: 68, paddingBottom: 12, paddingHorizontal: 16 },
  backButton: { width: 32, justifyContent: "center", alignItems: "flex-start" },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 22, fontWeight: "700", color: COLORS.textPrimary, marginRight: 32 },
  headerSpacer: { width: 32 },
  scrollContent: { paddingBottom: 40 },
  avatarWrapper: { alignSelf: "center", marginTop: 24, marginBottom: 16, width: 128, height: 128 },
  avatarCircle: { width: 128, height: 128, borderRadius: 64, overflow: "hidden", backgroundColor: "#F26522", justifyContent: "center", alignItems: "center" },
  avatarImage: { width: "100%", height: "100%" },
  avatarPlaceholder: { width: "100%", height: "100%", justifyContent: "center", alignItems: "center" },
  editBadge: {
    position: "absolute", right: 2, bottom: 4, width: 32, height: 32, borderRadius: 16,
    backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 4,
  },
  nameBlock: { alignItems: "center", marginBottom: 24 },
  studentName: { fontSize: 18, fontWeight: "700", color: COLORS.textPrimary },
  studentEmail: { fontSize: 13, color: COLORS.textMuted, marginTop: 4 },
  errorText: { textAlign: "center", color: COLORS.maroon, marginBottom: 20, fontSize: 13 },
  rowsContainer: { paddingHorizontal: 20, gap: 14 },
  row: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: COLORS.card, borderRadius: 14, paddingVertical: 18, paddingHorizontal: 18,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  rowPressed: { backgroundColor: "#F7F8FC" },
  rowLabel: { fontSize: 15, fontWeight: "500", color: COLORS.textMuted },
});