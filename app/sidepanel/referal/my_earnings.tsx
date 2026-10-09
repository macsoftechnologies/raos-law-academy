import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
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
  createdAt: string;
}

export interface Claim {
  _id: string;
  userId: string;
  amount: number;
  couponId: string;
  coupon_code: string;
  claimId: string;
  createdAt: string;
  updatedAt: string;
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

interface ReferralStatsResponse {
  statusCode: number;
  message: string;
  data: ReferralStats;
}

interface ConvertCouponResponse {
  statusCode: number;
  message: string;
  data?: {
    coupon_code?: string;
    amount?: number;
    claimId?: string;
  };
}

/* ---------- Constants ---------- */

const STATS_URL = "https://api.raoslawacademy.com/referrals/stats";
const CONVERT_COUPON_URL = "https://api.raoslawacademy.com/referrals/convert-to-coupon";
const DEFAULT_USER_ID = "4237c5bb-30d1-495a-96f8-d70ba48ec110";

const BG = "#E8EBF5";
const MAROON = "#6B1D1D";
const NAVY = "#0A1A3B";

export default function MyEarningsScreen() {
  const params = useLocalSearchParams<{ userId?: string; referralCode?: string }>();
  const [userId, setUserId] = useState<string>(params.userId || DEFAULT_USER_ID);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Tab: "referrals" | "claims"
  const [activeTab, setActiveTab] = useState<"referrals" | "claims">("referrals");

  // Convert to coupon modal
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [convertAmount, setConvertAmount] = useState<string>("1000");
  const [converting, setConverting] = useState<boolean>(false);

  // Success modal for generated coupon
  const [newCouponCode, setNewCouponCode] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const storedUserId = await AsyncStorage.getItem("userId");
      const resolvedUserId = params.userId || storedUserId || DEFAULT_USER_ID;
      setUserId(resolvedUserId);

      const response = await axios.post<ReferralStatsResponse>(
        STATS_URL,
        { userId: resolvedUserId },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data?.statusCode === 200 && response.data?.data) {
        setStats(response.data.data);
      } else {
        setError(response.data?.message || "Failed to load referral stats.");
      }
    } catch (err: any) {
      console.log("[MyEarnings] fetch stats error:", err?.response?.data || err?.message);
      setError(err?.response?.data?.message || "Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [params.userId]);

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [fetchStats])
  );

  const handleConvertCoupon = async () => {
    const amountNum = Number(convertAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount greater than 0.");
      return;
    }

    if (stats && amountNum > stats.earningsRemaining) {
      Alert.alert(
        "Insufficient Balance",
        `You have ₹${stats.earningsRemaining} remaining. Please enter an amount less than or equal to your remaining balance.`
      );
      return;
    }

    try {
      setConverting(true);
      const response = await axios.post<ConvertCouponResponse>(
        CONVERT_COUPON_URL,
        { userId, amount: amountNum },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data?.statusCode === 200) {
        setModalVisible(false);
        const code = response.data.data?.coupon_code || "COUPON GENERATED";
        setNewCouponCode(code);
        Toast.show({
          type: "success",
          text1: "Coupon Generated 🎉",
          text2: `Coupon code: ${code}`,
        });
        // Refetch stats to update balance & claims
        fetchStats();
      } else {
        Alert.alert("Failed", response.data?.message || "Could not convert earnings to coupon.");
      }
    } catch (err: any) {
      console.log("[convert coupon error]:", err?.response?.data || err?.message);
      Alert.alert(
        "Conversion Error",
        err?.response?.data?.message || "An error occurred while converting your earnings."
      );
    } finally {
      setConverting(false);
    }
  };

  const copyCoupon = async (code: string) => {
    await Clipboard.setStringAsync(code);
    Toast.show({
      type: "success",
      text1: "Copied!",
      text2: `Coupon ${code} copied to clipboard`,
    });
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

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
        <Text style={styles.headerTitle}>My Earnings</Text>
        <TouchableOpacity onPress={fetchStats} hitSlop={10} style={styles.refreshBtn}>
          <Ionicons name="refresh" size={20} color={NAVY} />
        </TouchableOpacity>
      </View>

      {loading && !stats ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={MAROON} />
          <Text style={styles.loadingText}>Loading referral earnings...</Text>
        </View>
      ) : error && !stats ? (
        <View style={styles.centerContainer}>
          <Feather name="alert-circle" size={42} color="#DC2626" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchStats}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Earnings Card */}
          <View style={styles.heroCard}>
            <Text style={styles.heroLabel}>Available Balance</Text>
            <Text style={styles.heroBalance}>₹{stats?.earningsRemaining ?? 0}</Text>

