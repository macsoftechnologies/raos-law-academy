import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";

/* ---------- Types ---------- */

type TicketStatus = "pending" | "in_progress" | "resolved" | "closed";
type TicketType = "course" | "support";

export interface MessageItem {
  _id: string;
  senderId: string;
  senderName: string;
  senderRole: string; // "student" | "teacher" | "supportadmin" | "admin" | "superadmin"
  message: string;
  isDeleted?: boolean;
  createdAt: string;
}

export interface TicketItem {
  _id: string;
  ticketId: string;
  userId: string;
  title: string;
  description: string;
  ticket_type: TicketType;
  status: TicketStatus;
  callScheduled?: boolean;
  callScheduledAt?: string | null;
  callStatus?: "none" | "scheduled" | "completed" | "missed";
  unreadCountStudent?: number;
  unreadCountAdmin?: number;
  lastMessageAt?: string | null;
  createdAt: string;
  updatedAt: string;
  messages?: MessageItem[];
}

interface UserTicketsResponse {
  success: boolean;
  tickets: TicketItem[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface TicketDetailsResponse {
  success: boolean;
  data: TicketItem;
}

/* ---------- Constants ---------- */

const BASE_URL = "https://api.raoslawacademy.com/tickets";
const DEFAULT_USER_ID = "7b682881-2d36-41b4-aca9-a9540bff291f";

const STATUS_STYLES: Record<
  TicketStatus,
  { card: string; border: string; badge: string; text: string; meta: string }
> = {
  in_progress: {
    card: "#FBF3F4",
    border: "#8B1E2D",
    badge: "#6B1B1B",
    text: "#3A1414",
    meta: "#8B1E2D",
  },
  pending: {
    card: "#FEF9EC",
    border: "#B8860B",
    badge: "#C7932A",
    text: "#3A2E0A",
    meta: "#8A6A16",
  },
  resolved: {
    card: "#EFF4FC",
    border: "#1E3A8A",
    badge: "#1E3A8A",
    text: "#16234F",
    meta: "#1E3A8A",
  },
  closed: {
    card: "#F3F4F6",
    border: "#6B7280",
    badge: "#4B5563",
    text: "#1F2937",
    meta: "#6B7280",
  },
};

const STATUS_LABEL: Record<TicketStatus, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

export default function TicketsStatusScreen() {
  const [userId, setUserId] = useState<string>(DEFAULT_USER_ID);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter
  const [statusFilter, setStatusFilter] = useState<"all" | TicketStatus>("all");

  // Selected Ticket for Conversation Modal
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  // Schedule callback modal
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [scheduleTicketId, setScheduleTicketId] = useState<string | null>(null);
  const [scheduling, setScheduling] = useState(false);

  // Fetch Tickets List
  const fetchTickets = useCallback(
    async (filter = statusFilter) => {
      try {
        setLoading(true);
        setError(null);

        const storedUserId = await AsyncStorage.getItem("userId");
        const activeUserId = storedUserId || DEFAULT_USER_ID;
        setUserId(activeUserId);

        const payload: any = {
          userId: activeUserId,
          page: 1,
          limit: 50,
        };
        if (filter !== "all") {
          payload.status = filter;
        }

        const response = await axios.post<UserTicketsResponse>(
          `${BASE_URL}/user-list`,
          payload,
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.data?.success) {
          setTickets(response.data.tickets ?? []);
        } else {
          setError("Failed to load tickets.");
        }
      } catch (err: any) {
        console.log("Fetch tickets error:", err?.response?.data || err?.message);
        setError(err?.response?.data?.message || "Failed to load tickets. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [statusFilter]
  );

  useFocusEffect(
    useCallback(() => {
      fetchTickets();
    }, [fetchTickets])
  );

  // Open Conversation
  const openConversation = async (ticket: TicketItem) => {
    setSelectedTicket(ticket);
    setConversationLoading(true);

    try {
      // 1. Fetch full conversation details
      const response = await axios.post<TicketDetailsResponse>(
        `${BASE_URL}/details`,
        { ticketId: ticket.ticketId, userId },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data?.success && response.data?.data) {
        setSelectedTicket(response.data.data);
      }

      // 2. Mark messages as read for student
      try {
        await axios.post(
          `${BASE_URL}/mark-read`,
          { ticketId: ticket.ticketId, userId },
          { headers: { "Content-Type": "application/json" } }
        );
        // Reset unread count locally in list
        setTickets((prev) =>
          prev.map((t) =>
            t.ticketId === ticket.ticketId ? { ...t, unreadCountStudent: 0 } : t
          )
        );
      } catch (markErr) {
        console.log("Mark read error:", markErr);
      }
    } catch (err: any) {
      console.log("Get ticket details error:", err?.response?.data || err?.message);
      Alert.alert("Error", "Could not load ticket messages.");
    } finally {
      setConversationLoading(false);
    }
  };

  // Send message in conversation
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket || sendingMessage) return;

    const messageText = newMessage.trim();
    try {
      setSendingMessage(true);

      const response = await axios.post(
        `${BASE_URL}/add-message`,
        {
          ticketId: selectedTicket.ticketId,
          senderId: userId,
          message: messageText,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data?.success) {
        setNewMessage("");

        // Refresh conversation details
        const detailsRes = await axios.post<TicketDetailsResponse>(
          `${BASE_URL}/details`,
          { ticketId: selectedTicket.ticketId, userId }
        );
        if (detailsRes.data?.success && detailsRes.data?.data) {
          setSelectedTicket(detailsRes.data.data);
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to send",
          text2: response.data?.message || "Please try again",
        });
      }
    } catch (err: any) {
      console.log("Send message error:", err?.response?.data || err?.message);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err?.response?.data?.message || "Failed to send message.",
      });
    } finally {
      setSendingMessage(false);
    }
  };

  // Schedule Callback
  const handleScheduleCallback = async () => {
    if (!scheduleTicketId || scheduling) return;

    try {
      setScheduling(true);
      // Default to 2 hours from now
      const scheduledTime = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

      const response = await axios.post(
        `${BASE_URL}/schedule-call`,
        {
          ticketId: scheduleTicketId,
          userId,
          scheduledAt: scheduledTime,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data?.success) {
        setScheduleModalVisible(false);
        Toast.show({
          type: "success",
          text1: "Callback Scheduled 📞",
          text2: "Our advisor will contact you within the next 2-4 hours.",
        });
        // Refresh list
        fetchTickets();
        if (selectedTicket?.ticketId === scheduleTicketId) {
          setSelectedTicket((prev) =>
            prev ? { ...prev, callScheduled: true, callStatus: "scheduled" } : prev
          );
        }
      } else {
        Alert.alert("Callback Notice", response.data?.message || "Failed to schedule callback.");
      }
    } catch (err: any) {
      console.log("Schedule callback error:", err?.response?.data || err?.message);
      Alert.alert(
        "Callback Notice",
        err?.response?.data?.message || "Could not schedule callback. Please try again."
      );
    } finally {
      setScheduling(false);
    }
  };

  const formatRelativeTime = (dateStr: string) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} min ago`;
      if (diffHours < 24) return `${diffHours} hr ago`;
      if (diffDays === 1) return "Yesterday";
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#E9EDF5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tickets Status</Text>
        <TouchableOpacity
          onPress={() => fetchTickets(statusFilter)}
          hitSlop={10}
          style={styles.headerAction}
        >
          <Ionicons name="refresh" size={20} color="#1E3A8A" />
        </TouchableOpacity>
      </View>

      {/* Status Filter Chips */}
      <View style={styles.filterWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {(["all", "pending", "in_progress", "resolved", "closed"] as const).map((filter) => {
            const isActive = statusFilter === filter;
            const label =
              filter === "all"
                ? "All"
                : filter === "in_progress"
                ? "In Progress"
                : filter[0].toUpperCase() + filter.slice(1);

            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => {
                  setStatusFilter(filter);
                  fetchTickets(filter);
                }}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Body List */}
      {loading && tickets.length === 0 ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#1E3A8A" />
          <Text style={styles.centerLoadingText}>Loading tickets...</Text>
        </View>
      ) : error && tickets.length === 0 ? (
        <View style={styles.centerBox}>
          <Feather name="alert-circle" size={40} color="#DC2626" />
          <Text style={styles.centerErrorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchTickets()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
        >
          {tickets.length > 0 ? (
            tickets.map((ticket) => {
              const statusKey = ticket.status in STATUS_STYLES ? ticket.status : "pending";
              const s = STATUS_STYLES[statusKey];
              const displayId = `#${ticket.ticketId.slice(0, 8).toUpperCase()}`;

              return (
                <TouchableOpacity
                  key={ticket._id || ticket.ticketId}
                  style={[styles.card, { backgroundColor: s.card, borderColor: s.border }]}
                  activeOpacity={0.85}
                  onPress={() => openConversation(ticket)}
                >
                  {/* Top Row */}
                  <View style={styles.cardTopRow}>
                    <View style={{ flex: 1 }}>
                      <View style={styles.ticketIdRow}>
                        <Text style={[styles.ticketNumber, { color: s.text }]}>{displayId}</Text>
                        <View style={styles.typeTag}>
                          <Text style={styles.typeTagText}>
                            {ticket.ticket_type === "course" ? "Course Issue" : "Support"}
                          </Text>
                        </View>
                        {(ticket.unreadCountStudent ?? 0) > 0 && (
                          <View style={styles.unreadDotBadge}>
                            <Text style={styles.unreadDotText}>{ticket.unreadCountStudent}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={[styles.cardTitle, { color: s.text }]} numberOfLines={1}>
                        {ticket.title}
                      </Text>
                    </View>

                    <View style={[styles.badge, { backgroundColor: s.badge }]}>
                      <Text style={styles.badgeText}>{STATUS_LABEL[statusKey]}</Text>
                    </View>
                  </View>

                  {/* Description */}
                  <Text style={[styles.description, { color: s.text }]} numberOfLines={2}>
                    “{ticket.description}”
                  </Text>

                  {/* Bottom Row */}
                  <View style={styles.cardBottomRow}>
                    {ticket.status === "pending" || ticket.status === "in_progress" ? (
                      <TouchableOpacity
                        style={[
                          styles.callButton,
                          {
                            backgroundColor: ticket.callScheduled ? "#16A34A" : s.badge,
                          },
                        ]}
                        onPress={(e) => {
                          e.stopPropagation();
                          setScheduleTicketId(ticket.ticketId);
                          setScheduleModalVisible(true);
                        }}
                      >
                        <Feather
                          name={ticket.callScheduled ? "check-circle" : "phone-call"}
                          size={13}
                          color="#FFFFFF"
                        />
                        <Text style={styles.callButtonText}>
                          {ticket.callScheduled ? "Call Scheduled" : "Call Us Now"}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.chatActionHint}>
                        <Feather name="message-square" size={13} color={s.meta} />
                        <Text style={[styles.chatActionHintText, { color: s.meta }]}>
                          View Chat
                        </Text>
                      </View>
                    )}

                    <Text style={[styles.lastUpdated, { color: s.meta }]}>
                      {formatRelativeTime(ticket.updatedAt || ticket.createdAt)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.emptyContainer}>
              <Feather name="inbox" size={44} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No tickets found</Text>
              <Text style={styles.emptySub}>
                {statusFilter === "all"
                  ? "You haven't submitted any help tickets yet."
                  : `No tickets with status "${STATUS_LABEL[statusFilter as TicketStatus]}".`}
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Footer: New Ticket button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.newTicketButton}
          onPress={() => router.push("/sidepanel/help_center/help")}
        >
          <Feather name="plus" size={18} color="#FFFFFF" />
          <Text style={styles.newTicketButtonText}>New Ticket</Text>
        </TouchableOpacity>
      </View>

      {/* Ticket Details & Conversation Modal */}
      <Modal
        visible={!!selectedTicket}
        animationType="slide"
        onRequestClose={() => setSelectedTicket(null)}
      >
        <SafeAreaView style={styles.convoModalSafe} edges={["top", "bottom"]}>
          {/* Conversation Header */}
          <View style={styles.convoHeader}>
            <TouchableOpacity onPress={() => setSelectedTicket(null)} hitSlop={12}>
              <Ionicons name="close" size={26} color="#111827" />
            </TouchableOpacity>

            <View style={styles.convoHeaderCenter}>
              <Text style={styles.convoHeaderTitle} numberOfLines={1}>
                #{selectedTicket?.ticketId.slice(0, 8).toUpperCase()} - {selectedTicket?.title}
              </Text>
              <View style={styles.convoHeaderStatusRow}>
                {selectedTicket && (
                  <View
                    style={[
                      styles.convoStatusBadge,
                      {
                        backgroundColor:
                          STATUS_STYLES[
                            selectedTicket.status in STATUS_STYLES
                              ? selectedTicket.status
                              : "pending"
                          ].badge,
                      },
                    ]}
                  >
                    <Text style={styles.convoStatusText}>
                      {STATUS_LABEL[
                        selectedTicket.status in STATUS_STYLES
                          ? selectedTicket.status
                          : "pending"
                      ]}
                    </Text>
                  </View>
                )}
                <Text style={styles.convoTypeLabel}>
                  {selectedTicket?.ticket_type === "course" ? "Course Ticket" : "Support Ticket"}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                if (selectedTicket) {
                  setScheduleTicketId(selectedTicket.ticketId);
                  setScheduleModalVisible(true);
                }
              }}
              hitSlop={10}
              style={styles.convoCallIcon}
            >
              <Feather name="phone" size={20} color="#1E3A8A" />
            </TouchableOpacity>
          </View>

