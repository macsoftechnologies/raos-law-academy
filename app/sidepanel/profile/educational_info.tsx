import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import { Toast } from "react-native-toast-message/lib/src/Toast";

interface CertificateData {
  certificate_id: string;
  certificate_standard: string;
  marks_cgpa: string;
  institute_name: string;
  certificate_file: string;
  userId: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AddCertificateResponse {
  statusCode: number;
  message: string;
  data: CertificateData;
}

const { width } = Dimensions.get("window");

const COLORS = {
  navy: "#0A1A3B",
  navyLight: "#23408E",
  gold: "#C9A227",
  goldLight: "#D8AE24",
  maroon: "#7A1F2B",
  bg: "#EDEEF5",
  bgLight: "#EEF1FB",
  border: "#DDE1EC",
  gray: "#4B4F5C",
  white: "#FFFFFF",
  success: "#1C8A4B",
  danger: "#C0392B",
};

type SectionKey = "secondary" | "intermediate" | "graduation" | "llb";

interface SectionConfig {
  key: SectionKey;
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  accent: string;
  accentSoft: string;
  scoreLabel: string;
}

const SECTIONS: SectionConfig[] = [
  {
    key: "secondary",
    title: "Secondary Education",
    icon: "book-open-page-variant-outline",
    accent: COLORS.navyLight,
    accentSoft: "#E4E8F5",
    scoreLabel: "Marks",
  },
  {
    key: "intermediate",
    title: "Intermediate Education",
    icon: "book-open-variant",
    accent: COLORS.maroon,
    accentSoft: "#F3E4E6",
    scoreLabel: "Marks",
  },
  {
    key: "graduation",
    title: "Graduation",
    icon: "school-outline",
    accent: COLORS.gold,
    accentSoft: "#F5EFD8",
    scoreLabel: "CGPA",
  },
  {
    key: "llb",
    title: "LLB Certificate",
    icon: "school",
    accent: COLORS.navyLight,
    accentSoft: "#E4E8F5",
    scoreLabel: "CGPA",
  },
];

type UploadStatus = "idle" | "uploading" | "uploaded" | "error";

interface FieldState {
  score: string;
  institute: string;
  fileName: string | null;
  fileUri: string | null;
  fileMimeType: string | null;
  status: UploadStatus;
  certificateId: string | null;
}

type FormState = Record<SectionKey, FieldState>;

const emptyField: FieldState = {
  score: "",
  institute: "",
  fileName: null,
  fileUri: null,
  fileMimeType: null,
  status: "idle",
  certificateId: null,
};

const initialState: FormState = {
  secondary: { ...emptyField },
  intermediate: { ...emptyField },
  graduation: { ...emptyField },
  llb: { ...emptyField },
};

export default function EducationalInfo() {
  const router = useRouter();
  const { userId, student: studentParam } = useLocalSearchParams<{
    userId?: string;
    student?: string;
  }>();


  const student = studentParam ? JSON.parse(studentParam) : null;
  const resolvedUserId = student?.userId ?? userId;

  const [editable, setEditable] = useState(true);
  const [form, setForm] = useState<FormState>(initialState);

  const updateField = (
    key: SectionKey,
    field: "score" | "institute",
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const setSectionState = (key: SectionKey, patch: Partial<FieldState>) => {
    setForm((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...patch },
    }));
  };

