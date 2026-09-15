import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";

// ---------- Types ----------
interface TermsCondition {
  _id: string;
  test_term_id: string;
  terms_conditions: string[];
  testType: "QZ" | "GT" | "SMT" | string;
  instructions: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface TermsConditionsResponse {
  statusCode: number;
  message: string;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  data: TermsCondition[];
}

interface CommonIssue {
  id: string;
  label: string;
  icon: "receipt" | "credit-card" | "settings";
}

const COLORS = {
  navy: "#0A1A3B",
  blue: "#23408E",
  maroon: "#7A1F2B",
  background: "#EDEEF5",
  cardBg: "#FFFFFF",
  gray: "#8A8FA3",
  errorRed: "#B3261E",
};

const COMMON_ISSUES: CommonIssue[] = [
  { id: "1", label: "Course Content Access", icon: "receipt" },
  { id: "2", label: "Payment & Billing", icon: "credit-card" },
  { id: "3", label: "Account Settings", icon: "settings" },
];

export default function Help() {
  const [problem, setProblem] = useState("");
  const { test_term_id: paramTestTermId } = useLocalSearchParams<{
    test_term_id?: string;
  }>();

  // TEMP: falls back to a hardcoded test ID when no param is passed.
  // Remove the fallback once real navigation always supplies test_term_id.
  const test_term_id =
    paramTestTermId ?? "55fd83b6-4add-499d-8527-e439542b0a16";

  const [terms, setTerms] = useState<TermsCondition | null>(null);
  const [termsLoading, setTermsLoading] = useState(false);
  const [termsError, setTermsError] = useState<string | null>(null);

  useEffect(() => {
    console.log("useEffect called");

    if (!test_term_id) {
      console.log("No test_term_id provided — skipping terms fetch");
      return;
    }

    const fetchTerms = async () => {
      console.log("API calling...");
      setTermsLoading(true);
      setTermsError(null);
      try {
        const response = await axios.get<TermsConditionsResponse>(
          "https://api.raoslawacademy.com/test-terms?page=1&limit=10"
        );

        console.log("Response:", response.data);

        if (response.data?.statusCode === 200) {
          const match = response.data.data.find(
            (t) => t.test_term_id === test_term_id
          );
          if (match) {
            setTerms(match);
          } else {
            setTermsError("No terms & conditions found for this test.");
          }
        } else {
          setTermsError("Couldn't load terms & conditions right now.");
        }
      } catch (error: any) {
        console.log("API Error:", error);
        console.log("Response:", error?.response?.data);
        setTermsError("Couldn't load terms & conditions right now.");
      } finally {
        setTermsLoading(false);
      }
    };

    fetchTerms();
  }, [test_term_id]);

  const renderIcon = (icon: CommonIssue["icon"]) => {
    switch (icon) {
      case "receipt":
        return (
          <MaterialCommunityIcons
            name="text-box-outline"
            size={20}
            color={COLORS.blue}
          />
        );
      case "credit-card":
        return <Feather name="credit-card" size={20} color={COLORS.blue} />;
      case "settings":
        return <Ionicons name="settings-outline" size={20} color={COLORS.blue} />;
    }
  };

  const handleIssuePress = (issue: CommonIssue) => {
    router.push({
      pathname: "/sidepanel/help_center/help_issue",
      params: { id: issue.id },
    });
  };

  const handleSubmit = () => {
    if (!problem.trim()) return;
    router.push({
      pathname: "/sidepanel/help_center/help_issue",
      params: { description: problem },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <TouchableOpacity
          style={styles.ticketsButton}
          onPress={() => router.push("/sidepanel/help_center/help_issue")}
        >
          <Text style={styles.ticketsButtonText}>Tickets Statuss</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Terms & Conditions (only shown when test_term_id is passed in) */}
        {test_term_id && (
          <View style={styles.termsCard}>
            <Text style={styles.sectionHeading}>Test Terms & Conditions</Text>

            {termsLoading && (
              <View style={styles.termsLoadingRow}>
                <ActivityIndicator size="small" color={COLORS.blue} />
                <Text style={styles.termsLoadingText}>Loading terms…</Text>
              </View>
            )}

            {!termsLoading && termsError && (
              <Text style={styles.termsErrorText}>{termsError}</Text>
            )}

            {!termsLoading && !termsError && terms && (
              <>
                <Text style={styles.termsTypeLabel}>
                  Test Type: {terms.testType}
                </Text>

                {terms.terms_conditions.map((line, idx) => (
                  <View key={`tc-${idx}`} style={styles.bulletRow}>
                    <View style={styles.bulletDot} />
                    <Text style={styles.bulletText}>{line}</Text>
                  </View>
                ))}

                <Text style={[styles.termsTypeLabel, { marginTop: 14 }]}>
                  Instructions
                </Text>
                {terms.instructions.map((line, idx) => (
                  <View key={`ins-${idx}`} style={styles.bulletRow}>
                    <View style={styles.bulletDot} />
                    <Text style={styles.bulletText}>{line}</Text>
                  </View>
                ))}
              </>
            )}
          </View>
        )}

        {/* Problem Description Box */}
        <View style={styles.describeBox}>
          <TextInput
            style={styles.describeInput}
            placeholder="Describe your problem..."
            placeholderTextColor={COLORS.gray}
            value={problem}
            onChangeText={setProblem}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Common Issues */}
        <Text style={styles.sectionHeading}>Common Issues</Text>
        {COMMON_ISSUES.map((issue) => (
          <TouchableOpacity
            key={issue.id}
            style={styles.issueRow}
            activeOpacity={0.75}
            onPress={() => handleIssuePress(issue)}
          >
            {renderIcon(issue.icon)}
            <Text style={styles.issueLabel}>{issue.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.submitWrapper}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            !problem.trim() && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!problem.trim()}
        >
          <Text style={styles.submitButtonText}>Submit Problem</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: COLORS.navy,
    flex: 1,
  },
  ticketsButton: {
    backgroundColor: COLORS.maroon,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  ticketsButtonText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  termsCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  termsLoadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  termsLoadingText: {
    color: "#4A5578",
    fontSize: 13,
  },
  termsErrorText: {
    color: COLORS.errorRed,
    fontSize: 13,
  },
  termsTypeLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.blue,
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.blue,
    marginTop: 6,
    marginRight: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.navy,
    lineHeight: 18,
  },
  describeBox: {
    borderWidth: 1.5,
    borderColor: COLORS.blue,
    borderRadius: 16,
    padding: 14,
    backgroundColor: COLORS.cardBg,
    marginBottom: 24,
  },
  describeInput: {
    height: 130,
    fontSize: 14,
    color: COLORS.navy,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.navy,
    marginBottom: 12,
  },
  issueRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  issueLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.navy,
    marginLeft: 12,
  },
  submitWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
    backgroundColor: COLORS.background,
  },
  submitButton: {
    backgroundColor: COLORS.navy,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#8A93B3",
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});