import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface CommonIssue {
  id: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  ticketType: TicketType;
}

type TicketType = "course" | "support";

const COMMON_ISSUES: CommonIssue[] = [
  { id: "1", label: "Course Content Access", icon: "credit-card", ticketType: "course" },
  { id: "2", label: "Payment & Billing", icon: "credit-card", ticketType: "support" },
  { id: "3", label: "Payment & Billing", icon: "settings", ticketType: "support" },
];

interface TicketData {
  userId: string;
  title: string;
  description: string;
  ticket_type: TicketType;
  status: "pending" | "in_progress" | "resolved" | "closed";
  callScheduled: boolean;
  callScheduledAt: string | null;
  callStatus: "none" | "scheduled" | "completed" | "missed";
  unreadCountStudent: number;
  unreadCountAdmin: number;
  lastMessageAt: string | null;
  resolvedAt: string | null;
  closedAt: string | null;
  _id: string;
  ticketId: string;
  messages: unknown[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface CreateTicketResponse {
  success: boolean;
  message: string;
  data: TicketData;
}

const CREATE_TICKET_URL = "https://api.raoslawacademy.com/tickets/create";

// Builds a short title from the description since the UI only collects one field.
const deriveTitle = (description: string) => {
  const trimmed = description.trim();
  return trimmed.length > 60 ? `${trimmed.slice(0, 57)}...` : trimmed;
};

export default function HelpCenterScreen() {
  const [problem, setProblem] = useState("");
  const [ticketType, setTicketType] = useState<TicketType>("support");
  const [submitting, setSubmitting] = useState(false);



 const handleSubmit = async () => {
  console.log("handleSubmit called, problem:", problem);   // <-- add this
  if (!problem.trim() || submitting) return;

  try {
    setSubmitting(true);

    const userId = await AsyncStorage.getItem("userId");
    console.log("userId from storage:", userId);            // <-- add this
    if (!userId) {
      Alert.alert("Error", "You need to be logged in to submit a ticket.");
      return;
    }

    console.log("Sending ticket request:", {                // <-- add this
      userId,
      title: deriveTitle(problem),
      description: problem,
      ticket_type: ticketType,
    });

    const response = await axios.post<CreateTicketResponse>(
  "https://api.raoslawacademy.com/tickets/create",
  {
    userId,
    title: deriveTitle(problem),
    description: problem,
    ticket_type: ticketType,
  },
  { timeout: 10000 }
);

      if (response.data.success) {
        setProblem("");
        setTicketType("support");
        router.push({
          pathname: "/sidepanel/help_center/help",
          params: { ticketId: response.data.data.ticketId },
        });
      } else {
        Alert.alert("Error", response.data.message || "Failed to submit ticket.");
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
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <TouchableOpacity
          style={styles.ticketsButton}
          onPress={() => router.push("/sidepanel/help_center/help")}
        >
          <Text style={styles.ticketsButtonText}>Tickets Status</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Problem input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Describe your problem..."
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
          <Text style={styles.submitButtonText}>
            {submitting ? "Submitting..." : "Submit Problem"}
          </Text>
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
    paddingTop: 38,
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
    paddingTop:6,
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
    paddingTop: 18
  },
  inputContainer: {
    borderWidth: 1.5,
    borderColor: "#2563EB",
    borderRadius: 14,
    padding: 14,
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
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 12,
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
    paddingBottom: 20,
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