          {/* Conversation Message List */}
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            {conversationLoading ? (
              <View style={styles.centerBox}>
                <ActivityIndicator size="small" color="#1E3A8A" />
                <Text style={styles.centerLoadingText}>Loading conversation...</Text>
              </View>
            ) : (
              <ScrollView
                style={styles.convoBody}
                contentContainerStyle={styles.convoBodyContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Initial Ticket Question Bubble */}
                <View style={styles.initialQuestionBox}>
                  <Text style={styles.initialQuestionLabel}>Issue Reported:</Text>
                  <Text style={styles.initialQuestionText}>{selectedTicket?.description}</Text>
                  <Text style={styles.initialQuestionTime}>
                    {selectedTicket && formatRelativeTime(selectedTicket.createdAt)}
                  </Text>
                </View>

                {/* Conversation Messages */}
                {selectedTicket?.messages && selectedTicket.messages.length > 0 ? (
                  selectedTicket.messages
                    .filter((m) => !m.isDeleted)
                    .map((msg, idx) => {
                      const isMe = msg.senderRole === "student" || msg.senderId === userId;

                      return (
                        <View
                          key={msg._id || idx}
                          style={[
                            styles.msgWrapper,
                            isMe ? styles.msgWrapperMe : styles.msgWrapperOther,
                          ]}
                        >
                          <View
                            style={[
                              styles.msgBubble,
                              isMe ? styles.msgBubbleMe : styles.msgBubbleOther,
                            ]}
                          >
                            <Text
                              style={[
                                styles.msgSenderName,
                                isMe ? styles.msgSenderMe : styles.msgSenderOther,
                              ]}
                            >
                              {isMe
                                ? "You (Student)"
                                : msg.senderName || msg.senderRole?.toUpperCase() || "Support Team"}
                            </Text>
                            <Text
                              style={[
                                styles.msgText,
                                isMe ? styles.msgTextMe : styles.msgTextOther,
                              ]}
                            >
                              {msg.message}
                            </Text>
                            <Text
                              style={[
                                styles.msgTime,
                                isMe ? styles.msgTimeMe : styles.msgTimeOther,
                              ]}
                            >
                              {formatRelativeTime(msg.createdAt)}
                            </Text>
                          </View>
                        </View>
                      );
                    })
                ) : (
                  <View style={styles.noMessagesNotice}>
                    <Text style={styles.noMessagesNoticeText}>
                      No replies yet. An agent will respond shortly.
                    </Text>
                  </View>
                )}
              </ScrollView>
            )}

