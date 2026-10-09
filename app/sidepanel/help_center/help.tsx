import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

type TicketType = "course" | "support";

interface CommonIssue {
  id: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  ticketType: TicketType;
}

const COMMON_ISSUES: CommonIssue[] = [
  { id: "1", label: "Course Content Access", icon: "book-open", ticketType: "course" },
  { id: "2", label: "Payment & Billing", icon: "credit-card", ticketType: "support" },
  { id: "3", label: "Account & Technical Support", icon: "settings", ticketType: "support" },
];

interface TicketData {
  userId: string;
  title: string;
  description: string;
  ticket_type: TicketType;
  status: "pending" | "in_progress" | "resolved" | "closed";
  ticketId: string;
}

interface CreateTicketResponse {
  success: boolean;
  message: string;
  data: TicketData;
}

const CREATE_TICKET_URL = "https://api.raoslawacademy.com/tickets/create";
const DEFAULT_USER_ID = "7b682881-2d36-41b4-aca9-a9540bff291f";

// Helper to derive a concise title from problem description
const deriveTitle = (description: string) => {
  const trimmed = description.trim();
  return trimmed.length > 60 ? `${trimmed.slice(0, 57)}...` : trimmed;
};

export default function HelpCenterScreen() {
  const [problem, setProblem] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [ticketType, setTicketType] = useState<TicketType>("support");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!problem.trim() || submitting) return;

    try {
      setSubmitting(true);

      const storedUserId = await AsyncStorage.getItem("userId");
      const userId = storedUserId || DEFAULT_USER_ID;

      const title = customTitle.trim() || deriveTitle(problem);

      const response = await axios.post<CreateTicketResponse>(
        CREATE_TICKET_URL,
        {
          userId,
          title,
          description: problem.trim(),
          ticket_type: ticketType,
        },
        { headers: { "Content-Type": "application/json" }, timeout: 12000 }
      );

      if (response.data?.success && response.data?.data?.ticketId) {
        const createdTicketId = response.data.data.ticketId;
        setProblem("");
        setCustomTitle("");
        Toast.show({
          type: "success",
          text1: "Ticket Created 🎉",
          text2: `Ticket #${createdTicketId.slice(0, 8).toUpperCase()} submitted.`,
        });

        // Navigate to confirmation screen
        router.push({
          pathname: "/sidepanel/help_center/help_submit" as any,
          params: { ticketId: createdTicketId },
        });
      } else {
        Alert.alert("Error", response.data?.message || "Failed to submit ticket.");
      }
    } catch (error: any) {
      console.log(
        "Ticket submit error:",
        error?.response?.status,
        error?.response?.data,
        error?.message
      );
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          `Something went wrong (${error?.response?.status ?? "no response"}). Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleIssuePress = (issue: CommonIssue) => {
    setProblem(issue.label);
    setTicketType(issue.ticketType);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <TouchableOpacity
          style={styles.ticketsButton}
          onPress={() => router.push("/sidepanel/help_center/help_issue")}
        >
          <Text style={styles.ticketsButtonText}>Tickets Status</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Category Picker */}
        <Text style={styles.fieldLabel}>Issue Type</Text>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeOption, ticketType === "course" && styles.typeOptionActive]}
            onPress={() => setTicketType("course")}
          >
            <Feather
              name="book"
              size={16}
              color={ticketType === "course" ? "#FFFFFF" : "#4B5563"}
            />
            <Text
              style={[
                styles.typeOptionText,
                ticketType === "course" && styles.typeOptionTextActive,
              ]}
            >
              Course Issue
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeOption, ticketType === "support" && styles.typeOptionActive]}
            onPress={() => setTicketType("support")}
          >
            <Feather
              name="headphones"
              size={16}
              color={ticketType === "support" ? "#FFFFFF" : "#4B5563"}
            />
            <Text
              style={[
                styles.typeOptionText,
                ticketType === "support" && styles.typeOptionTextActive,
              ]}
            >
              General & Payment
            </Text>
          </TouchableOpacity>
        </View>

        {/* Problem input */}
        <Text style={styles.fieldLabel}>Describe Your Problem</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Describe your problem in detail..."
            placeholderTextColor="#6B7280"
            value={problem}
            onChangeText={setProblem}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Common issues */}
        <Text style={styles.sectionTitle}>Common Issues</Text>

        {COMMON_ISSUES.map((issue) => (
          <TouchableOpacity
            key={issue.id}
            style={styles.issueRow}
            onPress={() => handleIssuePress(issue)}
            activeOpacity={0.7}
          >
            <View style={styles.issueIconWrap}>
              <Feather name={issue.icon} size={18} color="#2563EB" />
            </View>
            <Text style={styles.issueLabel}>{issue.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Submit button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!problem.trim() || submitting) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!problem.trim() || submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Problem</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E9EDF5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  ticketsButton: {
    backgroundColor: "#6B1B1B",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  ticketsButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
    marginTop: 8,
  },
  typeSelector: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  typeOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  typeOptionActive: {
    backgroundColor: "#1E3A8A",
    borderColor: "#1E3A8A",
  },
  typeOptionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
  },
  typeOptionTextActive: {
    color: "#FFFFFF",
  },
  inputContainer: {
    borderWidth: 1.5,
    borderColor: "#2563EB",
    borderRadius: 14,
    padding: 12,
    backgroundColor: "#F3F5FA",
  },
  input: {
    minHeight: 120,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: "#111827",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginTop: 20,
    marginBottom: 12,
  },
  issueRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  issueIconWrap: {
    width: 28,
    alignItems: "center",
    marginRight: 12,
  },
  issueLabel: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "500",
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
  submitButton: {
    backgroundColor: "#1E3A8A",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});