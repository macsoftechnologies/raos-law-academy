import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Modal,
  Pressable,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import { useCartWishlist } from "@/src/context/CartWishlistContext";
import {
  getImageUrl,
  FALLBACK_COURSE_IMAGE,
  apiClient,
  getEffectiveUserId,
} from "@/src/api/client";
import { parseApiError, showApiErrorToast } from "@/src/api/errorHandler";

export interface SubCategoryDetails {
  _id: string;
  subcategory_id: string;
  presentation_image: string;
  title: string;
  about_course: string;
  terms_conditions: string;
  categoryId: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CoursePlan {
  _id: string;
  planId: string;
  original_price: string;
  strike_price: string;
  duration: string;
  handling_fee: string;
  course_id: string;
  discount_percent: string;
  course_type: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CalculatePriceResponse {
  statusCode: number;
  message: string;
  data: {
    original_price: number;
    handling_fee: number;
    discount_amount: number;
    final_price: number;
    coupon_code: string;
    coupon_applied: boolean;
  };
}

const DEFAULT_TERMS = [
  "Are you sure you want to start the Civil Laws Mains Test?",
  "Once the test begins, you must complete it within 3 hours.",
  "After submission time, you'll get an additional 15 minutes grace period to scan your answer sheets, convert them into a PDF, and upload the file.",
  "Once started, the test cannot be paused or restarted.",
];

export default function Coursepackage() {
  const params = useLocalSearchParams<{
    sub_categoryId?: string;
    subcategoryId?: string;
    subcategory_id?: string;
    courseId?: string;
    id?: string;
    title?: string;
    buyNow?: string;
  }>();

  // Resolve the actual subcategory UUID (contains hyphens)
  const rawCandidates = [
    params.sub_categoryId,
    params.subcategoryId,
    params.subcategory_id,
    params.courseId,
    params.id,
  ].filter((x): x is string => typeof x === "string" && x.trim().length > 0);

  const uuidCandidate = rawCandidates.find((id) => id.includes("-"));
  const effectiveCourseId =
    uuidCandidate || rawCandidates[0] || "37634c0a-1deb-4cee-aaa9-888f60af09c9";

  const { addToCart, isInCart, cartCount } = useCartWishlist();
  const [subCategoryData, setSubCategoryData] = useState<SubCategoryDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const [plans, setPlans] = useState<CoursePlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const [termsExpanded, setTermsExpanded] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [planModalVisible, setPlanModalVisible] = useState(false);
  const [payModalVisible, setPayModalVisible] = useState(false);

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [calculatingPrice, setCalculatingPrice] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [calculatedPriceData, setCalculatedPriceData] = useState<{
    original_price: number;
    handling_fee: number;
    discount_amount: number;
    final_price: number;
    coupon_applied: boolean;
  } | null>(null);

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // 1. Fetch Course / SubCategory Details
  const fetchDetails = useCallback(async () => {
    setDetailsLoading(true);
    try {
      const response = await apiClient.post<{
        statusCode: number;
        message: string;
        data: SubCategoryDetails;
      }>("/subcategories/details", {
        subcategory_id: effectiveCourseId,
      });

      if (
        (response.data?.statusCode === 200 || response.data?.statusCode === 201 || response.status === 200) &&
        response.data?.data
      ) {
        setSubCategoryData(response.data.data);
      }
    } catch (err: any) {
      console.log("Coursepackage details fetch error:", err?.response?.data || err.message);
    } finally {
      setDetailsLoading(false);
    }
  }, [effectiveCourseId]);

  // 2. Fetch Course Plans
  const fetchPlans = useCallback(async () => {
    setPlansLoading(true);
    setPlansError(null);
    try {
      const response = await apiClient.post<{
        statusCode: number;
        message: string;
        data: CoursePlan[];
      }>("/plans/bycourse", {
        course_id: effectiveCourseId,
      });

      if (
        (response.data?.statusCode === 200 || response.status === 200) &&
        Array.isArray(response.data?.data) &&
        response.data.data.length > 0
      ) {
        const fetchedPlans = response.data.data;
        setPlans(fetchedPlans);
        setSelectedPlanId(fetchedPlans[0].planId);

        // Structured logging of plan details (not repeated on render)
        console.log("Course plans loaded successfully:", {
          course_id: effectiveCourseId,
          count: fetchedPlans.length,
          plans: fetchedPlans.map((p) => ({
            planId: p.planId,
            duration: p.duration,
            price: p.original_price,
            strike: p.strike_price,
            handling_fee: p.handling_fee,
          })),
        });
      } else {
        setPlans([]);
        setPlansError(response.data?.message || "No plans found for this course.");
      }
    } catch (err: any) {
      console.log("Coursepackage plans fetch error:", err?.response?.data || err.message);
      const parsed = parseApiError(err);
      setPlansError(parsed.message || "Failed to load plans.");
      setPlans([]);
    } finally {
      setPlansLoading(false);
    }
  }, [effectiveCourseId]);

  useEffect(() => {
    fetchDetails();
    fetchPlans();
  }, [fetchDetails, fetchPlans]);

  // Auto-open buy flow if user tapped Buy Now on previous screen
  useEffect(() => {
    if (params.buyNow === "true" && !plansLoading && plans.length > 0) {
      setTermsAccepted(true);
      setPlanModalVisible(true);
    }
  }, [params.buyNow, plansLoading, plans.length]);

  // Active plan resolution
  const activePlan: CoursePlan | null =
    plans.find((p) => p.planId === selectedPlanId) ||
    plans[0] ||
    null;

  const basePrice = activePlan ? parseFloat(activePlan.original_price) || 0 : 0;
  const baseStrike = activePlan ? parseFloat(activePlan.strike_price) || 0 : 0;
  const baseHandling = activePlan ? parseFloat(activePlan.handling_fee) || 0 : 0;

  const displayPrice = calculatedPriceData ? calculatedPriceData.original_price : basePrice;
  const displayHandling = calculatedPriceData ? calculatedPriceData.handling_fee : baseHandling;
  const discountAmount = calculatedPriceData ? calculatedPriceData.discount_amount : 0;
  const grandTotal = calculatedPriceData
    ? calculatedPriceData.final_price
    : displayPrice + displayHandling;

  // Plan Selection Handler
  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setCalculatedPriceData(null);
    setAppliedCoupon(null);
    setCouponError(null);

    const planObj = plans.find((p) => p.planId === planId);
    if (planObj) {
      console.log("Selected plan details:", {
        planId: planObj.planId,
        duration: planObj.duration,
        price: planObj.original_price,
        handling_fee: planObj.handling_fee,
      });
    }
  };

  const openBuyFlow = () => {
    if (!termsAccepted) {
      Alert.alert(
        "Terms & Conditions",
        "Please accept the Terms & Conditions before proceeding to purchase."
      );
      return;
    }
    if (plans.length === 0) {
      Alert.alert(
        "No Plans Available",
        "No subscription plans are currently available for this course. Please try again later."
      );
      return;
    }
    setPlanModalVisible(true);
  };

  const confirmPlan = () => {
    setPlanModalVisible(false);
    setPayModalVisible(true);
  };

  // Coupon Application
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      setCouponError("Please enter a coupon code.");
      return;
    }
    if (!activePlan) {
      setCouponError("Please select a plan first.");
      return;
    }

