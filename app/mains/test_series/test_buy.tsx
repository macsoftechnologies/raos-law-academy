import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Modal,
  Image,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import Toast from "react-native-toast-message";



export interface MainsCourse {
  _id: string;
  mains_id: string;
  title: string;
  sub_title: string;
  about_course: string;
  course_points: string[];
  terms_conditions: string;
  presentation_image: string;
  subcategory_id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface MainsTestDetail {
  _id: string;
  mains_test_id: string;
  mains_id: MainsCourse[];
  title: string;
  no_of_qs: string;
  no_of_subjects: string;
  presentation_image: string;
  terms_conditions: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface MainsTestDetailsResponse {
  statusCode: number;
  message: string;
  data: MainsTestDetail[];
}


const NAVY = "#0A1A3B";
const MAROON = "#7A1F2B";
const BG = "#EDEEF5";

const API_BASE = "https://api.raoslawacademy.com";
const MAINS_TEST_DETAILS_URL = `${API_BASE}/mains/mainstestdetails`;
// TODO: confirm the real static-file prefix with your backend dev
const IMAGE_BASE = `${API_BASE}/uploads/`;


function parseTerms(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^\d+\.\s*/, ""));
}


export default function MainsTestOverviewScreen() {
  const { mains_test_id, mains_id } = useLocalSearchParams<{
    mains_test_id?: string;
    mains_id?: string;
  }>();

  const [testDetail, setTestDetail] = useState<MainsTestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const openModal = () => {
    setAccepted(false);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setAccepted(false);
  };

  useEffect(() => {
    console.log("[MainsTestOverview] mains_test_id param received:", mains_test_id);

    if (!mains_test_id) {
      setError("Missing test reference.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchTestDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("[MainsTestOverview] POST", MAINS_TEST_DETAILS_URL, "body:", {
          mains_test_id,
        });

        const response = await axios.post<MainsTestDetailsResponse>(
         "https://api.raoslawacademy.com/mains/mainstestdetails",
          { mains_test_id:"b0381513-0981-45f5-925e-940774b55301" }
        );

       

        if (cancelled) return;

        if (
          response.data.statusCode === 200 &&
          Array.isArray(response.data.data) &&
          response.data.data.length > 0
        ) {
          setTestDetail(response.data.data[0]);
        } else {
          console.log(
            "[MainsTestOverview] statusCode/empty-data issue:",
            response.data
          );
          setError("Couldn't load test details.");
        }
      } catch (err: any) {
        console.log(
          "[MainsTestOverview] fetch failed:",
          err?.response?.status,
          err?.response?.data ?? err?.message
        );
        if (cancelled) return;
        setError("Couldn't load test details.");
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Couldn't load test details. Pull down to retry.",
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTestDetails();

    return () => {
      cancelled = true;
    };
  }, [mains_test_id]);

  const course = testDetail?.mains_id?.[0];
  const terms = parseTerms(testDetail?.terms_conditions);

  const thumbUri = testDetail?.presentation_image
    ? `${IMAGE_BASE}${testDetail.presentation_image}`
    : null;

  // Confirmed from the modal — proceed into the subject-test list screen.
  const confirmStartTest = () => {
    if (!testDetail) return;
    closeModal();

    router.push({
      pathname: "/mains/test_series", // your existing subject-test list screen
      params: {
        mains_test_id: testDetail.mains_test_id,
        mains_id: mains_id ?? course?.mains_id ?? "",
      },
    } as any);
  };

  const handleViewResult = () => {
    router.push({
      pathname: "/mains-test/MainsResult" as any,
      params: {
        mains_test_id: testDetail?.mains_test_id ?? mains_test_id ?? "",
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#111111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={2}>
          {course?.title ?? testDetail?.title ?? "Mains Test"}
        </Text>
        <TouchableOpacity style={styles.resultBtn} onPress={handleViewResult}>
          <Text style={styles.resultBtnText}>Result</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.centerBlock}>
            <ActivityIndicator size="large" color={NAVY} />
            <Text style={styles.centerText}>Loading test details…</Text>
          </View>
        ) : error ? (
          <View style={styles.centerBlock}>
            <Ionicons name="alert-circle-outline" size={32} color={MAROON} />
            <Text style={styles.centerText}>{error}</Text>
            <Text style={styles.debugText}>
              mains_test_id: {mains_test_id ?? "undefined"}
            </Text>
          </View>
        ) : !testDetail ? (
          <View style={styles.centerBlock}>
            <Text style={styles.centerText}>No test details found.</Text>
          </View>
        ) : (
          <>
            {/* --- Banner / thumbnail --- */}
            <View style={styles.bannerBox}>
              {thumbUri ? (
                <Image
                  source={{ uri: thumbUri }}
                  style={styles.bannerImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.bannerPlaceholder}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <View key={i} style={styles.bannerLine} />
                  ))}
                </View>
              )}
            </View>

            {/* --- Course info --- */}
            {course && (
              <View style={styles.infoCard}>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseSubtitle}>{course.sub_title}</Text>
                <Text style={styles.aboutText}>{course.about_course}</Text>

                {course.course_points.length > 0 && (
                  <View style={styles.pointsBlock}>
                    {course.course_points.map((point, idx) => (
                      <View key={idx} style={styles.pointRow}>
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color={NAVY}
                        />
                        <Text style={styles.pointText}>{point}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* --- Test meta + start --- */}
            <View style={styles.metaCard}>
              <Text style={styles.metaCardTitle}>{testDetail.title}</Text>

              <View style={styles.metaRow}>
                <Ionicons
                  name="document-text-outline"
                  size={14}
                  color="#4A4F63"
                />
                <Text style={styles.metaText}>
                  {testDetail.no_of_qs} Questions
                </Text>
              </View>

              <View style={styles.metaRow}>
                <Ionicons name="reader-outline" size={14} color="#4A4F63" />
                <Text style={styles.metaText}>
                  {testDetail.no_of_subjects} Subjects
                </Text>
              </View>

              <TouchableOpacity
                style={styles.startBtn}
                onPress={openModal}
                activeOpacity={0.85}
              >
                <Text style={styles.startBtnText}>Start Test</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Note:</Text>
              <TouchableOpacity onPress={closeModal} hitSlop={10}>
                <Ionicons name="close" size={22} color="#111111" />
              </TouchableOpacity>
            </View>

            {terms.map((term, idx) => (
              <View key={idx} style={styles.termRow}>
                <Text style={styles.termNumber}>{idx + 1}.</Text>
                <Text style={styles.termText}>{term}</Text>
              </View>
            ))}

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setAccepted(!accepted)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, accepted && styles.checkboxChecked]}>
                {accepted && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
              </View>
              <Text style={styles.checkboxLabel}>I accept Terms &amp; Conditions</Text>
            </TouchableOpacity>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={closeModal}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalStartBtn, !accepted && styles.modalStartBtnDisabled]}
                onPress={confirmStartTest}
                disabled={!accepted}
                activeOpacity={0.85}
              >
                <Text style={styles.modalStartBtnText}>Start Test</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BG },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 14,
    paddingTop: 20,
  },
  backBtn: { padding: 6, marginRight: 2, marginTop: 2 },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111111",
    flex: 1,
    flexShrink: 1,
    lineHeight: 24,
  },
  resultBtn: {
    backgroundColor: MAROON,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 9,
    marginLeft: 8,
    marginTop: 2,
  },
  resultBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 24,
  },
  centerBlock: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 8,
  },
  centerText: {
    fontSize: 13,
    color: "#4A4F63",
    textAlign: "center",
  },
  debugText: {
    fontSize: 11,
    color: "#A0A5B8",
    marginTop: 6,
    textAlign: "center",
  },

  bannerBox: {
    width: "100%",
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#F7F8FC",
    marginBottom: 16,
  },
  bannerImage: { width: "100%", height: "100%" },
  bannerPlaceholder: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    gap: 8,
  },
  bannerLine: {
    height: 3,
    borderRadius: 2,
    backgroundColor: "#D7DAE6",
    width: "80%",
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 2,
  },
  courseSubtitle: {
    fontSize: 13,
    color: "#6B7086",
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 13.5,
    color: "#3A3F55",
    lineHeight: 19,
    marginBottom: 12,
  },
  pointsBlock: { gap: 8 },
  pointRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  pointText: {
    flex: 1,
    fontSize: 13.5,
    color: "#26293A",
    fontWeight: "600",
  },

  metaCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  metaCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  metaText: { fontSize: 13, color: "#4A4F63" },

  startBtn: {
    backgroundColor: NAVY,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 20,
  },
  startBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },

  // --- Terms modal ---
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 28,
  },
  modalHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: MAROON },
  termRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  termNumber: {
    fontSize: 12.5,
    color: "#26293A",
    marginRight: 4,
    fontWeight: "600",
  },
  termText: {
    flex: 1,
    fontSize: 12.5,
    color: "#26293A",
    lineHeight: 17,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
    marginBottom: 18,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: MAROON,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: MAROON,
  },
  checkboxLabel: {
    fontSize: 13,
    color: "#26293A",
    fontWeight: "600",
  },
  modalBtnRow: {
    flexDirection: "row",
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1.2,
    borderColor: "#C7CBD6",
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    color: "#26293A",
    fontSize: 14,
    fontWeight: "700",
  },
  modalStartBtn: {
    flex: 1,
    backgroundColor: NAVY,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  modalStartBtnDisabled: {
    opacity: 0.45,
  },
  modalStartBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});