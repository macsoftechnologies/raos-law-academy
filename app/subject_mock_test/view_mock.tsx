import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import Toast from "react-native-toast-message";


interface MockTestPrelims {
  prelimes_id: string;
  title: string;
}

interface MockTestLaw {
  lawId: string;
  title: string;
}

interface MockTestCourse {
  subcategory_id: string;
  title: string;
}

interface MockTestSubjectDetail {
  _id: string;
  mocktest_subject_id: string;
  presentation_image: string;
  title: string;
  no_of_qos: string;
  duration: string;
  prelimes: MockTestPrelims | Record<string, never>;
  law: MockTestLaw | Record<string, never>;
  course: MockTestCourse | Record<string, never>;
}

interface MockTestSubjectDetailResponse {
  statusCode: number;
  message: string;
  data: MockTestSubjectDetail[];
}


interface PrelimesTest {
  _id: string;
  prelimes_test_id: string;
  prelimes_id: string;
  test_type: string;
  test_number: string;
  title: string;
  no_of_qos: string;
  duration: string;
  mocktest_subject_id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PrelimesTestsResponse {
  statusCode: number;
  message: string;
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  data: PrelimesTest[];
}

const termsList = [
  "Are you sure you want to start the Civil Laws Mains Test?",
  "Once the test begins, you must complete it within 3 hours.",
  "After submission time, you'll get an additional 15 minutes grace period to scan your answer sheets, convert them into a PDF, and upload the file.",
  "Once started, the test cannot be paused or restarted.",
];

const NAVY = "#0A1A3B";
const GOLD = "#C9A227";

export default function ViewMock() {
  const { mocktest_subject_id, userId} = useLocalSearchParams<{
    mocktest_subject_id?: string;
    userId?: string;
  }>();

  // now an array, not a single object
  const [mockTests, setMockTests] = useState<MockTestSubjectDetail[]>([]);
   const [testsList, setTestsList] = useState<PrelimesTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [activeMock, setActiveMock] = useState<MockTestSubjectDetail | null>(null);

  
  
  

  useEffect(() => {
    const fetchMockDetails = async () => {
      if (!mocktest_subject_id) {
        setError("No mock test selected.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await axios.post<MockTestSubjectDetailResponse>(
          "https://api.raoslawacademy.com/prelimes/mocktestsubjectdetails",
          { mocktest_subject_id: mocktest_subject_id ?? "" }
        );

        // full response log
        console.log("FULL API RESPONSE:", JSON.stringify(response.data, null, 2));

        if (response.data.statusCode === 200 && response.data.data.length > 0) {
          setMockTests(response.data.data);

          // log every field per item
          response.data.data.forEach((item, idx) => {
            console.log(`--- Mock Test [${idx}] ---`);
            console.log("mocktest_subject_id:", item.mocktest_subject_id);
            console.log("title:", item.title);
            console.log("no_of_qos:", item.no_of_qos);
            console.log("duration:", item.duration);
            console.log("lawId:", item.law?.lawId);
            console.log("law title:", item.law?.title);
            console.log("prelimes_id:", item.prelimes?.prelimes_id);
            console.log("prelimes title:", item.prelimes?.title);
            console.log("course subcategory_id:", item.course?.subcategory_id);
            console.log("course title:", item.course?.title);
        
          });
        } else {
          setError("Couldn't load this mock test.");
        }

        if (response.data.statusCode !== 200) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: response.data.message || "no data found for this mock test.",
          });
        }
      } catch (err: any) {
        console.log(err?.response?.data || err.message);
        setError("Couldn't load this mock test.");
      } finally {
        setLoading(false);
      }
    };

    fetchMockDetails();
  }, [mocktest_subject_id]);

   

  const openModal = (mock: MockTestSubjectDetail) => {
    setActiveMock(mock);
    setAccepted(false);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setAccepted(false);
  };