  const uploadCertificate = async (
    key: SectionKey,
    section: SectionConfig,
    file: DocumentPicker.DocumentPickerAsset
  ) => {
    const current = form[key];

    if (!current.score.trim() || !current.institute.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing details",
        text2: `Enter ${section.scoreLabel.toLowerCase()} and institute name before uploading.`,
      });
      return;
    }

    if (!resolvedUserId) {
      Toast.show({ type: "error", text1: "Error", text2: "Missing userId, can't upload certificate." });
      return;
    }

    setSectionState(key, {
      status: "uploading",
      fileName: file.name,
      fileUri: file.uri,
      fileMimeType: file.mimeType ?? null,
    });

    try {
      const token = /* pull from wherever this app stores it — AsyncStorage/SecureStore/context */ "";

      const formData = new FormData();
      formData.append("userId", "a125b9e1-9d01-41c4-8ee8-7ed42f4aef84");
      formData.append("certificate_standard", section.title);
      formData.append("marks_cgpa", current.score);
      formData.append("institute_name", current.institute);
      formData.append("certificate_file", {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || "application/octet-stream",
      } as any);

      const response = await axios.post<AddCertificateResponse>(
        `https://api.raoslawacademy.com/users/addcertificate`, // confirm actual endpoint
        formData,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImZpbmRVc2VyIjp7Il9pZCI6IjZhNWYzYjNmMjFjYjczOGI2MmQ2NWRhYSIsIm5hbWUiOiJWYXJzaGEiLCJlbWFpbCI6InZhc3VwYWxsaXZhcnNoYUBnbWFpbC5jb20iLCJtb2JpbGVfbnVtYmVyIjoiOTg0OTE4NzQ5MiIsInBhc3N3b3JkIjoiJDJiJDEwJHlWbFhKTUd2RmRwTGxtdEN0bDY0UE95bC80Z1dPNS94T282cDEyNGdDd2JqZUhKdG5JV2J5Iiwib3RwIjoiMzc5NzI2IiwicmVmZXJyYWxfY29kZSI6Ikc5SE82UkVQIiwicm9sZSI6InN0dWRlbnQiLCJ1c2VySWQiOiJhMTI1YjllMS05ZDAxLTQxYzQtOGVlOC03ZWQ0MmY0YWVmODQiLCJjcmVhdGVkQXQiOiIyMDI2LTA3LTIxVDA5OjI2OjIzLjYyOFoiLCJ1cGRhdGVkQXQiOiIyMDI2LTA5LTAyVDA5OjExOjQ0LjIwNFoiLCJfX3YiOjAsImFjdGl2ZVRva2VuU2Vzc2lvbklkIjoiIiwic2Vzc2lvbkV4cGlyZXNBdCI6IjIwMjYtMDktMDlUMDk6MTE6NDQuMDAwWiJ9fSwic2Vzc2lvbklkIjoiMTJlOWRjYzAtODRlOS00YWJiLTljNWQtNWE4ZDAxNzgwZjU4IiwiaWF0IjoxNzg4MzQ1Mjg1LCJleHAiOjE3ODg5NTAwODV9.kFlZtCWpQNT-s0pvpCuWOckrFopPFsnKx3-KI5Mtk7A`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(`Upload response for`, JSON.stringify(response.data.data));

      if (response.data?.statusCode === 200) {
        setSectionState(key, {
          status: "uploaded",
          certificateId: response.data.data.certificate_id,
        });
        Toast.show({
          type: "success",
          text1: "Uploaded",
          text2: `${section.title} certificate added.`,
        });
      } else {
        setSectionState(key, { status: "error" });
        Toast.show({
          type: "error",
          text1: "Error",
          text2: response.data?.message || `Couldn't upload ${section.title}.`,
        });
      }
    } catch (error: any) {
      console.error(`Error uploading ${section.title}:`, error?.response?.data || error.message);
      setSectionState(key, { status: "error" });
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `Couldn't upload ${section.title}. Please try again.`,
      });
    }
  };

  const handlePickAndUpload = async (key: SectionKey) => {
    const section = SECTIONS.find((s) => s.key === key)!;
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await uploadCertificate(key, section, result.assets[0]);
      }
    } catch (error) {
      console.log("Certificate upload error:", error);
      setSectionState(key, { status: "error" });
    }
  };

  const allUploaded = SECTIONS.every((s) => form[s.key].status === "uploaded");

  const handleSubmit = () => {
    if (!allUploaded) return;
    router.push("/sidepanel/profile/educational_submit");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={26} color={COLORS.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Educational Information</Text>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => setEditable((prev) => !prev)}
        >
          <Feather
            name="edit-2"
            size={15}
            color={editable ? COLORS.navyLight : COLORS.gray}
          />
          <Text
            style={[
              styles.editBtnText,
              editable && { color: COLORS.navyLight },
            ]}
          >
            Edit
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {SECTIONS.map((section) => {
          const data = form[section.key];
          const isUploading = data.status === "uploading";
          const isUploaded = data.status === "uploaded";
          const isError = data.status === "error";

          return (
            <View
              key={section.key}
              style={[styles.card, { borderColor: section.accent }]}
            >
              <View style={styles.cardHeaderRow}>
                <MaterialCommunityIcons
                  name={section.icon}
                  size={22}
                  color={section.accent}
                />
                <Text style={[styles.cardTitle, { color: section.accent }]}>
                  {section.title}
                </Text>
                <Text style={styles.mandatoryTag}>Mandatory</Text>
              </View>

              <Text style={styles.fieldLabel}>{section.scoreLabel} :</Text>
              <TextInput
                style={styles.input}
                value={data.score}
                onChangeText={(v) => updateField(section.key, "score", v)}
                editable={editable && !isUploaded}
                keyboardType="numeric"
                placeholder={`Enter ${section.scoreLabel.toLowerCase()}`}
                placeholderTextColor="#A5A9B8"
              />

              <Text style={styles.fieldLabel}>Institute name :</Text>
              <TextInput
                style={styles.input}
                value={data.institute}
                onChangeText={(v) => updateField(section.key, "institute", v)}
                editable={editable && !isUploaded}
                placeholder="Enter institute name"
                placeholderTextColor="#A5A9B8"
              />

              <TouchableOpacity
                style={[
                  styles.uploadBtn,
                  { backgroundColor: section.accentSoft },
                  isUploaded && { backgroundColor: "#E1F3E8" },
                  isError && { backgroundColor: "#FBE4E1" },
                ]}
                onPress={() => handlePickAndUpload(section.key)}
                disabled={isUploading || isUploaded}
                activeOpacity={0.8}
              >
                <Feather
                  name={
                    isUploaded
                      ? "check-circle"
                      : isError
                        ? "alert-circle"
                        : "upload-cloud"
                  }
                  size={16}
                  color={
                    isUploaded
                      ? COLORS.success
                      : isError
                        ? COLORS.danger
                        : COLORS.gray
                  }
                />
                <Text
                  style={[
                    styles.uploadBtnText,
                    isUploaded && { color: COLORS.success },
                    isError && { color: COLORS.danger },
                  ]}
                  numberOfLines={1}
                >
                  {isUploading
                    ? "Uploading..."
                    : isUploaded
                      ? data.fileName ?? "Uploaded"
                      : isError
                        ? "Upload failed — tap to retry"
                        : "Upload Certificate (PDF or image)"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}

        {!allUploaded && (
          <Text style={styles.helperNote}>
            All four certificates are required — upload each one to continue.
          </Text>
        )}
      </ScrollView>

      {/* Bottom submit */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.submitBtn, !allUploaded && styles.submitBtnDisabled]}
          activeOpacity={0.85}
          onPress={handleSubmit}
          disabled={!allUploaded}
        >
          <Text style={styles.submitBtnText}>Upload</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: COLORS.bg,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.navy,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.gray,
    marginLeft: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1.4,
    padding: 18,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
    flex: 1,
  },
  mandatoryTag: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.danger,
    textTransform: "uppercase",
  },
  fieldLabel: {
    fontSize: 14,
    color: COLORS.navy,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#1F2430",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.navy,
    marginBottom: 14,
    backgroundColor: COLORS.white,
  },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 10,
    paddingVertical: 13,
  },
  uploadBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.gray,
    marginLeft: 8,
    maxWidth: "80%",
  },
  helperNote: {
    fontSize: 12.5,
    color: COLORS.gray,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 8,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    backgroundColor: COLORS.bg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  submitBtn: {
    backgroundColor: COLORS.navy,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitBtnDisabled: {
    backgroundColor: "#A9AEC2",
  },
  submitBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
});