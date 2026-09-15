import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface CartCourse {
  id: string;
  title: string;
  thumbnail: string;
  price: number;
  mrp: number;
}

interface AddOnCourse {
  id: string;
  thumbnail: string;
  selected: boolean;
}

const CART_COURSES: CartCourse[] = [
  {
    id: "1",
    title: "Andhra Pradesh JCJ Course",
    thumbnail: "https://via.placeholder.com/120x100",
    price: 45000,
    mrp: 90000,
  },
  {
    id: "2",
    title: "Telangana JCJ Course",
    thumbnail: "https://via.placeholder.com/120x100",
    price: 45000,
    mrp: 90000,
  },
  {
    id: "3",
    title: "Telangana JCJ Course",
    thumbnail: "https://via.placeholder.com/120x100",
    price: 45000,
    mrp: 90000,
  },
];

const ADD_ON_COURSES: AddOnCourse[] = [
  { id: "1", thumbnail: "https://via.placeholder.com/60x50", selected: true },
  { id: "2", thumbnail: "https://via.placeholder.com/60x50", selected: true },
];

const TERMS = [
  "Are you sure you want to start the Civil Laws Mains Test?",
  "Once the test begins, you must complete it within 3 hours.",
  "After submission time, you'll get an additional 15 minutes grace period to scan your answer sheets, convert them into a PDF, and upload the file.",
  "Once started, the test cannot be paused or restarted.",
];

const DELIVERY_ADDRESS = {
  name: "Allu Krishna...",
  pincode: "533002",
  label: "Home",
  fullAddress: "Visakhapatnam, Andharapradesh",
};

const MRP = 599;
const PRICE = 499;
const SHIPPING = 50;
const TOTAL = 549;
const GRAND_TOTAL = 90053;

