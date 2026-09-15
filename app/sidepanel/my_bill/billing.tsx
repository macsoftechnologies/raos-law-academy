import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as FileSystem from "expo-file-system";

import Toast from "react-native-toast-message";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

// ---------- Nested shapes ----------

export interface BillingUser {
  _id: string;
  name: string;
  email: string;
  mobile_number: string;
  password: string;
  otp: string;
  referral_code: string;
  role: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  corresponding_address?: string;
  date_of_birth?: string;
  father_name?: string;
  gender?: string;
  mother_name?: string;
  permanent_address?: string;
}

export interface BillingEnrollment {
  _id: string;
  enroll_id: string;
  userId: string;
  course_id: string;
  enroll_date: string;
  expiry_date: string;
  payment_id: string;
  status: string;
  enroll_type: EnrollType;
  planId: string;
  coupon_code?: string;
  final_price?: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface BillingPlan {
  _id: string;
  planId: string;
  original_price: string;
  strike_price: string;
  duration: string;
  handling_fee: string;
  course_id: string;
  discount_percent: string;
  course_type: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// courseDetails comes back "thin" (just a type + empty subcategory/category
// placeholders) for some enroll types, and "full" for combination courses.
// Model both shapes and let callers narrow with `isFullCourseDetails`.

export interface ThinCourseDetails {
  type: EnrollType;
  subcategory: Record<string, unknown>;
  category: Record<string, unknown>;
}

export interface ComboLawConfig {
  access_type: string;
  law_id: string;
}

export interface ComboSubcategory {
  subcategory_id: string;
  title: string;
  presentation_image: string;
}

export interface ComboCategory {
  categoryId: string;
  category_name: string;
  tag_text: string;
}

export interface FullComboCourseDetails {
  type: "combination";
  combo_id: string;
  title: string;
  description: string;
  presentation_image: string;
  includes_lectures: boolean;
  includes_notes: boolean;
  includes_prelimes: boolean;
  includes_mains: boolean;
  lecture_config: ComboLawConfig;
  notes_config: ComboLawConfig;
  subcategory: ComboSubcategory;
  category: ComboCategory;
}

export type BillingCourseDetails = ThinCourseDetails | FullComboCourseDetails;

export function isFullCourseDetails(
  details: BillingCourseDetails
): details is FullComboCourseDetails {
  return "combo_id" in details;
}

// ---------- Top-level record ----------

export type EnrollType =
  | "full-course"
  | "subject-wise"
  | "notes"
  | "mains"
  | "prelimes"
  | "combination";

export interface BillingRecord {
  _id: string;
  userId: string;
  enroll_id: string;
  planId: string;
  course_id: string;
  enroll_type: EnrollType;
  payment_id: string;
  amount_paise: number;
  currency: string;
  transaction_date: string;
  billing_cycle: string;
  valid_till: string;
  billing_status: string;
  gst_percent: number;
  base_amount_paise: number;
  gst_amount_paise: number;
  billing_id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  enrollment: BillingEnrollment;
  user: BillingUser;
  plan: BillingPlan;
  courseDetails: BillingCourseDetails;
  amount: number;
  base_amount: number;
  gst_amount: number;
}

export interface GetUserBillingResponse {
  statusCode: number;
  message: string;
  data: BillingRecord[];
}

const API_BASE_URL = "https://api.raoslawacademy.com";
// Adjust this if your CDN/image path differs — the API only returns filenames.
const IMAGE_BASE_URL = `${API_BASE_URL}/uploads`;

// ---------- Helpers ----------

function formatCurrency(amount: number, currency: string): string {
  const symbol = currency === "INR" ? "₹" : `${currency} `;
  return `${symbol}${amount.toFixed(2)}`;
}

function formatDate(dateString: string): string {
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return dateString;
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getCourseTitle(record: BillingRecord): string {
  if (isFullCourseDetails(record.courseDetails)) {
    return record.courseDetails.title;
  }
  return record.enrollment?.enroll_type
    ? `${record.enrollment.enroll_type.charAt(0).toUpperCase()}${record.enrollment.enroll_type.slice(1)} Course`
    : "Course";
}

function isActiveBilling(record: BillingRecord): boolean {
  return (
    record.billing_status?.toLowerCase() === "active" &&
    record.enrollment?.status?.toLowerCase() === "active"
  );
}

export default function Billing() {
  const { userId: paramUserId } = useLocalSearchParams<{ userId?: string }>();

  const [billings, setBillings] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBillings = useCallback(async () => {
    setLoading(true);
    try {
      const userId = paramUserId ?? (await AsyncStorage.getItem("userId"));

      const response = await axios.post<GetUserBillingResponse>(
        `https://api.raoslawacademy.com/billings/user_billings`,
        { userId: "65bfbd3c-979e-4ed3-ad54-cb7ec0412544" }
      );

      if (response.data.statusCode === 200) {
        setBillings(response.data.data ?? []);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: response.data.message || "Couldn't load your billings.",
        });
      }
    } catch (error: any) {
      console.error("Error fetching billings:", error?.response?.data || error.message);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Couldn't load your billings. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [paramUserId]);

  useEffect(() => {
    fetchBillings();
  }, [fetchBillings]);

const handleDownloadInvoice = async (record: BillingRecord) => {
  try {
    const fileName = `invoice-${record.billing_id}.pdf`;

    const downloadedFile = await File.downloadFileAsync(
      `https://api.raoslawacademy.com/billings/invoice/f56a235f-847a-4b77-b0f0-0813fda33a9a`,
      Paths.document
    );

    // downloadFileAsync names the file based on the URL/response headers —
    // rename it to something predictable.
    const finalFile = new File(Paths.document, fileName);
    if (downloadedFile.uri !== finalFile.uri) {
      if (finalFile.exists) {
        finalFile.delete();
      }
      downloadedFile.move(finalFile);
    }

    Toast.show({
      type: "success",
      text1: "Success",
      text2: "Invoice downloaded successfully.",
    });

    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(finalFile.uri, {
        mimeType: "application/pdf",
        dialogTitle: fileName,
        UTI: "com.adobe.pdf",
      });
    }
  } catch (error) {
    console.error("Invoice download error:", error);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "Failed to download invoice.",
    });
  }
};

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ECEFF6" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Billings & Payments</Text>

        <View style={{ width: 26 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#26469C" style={{ marginTop: 40 }} />
      ) : billings.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={40} color="#9CA3AF" />
          <Text style={styles.emptyText}>No billing records yet</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16 }}
        >
          {billings.map((record) => {
            const active = isActiveBilling(record);
            const fullDetails = isFullCourseDetails(record.courseDetails)
              ? record.courseDetails
              : null;
            const hasGst = record.gst_percent > 0;
            const couponCode = record.enrollment?.coupon_code;

            return (
              <View key={record._id} style={styles.card}>
                {/* Course image + category/subcategory tags, when available */}
                {fullDetails && (
                  <View style={styles.imageRow}>
                    {fullDetails.presentation_image ? (
                      <Image
                        source={{
                          uri: `${IMAGE_BASE_URL}/${fullDetails.presentation_image}`,
                        }}
                        style={styles.thumbnail}
                        resizeMode="cover"
                      />
                    ) : null}
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <View style={styles.tagRow}>
                        {fullDetails.category?.tag_text ? (
                          <View style={styles.tag}>
                            <Text style={styles.tagText}>
                              {fullDetails.category.tag_text}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                      {fullDetails.subcategory?.title ? (
                        <Text style={styles.subcategoryText} numberOfLines={2}>
                          {fullDetails.subcategory.title}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                )}

                <View style={styles.topRow}>
                  <Text style={styles.billingType}>
                    {active ? "Active Course Billing" : "Inactive Course Billing"}
                  </Text>

                  <View
                    style={[
                      styles.statusBadge,
                      active ? styles.activeBadge : styles.inactiveBadge,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: active ? "#C89A17" : "#8E2D2D" },
                      ]}
                    >
                      • {active ? "Active" : "Inactive"}
                    </Text>
                  </View>
                </View>

                <Text style={styles.courseTitle}>{getCourseTitle(record)}</Text>

                {fullDetails?.description ? (
                  <Text style={styles.description} numberOfLines={2}>
                    {fullDetails.description}
                  </Text>
                ) : null}

                <View style={styles.divider} />

                <Text style={styles.amount}>
                  {formatCurrency(record.amount, record.currency)}
                  <Text style={styles.cycle}>
                    {" "}
                    /Billing cycle : {record.billing_cycle}
                  </Text>
                </Text>

                {/* Price breakdown: base amount + GST, only when GST applies */}
                {hasGst && (
                  <View style={styles.breakdownBox}>
                    <View style={styles.breakdownRow}>
                      <Text style={styles.breakdownLabel}>Base amount</Text>
                      <Text style={styles.breakdownValue}>
                        {formatCurrency(record.base_amount, record.currency)}
                      </Text>
                    </View>
                    <View style={styles.breakdownRow}>
                      <Text style={styles.breakdownLabel}>
                        GST ({record.gst_percent}%)
                      </Text>
                      <Text style={styles.breakdownValue}>
                        {formatCurrency(record.gst_amount, record.currency)}
                      </Text>
                    </View>
                  </View>
                )}

                {couponCode ? (
                  <View style={styles.couponRow}>
                    <Ionicons name="pricetag-outline" size={14} color="#166534" />
                    <Text style={styles.couponText}>Coupon applied: {couponCode}</Text>
                  </View>
                ) : null}

                <Text style={styles.valid}>
                  Valid Till : {formatDate(record.valid_till)}
                </Text>

                <Text style={styles.info}>
                  TRANSACTION ID: {record.payment_id}
                </Text>

                <Text style={styles.info}>
                  TRANSACTION DATE: {formatDate(record.transaction_date)}
                </Text>

                <Text style={styles.info}>
                  BILLING ID: {record.billing_id}
                </Text>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleDownloadInvoice(record)}
                >
                  <Ionicons name="document-text-outline" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Download Invoice</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECEFF6",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 11,
    paddingBottom: 10,
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 10,
  },

  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#2447A8",
    padding: 18,
    marginBottom: 22,
  },

  imageRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
  },

  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  tag: {
    backgroundColor: "#E8ECF9",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 4,
  },

  tagText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#26469C",
  },

  subcategoryText: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  billingType: {
    fontSize: 16,
    color: "#222",
  },

  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },

  activeBadge: {
    backgroundColor: "#F5ECD6",
  },

  inactiveBadge: {
    backgroundColor: "#EFE4E8",
  },

  statusText: {
    fontWeight: "700",
  },

  courseTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
    marginTop: 10,
    lineHeight: 28,
  },

  description: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
    lineHeight: 18,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 16,
  },

  amount: {
    fontSize: 19,
    fontWeight: "700",
    color: "#111",
  },

  cycle: {
    fontSize: 16,
    fontWeight: "400",
  },

  breakdownBox: {
    backgroundColor: "#F7F8FC",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },

  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },

  breakdownLabel: {
    fontSize: 12,
    color: "#666",
  },

  breakdownValue: {
    fontSize: 12,
    color: "#333",
    fontWeight: "600",
  },

  couponRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 6,
  },

  couponText: {
    fontSize: 12,
    color: "#166534",
    fontWeight: "600",
  },

  valid: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  info: {
    marginTop: 10,
    fontSize: 12,
    color: "#333",
  },

  button: {
    marginTop: 20,
    backgroundColor: "#26469C",
    borderRadius: 12,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 10,
  },
});