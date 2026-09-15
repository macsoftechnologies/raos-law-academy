import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { Toast } from "react-native-toast-message/lib/src/Toast";


const NAVY = "#0A1A3B";
const NAVY_LIGHT = "#23408E";
const GOLD = "#D8AE24";
const MAROON = "#7A1F2B";
const BG = "#EEF1FB";

const TEST_INFO = {
  title: "Grand Test - All Subjects",
  totalQuestions: 200,
  totalMarks: 200,
  duration: "150 mins",
};

const INSTRUCTIONS = [
  "You have 150 Minutes to complete the test.",
  "The test contains a total of 200 Questions for 200 Marks, covering all subjects.",
  "There is only one correct answer to each question. Click on the most appropriate option to mark it as your answer.",
  "There is 1/4 penalty for each wrong answer.",
  "You can change your answer by clicking on some other option.",
  "You can unmark your answer by clicking on the \u201CClear Response\u201D button.",
  "A number list of all questions appears at the right-hand side of the screen. You can access the questions in any order within a section or across sections by clicking on the question number given on the number list.",
  "You can use rough sheets while taking the test. Do not use calculators, log tables, dictionaries, or any other printed/online reference material during the test.",
  "Do not click the \u201CSubmit test\u201D button before completing the test. A test once submitted cannot be resumed.",
];

const TERMS = [
  "Are you sure you want to start the Grand Test?",
  "Once the test begins, you must complete it within 150 minutes.",
  "After submission time, you\u2019ll get an additional 15 minutes grace period to scan your answer sheets, convert them into a PDF, and upload the file.",
  "Once started, the test cannot be paused or restarted.",
];

export default function GrandInstructions() {
    const { prelimes_test_id, prelimes_id, userId} = useLocalSearchParams<{prelimes_test_id: string,prelimes_id:string, userId:string }>();
console.log("received prelims test id"+prelimes_test_id   )
console.log("received prelims  id"+prelimes_id  )
console.log("received  userid"+userId  )
  const [accepted, setAccepted] = useState(false);

 const handleStartTest = async () => {
  
    try {
      const response = await axios.post(
        "https://api.raoslawacademy.com/prelimes-tests/start_attempt",
        {
          userId: userId,
          testId: prelimes_test_id,
        }
      );

      console.log(response.data.message);
      

      if (response.data.statusCode === 200) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: response.data.message || "Your test has been started.",
        });

       

      router.push({
  pathname: "/grandmodule/grand_test_start",
  params: {
    prelimes_test_id:prelimes_test_id,
    prelimes_id:prelimes_id,
    userId:userId
  },
} as any);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: response.data.message || "Couldn't start the test.",
        });
      }
    } catch (error: any) {
      console.error("Error starting test attempt:", error?.response?.data || error.message);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Couldn't start the test. Please try again.",
      });
    } 
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Instructions</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.testTitle}>{TEST_INFO.title}</Text>

        <View style={styles.divider} />

        {/* Stat pills */}
        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Text style={styles.statValue}>{TEST_INFO.totalQuestions}</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statValue}>{TEST_INFO.totalMarks}</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statValueSmall}>{TEST_INFO.duration}</Text>
          </View>
        </View>
        <View style={styles.statsLabelRow}>
          <Text style={styles.statLabel}>Total Questions</Text>
          <Text style={styles.statLabel}>Total Marks</Text>
          <Text style={styles.statLabel}>Duration</Text>
        </View>

        <View style={styles.divider} />

        {/* Instructions */}
        <Text style={styles.sectionTitle}>
          Please read the following instructions carefully
        </Text>

        {INSTRUCTIONS.map((item, idx) => (
          <View key={idx} style={styles.listRow}>
            <Text style={styles.listIndex}>{idx + 1}.</Text>
            <Text style={styles.listText}>{item}</Text>
          </View>
        ))}

        {/* Terms & Conditions */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
          Terms & Conditions
        </Text>

        {TERMS.map((item, idx) => (
          <View key={idx} style={styles.listRow}>
            <Text style={styles.listIndex}>{idx + 1}.</Text>
            <Text style={styles.listText}>{item}</Text>
          </View>
        ))}

        <TouchableOpacity
          style={styles.acceptRow}
          onPress={() => setAccepted((prev) => !prev)}
          activeOpacity={0.75}
        >
          <View style={[styles.checkbox, accepted && styles.checkboxChecked]}>
            {accepted && <Ionicons name="checkmark" size={16} color="#fff" />}
          </View>
          <Text style={styles.acceptText}>I accept Terms & Conditions</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom action buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={handleCancel}
          activeOpacity={0.85}
        >
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>

      <TouchableOpacity
  style={[styles.startBtn, !accepted && styles.startBtnDisabled]}
  onPress={handleStartTest}
  activeOpacity={0.85}
  disabled={!accepted}
>
  <Text style={styles.startBtnText}>Start Test</Text>
</TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#D6DAE8",
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  statPill: {
    flex: 1,
    backgroundColor: "#DDE2F0",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  statValueSmall: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  statsLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 14,
    gap: 12,
  },
  statLabel: {
    flex: 1,
    fontSize: 12,
    color: "#5A5F73",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  listRow: {
    flexDirection: "row",
    marginBottom: 12,
    paddingRight: 4,
  },
  listIndex: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginRight: 8,
    width: 18,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: "#2C2C2C",
    lineHeight: 20,
  },
  acceptRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: MAROON,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: MAROON,
  },
  acceptText: {
    fontSize: 14,
    fontWeight: "600",
    color: MAROON,
  },
  bottomBar: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    gap: 14,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#B9C0D6",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    color: "#1A1A1A",
    fontSize: 16,
    fontWeight: "700",
  },
  startBtn: {
    flex: 1,
    backgroundColor: NAVY,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  startBtnDisabled: {
    backgroundColor: "#9AA3C2",
  },
  startBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});