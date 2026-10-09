import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Share,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";

/* ---------- Types ---------- */

export interface Referral {
  referralId: string;
  referredId: string;
  referredName: string;
  referredEmail: string;
  enroll_id: string;
  course_id: string;
  amount: number;
  createdAt: string; // ISO date
}

export interface Claim {
  _id: string;
  userId: string;
  amount: number;
  couponId: string;
  coupon_code: string;
  claimId: string;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  __v: number;
}

export interface ReferralStats {
  myReferralsCount: number;
  successfulReferralsCount: number;
  earningsClaimed: number;
  earningsRemaining: number;
  totalEarned: number;
  referrals: Referral[];
  claims: Claim[];
}

export interface ReferralStatsResponse {
  statusCode: number;
  message: string;
  data: ReferralStats;
}

interface StudentDetailsResponse {
  statusCode: number;
  message: string;
  data: Array<{
    userId: string;
    name: string;
    email: string;
    mobile_number: string;
    referral_code: string;
    role: string;
  }>;
}

/* ---------- Constants ---------- */

const STATS_URL = "https://api.raoslawacademy.com/referrals/stats";
const USER_DETAILS_URL = "https://api.raoslawacademy.com/users/details";
const DEFAULT_USER_ID = "4237c5bb-30d1-495a-96f8-d70ba48ec110";

const BG = "#E8EBF5";
const MAROON = "#6B1D1D";
const MUSTARD = "#C9A227";

