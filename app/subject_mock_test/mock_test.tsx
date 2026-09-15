import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface MockTestData {
  id: string;
  title: string;
  questions: number;
  minutes: number;
  attempts: number;
  // image: any;
  footerText: string;
  accentColor: string;
}

const MOCK_TESTS: MockTestData[] = [
  {
    id: "1",
    title: "Mock Test 1:\nCivil Procedure Code",
    questions: 200,
    minutes: 150,
    attempts: 3,
    // image: require("../assets/images/target-icon.png"),
    footerText: "Crash it! every attempt makes you stronger!",
    accentColor: "#F3D9D9",
  },
  {
    id: "2",
    title: "Mock Test 2:\nCivil Procedure Code",
    questions: 200,
    minutes: 150,
    attempts: 2,
    // image: require("../assets/images/scale-icon.png"),
    footerText: "You're a genius! Ready for the next challenge?",
    accentColor: "#F3EBC8",
  },
  {
    id: "3",
    title: "Mock Test 3:\nCivil Procedure Code",
    questions: 200,
    minutes: 150,
    attempts: 2,
    // image: require("../assets/images/scale-icon.png"),
    footerText: "You're a genius! Ready for the next challenge?",
    accentColor: "#DCE1F7",
  },
];

export default function MockTest() {
  const handleStartTest = (testId: string) => {
    router.push({
      pathname: "/subject_mock_test/mock_task",
      params: { testId },
    });
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F3F7" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={26} color="#1A1A2E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AP Civil Procedure Code Mocks</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerTextWrap}>
            <Text style={styles.bannerTitle}>Unlock Your{"\n"}Potential</Text>
            <Text style={styles.bannerSubtitle}>Access Your Exams</Text>
          </View>
          {/* <Image
            source={require("../assets/images/growth-illustration.png")}
            style={styles.bannerImage}
            resizeMode="contain"
          /> */}
        </View>

        {/* Mock Test Cards */}
        {MOCK_TESTS.map((test) => (
          <View key={test.id} style={styles.card}>
            <View
              style={[
                styles.cardCornerAccent,
                { backgroundColor: test.accentColor },
              ]}
            />

            <View style={styles.cardTopRow}>
              <Text style={styles.cardTitle}>{test.title}</Text>
              {/* <Image
                source={test.image}
                style={styles.cardIcon}
                resizeMode="contain"
              /> */}
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="document-text-outline" size={16} color="#6B7280" />
                <Text style={styles.metaText}>{test.questions} Ques</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color="#6B7280" />
                <Text style={styles.metaText}>{test.minutes} mins</Text>
              </View>
            </View>

            <View style={styles.actionRow}>
  <TouchableOpacity
    style={styles.attemptsBadge}
    onPress={() =>
      router.push({
        pathname: "/subject_mock_test/mock_task",
        params: { testId: test.id },
      })
    }
  >
    <Text style={styles.attemptsText}>
      {test.attempts} Attempts
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.startButton}
    onPress={() =>
      router.push({
        pathname: "/subject_mock_test/mock_test", // Your start test page
        params: { testId: test.id },
      })
    }
  >
    <Text style={styles.startButtonText}>Start Test</Text>
  </TouchableOpacity>
</View>
            <Text style={styles.footerText}>{test.footerText}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const NAVY = "#1B2560";
const CARD_RADIUS = 18;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F2F3F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  // Banner
  banner: {
    backgroundColor: NAVY,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    overflow: "hidden",
  },
  bannerTextWrap: {
    flex: 1,
  },
  bannerTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 28,
    marginBottom: 8,
  },
  bannerSubtitle: {
    color: "#C9CEE8",
    fontSize: 14,
  },
  bannerImage: {
    width: 120,
    height: 110,
    marginLeft: 8,
  },

  // Cards
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: CARD_RADIUS,
    padding: 18,
    marginBottom: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardCornerAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 90,
    height: 90,
    borderTopLeftRadius: CARD_RADIUS,
    borderBottomRightRadius: 60,
    opacity: 0.6,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A2E",
    flex: 1,
    lineHeight: 24,
    zIndex: 2,
  },
  cardIcon: {
    width: 64,
    height: 64,
    zIndex: 2,
  },
  metaRow: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 16,
    zIndex: 2,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: "#6B7280",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
    zIndex: 2,
  },
  attemptsBadge: {
    flex: 1,
    backgroundColor: "#DCE1F7",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 13,
  },
  attemptsText: {
    color: NAVY,
    fontWeight: "600",
    fontSize: 14,
  },
  startButton: {
    flex: 1,
    backgroundColor: NAVY,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 13,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  footerText: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    zIndex: 2,
  },
});