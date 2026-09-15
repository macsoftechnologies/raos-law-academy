import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { Toast } from "react-native-toast-message/lib/src/Toast";

const COLORS = {
  navyDark: "#0A1A3B",
  navy: "#23408E",
  background: "#EDEEF5",
  field: "#E3E5EF",
  fieldText: "#1C2340",
  icon: "#6B7284",
};

export default function AdminConsulting() {
  const { student: studentParam, userId, name, mobile, email } = useLocalSearchParams<{
    student?: string;
    userId?: string;
    name?: string;
    mobile?: string;
    email?: string;
  }>();

  console.log("received userId:", userId);
  console.log("received studentParam:", studentParam);
  console.log("received name:", name);
  console.log("received mobile:", mobile);
  console.log("received email:", email);

  const student = studentParam ? JSON.parse(studentParam) : null;

  // Prefer the flat params; fall back to the student object if they're missing
  const displayName = name ?? student?.name ?? "";
  const displayMobile = mobile ?? student?.mobile_number ?? "";
  const displayEmail = email ?? student?.email ?? "";

  const [submitting, setSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmitRequest = async () => {
    if (!acceptedTerms) {
      Toast.show({ type: "error", text1: "Error", text2: "Please accept the terms and conditions." });
      return;
    }

    if (!userId) {
      Toast.show({ type: "error", text1: "Error", text2: "Missing userId, can't submit request." });
      return;
    }

    setSubmitting(true);
    try {
      const token = /* pull from wherever this app stores it — AsyncStorage/SecureStore/context */ "";

      const response = await axios.post(
        `https://api.raoslawacademy.com/users/updatedetailsrequest`,
        {
          userId: userId,
          name: displayName,
          mobile_number: displayMobile,
          email: displayEmail,
        },
        { headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImZpbmRVc2VyIjp7Il9pZCI6IjZhNWYzYjNmMjFjYjczOGI2MmQ2NWRhYSIsIm5hbWUiOiJWYXJzaGEiLCJlbWFpbCI6InZhc3VwYWxsaXZhcnNoYUBnbWFpbC5jb20iLCJtb2JpbGVfbnVtYmVyIjoiOTg0OTE4NzQ5MiIsInBhc3N3b3JkIjoiJDJiJDEwJHlWbFhKTUd2RmRwTGxtdEN0bDY0UE95bC80Z1dPNS94T282cDEyNGdDd2JqZUhKdG5JV2J5Iiwib3RwIjoiMzc5NzI2IiwicmVmZXJyYWxfY29kZSI6Ikc5SE82UkVQIiwicm9sZSI6InN0dWRlbnQiLCJ1c2VySWQiOiJhMTI1YjllMS05ZDAxLTQxYzQtOGVlOC03ZWQ0MmY0YWVmODQiLCJjcmVhdGVkQXQiOiIyMDI2LTA3LTIxVDA5OjI2OjIzLjYyOFoiLCJ1cGRhdGVkQXQiOiIyMDI2LTA5LTAyVDA1OjM1OjIxLjgwOFoiLCJfX3YiOjAsImFjdGl2ZVRva2VuU2Vzc2lvbklkIjoiIiwic2Vzc2lvbkV4cGlyZXNBdCI6IjIwMjYtMDktMDlUMDU6MzU6MjEuMDAwWiJ9fSwic2Vzc2lvbklkIjoiNmZmYzRmMmItMTMzMS00MmExLTgxZjktMWE0MDJiMDJmOGJmIiwiaWF0IjoxNzg4MzQwMzA0LCJleHAiOjE3ODg5NDUxMDR9.tvcf59NP3_hua35uUrM8lKDF7-a0rcu3pzZXXzloei0` } }
      );

      if (response.data?.statusCode === 200 || response.data?.success) {
        Toast.show({
          type: "success",
          text1: "Request sent",
          text2: response.data?.message || "Admin has been notified.",
        });
        router.back();
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: response.data?.message || "Couldn't submit request.",
        });
      }
    } catch (error: any) {
      console.error("Error submitting admin request:", error?.response?.data || error.message);
      Toast.show({ type: "error", text1: "Error", text2: "Couldn't submit request. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Ionicons name="chevron-back" size={26} color={COLORS.navyDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Consulting</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <InfoRow icon={<Feather name="user" size={18} color={COLORS.icon} />} label="Name" value={displayName} />
        <InfoRow icon={<Feather name="phone" size={18} color={COLORS.icon} />} label="Mobile Number" value={displayMobile} />
        <InfoRow icon={<Feather name="mail" size={18} color={COLORS.icon} />} label="Email" value={displayEmail} />

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setAcceptedTerms((prev) => !prev)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={acceptedTerms ? "checkbox" : "square-outline"}
            size={22}
            color={acceptedTerms ? COLORS.navy : COLORS.icon}
          />
          <Text style={styles.note}>I accept terms and conditions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, (submitting || !acceptedTerms) && { opacity: 0.5 }]}
          onPress={handleSubmitRequest}
          disabled={submitting || !acceptedTerms}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? "Submitting..." : "Submit Request to Admin"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View style={styles.field}>
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value || "—"}</Text>
      </View>
      {icon}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: "row", alignItems: "center", paddingTop: 71, paddingBottom: 12, paddingHorizontal: 16 },
  headerTitle: { flex: 1, fontSize: 21, fontWeight: "700", color: COLORS.navyDark, marginLeft: 12 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  field: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: COLORS.field, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 12 },
  label: { fontSize: 12, color: COLORS.icon, marginBottom: 2 },
  value: { fontSize: 15, color: COLORS.fieldText, fontWeight: "600" },
  note: { fontSize: 12.5, lineHeight: 18, color: COLORS.navyDark },
  submitButton: { marginTop: 20, backgroundColor: COLORS.navy, borderRadius: 14, paddingVertical: 16, alignItems: "center" },
  submitButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  checkboxRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 16 },
});