export default function WishAcess() {
  const [activeTab, setActiveTab] = useState<"courses" | "books">("books");
  const [cartCourses, setCartCourses] = useState(CART_COURSES);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleRemove = (id: string) => {
    setCartCourses((prev) => prev.filter((course) => course.id !== id));
  };

  const formatPrice = (value: number) => `₹${value.toLocaleString("en-IN")}`;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDEEF5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
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
          onPress={() => setActiveTab("courses")}
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
        {/* Delivery Address (Printed Books only) */}
        {activeTab === "books" && (
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
              <TouchableOpacity
                style={styles.changeButton}
                onPress={() => router.push("/sidepanel/wish_cart/wish_buy")}
              >
                <Text style={styles.changeButtonText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Cart Items */}
        {cartCourses.map((course) => (
          <View key={course.id} style={styles.cartCard}>
            <Image
              source={{ uri: course.thumbnail }}
              style={styles.cartThumbnail}
              resizeMode="cover"
            />
            <View style={styles.cartCardBody}>
              <Text style={styles.cartTitle} numberOfLines={2}>
                {course.title}
              </Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceNow}>{formatPrice(course.price)}</Text>
                <Text style={styles.priceMrp}>{formatPrice(course.mrp)}</Text>
              </View>
              <View style={styles.cartActions}>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemove(course.id)}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buyNowSmallButton}
                  onPress={() => router.push("/sidepanel/wish_cart/wish_buy")}
                >
                  <Text style={styles.buyNowSmallText}>Buy Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* Buy More & Save More */}
        <Text style={styles.sectionHeading}>Buy More & Save More</Text>
        <View style={styles.saveMoreCard}>
          <View style={styles.saveMoreBanner}>
            <Ionicons name="pricetag" size={16} color="#16A34A" />
            <Text style={styles.saveMoreBannerText}>
              Add 1 more course(s) to get extra 5% off
            </Text>
          </View>
          <View style={styles.addOnRow}>
            <TouchableOpacity style={styles.addOnAddButton}>
              <Ionicons name="add-circle-outline" size={20} color="#23408E" />
              <Text style={styles.addOnAddText}>Add</Text>
            </TouchableOpacity>
            {ADD_ON_COURSES.map((course) => (
              <React.Fragment key={course.id}>
                <Text style={styles.plusSign}>+</Text>
                <View style={styles.addOnThumbnailWrap}>
                  <Image
                    source={{ uri: course.thumbnail }}
                    style={styles.addOnThumbnail}
                    resizeMode="cover"
                  />
                  {course.selected && (
                    <View style={styles.checkBadge}>
                      <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                    </View>
                  )}
                </View>
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Price Details */}
        <View style={styles.priceDetailsCard}>
          <Text style={styles.priceDetailsHeading}>Price Details</Text>
          <View style={styles.priceDetailsRow}>
            <Text style={styles.priceDetailsLabel}>MRP</Text>
            <Text style={styles.priceDetailsStrike}>{formatPrice(MRP)}</Text>
          </View>
          <View style={styles.priceDetailsRow}>
            <Text style={styles.priceDetailsLabel}>Price</Text>
            <Text style={styles.priceDetailsValue}>{formatPrice(PRICE)}</Text>
          </View>
          <View style={styles.priceDetailsRow}>
            <Text style={styles.priceDetailsLabel}>Shipping Price</Text>
            <Text style={styles.priceDetailsValue}>
              {formatPrice(SHIPPING)}
            </Text>
          </View>
          <View style={styles.priceDetailsRow}>
            <Text style={styles.priceDetailsLabelBold}>Total Price</Text>
            <Text style={styles.priceDetailsValueBold}>
              {formatPrice(TOTAL)}
            </Text>
          </View>
          <TouchableOpacity style={styles.couponButton}>
            <Text style={styles.couponButtonText}>Apply Coupon</Text>
          </TouchableOpacity>
        </View>

        {/* Terms & Conditions */}
        <TouchableOpacity
          style={styles.termsRow}
          onPress={() => setTermsAccepted((prev) => !prev)}
          activeOpacity={0.7}
        >
          <View
            style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}
          >
            {termsAccepted && (
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
            )}
          </View>
          <Text style={styles.termsText}>I accept Terms & Conditions</Text>
          <Ionicons
            name={termsAccepted ? "chevron-up" : "chevron-down"}
            size={18}
            color="#7A1F2B"
            style={styles.termsChevron}
          />
        </TouchableOpacity>

        {termsAccepted && (
          <View style={styles.termsList}>
            {TERMS.map((term, index) => (
              <View key={index} style={styles.termsItem}>
                <Text style={styles.termsItemNumber}>{index + 1}.</Text>
                <Text style={styles.termsItemText}>{term}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomTotal}>{formatPrice(GRAND_TOTAL)}</Text>
          <TouchableOpacity style={styles.viewDetailsRow}>
            <Text style={styles.viewDetailsText}>View Details</Text>
            <Ionicons name="chevron-up" size={14} color="#6B7089" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[
            styles.buyNowLargeButton,
            !termsAccepted && styles.buyNowLargeButtonDisabled,
          ]}
          disabled={!termsAccepted}
          onPress={() =>
            router.push("/sidepanel/wish_cart/wish_buy")
          }
        >
          <Text style={styles.buyNowLargeText}>
            {activeTab === "books" ? "Place Order" : "Buy Now"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEEF5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#0A1A3B",
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginHorizontal: 20,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#0A1A3B",
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
    color: "#23408E",
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  addressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
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
    justifyContent: "space-between",
  },
  addressFull: {
    fontSize: 12,
    color: "#6B7089",
    flex: 1,
  },
  changeButton: {
    borderWidth: 1,
    borderColor: "#23408E",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginLeft: 8,
  },
  changeButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#23408E",
  },
  cartCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    shadowColor: "#0A1A3B",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cartThumbnail: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "#DCE0F0",
  },
  cartCardBody: {
    flex: 1,
    justifyContent: "space-between",
  },
  cartTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0A1A3B",
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  priceNow: {
    fontSize: 15,
    fontWeight: "700",
    color: "#4B2E83",
    marginRight: 8,
  },
  priceMrp: {
    fontSize: 13,
    color: "#8A8FA3",
    textDecorationLine: "line-through",
  },
  cartActions: {
    flexDirection: "row",
  },
  removeButton: {
    backgroundColor: "#F1E4B8",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
  },
  removeButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8A6D1F",
  },
  buyNowSmallButton: {
    backgroundColor: "#C9A227",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  buyNowSmallText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0A1A3B",
    marginTop: 4,
    marginBottom: 12,
  },
  saveMoreCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  saveMoreBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAF7EE",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  saveMoreBannerText: {
    fontSize: 12.5,
    color: "#16803C",
    fontWeight: "600",
    marginLeft: 8,
  },
  addOnRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  addOnAddButton: {
    width: 56,
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#23408E",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  addOnAddText: {
    fontSize: 10,
    color: "#23408E",
    fontWeight: "600",
    marginTop: 2,
  },
  plusSign: {
    fontSize: 16,
    color: "#8A8FA3",
    marginHorizontal: 10,
  },
  addOnThumbnailWrap: {
    position: "relative",
  },
  addOnThumbnail: {
    width: 56,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#DCE0F0",
  },
  checkBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#16A34A",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  priceDetailsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  priceDetailsHeading: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0A1A3B",
    marginBottom: 12,
  },
  priceDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  priceDetailsLabel: {
    fontSize: 13,
    color: "#6B7089",
  },
  priceDetailsValue: {
    fontSize: 13,
    color: "#0A1A3B",
    fontWeight: "600",
  },
  priceDetailsStrike: {
    fontSize: 13,
    color: "#8A8FA3",
    textDecorationLine: "line-through",
  },
  priceDetailsLabelBold: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0A1A3B",
  },
  priceDetailsValueBold: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0A1A3B",
  },
  couponButton: {
    backgroundColor: "#0A1A3B",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
  },
  couponButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#7A1F2B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: "#7A1F2B",
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#7A1F2B",
  },
  termsChevron: {
    marginLeft: 8,
  },
  termsList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  termsItem: {
    flexDirection: "row",
    marginBottom: 10,
  },
  termsItemNumber: {
    fontSize: 12.5,
    color: "#0A1A3B",
    fontWeight: "600",
    marginRight: 6,
  },
  termsItemText: {
    flex: 1,
    fontSize: 12.5,
    color: "#3A3F55",
    lineHeight: 18,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#0A1A3B",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
  },
  bottomTotal: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0A1A3B",
  },
  viewDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  viewDetailsText: {
    fontSize: 12,
    color: "#6B7089",
    marginRight: 4,
  },
  buyNowLargeButton: {
    backgroundColor: "#C9A227",
    borderRadius: 12,
    paddingHorizontal: 36,
    paddingVertical: 14,
  },
  buyNowLargeButtonDisabled: {
    backgroundColor: "#E8DBAE",
  },
  buyNowLargeText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});