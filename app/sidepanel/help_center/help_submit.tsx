import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { MaterialCommunityIcons, Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const COLORS = {
  navy: "#0A1A3B",
  navyLight: "#23408E",
  gold: "#C9A227",
  bg: "#EDEEF5",
  blue: "#2F7DE1",
  blueSoft: "#E4F0FE",
  green: "#16A34A",
  gray: "#6B7280",
  white: "#FFFFFF",
};

export default function HelpSubmitScreen() {
  const router = useRouter();
  const { ticketId } = useLocalSearchParams<{ ticketId?: string }>();

  const displayTicketId = ticketId ? `#${ticketId.slice(0, 8).toUpperCase()}` : "";

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <View style={styles.content}>
        {/* Illustration */}
        <View style={styles.illustrationWrap}>
          <View style={styles.blobBg} />

          <View style={styles.planeWrap}>
            <MaterialCommunityIcons name="send" size={36} color={COLORS.blue} />
          </View>

          <View style={styles.gearWrap}>
            <Feather name="headphones" size={20} color={COLORS.navyLight} />
          </View>

          <View style={styles.clockWrap}>
            <Feather name="clock" size={16} color={COLORS.gold} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Ticket Submitted Successfully</Text>

        {/* Ticket ID Tag */}
        {displayTicketId ? (
          <View style={styles.ticketBadge}>
            <Text style={styles.ticketBadgeLabel}>TICKET ID: </Text>
            <Text style={styles.ticketBadgeId}>{displayTicketId}</Text>
          </View>
        ) : null}

        {/* Message */}
        <Text style={styles.subtitle}>
          Your request has been routed to our dedicated support team. You can track updates and converse directly in the ticket status section.
        </Text>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push("/sidepanel/help_center/help_issue")}
        >
          <Text style={styles.primaryBtnText}>Track Ticket Status</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.replace("/dashboard/dashboard" as any)}
        >
          <Text style={styles.secondaryBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    width: width - 40,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  illustrationWrap: {
    width: 140,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    position: "relative",
  },
  blobBg: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.blueSoft,
  },
  planeWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.blue,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  gearWrap: {
    position: "absolute",
    top: 6,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  clockWrap: {
    position: "absolute",
    bottom: 8,
    left: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.navy,
    textAlign: "center",
    marginBottom: 10,
  },
  ticketBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 12,
  },
  ticketBadgeLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.gray,
  },
  ticketBadgeId: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.navyLight,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 26,
    paddingHorizontal: 8,
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    backgroundColor: COLORS.navyLight,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  primaryBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryBtn: {
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryBtnText: {
    color: COLORS.gray,
    fontSize: 14,
    fontWeight: "600",
  },
});
