import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import { Toast } from "react-native-toast-message/lib/src/Toast";

interface StudentTokenUser {
  _id: string;
  name: string;
  email: string;
  mobile_number: string;
  password: string; // bcrypt hash
  otp: string;
  referral_code: string;
  role: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  activeTokenSessionId: string;
  sessionExpiresAt: string;
}

interface AddIdProofResponse {
  statusCode: number;
  message: string;
  data: {
    proof_id: string;
    idType: string;
    id_number: string;
    proof_file: string;
    userId: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

type IdProofType = {
  id: string;
  title: string;
  idType: string; // matches backend's expected idType value, e.g. "Aadhar"
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  accentColor: string;
  lightBg: string;
  placeholder: string;
};

const ID_PROOF_DATA: IdProofType[] = [
  {
    id: "aadhar",
    title: "Aadhar Number",
    idType: "Aadhar",
    icon: "card-account-details-outline",
    accentColor: "#23408E",
    lightBg: "#DCE1F2",
    placeholder: "Enter Aadhar number",
  },
  {
    id: "pan",
    title: "PAN Number",
    idType: "PAN",
    icon: "card-outline" as any,
    accentColor: "#7A1F2B",
    lightBg: "#F3E1E1",
    placeholder: "Enter PAN number",
  },
  {
    id: "passport",
    title: "Passport Number",
    idType: "Passport",
    icon: "passport-biometric" as any,
    accentColor: "#D8AE24",
    lightBg: "#F3EACB",
    placeholder: "Enter Passport number",
  },
];

type UploadStatus = "idle" | "uploading" | "uploaded" | "error";

type FieldState = {
  number: string;
  fileName: string | null;
  fileUri: string | null;
  fileMimeType: string | null;
  status: UploadStatus;
};

const emptyField: FieldState = {
  number: "",
  fileName: null,
  fileUri: null,
  fileMimeType: null,
  status: "idle",
};

export default function IdProof() {
  const { userId, student: studentParam } = useLocalSearchParams<{
    userId?: string;
    student?: string;
  }>();

  const student: StudentTokenUser | null = studentParam ? JSON.parse(studentParam) : null;
  const resolvedUserId = student?.userId ?? userId;

  const [fields, setFields] = useState<Record<string, FieldState>>({
    aadhar: { ...emptyField },
    pan: { ...emptyField },
    passport: { ...emptyField },
  });

  const [submitting, setSubmitting] = useState(false);

  const updateNumber = (id: string, value: string) => {
    setFields((prev) => ({
      ...prev,
      [id]: { ...prev[id], number: value },
    }));
  };

  const setFieldState = (id: string, patch: Partial<FieldState>) => {
    setFields((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }));
  };

  const uploadIdProof = async (item: IdProofType, asset: DocumentPicker.DocumentPickerAsset) => {
    const current = fields[item.id];

    if (!current.number.trim()) {
      Alert.alert("Missing Number", `Enter the ${item.title.toLowerCase()} before uploading.`);
      return;
    }

    if (!resolvedUserId) {
      Alert.alert("Error", "Missing userId, can't upload ID proof.");
      return;
    }

    setFieldState(item.id, {
      status: "uploading",
      fileName: asset.name,
      fileUri: asset.uri,
      fileMimeType: asset.mimeType ?? null,
    });

    try {
      // TODO: replace with the app's real stored token (AsyncStorage / SecureStore / auth context)
      const token = "";

      const formData = new FormData();
      formData.append("idType", item.idType);
      formData.append("id_number", current.number);
      formData.append("userId", resolvedUserId);
      formData.append("proof_file", {
        uri: asset.uri,
        name: asset.name,
        type: asset.mimeType || "application/octet-stream",
      } as any);

      const response = await axios.post<AddIdProofResponse>(
        "https://api.raoslawacademy.com/users/addidproof",
        formData,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImZpbmRVc2VyIjp7Il9pZCI6IjZhNWYzYjNmMjFjYjczOGI2MmQ2NWRhYSIsIm5hbWUiOiJWYXJzaGEiLCJlbWFpbCI6InZhc3VwYWxsaXZhcnNoYUBnbWFpbC5jb20iLCJtb2JpbGVfbnVtYmVyIjoiOTg0OTE4NzQ5MiIsInBhc3N3b3JkIjoiJDJiJDEwJHlWbFhKTUd2RmRwTGxtdEN0bDY0UE95bC80Z1dPNS94T282cDEyNGdDd2JqZUhKdG5JV2J5Iiwib3RwIjoiMzc5NzI2IiwicmVmZXJyYWxfY29kZSI6Ikc5SE82UkVQIiwicm9sZSI6InN0dWRlbnQiLCJ1c2VySWQiOiJhMTI1YjllMS05ZDAxLTQxYzQtOGVlOC03ZWQ0MmY0YWVmODQiLCJjcmVhdGVkQXQiOiIyMDI2LTA3LTIxVDA5OjI2OjIzLjYyOFoiLCJ1cGRhdGVkQXQiOiIyMDI2LTA5LTAyVDA5OjExOjQ0LjIwNFoiLCJfX3YiOjAsImFjdGl2ZVRva2VuU2Vzc2lvbklkIjoiIiwic2Vzc2lvbkV4cGlyZXNBdCI6IjIwMjYtMDktMDlUMDk6MTE6NDQuMDAwWiJ9fSwic2Vzc2lvbklkIjoiMTJlOWRjYzAtODRlOS00YWJiLTljNWQtNWE4ZDAxNzgwZjU4IiwiaWF0IjoxNzg4MzQ1Mjg1LCJleHAiOjE3ODg5NTAwODV9.kFlZtCWpQNT-s0pvpCuWOckrFopPFsnKx3-KI5Mtk7A`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(`Upload response for ${item.title}:`, JSON.stringify(response.data));

      if (response.data?.statusCode === 200) {
        setFieldState(item.id, { status: "uploaded" });
        Toast.show({
          type: "success",
          text1: `${item.title} uploaded successfully!`,
        });
      } else {
        setFieldState(item.id, { status: "error" });
        Toast.show({
          type: "error",
          text1: response.data?.message || `Couldn't upload ${item.title}.`,
        });
      }
    } catch (error: any) {
      console.error(`Error uploading ${item.title}:`, error?.response?.data || error.message);
      setFieldState(item.id, { status: "error" });
      Toast.show({
        type: "error",
        text1: `Failed to upload ${item.title}.`,
      });
    }
  };

  const handleUpload = async (item: IdProofType) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const asset = result.assets?.[0];
      if (asset) {
        await uploadIdProof(item, asset);
      }
    } catch (error) {
      Alert.alert("Upload Failed", "Could not select the certificate. Please try again.");
      setFieldState(item.id, { status: "error" });
    }
  };

  const allUploaded = ID_PROOF_DATA.every((item) => fields[item.id].status === "uploaded");

  const handleSubmit = () => {
    if (!allUploaded) {
      Alert.alert(
        "Missing Details",
        "Please fill in all ID numbers and upload the corresponding certificates."
      );
      return;
    }

    try {
      router.push("/sidepanel/profile/id_submit");
    } catch (error) {
      console.error("Error navigating to id_submit:", error);
      Alert.alert("Error", "Couldn't proceed. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDEEF5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={26} color="#0A1A3B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>ID Proofs</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {ID_PROOF_DATA.map((item) => {
          const data = fields[item.id];
          const isUploading = data.status === "uploading";
          const isUploaded = data.status === "uploaded";
          const isError = data.status === "error";

          return (
            <View
              key={item.id}
              style={[styles.card, { borderColor: item.accentColor }]}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { borderColor: item.accentColor }]}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={16}
                    color={item.accentColor}
                  />
                </View>
                <Text style={[styles.cardTitle, { color: item.accentColor }]}>
                  {item.title}
                </Text>
              </View>

              <Text style={styles.label}>Number :</Text>
              <TextInput
                style={styles.input}
                placeholder={item.placeholder}
                placeholderTextColor="#9CA3AF"
                value={data.number}
                onChangeText={(text) => updateNumber(item.id, text)}
                autoCapitalize="characters"
                editable={!isUploaded}
              />

              <TouchableOpacity
                style={[
                  styles.uploadButton,
                  { backgroundColor: item.lightBg },
                  isUploaded && { backgroundColor: "#E1F3E8" },
                  isError && { backgroundColor: "#FBE4E1" },
                ]}
                activeOpacity={0.8}
                onPress={() => handleUpload(item)}
                disabled={isUploading || isUploaded}
              >
                <Feather
                  name={isUploaded ? "check-circle" : isError ? "alert-circle" : "upload"}
                  size={16}
                  color={isUploaded ? "#1C8A4B" : isError ? "#C0392B" : "#1F2937"}
                />
                <Text
                  style={[
                    styles.uploadText,
                    isUploaded && { color: "#1C8A4B" },
                    isError && { color: "#C0392B" },
                  ]}
                  numberOfLines={1}
                >
                  {isUploading
                    ? "Uploading..."
                    : isUploaded
                    ? data.fileName ?? "Uploaded"
                    : isError
                    ? "Upload failed — tap to retry"
                    : "Upload Certificate"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, !allUploaded && styles.submitButtonDisabled]}
          activeOpacity={0.85}
          onPress={handleSubmit}
          disabled={!allUploaded}
        >
          <Text style={styles.submitText}>Upload</Text>
        </TouchableOpacity>
        <Text style={styles.footerNote}>All certificates are encrypted</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEEF5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#0A1A3B",
    textAlign: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  label: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#0A1A3B",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
    marginBottom: 14,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 10,
    paddingVertical: 12,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    maxWidth: "80%",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 8,
    alignItems: "center",
  },
  submitButton: {
    width: "100%",
    backgroundColor: "#23408E",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#23408E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: "#A9AEC2",
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  footerNote: {
    marginTop: 10,
    fontSize: 12,
    color: "#6B7280",
  },
});