            {/* Input Bar */}
            <View style={styles.convoInputBar}>
              <TextInput
                style={styles.convoInput}
                placeholder="Type your message..."
                placeholderTextColor="#9CA3AF"
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!newMessage.trim() || sendingMessage) && styles.sendButtonDisabled,
                ]}
                onPress={handleSendMessage}
                disabled={!newMessage.trim() || sendingMessage}
              >
                {sendingMessage ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Ionicons name="send" size={18} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* Schedule Callback Modal */}
      <Modal
        visible={scheduleModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setScheduleModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.scheduleModalBox}>
            <View style={styles.scheduleIconWrap}>
              <Feather name="phone-call" size={26} color="#1E3A8A" />
            </View>
            <Text style={styles.scheduleModalTitle}>Request Callback</Text>
            <Text style={styles.scheduleModalDesc}>
              Need urgent help? Our senior legal academic counselor will call you on your registered mobile number.
            </Text>

            <TouchableOpacity
              style={[styles.scheduleConfirmBtn, scheduling && styles.buttonDisabled]}
              onPress={handleScheduleCallback}
              disabled={scheduling}
            >
              {scheduling ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.scheduleConfirmText}>Confirm Callback Request</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.scheduleCancelBtn}
              onPress={() => setScheduleModalVisible(false)}
            >
              <Text style={styles.scheduleCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  headerAction: {
    padding: 6,
  },
  filterWrap: {
    paddingBottom: 8,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterChipActive: {
    backgroundColor: "#1E3A8A",
    borderColor: "#1E3A8A",
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },
  centerBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  centerLoadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#4B5563",
  },
  centerErrorText: {
    marginTop: 12,
    fontSize: 14,
    color: "#DC2626",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 6,
  },
  card: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  ticketIdRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  ticketNumber: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  typeTag: {
    backgroundColor: "rgba(0, 0, 0, 0.06)",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeTagText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#4B5563",
  },
  unreadDotBadge: {
    backgroundColor: "#DC2626",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  unreadDotText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  cardBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  callButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  chatActionHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  chatActionHintText: {
    fontSize: 12,
    fontWeight: "600",
  },
  lastUpdated: {
    fontSize: 11,
    fontWeight: "600",
    marginLeft: "auto",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginTop: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
  newTicketButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#1E3A8A",
    borderRadius: 14,
    paddingVertical: 15,
  },
  newTicketButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  /* Conversation Modal Styles */
  convoModalSafe: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  convoHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  convoHeaderCenter: {
    flex: 1,
    marginHorizontal: 12,
  },
  convoHeaderTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  convoHeaderStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  convoStatusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  convoStatusText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  convoTypeLabel: {
    fontSize: 11,
    color: "#6B7280",
  },
  convoCallIcon: {
    padding: 6,
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
  },
  convoBody: {
    flex: 1,
  },
  convoBodyContent: {
    padding: 16,
    paddingBottom: 24,
  },
  initialQuestionBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#1E3A8A",
  },
  initialQuestionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  initialQuestionText: {
    fontSize: 14,
    color: "#1F2937",
    lineHeight: 20,
  },
  initialQuestionTime: {
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 6,
    textAlign: "right",
  },
  msgWrapper: {
    marginVertical: 6,
    flexDirection: "row",
  },
  msgWrapperMe: {
    justifyContent: "flex-end",
  },
  msgWrapperOther: {
    justifyContent: "flex-start",
  },
  msgBubble: {
    maxWidth: "82%",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  msgBubbleMe: {
    backgroundColor: "#1E3A8A",
    borderBottomRightRadius: 2,
  },
  msgBubbleOther: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  msgSenderName: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 3,
  },
  msgSenderMe: {
    color: "#93C5FD",
  },
  msgSenderOther: {
    color: "#7A1F2B",
  },
  msgText: {
    fontSize: 14,
    lineHeight: 20,
  },
  msgTextMe: {
    color: "#FFFFFF",
  },
  msgTextOther: {
    color: "#111827",
  },
  msgTime: {
    fontSize: 10,
    marginTop: 4,
    textAlign: "right",
  },
  msgTimeMe: {
    color: "#BFDBFE",
  },
  msgTimeOther: {
    color: "#9CA3AF",
  },
  noMessagesNotice: {
    alignItems: "center",
    paddingVertical: 20,
  },
  noMessagesNoticeText: {
    fontSize: 13,
    color: "#6B7280",
    fontStyle: "italic",
  },
  convoInputBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  convoInput: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
    maxHeight: 90,
  },
  sendButton: {
    backgroundColor: "#1E3A8A",
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  /* Callback Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  scheduleModalBox: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
  },
  scheduleIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  scheduleModalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  scheduleModalDesc: {
    fontSize: 13,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 20,
  },
  scheduleConfirmBtn: {
    width: "100%",
    backgroundColor: "#1E3A8A",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  scheduleConfirmText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  scheduleCancelBtn: {
    paddingVertical: 10,
  },
  scheduleCancelText: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "600",
  },
});