            <View style={styles.heroRow}>
              <View style={styles.heroSubItem}>
                <Text style={styles.heroSubLabel}>Total Earned</Text>
                <Text style={styles.heroSubVal}>₹{stats?.totalEarned ?? 0}</Text>
              </View>
              <View style={styles.heroDivider} />
              <View style={styles.heroSubItem}>
                <Text style={styles.heroSubLabel}>Claimed</Text>
                <Text style={styles.heroSubVal}>₹{stats?.earningsClaimed ?? 0}</Text>
              </View>
              <View style={styles.heroDivider} />
              <View style={styles.heroSubItem}>
                <Text style={styles.heroSubLabel}>Friends</Text>
                <Text style={styles.heroSubVal}>{stats?.successfulReferralsCount ?? 0}</Text>
              </View>
            </View>

            {/* Convert to Coupon Button */}
            <TouchableOpacity
              style={[
                styles.convertBtn,
                (stats?.earningsRemaining ?? 0) <= 0 && styles.convertBtnDisabled,
              ]}
              disabled={(stats?.earningsRemaining ?? 0) <= 0}
              onPress={() => {
                setConvertAmount(
                  stats && stats.earningsRemaining >= 1000
                    ? "1000"
                    : String(stats?.earningsRemaining ?? 100)
                );
                setModalVisible(true);
              }}
            >
              <Feather name="gift" size={18} color="#FFFFFF" />
              <Text style={styles.convertBtnText}>Convert Earnings to Coupon</Text>
            </TouchableOpacity>
          </View>

