import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { Toast } from "react-native-toast-message/lib/src/Toast";

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

const COLORS = {
  navyDark: "#0A1A3B",
  navy: "#23408E",
  gold: "#C9A227",
  goldLight: "#D8AE24",
  maroon: "#7A1F2B",
  background: "#EDEEF5",
  field: "#E3E5EF",
  fieldText: "#1C2340",
  placeholder: "#9AA0B4",
  icon: "#6B7284",
  danger: "#E23B3B",
};

type FormState = {
  name: string;
  dob: string;
  gender: "Male" | "Female" | "Other" | "";
  mobile: string;
  email: string;
  motherName: string;
  fatherName: string;
  correspondingAddress: string;
  permanentAddress: string;
};

const LOCKED_FIELDS: (keyof FormState)[] = ["name", "mobile", "email"];
const GENDER_OPTIONS: FormState["gender"][] = ["Male", "Female", "Other"];

export default function PersonalInfo() {
  const { student: studentParam, userId } = useLocalSearchParams<{
    student?: string;
    userId?: string;
  }>();

  const student: Student | null = studentParam ? JSON.parse(studentParam) : null;
  const resolvedUserId = student?.userId ?? userId;

  console.log("---- Personal Info: received data ----");
  console.log("userId param:", userId);
  console.log("_id:", student?._id);
  console.log("name:", student?.name);
  console.log("email:", student?.email);
  console.log("mobile_number:", student?.mobile_number);
  console.log("otp:", student?.otp);
  console.log("referral_code:", student?.referral_code);
  console.log("role:", student?.role);
  console.log("userId (from student):", student?.userId);
  console.log("createdAt:", student?.createdAt);
  console.log("updatedAt:", student?.updatedAt);
  console.log("activeTokenSessionId:", student?.activeTokenSessionId);
  console.log("sessionExpiresAt:", student?.sessionExpiresAt);
  console.log("certificates:", student?.certificates);
  console.log("idProofs:", student?.idProofs);
  console.log("---------------------------------------");

  const [form, setForm] = useState<FormState>({
    name: student?.name ?? "",
    dob: "",
    gender: "",
    mobile: student?.mobile_number ?? "",
    email: student?.email ?? "",
    motherName: "",
    fatherName: "",
    correspondingAddress: "",
    permanentAddress: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!resolvedUserId) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Missing userId, can't save changes.",
      });
      return;
    }

    setSaving(true);
    try {
    const response = await axios.post(
  `https://api.raoslawacademy.com/users/personal_information`,
  {
    userId: resolvedUserId,
    date_of_birth: form.dob,
    gender: form.gender,
    mother_name: form.motherName,
    father_name: form.fatherName,
    corresponding_address: form.correspondingAddress,
    permanent_address: form.permanentAddress,
  },
  {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImZpbmRVc2VyIjp7Il9pZCI6IjZhNWYzYjNmMjFjYjczOGI2MmQ2NWRhYSIsIm5hbWUiOiJWYXJzaGEiLCJlbWFpbCI6InZhc3VwYWxsaXZhcnNoYUBnbWFpbC5jb20iLCJtb2JpbGVfbnVtYmVyIjoiOTg0OTE4NzQ5MiIsInBhc3N3b3JkIjoiJDJiJDEwJHlWbFhKTUd2RmRwTGxtdEN0bDY0UE95bC80Z1dPNS94T282cDEyNGdDd2JqZUhKdG5JV2J5Iiwib3RwIjoiMzc5NzI2IiwicmVmZXJyYWxfY29kZSI6Ikc5SE82UkVQIiwicm9sZSI6InN0dWRlbnQiLCJ1c2VySWQiOiJhMTI1YjllMS05ZDAxLTQxYzQtOGVlOC03ZWQ0MmY0YWVmODQiLCJjcmVhdGVkQXQiOiIyMDI2LTA3LTIxVDA5OjI2OjIzLjYyOFoiLCJ1cGRhdGVkQXQiOiIyMDI2LTA5LTAxVDExOjE2OjI5LjQwNVoiLCJfX3YiOjAsImFjdGl2ZVRva2VuU2Vzc2lvbklkIjoiIiwic2Vzc2lvbkV4cGlyZXNBdCI6IjIwMjYtMDktMDhUMTE6MTY6MjkuMDAwWiJ9fSwic2Vzc2lvbklkIjoiM2JlNjU4YjMtMWQ0Ny00NGUyLTlhNTgtYmFkMGE4ZTI0YjFhIiwiaWF0IjoxNzg4MzI3MzIxLCJleHAiOjE3ODg5MzIxMjF9.VYSNa9w01LQVsXinpojnM5A_FP-rDfybICrh07sn18s`, // whatever your stored token variable/context is
    },
  }
);

      if (response.data?.statusCode === 200) {
        Toast.show({
          type: "success",
          text1: "Saved",
          text2: response.data?.message || "Personal information updated.",
        });
        setEditMode(false);
        router.back();
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: response.data?.message || "Couldn't save changes.",
        });
      }
    } catch (error: any) {
      console.error("Error saving personal info:", error?.response?.data || error.message);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Couldn't save changes. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const isFieldEditable = (key: keyof FormState) =>
    editMode && !LOCKED_FIELDS.includes(key);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Ionicons name="chevron-back" size={26} color={COLORS.navyDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Information</Text>
        <TouchableOpacity style={styles.editButton} onPress={() => setEditMode((prev) => !prev)}>
          <Feather name="edit-2" size={15} color={editMode ? COLORS.navy : COLORS.navyDark} />
          <Text style={[styles.editButtonText, editMode && { color: COLORS.navy }]}>
            {editMode ? "Editing" : "Edit"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={styles.note}>
          <Text style={styles.noteLabel}>Note: </Text>
          Name, Mobile and email can&apos;t be edited. should consult admin for further assistance.
  
        </Text>
            <TouchableOpacity onPress={() => {
  router.push({
    pathname: '/sidepanel/profile/admin_consulting',
    params: {
      student: JSON.stringify(student),
      userId: resolvedUserId,
      name: form.name,
      mobile: form.mobile,
      email: form.email,
    },
  });
}}>
  <Text style={styles.noteBold}>Click away</Text>
</TouchableOpacity>

        <FieldRow value={form.name} placeholder="Full Name" editable={isFieldEditable("name")} onChangeText={(v) => updateField("name", v)} iconRight={<Feather name="user" size={18} color={COLORS.icon} />} />

        <FieldRow value={form.dob} placeholder="Date of birth" editable={isFieldEditable("dob")} onChangeText={(v) => updateField("dob", v)} iconRight={<MaterialCommunityIcons name="cake-variant-outline" size={19} color={COLORS.icon} />} />

        <Pressable disabled={!isFieldEditable("gender")} onPress={() => setGenderModalVisible(true)}>
          <View style={styles.field}>
            <Text style={form.gender ? styles.fieldText : styles.placeholderText}>{form.gender || "Gender"}</Text>
            <MaterialCommunityIcons
              name={form.gender === "Female" ? "gender-female" : form.gender === "Other" ? "gender-non-binary" : "gender-male"}
              size={19}
              color={COLORS.icon}
            />
          </View>
        </Pressable>

        <FieldRow value={form.mobile} placeholder="Mobile Number" editable={isFieldEditable("mobile")} keyboardType="phone-pad" onChangeText={(v) => updateField("mobile", v)} iconRight={<Feather name="phone" size={18} color={COLORS.icon} />} />

        <FieldRow value={form.email} placeholder="Email" editable={isFieldEditable("email")} keyboardType="email-address" autoCapitalize="none" onChangeText={(v) => updateField("email", v)} iconRight={<Feather name="mail" size={18} color={COLORS.icon} />} />

        <FieldRow value={form.motherName} placeholder="Mother Name" editable={isFieldEditable("motherName")} onChangeText={(v) => updateField("motherName", v)} iconRight={<MaterialCommunityIcons name="human-female" size={19} color={COLORS.icon} />} />

        <FieldRow value={form.fatherName} placeholder="Father Name" editable={isFieldEditable("fatherName")} onChangeText={(v) => updateField("fatherName", v)} iconRight={<MaterialCommunityIcons name="human-male-male" size={19} color={COLORS.icon} />} />

        <FieldRow value={form.correspondingAddress} placeholder="Corresponding Address" editable={isFieldEditable("correspondingAddress")} multiline onChangeText={(v) => updateField("correspondingAddress", v)} iconRight={<Feather name="map-pin" size={18} color={COLORS.icon} />} />

        <FieldRow value={form.permanentAddress} placeholder="Permanent Address" editable={isFieldEditable("permanentAddress")} multiline onChangeText={(v) => updateField("permanentAddress", v)} iconRight={<Feather name="map-pin" size={18} color={COLORS.icon} />} />

        <TouchableOpacity
          style={[styles.saveButton, saving && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={genderModalVisible} transparent animationType="fade" onRequestClose={() => setGenderModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setGenderModalVisible(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Gender</Text>
            {GENDER_OPTIONS.map((option) => (
              <TouchableOpacity key={option} style={styles.modalOption} onPress={() => { updateField("gender", option as string); setGenderModalVisible(false); }}>
                <Text style={styles.modalOptionText}>{option}</Text>
                {form.gender === option && <Ionicons name="checkmark" size={18} color={COLORS.navy} />}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

type FieldRowProps = {
  value: string;
  placeholder: string;
  editable: boolean;
  onChangeText: (v: string) => void;
  iconRight: React.ReactNode;
  keyboardType?: "default" | "phone-pad" | "email-address";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  multiline?: boolean;
};

function FieldRow({ value, placeholder, editable, onChangeText, iconRight, keyboardType = "default", autoCapitalize = "sentences", multiline = false }: FieldRowProps) {
  return (
    <View style={styles.field}>
      <TextInput
        style={[styles.fieldText, styles.fieldInput]}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={COLORS.placeholder}
        editable={editable}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
      />
      {iconRight}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: "row", alignItems: "center", paddingTop: 71, paddingBottom: 12, paddingHorizontal: 16 },
  headerTitle: { flex: 1, fontSize: 21, fontWeight: "700", color: COLORS.navyDark, marginLeft: 12 },
  editButton: { flexDirection: "row", alignItems: "center", gap: 6 },
  editButtonText: { fontSize: 14, fontWeight: "600", color: COLORS.navyDark },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  note: { fontSize: 11, lineHeight: 18, color: COLORS.navyDark, marginBottom: 16 },
  noteLabel: { color: COLORS.danger, fontWeight: "700" },
  noteBold: { fontWeight: "700" ,fontSize: 11, marginTop: 7, color: COLORS.navyDark},
  field: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: COLORS.field, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 12 },
  fieldInput: { flex: 1, padding: 0 },
  fieldText: { fontSize: 15, color: COLORS.fieldText },
  placeholderText: { fontSize: 15, color: COLORS.placeholder },
  saveButton: { marginTop: 16, backgroundColor: COLORS.navy, borderRadius: 14, paddingVertical: 16, alignItems: "center" },
  saveButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(10,26,59,0.4)", justifyContent: "center", alignItems: "center" },
  modalCard: { width: "80%", backgroundColor: "#FFFFFF", borderRadius: 16, padding: 20 },
  modalTitle: { fontSize: 16, fontWeight: "700", color: COLORS.navyDark, marginBottom: 12 },
  modalOption: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#EEF0F6" },
  modalOptionText: { fontSize: 15, color: COLORS.fieldText },
});