    setCalculatingPrice(true);
    setCouponError(null);
    try {
      const effectiveUserId = await getEffectiveUserId();
      const response = await apiClient.post<CalculatePriceResponse>(
        "/enrollments/calculate-price",
        {
          planId: activePlan.planId,
          coupon_code: couponInput.trim().toUpperCase(),
          userId: effectiveUserId,
        }
      );

      if (
        (response.data?.statusCode === 200 || response.status === 200 || response.status === 201) &&
        response.data?.data
      ) {
        setCalculatedPriceData(response.data.data);
        setAppliedCoupon(couponInput.trim().toUpperCase());
        Toast.show({
          type: "success",
          text1: "Coupon Applied",
          text2: `Saved ₹${response.data.data.discount_amount}!`,
        });
      } else {
        const msg = response.data?.message || "Invalid or expired coupon code.";
        setCouponError(msg);
        Toast.show({
          type: "error",
          text1: "Coupon Error",
          text2: msg,
        });
      }
    } catch (err: any) {
      console.log("Calculate price error:", err?.response?.data || err.message);
      const parsed = parseApiError(err);
      setCouponError(parsed.message || "Failed to apply coupon.");
      Toast.show({
        type: "error",
        text1: "Coupon Error",
        text2: parsed.message || "Failed to apply coupon.",
      });
    } finally {
      setCalculatingPrice(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponInput("");
    setAppliedCoupon(null);
    setCalculatedPriceData(null);
    setCouponError(null);
  };

  // Payment navigation
  const handlePayOnline = () => {
    if (isSubmittingPayment) return;
    if (!activePlan) {
      Alert.alert("Error", "No plan selected.");
      return;
    }

    setIsSubmittingPayment(true);
    console.log("Proceeding to payment:", {
      price: displayPrice,
      handlingFee: displayHandling,
      total: grandTotal,
      courseId: effectiveCourseId,
      planId: activePlan.planId,
      coupon: appliedCoupon,
    });

    setPayModalVisible(false);

    router.push({
      pathname: "/paymentgateways/razorpay",
      params: {
        price: String(displayPrice),
        handlingFee: String(displayHandling),
        total: String(grandTotal),
        courseId: effectiveCourseId,
        planId: activePlan.planId,
      },
    });

    setTimeout(() => {
      setIsSubmittingPayment(false);
    }, 1000);
  };

  // Add to cart handler
  const handleAddToCart = async () => {
    if (isAddingToCart) return;
    if (!activePlan) {
      Alert.alert("Notice", "No plans available for this course.");
      return;
    }

    setIsAddingToCart(true);
    try {
      const success = await addToCart(
        effectiveCourseId,
        activePlan.course_type || "full-course",
        activePlan.planId
      );
      if (success) {
        Toast.show({
          type: "success",
          text1: "Added to Cart",
          text2: "Course added to your cart successfully.",
        });
      }
    } catch (err: any) {
      showApiErrorToast(err, "Cart Error");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {subCategoryData?.title || params.title || "Course Details"}
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/sidepanel/wish_cart/wish_buy")}
          style={{ position: "relative", padding: 4 }}
          hitSlop={10}
        >
          <Ionicons name="cart-outline" size={24} color="#111" />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={{ color: "#fff", fontSize: 9, fontWeight: "700" }}>
                {cartCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {(() => {
          const imgUri = getImageUrl(subCategoryData?.presentation_image);
          const isImgError = !imgUri || imageError;
          return (
            <Image
              source={isImgError ? FALLBACK_COURSE_IMAGE : { uri: imgUri }}
              onError={() => setImageError(true)}
              defaultSource={FALLBACK_COURSE_IMAGE}
              style={styles.banner}
              resizeMode="cover"
            />
          );
        })()}

        <View style={styles.content}>
          <Text style={styles.courseTitle}>
            {subCategoryData?.title || params.title || "Andhra Pradesh Junior Civil Judge Course"}
          </Text>

          {/* Dynamic Price Row */}
          {plansLoading ? (
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
              <ActivityIndicator size="small" color="#1e2a5e" />
              <Text style={{ marginLeft: 8, color: "#666", fontSize: 13 }}>Loading plan details...</Text>
            </View>
          ) : activePlan ? (
            <View style={styles.priceRow}>
              <Text style={styles.price}>
                ₹{basePrice.toLocaleString("en-IN")}
              </Text>
              {baseStrike > 0 && (
                <Text style={styles.strike}>
                  ₹{baseStrike.toLocaleString("en-IN")}
                </Text>
              )}
              {activePlan.discount_percent && (
                <View style={styles.offBadge}>
                  <Text style={styles.offText}>{activePlan.discount_percent}% off</Text>
                </View>
              )}
              {activePlan.duration && (
                <Text style={{ fontSize: 13, color: "#666", marginLeft: 4 }}>
                  ({activePlan.duration})
                </Text>
              )}
            </View>
          ) : (
            <View style={styles.priceRow}>
              <Text style={{ fontSize: 14, color: "#888" }}>
                {plansError || "No subscription plans available"}
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>About the course</Text>
          <Text style={styles.description}>
            {subCategoryData?.about_course ||
              "Prepare effectively for the AP Junior Civil Judge Exam (Prelims & Mains) with our comprehensive course designed by expert faculty. The course offers separate classes for Civil Laws and Criminal Laws, ensuring clear understanding and focused learning."}
          </Text>

          <View style={styles.materialsRow}>
            <View style={styles.playCircle}>
              <Ionicons name="play" size={16} color="#fff" />
            </View>
            <View>
              <Text style={styles.materialsTitle}>100+ Learning Materials</Text>
              <Text style={styles.materialsSub}>250 files, 200 Videos, 500 Tests</Text>
            </View>
          </View>

          {[
            "Separate classes for Civil & Criminal Laws",
            "Covers Prelims and Mains",
            "Comprehensive notes provided",
            "Expert guidance for complete exam preparation",
          ].map((item) => (
            <View style={styles.bulletRow} key={item}>
              <Text style={styles.bulletDot}>{"\u2022"}</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}

          <View style={styles.extrasBox}>
            <Text style={styles.extrasTitle}>what additional things will you get?</Text>
            <View style={styles.extrasRow}>
              <View style={styles.extraItem}>
                <View style={styles.extraIcon}>
                  <Ionicons name="school-outline" size={16} color="#8a6d1a" />
                </View>
                <View>
                  <Text style={styles.extraTitle}>Guest Lectures</Text>
                  <Text style={styles.extraSub}>Learn by top advocates</Text>
                </View>
              </View>
              <View style={styles.extraItem}>
                <View style={styles.extraIcon}>
                  <Ionicons name="desktop-outline" size={16} color="#8a6d1a" />
                </View>
                <View>
                  <Text style={styles.extraTitle}>Available on PC</Text>
                  <Text style={styles.extraSub}>Wider screen, sharper quality</Text>
                </View>
              </View>
            </View>
          </View>

          <Text style={styles.ctaLine}>
            Start your journey to becoming a Junior Civil Judge with the right guidance and resources!
          </Text>

          {/* Terms & Conditions */}
          <TouchableOpacity
            style={styles.termsHeader}
            onPress={() => setTermsExpanded((e) => !e)}
            activeOpacity={0.7}
          >
            <TouchableOpacity
              onPress={() => setTermsAccepted((a) => !a)}
              hitSlop={8}
              style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}
            >
              {termsAccepted && <Ionicons name="checkmark" size={14} color="#fff" />}
            </TouchableOpacity>
            <Text style={styles.termsLabel}>I accept Terms & Conditions</Text>
            <Ionicons
              name={termsExpanded ? "chevron-up" : "chevron-down"}
              size={18}
              color="#c0392b"
            />
          </TouchableOpacity>

          {termsExpanded && (
            <View style={styles.termsList}>
              {(subCategoryData?.terms_conditions
                ? subCategoryData.terms_conditions
                    .split("\n")
                    .map((t) => t.trim())
                    .filter(Boolean)
                : DEFAULT_TERMS
              ).map((t, i) => (
                <View style={styles.termRow} key={i}>
                  <Text style={styles.termIndex}>{i + 1}.</Text>
                  <Text style={styles.termText}>{t.replace(/^\d+[\.\)]\s*/, "")}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.cartBtn, isAddingToCart && { opacity: 0.7 }]}
          disabled={isAddingToCart}
          onPress={handleAddToCart}
        >
          {isAddingToCart ? (
            <ActivityIndicator size="small" color="#1e2a5e" />
          ) : (
            <Text style={styles.cartBtnText}>
              {isInCart(effectiveCourseId) ? "In Cart" : "Add to Cart"}
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buyBtn, (!termsAccepted || plans.length === 0) && styles.buyBtnDisabled]}
          onPress={openBuyFlow}
        >
          <Text style={styles.buyBtnText}>Buy Now</Text>
        </TouchableOpacity>
      </View>

      {/* Plan selection modal */}
      <Modal visible={planModalVisible} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setPlanModalVisible(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Choose your plan</Text>

          {plansLoading ? (
            <View style={{ padding: 24, alignItems: "center" }}>
              <ActivityIndicator size="small" color="#1e2a5e" />
              <Text style={{ marginTop: 8, color: "#666", fontSize: 13 }}>Loading plans...</Text>
            </View>
          ) : plans.length === 0 ? (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={{ color: "#666", fontSize: 14, textAlign: "center" }}>
                {plansError || "No plans available for this course."}
              </Text>
              <TouchableOpacity
                onPress={fetchPlans}
                style={{
                  marginTop: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  backgroundColor: "#1e2a5e",
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600" }}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            plans.map((p) => {
              const isSelected = selectedPlanId === p.planId;
              const pPrice = parseFloat(p.original_price) || 0;
              const pStrike = parseFloat(p.strike_price) || 0;
              return (
                <TouchableOpacity
                  key={p.planId}
                  style={[styles.planRow, isSelected && styles.planRowSelected]}
                  onPress={() => handleSelectPlan(p.planId)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.radio, isSelected && styles.radioSelected]}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                  <Text style={styles.planPrice}>₹{pPrice.toLocaleString("en-IN")}</Text>
                  {pStrike > 0 && (
                    <Text style={styles.planOriginal}>₹{pStrike.toLocaleString("en-IN")}</Text>
                  )}
                  <Text style={styles.planLabel}>for {p.duration}</Text>
                </TouchableOpacity>
              );
            })
          )}

          {plans.length > 0 && (
            <TouchableOpacity style={styles.nextBtn} onPress={confirmPlan}>
              <Text style={styles.nextBtnText}>Next</Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>

      {/* Payment / Coupon modal */}
      <Modal visible={payModalVisible} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setPayModalVisible(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>
            {subCategoryData?.title || params.title || "Course Enrollment"}
          </Text>

          {activePlan && (
            <Text style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
              Selected Plan: {activePlan.duration} ({activePlan.course_type})
            </Text>
          )}

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Price</Text>
            <Text style={styles.summaryValue}>₹{displayPrice.toLocaleString("en-IN")}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Internet Handling Fee</Text>
            <Text style={styles.summaryValue}>₹{displayHandling}</Text>
          </View>
          {discountAmount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: "#2E7D32" }]}>Coupon Discount</Text>
              <Text style={[styles.summaryValue, { color: "#2E7D32", fontWeight: "700" }]}>
                -₹{discountAmount.toLocaleString("en-IN")}
              </Text>
            </View>
          )}
          <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: "#d8dce6", paddingTop: 10, marginTop: 4 }]}>
            <Text style={[styles.summaryLabel, { fontWeight: "700", fontSize: 16 }]}>Total</Text>
            <Text style={[styles.summaryValue, { fontWeight: "700", fontSize: 16, color: "#1e2a5e" }]}>
              ₹{grandTotal.toLocaleString("en-IN")}
            </Text>
          </View>

          {/* Coupon Code Input */}
          <View style={styles.couponInputRow}>
            <TextInput
              style={styles.couponInput}
              value={couponInput}
              onChangeText={(text) => {
                setCouponInput(text);
                setCouponError(null);
              }}
              placeholder="Enter Discount Coupon"
              placeholderTextColor="#999"
              autoCapitalize="characters"
              editable={!appliedCoupon && !calculatingPrice}
            />
            {appliedCoupon ? (
              <TouchableOpacity onPress={handleRemoveCoupon} style={{ padding: 4 }}>
                <Text style={{ fontSize: 13, color: "#E53935", fontWeight: "600" }}>Remove</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleApplyCoupon}
                disabled={calculatingPrice || !couponInput.trim()}
                style={{ padding: 4 }}
              >
                {calculatingPrice ? (
                  <ActivityIndicator size="small" color="#1e2a5e" />
                ) : (
                  <Text style={[styles.applyLink, !couponInput.trim() && { color: "#999" }]}>
                    Apply
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          {couponError && (
            <Text style={{ color: "#E53935", fontSize: 12, marginTop: 4 }}>
              {couponError}
            </Text>
          )}
          {appliedCoupon && (
            <Text style={{ color: "#2E7D32", fontSize: 12, marginTop: 4, fontWeight: "600" }}>
              ✓ Coupon "{appliedCoupon}" applied successfully!
            </Text>
          )}

          <TouchableOpacity
            style={[styles.payBtn, isSubmittingPayment && { opacity: 0.7 }]}
            disabled={isSubmittingPayment}
            onPress={handlePayOnline}
          >
            {isSubmittingPayment ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.payBtnText}>Pay Online</Text>
            )}
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const NAVY = "#1e2a5e";
const GOLD = "#c99b1c";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#eef1f6" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#eef1f6",
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    paddingTop: 40,
    marginHorizontal: 8,
  },
  cartBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#E53935",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  banner: { width: "100%", height: 180 },
  content: { paddingHorizontal: 16, paddingTop: 16 },
  courseTitle: { fontSize: 20, fontWeight: "700", color: "#111" },
  priceRow: { flexDirection: "row", alignItems: "center", marginTop: 8, gap: 8 },
  price: { fontSize: 20, fontWeight: "700", color: NAVY },
  strike: { fontSize: 15, color: "#888", textDecorationLine: "line-through" },
  offBadge: {
    backgroundColor: "#e4c76b",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  offText: { fontSize: 12, fontWeight: "700", color: "#4a3b00" },
  divider: { height: 1, backgroundColor: "#d8dce6", marginVertical: 14 },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#111", marginBottom: 6 },
  description: { fontSize: 13.5, color: "#666", lineHeight: 20 },
  materialsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 16,
  },
  playCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: NAVY,
    alignItems: "center",
    justifyContent: "center",
  },
  materialsTitle: { fontSize: 14, fontWeight: "700", color: "#111" },
  materialsSub: { fontSize: 12, color: "#777", marginTop: 2 },
  bulletRow: { flexDirection: "row", marginTop: 8, paddingLeft: 4 },
  bulletDot: { fontSize: 13, color: "#666", marginRight: 6 },
  bulletText: { fontSize: 13.5, color: "#555", flex: 1 },
  extrasBox: {
    backgroundColor: "#fbf1d6",
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
  },
  extrasTitle: { fontSize: 12.5, color: "#7a6320", marginBottom: 10 },
  extrasRow: { flexDirection: "row", justifyContent: "space-between" },
  extraItem: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  extraIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f0dfa0",
    alignItems: "center",
    justifyContent: "center",
  },
  extraTitle: { fontSize: 12.5, fontWeight: "700", color: "#3a3000" },
  extraSub: { fontSize: 10.5, color: "#7a6320" },
  ctaLine: { fontSize: 13, color: "#333", marginTop: 16, lineHeight: 19 },
  termsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#c0392b",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: { backgroundColor: "#c0392b" },
  termsLabel: { flex: 1, fontSize: 13.5, fontWeight: "600", color: "#c0392b" },
  termsList: { marginTop: 10, paddingLeft: 4 },
  termRow: { flexDirection: "row", marginTop: 8 },
  termIndex: { fontSize: 13, color: "#333", marginRight: 6, fontWeight: "600" },
  termText: { fontSize: 13, color: "#333", flex: 1, lineHeight: 19 },
  bottomBar: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    backgroundColor: "#eef1f6",
    borderTopWidth: 1,
    borderTopColor: "#d8dce6",
  },
  cartBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: NAVY,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBtnText: { color: NAVY, fontWeight: "700", fontSize: 14 },
  buyBtn: {
    flex: 1,
    backgroundColor: NAVY,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buyBtnDisabled: { backgroundColor: "#a3a9c2" },
  buyBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet: {
    backgroundColor: "#eef1f6",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#c7cbd6",
    alignSelf: "center",
    marginBottom: 14,
  },
  sheetTitle: { fontSize: 17, fontWeight: "700", color: "#111", marginBottom: 16 },
  planRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#d8dce6",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  planRowSelected: {
    borderColor: NAVY,
    backgroundColor: "#E8EDFF",
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#999",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: { borderColor: NAVY },
  radioDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: NAVY },
  planPrice: { fontSize: 15, fontWeight: "700", color: "#111" },
  planOriginal: { fontSize: 13, color: "#999", textDecorationLine: "line-through" },
  planLabel: { marginLeft: "auto", fontSize: 12.5, color: GOLD, fontWeight: "600" },
  nextBtn: {
    backgroundColor: NAVY,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 6,
  },
  nextBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  summaryLabel: { fontSize: 14, color: "#333" },
  summaryValue: { fontSize: 14, color: "#111" },
  couponInputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d8dce6",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 10,
    backgroundColor: "#fff",
  },
  couponInput: {
    flex: 1,
    fontSize: 14,
    color: "#111",
    paddingVertical: 4,
  },
  applyLink: { fontSize: 13.5, color: NAVY, fontWeight: "700" },
  payBtn: {
    backgroundColor: NAVY,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  payBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});