          {/* Tab selector */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === "referrals" && styles.tabButtonActive]}
              onPress={() => setActiveTab("referrals")}
            >
              <Text
                style={[styles.tabText, activeTab === "referrals" && styles.tabTextActive]}
              >
                Referral History ({stats?.referrals?.length ?? 0})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === "claims" && styles.tabButtonActive]}
              onPress={() => setActiveTab("claims")}
            >
              <Text
                style={[styles.tabText, activeTab === "claims" && styles.tabTextActive]}
              >
                Claimed Coupons ({stats?.claims?.length ?? 0})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content: Referrals */}
          {activeTab === "referrals" && (
            <View style={styles.listContainer}>
              {stats?.referrals && stats.referrals.length > 0 ? (
                stats.referrals.map((item, index) => (
                  <View key={item.referralId || index} style={styles.listItem}>
                    <View style={styles.avatarWrap}>
                      <Text style={styles.avatarText}>
                        {(item.referredName || "U")[0].toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.listItemContent}>
                      <Text style={styles.itemTitle}>{item.referredName || "Referred User"}</Text>
                      <Text style={styles.itemSubtitle}>{item.referredEmail}</Text>
                      <Text style={styles.itemDate}>{formatDate(item.createdAt)}</Text>
                    </View>
                    <View style={styles.itemAmountWrap}>
                      <Text style={styles.itemAmount}>+₹{item.amount}</Text>
                      <View style={styles.itemBadgeSuccess}>
                        <Text style={styles.itemBadgeText}>Earned</Text>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Feather name="users" size={38} color="#9CA3AF" />
                  <Text style={styles.emptyTitle}>No Referrals Yet</Text>
                  <Text style={styles.emptyDesc}>
                    Share your referral code with friends. When they buy any full course, you earn ₹1000!
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Tab Content: Claims */}
          {activeTab === "claims" && (
            <View style={styles.listContainer}>
              {stats?.claims && stats.claims.length > 0 ? (
                stats.claims.map((claim, index) => (
                  <View key={claim.claimId || claim._id || index} style={styles.listItem}>
                    <View style={[styles.avatarWrap, { backgroundColor: "#FEF3C7" }]}>
                      <Feather name="tag" size={18} color="#D97706" />
                    </View>
                    <View style={styles.listItemContent}>
                      <Text style={styles.itemTitle}>{claim.coupon_code}</Text>
                      <Text style={styles.itemSubtitle}>Coupon worth ₹{claim.amount}</Text>
                      <Text style={styles.itemDate}>{formatDate(claim.createdAt)}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.copyBadge}
                      onPress={() => copyCoupon(claim.coupon_code)}
                    >
                      <Feather name="copy" size={14} color="#1E3A8A" />
                      <Text style={styles.copyBadgeText}>Copy</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Feather name="tag" size={38} color="#9CA3AF" />
                  <Text style={styles.emptyTitle}>No Coupons Claimed Yet</Text>
                  <Text style={styles.emptyDesc}>
                    You can convert your referral earnings balance into coupons to apply on courses.
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      )}

      {/* Convert to Coupon Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Convert to Coupon</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDesc}>
              Available balance: <Text style={styles.boldText}>₹{stats?.earningsRemaining ?? 0}</Text>
            </Text>
            <Text style={styles.modalNote}>
              Generated coupons are valid for 15 days and restricted to your account.
            </Text>

            <Text style={styles.inputLabel}>Enter Amount (₹)</Text>
            <TextInput
              style={styles.amountInput}
              keyboardType="numeric"
              value={convertAmount}
              onChangeText={setConvertAmount}
              placeholder="e.g. 1000"
            />

            {/* Quick amount chips */}
            <View style={styles.chipRow}>
              {[200, 500, 1000].map((amt) => (
                <TouchableOpacity
                  key={amt}
                  style={styles.chip}
                  onPress={() => setConvertAmount(String(amt))}
                >
                  <Text style={styles.chipText}>₹{amt}</Text>
                </TouchableOpacity>
              ))}
              {stats && stats.earningsRemaining > 0 && (
                <TouchableOpacity
                  style={[styles.chip, styles.chipMax]}
                  onPress={() => setConvertAmount(String(stats.earningsRemaining))}
                >
                  <Text style={[styles.chipText, styles.chipMaxText]}>Max</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={[styles.modalSubmitBtn, converting && styles.modalSubmitBtnDisabled]}
              onPress={handleConvertCoupon}
              disabled={converting}
            >
              {converting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.modalSubmitText}>Confirm & Generate Coupon</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={!!newCouponCode}
        transparent
        animationType="fade"
        onRequestClose={() => setNewCouponCode(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { alignItems: "center" }]}>
            <View style={styles.successIconCircle}>
              <Feather name="check" size={32} color="#15803D" />
            </View>
            <Text style={styles.successModalTitle}>Coupon Generated!</Text>
            <Text style={styles.successModalDesc}>
              Your referral coupon has been created and is ready to use:
            </Text>

            <TouchableOpacity
              style={styles.couponCopyCard}
              onPress={() => newCouponCode && copyCoupon(newCouponCode)}
            >
              <Text style={styles.couponCodeText}>{newCouponCode}</Text>
              <Feather name="copy" size={18} color="#1E3A8A" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalSubmitBtn}
              onPress={() => setNewCouponCode(null)}
            >
              <Text style={styles.modalSubmitText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  refreshBtn: {
    padding: 6,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#4B5563",
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
    color: "#DC2626",
    textAlign: "center",
  },
  retryBtn: {
    marginTop: 16,
    backgroundColor: MAROON,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  content: {
    paddingHorizontal: 18,
    paddingBottom: 32,
  },
  heroCard: {
    backgroundColor: MAROON,
    borderRadius: 16,
    padding: 22,
    marginTop: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  heroLabel: {
    color: "#F3D8D8",
    fontSize: 13,
    fontWeight: "500",
  },
  heroBalance: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
    marginVertical: 6,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 12,
    justifyContent: "space-between",
  },
  heroSubItem: {
    alignItems: "center",
    flex: 1,
  },
  heroSubLabel: {
    color: "#F3D8D8",
    fontSize: 11,
    fontWeight: "500",
  },
  heroSubVal: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 2,
  },
  heroDivider: {
    width: 1,
    height: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  convertBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#C9A227",
    paddingVertical: 13,
    borderRadius: 10,
    marginTop: 6,
  },
  convertBtnDisabled: {
    opacity: 0.5,
  },
  convertBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: NAVY,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  listContainer: {
    gap: 12,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  avatarWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: NAVY,
  },
  listItemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  itemSubtitle: {
    fontSize: 12,
    color: "#4B5563",
    marginTop: 2,
  },
  itemDate: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 3,
  },
  itemAmountWrap: {
    alignItems: "flex-end",
  },
  itemAmount: {
    fontSize: 15,
    fontWeight: "700",
    color: "#16A34A",
  },
  itemBadgeSuccess: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  itemBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#15803D",
  },
  copyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  copyBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E3A8A",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginTop: 10,
  },
  emptyDesc: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  modalDesc: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 4,
  },
  boldText: {
    fontWeight: "700",
    color: "#16A34A",
  },
  modalNote: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  amountInput: {
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    backgroundColor: "#F9FAFB",
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  chip: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  chipMax: {
    backgroundColor: "#FEF3C7",
  },
  chipMaxText: {
    color: "#B45309",
  },
  modalSubmitBtn: {
    backgroundColor: NAVY,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  modalSubmitBtnDisabled: {
    opacity: 0.6,
  },
  modalSubmitText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  successIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  successModalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  successModalDesc: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
  },
  couponCopyCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    backgroundColor: "#F0FDF4",
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#16A34A",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 20,
    width: "100%",
  },
  couponCodeText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#166534",
    letterSpacing: 1.5,
  },
});