const handleStartTest = async () => {
  if (!accepted || !activeMock) return;

  if (!activeMock.law?.lawId || !activeMock.prelimes?.prelimes_id) {
    Toast.show({
      type: "error",
      text1: "Unavailable",
      text2: "This mock test isn't fully configured yet. Please try another.",
    });
    return;
  }

  try {
    const response = await axios.get<PrelimesTestsResponse>(
      `https://api.raoslawacademy.com/prelimes-tests?page=1&limit=10&test_type=SMT&mocktest_subject_id=${mocktest_subject_id}`
    );

    console.log("FULL TESTS RESPONSE:", JSON.stringify(response.data, null, 2));

    if (response.data.statusCode !== 200 || response.data.data.length === 0) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: response.data.message || "No tests found for this subject.",
      });
      return;
    }

    // pick the most recently created test
    const latestTest = [...response.data.data].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

    console.log("prelimes_test_id:", latestTest.prelimes_test_id);
    console.log("prelimes_id:", latestTest.prelimes_id);

    setModalVisible(false);

    router.push({
      pathname: "/subject_mock_test/instructions",
      params: {
        mocktest_subject_id: activeMock.mocktest_subject_id,
        lawId: activeMock.law.lawId,
        prelimsId: latestTest.prelimes_id,
        prelimes_test_id: latestTest.prelimes_test_id,
        userId: userId,
      },
    } as any);
  } catch (err: any) {
    console.log(err?.response?.data || err.message);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "Couldn't start the test. Please try again.",
    });
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDEEF5" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color="#0A1A3B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {mockTests[0]?.title || "Mock Test"}
        </Text>
      </View>

      {loading ? (
        <View style={styles.centerWrap}>
          <ActivityIndicator size="large" color={NAVY} />
        </View>
      ) : error || mockTests.length === 0 ? (
        <View style={styles.centerWrap}>
          <Text style={styles.errorText}>{error ?? "Mock test not found."}</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {mockTests.map((mock) => (
            <View key={mock.mocktest_subject_id} style={styles.card}>
              <View style={styles.previewWrap}>
                <View style={styles.previewOverlay} />
                <Text style={styles.watermark}>Draft</Text>
              </View>

              <Text style={styles.cardTitle}>{mock.title}</Text>

              <View style={styles.pillRow}>
                <View style={[styles.pill, styles.pillMaroon]}>
                  <MaterialCommunityIcons name="clipboard-text-outline" size={14} color="#7A1F2B" />
                  <Text style={styles.pillTextMaroon}>{mock.no_of_qos} Ques</Text>
                </View>
                <View style={[styles.pill, styles.pillGold]}>
                  <Ionicons name="time-outline" size={14} color="#7A5C10" />
                  <Text style={styles.pillTextGold}>{mock.duration} mins</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.viewBtn}
                onPress={() => openModal(mock)}
                activeOpacity={0.85}
              >
                <Text style={styles.viewBtnText}>View</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={closeModal}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Note:</Text>
              <TouchableOpacity onPress={closeModal} hitSlop={10}>
                <Ionicons name="close" size={22} color="#111111" />
              </TouchableOpacity>
            </View>

            {termsList.map((term, idx) => (
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
              <Text style={styles.checkboxLabel}>I accept Terms & Conditions</Text>
            </TouchableOpacity>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={closeModal} activeOpacity={0.8}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.startBtn, !accepted && styles.startBtnDisabled]}
                onPress={handleStartTest}
                disabled={!accepted}
                activeOpacity={0.85}
              >
                <Text style={styles.startBtnText}>Start Test</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#EDEEF5", paddingTop: 23 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 14 },
  backBtn: { padding: 6, marginRight: 4 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111111", flexShrink: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },
  centerWrap: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, paddingHorizontal: 20 },
  errorText: { color: "#8A8A8A", fontSize: 14, textAlign: "center" },
  card: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 14, marginBottom: 16 },
  previewWrap: { height: 130, borderRadius: 12, backgroundColor: "#F4F4F4", overflow: "hidden", marginBottom: 12, justifyContent: "center" },
  previewOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(255,255,255,0.55)" },
  watermark: { position: "absolute", alignSelf: "center", fontSize: 26, fontWeight: "700", color: "rgba(0,0,0,0.12)", transform: [{ rotate: "-20deg" }] },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#111111", marginBottom: 10 },
  pillRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  pill: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
  pillMaroon: { backgroundColor: "#F3D9D9" },
  pillGold: { backgroundColor: "#F3E6C4" },
  pillTextMaroon: { color: "#7A1F2B", fontSize: 12, fontWeight: "700" },
  pillTextGold: { color: "#7A5C10", fontSize: 12, fontWeight: "700" },
  viewBtn: { backgroundColor: NAVY, borderRadius: 10, paddingVertical: 12, alignItems: "center" },
  viewBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
  modalSheet: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 28 },
  modalHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#7A1F2B" },
  termRow: { flexDirection: "row", marginBottom: 12 },
  termNumber: { fontSize: 14, color: "#111111", marginRight: 6, fontWeight: "500" },
  termText: { flex: 1, fontSize: 14, lineHeight: 20, color: "#111111" },
  checkboxRow: { flexDirection: "row", alignItems: "center", marginTop: 4, marginBottom: 20 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1.5, borderColor: "#B5B5B5", marginRight: 10, alignItems: "center", justifyContent: "center" },
  checkboxChecked: { backgroundColor: NAVY, borderColor: NAVY },
  checkboxLabel: { fontSize: 13, color: "#111111" },
  modalBtnRow: { flexDirection: "row", gap: 12 },
  cancelBtn: { flex: 1, borderRadius: 10, paddingVertical: 14, alignItems: "center", backgroundColor: "#EFEFEF" },
  cancelBtnText: { fontSize: 14, fontWeight: "700", color: "#333333" },
  startBtn: { flex: 1, borderRadius: 10, paddingVertical: 14, alignItems: "center", backgroundColor: NAVY },
  startBtnDisabled: { backgroundColor: "#9AA3B5" },
  startBtnText: { fontSize: 14, fontWeight: "700", color: "#FFFFFF" },
});