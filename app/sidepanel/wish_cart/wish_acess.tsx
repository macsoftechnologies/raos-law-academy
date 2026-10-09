import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCartWishlist, CartItem } from "@/src/context/CartWishlistContext";
import { getImageUrl, FALLBACK_COURSE_IMAGE } from "@/src/api/client";

const TERMS = [
  "Are you sure you want to start the Civil Laws Mains Test?",
  "Once the test begins, you must complete it within 3 hours.",
  "After submission time, you'll get an additional 15 minutes grace period to scan your answer sheets, convert them into a PDF, and upload the file.",
  "Once started, the test cannot be paused or restarted.",
];

const DELIVERY_ADDRESS = {
  name: "Student",
  pincode: "530017",
  label: "Home",
  fullAddress: "MVP Colony, Visakhapatnam, Andhra Pradesh",
};

export default function WishAcess() {
  const [activeTab, setActiveTab] = useState<"courses" | "books">("books");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsExpanded, setTermsExpanded] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const {
    cartItems,
    loadingCart,
    removeFromCart,
  } = useCartWishlist();

  const formatPrice = (value: number | string | undefined) => {
    const num = Number(value) || 0;
    return `₹${num.toLocaleString("en-IN")}`;
  };

  const { totalMrp, totalPrice, totalShipping, grandTotal } = useMemo(() => {
    let mrp = 0;
    let price = 0;
    const shipping = 50;

    cartItems.forEach((item) => {
      const p = Number(item.plan?.original_price) || 499;
      const strike = Number(item.plan?.strike_price) || p * 1.5;
      mrp += strike;
      price += p;
    });

    if (cartItems.length === 0) {
      return { totalMrp: 0, totalPrice: 0, totalShipping: 0, grandTotal: 0 };
    }

    return {
      totalMrp: mrp,
      totalPrice: price,
      totalShipping: shipping,
      grandTotal: price + shipping,
    };
  }, [cartItems]);

  const handlePlaceOrder = () => {
    if (!termsAccepted || cartItems.length === 0) return;
    router.push({
      pathname: "/paymentgateways/razorpay",
      params: {
        price: totalPrice,
        handlingFee: totalShipping,
        total: grandTotal,
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDEEF5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={10}
        >
          <Ionicons name="chevron-back" size={24} color="#0A1A3B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "courses" ? styles.tabActive : styles.tabInactive,
          ]}
          onPress={() => router.push("/sidepanel/wish_cart/wish_buy")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "courses"
                ? styles.tabTextActive
                : styles.tabTextInactive,
            ]}
          >
            My Courses
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "books" ? styles.tabActive : styles.tabInactive,
          ]}
          onPress={() => setActiveTab("books")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "books"
                ? styles.tabTextActive
                : styles.tabTextInactive,
            ]}
          >
            Printed Books
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Delivery Address */}
        <View style={styles.addressCard}>
          <View style={styles.addressTopRow}>
            <Text style={styles.addressDeliverTo}>
              Deliver to:{" "}
              <Text style={styles.addressName}>
                {DELIVERY_ADDRESS.name}, {DELIVERY_ADDRESS.pincode}
              </Text>
            </Text>
            <View style={styles.addressBadge}>
              <Text style={styles.addressBadgeText}>
                {DELIVERY_ADDRESS.label}
              </Text>
            </View>
          </View>
          <View style={styles.addressBottomRow}>
            <Text style={styles.addressFull}>
              {DELIVERY_ADDRESS.fullAddress}
            </Text>
          </View>
        </View>

        {loadingCart ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#23408E" />
            <Text style={styles.statusText}>Loading items...</Text>
          </View>
        ) : cartItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={72} color="#A0AEC0" />
            <Text style={styles.emptyTitle}>No Printed Books in Cart</Text>
            <Text style={styles.emptySubtitle}>
              Select courses or printed notes to view delivery and order details.
            </Text>
            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() => router.push("/dashboard/dashboard")}
            >
              <Text style={styles.exploreBtnText}>Explore Notes</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Cart Items */}
            {cartItems.map((item: CartItem) => {
              const imgUri = getImageUrl(item.courseDetails?.presentation_image);
              const isImgError = !imgUri || imageErrors[item.cartItemId];
              const price = Number(item.plan?.original_price) || 499;
              const strike = Number(item.plan?.strike_price) || 699;
              const title =
                item.courseDetails?.title || "Law Printed Notes & Book";

              return (
                <View key={item.cartItemId || item._id} style={styles.cartCard}>
                  <Image
                    source={isImgError ? FALLBACK_COURSE_IMAGE : { uri: imgUri }}
                    onError={() =>
                      setImageErrors((prev) => ({
                        ...prev,
                        [item.cartItemId]: true,
                      }))
                    }
                    defaultSource={FALLBACK_COURSE_IMAGE}
                    style={styles.cartThumbnail}
                    resizeMode="cover"
                  />
                  <View style={styles.cartCardBody}>
                    <Text style={styles.cartTitle} numberOfLines={2}>
                      {title}
                    </Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.priceNow}>{formatPrice(price)}</Text>
                      <Text style={styles.priceMrp}>{formatPrice(strike)}</Text>
                    </View>
                    <View style={styles.cartActions}>
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeFromCart(item.cartItemId)}
                      >
                        <Text style={styles.removeButtonText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}

            {/* Price Details */}
            <View style={styles.priceDetailsCard}>
              <Text style={styles.priceDetailsHeading}>Price Details</Text>
              <View style={styles.priceDetailsRow}>
                <Text style={styles.priceDetailsLabel}>MRP</Text>
                <Text style={styles.priceDetailsStrike}>
                  {formatPrice(totalMrp)}
                </Text>
              </View>
              <View style={styles.priceDetailsRow}>
                <Text style={styles.priceDetailsLabel}>Price</Text>
                <Text style={styles.priceDetailsValue}>
                  {formatPrice(totalPrice)}
                </Text>
              </View>
              <View style={styles.priceDetailsRow}>
                <Text style={styles.priceDetailsLabel}>Shipping Fee</Text>
                <Text style={styles.priceDetailsValue}>
                  {formatPrice(totalShipping)}
                </Text>
              </View>
              <View style={[styles.priceDetailsRow, styles.totalRow]}>
                <Text style={styles.priceDetailsLabelBold}>Total Price</Text>
                <Text style={styles.priceDetailsValueBold}>
                  {formatPrice(grandTotal)}
                </Text>
              </View>
            </View>

            {/* Terms & Conditions */}
            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setTermsAccepted((prev) => !prev)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  termsAccepted && styles.checkboxChecked,
                ]}
              >
                {termsAccepted && (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.termsLabel}>
                I accept the Terms & Conditions
              </Text>
              <TouchableOpacity
                onPress={() => setTermsExpanded((prev) => !prev)}
                hitSlop={8}
                style={{ marginLeft: "auto" }}
              >
                <Ionicons
                  name={termsExpanded ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#23408E"
                />
              </TouchableOpacity>
            </TouchableOpacity>

            {termsExpanded && (
              <View style={styles.termsBox}>
                {TERMS.map((term, index) => (
                  <Text key={index} style={styles.termsItemText}>
                    {index + 1}. {term}
                  </Text>
                ))}
              </View>
            )}

            {/* Bottom Bar / Checkout */}
            <TouchableOpacity
              style={[
                styles.checkoutButton,
                (!termsAccepted || cartItems.length === 0) &&
                  styles.checkoutButtonDisabled,
              ]}
              disabled={!termsAccepted || cartItems.length === 0}
              onPress={handlePlaceOrder}
            >
              <Text style={styles.checkoutButtonText}>
                Place Order ({formatPrice(grandTotal)})
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEEF5",
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0A1A3B",
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#E2E5F0",
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    backgroundColor: "#23408E",
  },
  tabInactive: {
    backgroundColor: "transparent",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  tabTextInactive: {
    color: "#6B7089",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  addressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    shadowColor: "#0A1A3B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  addressTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  addressDeliverTo: {
    fontSize: 13,
    color: "#0A1A3B",
    flexShrink: 1,
  },
  addressName: {
    fontWeight: "700",
  },
  addressBadge: {
    backgroundColor: "#F1E4B8",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 8,
  },
  addressBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#8A6D1F",
  },
  addressBottomRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressFull: {
    fontSize: 12,
    color: "#6B7089",
    flex: 1,
  },
  cartCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    shadowColor: "#0A1A3B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cartThumbnail: {
    width: 100,
    height: 95,
    borderRadius: 12,
    backgroundColor: "#F0F2F7",
  },
  cartCardBody: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  cartTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0A1A3B",
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  priceNow: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0A1A3B",
    marginRight: 8,
  },
  priceMrp: {
    fontSize: 13,
    color: "#8A8FA3",
    textDecorationLine: "line-through",
  },
  cartActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  removeButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E53935",
  },
  removeButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#E53935",
  },
  priceDetailsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginVertical: 14,
    shadowColor: "#0A1A3B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  priceDetailsHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0A1A3B",
    marginBottom: 12,
  },
  priceDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  priceDetailsLabel: {
    fontSize: 14,
    color: "#6B7089",
  },
  priceDetailsStrike: {
    fontSize: 14,
    color: "#8A8FA3",
    textDecorationLine: "line-through",
  },
  priceDetailsValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0A1A3B",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#E2E5F0",
    paddingTop: 10,
    marginTop: 4,
  },
  priceDetailsLabelBold: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0A1A3B",
  },
  priceDetailsValueBold: {
    fontSize: 16,
    fontWeight: "700",
    color: "#23408E",
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#23408E",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: "#23408E",
  },
  termsLabel: {
    fontSize: 13,
    color: "#0A1A3B",
    fontWeight: "500",
  },
  termsBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  termsItemText: {
    fontSize: 12,
    color: "#555",
    lineHeight: 18,
    marginBottom: 6,
  },
  checkoutButton: {
    backgroundColor: "#23408E",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#23408E",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutButtonDisabled: {
    backgroundColor: "#A0AEC0",
    shadowOpacity: 0,
    elevation: 0,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  statusText: {
    fontSize: 14,
    color: "#6B7089",
    marginTop: 10,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0A1A3B",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7089",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  exploreBtn: {
    marginTop: 20,
    backgroundColor: "#23408E",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  exploreBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});