export default function ReferAndEarn() {
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [referralCode, setReferralCode] = useState<string>("");
  const [codeLoading, setCodeLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>(DEFAULT_USER_ID);

  // Fetch logged in user id, referral code & referral stats
  const loadData = useCallback(async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      const userId = storedUserId || DEFAULT_USER_ID;
      setCurrentUserId(userId);

      // Check if referral_code is cached
      const storedCode = await AsyncStorage.getItem("referral_code");
      if (storedCode) {
        setReferralCode(storedCode);
        setCodeLoading(false);
      }

      // 1. Fetch user details to get real dynamic referral code
      try {
        const userRes = await axios.post<StudentDetailsResponse>(
          USER_DETAILS_URL,
          { userId }
        );
        if (
          userRes.data?.statusCode === 200 &&
          userRes.data?.data?.length > 0 &&
          userRes.data.data[0].referral_code
        ) {
          const code = userRes.data.data[0].referral_code;
          setReferralCode(code);
          await AsyncStorage.setItem("referral_code", code);
        }
      } catch (err) {
        console.log("[referral] user details fetch error:", err);
      } finally {
        setCodeLoading(false);
      }

      // 2. Fetch referral stats from POST /referrals/stats
      setStatsLoading(true);
      const statsRes = await axios.post<ReferralStatsResponse>(
        STATS_URL,
        { userId },
        { headers: { "Content-Type": "application/json" } }
      );

      if (statsRes.data?.statusCode === 200 && statsRes.data?.data) {
        setStats(statsRes.data.data);
      } else {
        setStats(null);
      }
    } catch (e: any) {
      console.log("[referral] fetch stats error:", e?.response?.data || e?.message);
      setStats(null);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Refetch every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const displayCode = referralCode || (codeLoading ? "..." : "---");

  const handleCopy = async () => {
    if (!referralCode) {
      Toast.show({ type: "info", text1: "Loading referral code..." });
      return;
    }
    await Clipboard.setStringAsync(referralCode);
    setCopied(true);
    Toast.show({
      type: "success",
      text1: "Copied!",
      text2: "Referral code copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!referralCode) {
      Toast.show({ type: "info", text1: "Loading referral code..." });
      return;
    }
    try {
      await Share.share({
        message: `Join me on Rao's Law Academy and use my referral code ${referralCode} to get a coupon worth 1000/- on your first full course purchase!`,
      });
    } catch (e) {
      Alert.alert("Unable to share", "Please try again.");
    }
  };

  const earningsSubtitle = stats
    ? `₹${stats.earningsRemaining} available · ₹${stats.totalEarned} earned in total`
    : statsLoading
    ? "Loading your earnings..."
    : "Tap to check your referral earnings";

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Refer & Earn</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Referral code box */}
        <View style={styles.codeWrap}>
          <TouchableOpacity
            style={styles.codeBox}
            activeOpacity={0.7}
            onPress={handleCopy}
            disabled={codeLoading}
          >
            {codeLoading ? (
              <ActivityIndicator size="small" color="#111" />
            ) : (
              <Text style={styles.codeText}>{displayCode}</Text>
            )}
            <Ionicons
              name={copied ? "checkmark-circle" : "copy-outline"}
              size={20}
              color={copied ? "#1E8A3A" : "#111"}
            />
          </TouchableOpacity>
          <Text style={styles.codeHint}>Tap to copy your referral code</Text>
        </View>

        {/* Title + description */}
        <View style={styles.titleRow}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.title}>Invite Friends, Get Bonuses</Text>
        </View>
        <Text style={styles.description}>
          Refer your Friend and get a coupon worth 1000/- on their successful
          purchase of ANY FULL COURSE.
        </Text>

        {/* Summary Card - Stats at a glance */}
        {stats && (
          <View style={styles.statsSummaryContainer}>
            <View style={styles.statsSummaryItem}>
              <Text style={styles.statsSummaryNumber}>{stats.myReferralsCount}</Text>
              <Text style={styles.statsSummaryLabel}>Total Friends</Text>
            </View>
            <View style={styles.statsSummaryDivider} />
            <View style={styles.statsSummaryItem}>
              <Text style={styles.statsSummaryNumber}>₹{stats.totalEarned}</Text>
              <Text style={styles.statsSummaryLabel}>Total Earned</Text>
            </View>
            <View style={styles.statsSummaryDivider} />
            <View style={styles.statsSummaryItem}>
              <Text style={[styles.statsSummaryNumber, { color: "#2E7D32" }]}>
                ₹{stats.earningsRemaining}
              </Text>
              <Text style={styles.statsSummaryLabel}>Available</Text>
            </View>
          </View>
        )}

        {/* My Earnings Card */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.card, { backgroundColor: MAROON }]}
          onPress={() =>
            router.push({
              pathname: "/sidepanel/referal/my_earnings" as any,
              params: { userId: currentUserId, referralCode },
            })
          }
        >
          <Text style={styles.cardEmoji}>💰</Text>
          <View style={styles.cardTextWrap}>
            <Text style={styles.cardTitle}>My Earnings</Text>
            <Text style={styles.cardSub}>{earningsSubtitle}</Text>
          </View>
          {statsLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="chevron-forward" size={22} color="#fff" />
          )}
        </TouchableOpacity>

        {/* Share to your network */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.card, { backgroundColor: MUSTARD }]}
          onPress={handleShare}
        >
          <Text style={styles.cardEmoji}>📈</Text>
          <View style={styles.cardTextWrap}>
            <Text style={styles.cardTitle}>Share to your network</Text>
            <Text style={styles.cardSub}>
              {stats && stats.myReferralsCount > 0
                ? `${stats.myReferralsCount} friend${
                    stats.myReferralsCount > 1 ? "s" : ""
                  } joined so far, invite more`
                : "Tap to share with your friends & family"}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtn: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  content: {
    paddingHorizontal: 28,
    paddingBottom: 32,
  },
  codeWrap: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  codeBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    minWidth: 140,
    borderWidth: 1.5,
    borderColor: "#111",
    borderRadius: 12,
    backgroundColor: "#F8FAFF",
  },
  codeText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    letterSpacing: 1.2,
  },
  codeHint: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 6,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  emoji: {
    fontSize: 22,
    marginRight: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
    marginBottom: 20,
  },
  statsSummaryContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statsSummaryItem: {
    alignItems: "center",
    flex: 1,
  },
  statsSummaryNumber: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0A1A3B",
  },
  statsSummaryLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 3,
    fontWeight: "500",
  },
  statsSummaryDivider: {
    width: 1,
    height: 28,
    backgroundColor: "#E5E7EB",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 18,
    paddingHorizontal: 22,
    marginBottom: 18,
  },
  cardEmoji: {
    fontSize: 22,
    marginRight: 14,
  },
  cardTextWrap: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  cardSub: {
    fontSize: 12,
    color: "#fff",
    marginTop: 4,
  },
});