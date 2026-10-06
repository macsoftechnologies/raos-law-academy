import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type TicketStatus = "in_progress" | "pending" | "resolved";

interface Ticket {
  id: string;
  ticketNumber: string;
  status: TicketStatus;
  description: string;
  lastUpdated: string;
}

const STATUS_STYLES: Record<
  TicketStatus,
  { card: string; border: string; badge: string; text: string; meta: string }
> = {
  in_progress: {
    card: "#EADCDD",
    border: "#8B1E2D",
    badge: "#6B1B1B",
    text: "#3A1414",
    meta: "#8B1E2D",
  },
  pending: {
    card: "#EFE2B8",
    border: "#B8860B",
    badge: "#C7932A",
    text: "#3A2E0A",
    meta: "#8A6A16",
  },
  resolved: {
    card: "#D9E0F0",
    border: "#1E3A8A",
    badge: "#1E3A8A",
    text: "#16234F",
    meta: "#1E3A8A",
  },
};

const STATUS_LABEL: Record<TicketStatus, string> = {
  in_progress: "In Progress",
  pending: "Pending",
  resolved: "Resolved",
};

const TICKETS: Ticket[] = [
  {
    id: "1",
    ticketNumber: "#LAW2025-001",
    status: "in_progress",
    description: "Confused about contract law assignment clauses, need clasification.",
    lastUpdated: "5min ago",
  },
  {
    id: "2",
    ticketNumber: "#LAW2025-001",
    status: "pending",
    description: "Confused about contract law assignment clauses, need clasification.",
    lastUpdated: "5min ago",
  },
  {
    id: "3",
    ticketNumber: "#LAW2025-001",
    status: "resolved",
    description: "Confused about contract law assignment clauses, need clasification.",
    lastUpdated: "5min ago",
  },
];

export default function TicketsStatusScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {TICKETS.map((ticket) => {
          const s = STATUS_STYLES[ticket.status];
          return (
            <View
              key={ticket.id}
              style={[
                styles.card,
                { backgroundColor: s.card, borderColor: s.border },
              ]}
            >
              <View style={styles.cardTopRow}>
                <Text style={[styles.ticketLabel, { color: s.text }]}>
                  TICKET ID:{"\n"}
                  <Text style={styles.ticketNumber}>{ticket.ticketNumber}</Text>
                </Text>
                <View style={[styles.badge, { backgroundColor: s.badge }]}>
                  <Text style={styles.badgeText}>{STATUS_LABEL[ticket.status]}</Text>
                </View>
              </View>

              <Text style={[styles.description, { color: s.text }]}>
                “{ticket.description}
              </Text>

              <View style={styles.cardBottomRow}>
                {ticket.status === "pending" ? (
                  <TouchableOpacity style={[styles.callButton, { backgroundColor: s.badge }]}>
                    <Text style={styles.callButtonText}>Call Us Now</Text>
                  </TouchableOpacity>
                ) : (
                  <View />
                )}
                <Text style={[styles.lastUpdated, { color: s.meta }]}>
                  Last Updated: {ticket.lastUpdated}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* New ticket button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.newTicketButton}
          onPress={() => router.push("/sidepanel/help_center/help")}
        >
          <Text style={styles.newTicketButtonText}>New Ticket</Text>
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
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  ticketLabel: {
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    flexShrink: 1,
  },
  ticketNumber: {
    fontSize: 15,
    fontWeight: "800",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  callButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  callButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  lastUpdated: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: "auto",
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 8,
  },
  newTicketButton: {
    backgroundColor: "#1E3A8A",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  newTicketButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});