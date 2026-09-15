import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  navy: "#0A1F44",
  navyLight: "#1B3A6B",
  gold: "#D4AF37",
  goldLight: "#F0D98C",
  bg: "#F5F6FA",
  white: "#FFFFFF",
  gray: "#8A8F98",
  lightGray: "#E5E7EB",
  green: "#2E7D32",
  blue: "#1E5FA8",
};

const INCLUDED = [
  {
    id: "1",
    heading: "AP JCJ Civil",
    items: ["Civil Procedure Code (CPC)", "Indian Evidence Act"],
  },
  {
    id: "2",
    heading: "AP JCJ Criminal",
    items: ["Criminal Procedure Code (CrPC)", "Negotiable Instruments Act (NI Act)"],
  },
];

const HIGHLIGHTS = [
  "Separate classes for Civil & Criminal Laws",
  "Covers Prelims and Mains",
  "Comprehensive notes provided",
  "Expert guidance for complete exam preparation",
];

const FEATURE_CARDS = [
  { id: "1", icon: "play-circle", value: "390", label: "Videos", tint: "#FDF3D9" },
  { id: "2", icon: "help-circle", value: "Doubt", label: "Solving", tint: "#E3ECFA" },
  { id: "3", icon: "checkmark-circle", value: "Available", label: "on PC", tint: "#E4F5E6" },
];

export default function Buy() {
  const [accepted, setAccepted] = useState(false);

  const course = {
    title: "Andhra Pradesh JCJ Civil & Criminal",
    heading: "Combo of AP Civil & Criminal",
    price: 45000,
    mrp: 90000,
    discount: 40,
    image:
      "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=800&q=80",
    description:
      "Boost your exam preparation with our comprehensive AP JCJ Civil & Criminal Combo Course, thoughtfully designed to cover all essential subjects in one powerful package.",
    materialsCount: "100+ Learning Materials",
    materialsSub: "250 files, 200 Video, 500 Tests",
  };

 const handleAddToCart = () => {
  console.log("Added to cart");
};
  const handleBuyNow = () => {
  if (!accepted) return;

  router.push("/paymentgateways/razorpay");
};

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {course.heading}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Course Image */}
        <Image source={{ uri: course.image }} style={styles.courseImage} />

        {/* Title & Price */}
        <View style={styles.section}>
          <Text style={styles.courseTitle}>{course.title}</Text>

          <View style={styles.priceRow}>
            <View style={styles.priceLeft}>
              <Text style={styles.price}>₹{course.price.toLocaleString("en-IN")}</Text>
              <Text style={styles.mrp}>₹{course.mrp.toLocaleString("en-IN")}</Text>
            </View>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{course.discount}% off</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the course</Text>
          <Text style={styles.description}>{course.description}</Text>

          <Text style={styles.includedLabel}>What's Included:</Text>
          {INCLUDED.map((group) => (
            <View key={group.id} style={{ marginBottom: 8 }}>
              <View style={styles.groupHeadingRow}>
                <View style={styles.diamondBullet} />
                <Text style={styles.groupHeading}>{group.heading}</Text>
              </View>
              {group.items.map((item, idx) => (
                <Text key={idx} style={styles.subItem}>
                  •  {item}
                </Text>
              ))}
            </View>
          ))}
        </View>

        {/* Learning Materials */}
        <View style={styles.materialsRow}>
          <View style={styles.playCircle}>
            <Ionicons name="play" size={18} color={COLORS.white} />
          </View>
          <View>
            <Text style={styles.materialsCount}>{course.materialsCount}</Text>
            <Text style={styles.materialsSub}>{course.materialsSub}</Text>
          </View>
        </View>

        {/* Highlights */}
        <View style={styles.section}>
          {HIGHLIGHTS.map((h, idx) => (
            <Text key={idx} style={styles.highlightItem}>
              •  {h}
            </Text>
          ))}
        </View>

        {/* Feature Cards */}
        <View style={styles.featureRow}>
          {FEATURE_CARDS.map((card) => (
            <View key={card.id} style={[styles.featureCard, { backgroundColor: card.tint }]}>
              <Ionicons
                name={card.icon as any}
                size={22}
                color={COLORS.navy}
                style={{ marginBottom: 8 }}
              />
              <Text style={styles.featureValue}>{card.value}</Text>
              <Text style={styles.featureLabel}>{card.label}</Text>
            </View>
          ))}
        </View>

        {/* CTA line */}
        <Text style={styles.ctaLine}>
          Start your journey to becoming a Junior Civil Judge in Andhra Pradesh
          with the right guidance and resources!
        </Text>

        {/* Terms */}
        <TouchableOpacity
          style={styles.termsRow}
          onPress={() => setAccepted(!accepted)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, accepted && styles.checkboxChecked]}>
            {accepted && <Ionicons name="checkmark" size={14} color={COLORS.white} />}
          </View>
          <Text style={styles.termsText}>I accept Terms & Conditions</Text>
          <Ionicons
            name="chevron-down"
            size={18}
            color={COLORS.gray}
            style={{ marginLeft: "auto" }}
          />
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buyNowBtn, !accepted && styles.buyNowDisabled]}
          onPress={handleBuyNow}
          disabled={!accepted}
        >
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: COLORS.bg,
  },
  backBtn: { padding: 4 },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.navy,
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  scroll: { flex: 1 },
  courseImage: {
    width: "100%",
    height: 190,
    borderRadius: 16,
    marginTop: 4,
  },
  section: { paddingHorizontal: 16, marginTop: 16 },
  courseTitle: { fontSize: 19, fontWeight: "700", color: COLORS.navy },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  priceLeft: { flexDirection: "row", alignItems: "baseline", gap: 8 },
  price: { fontSize: 20, fontWeight: "700", color: COLORS.blue },
  mrp: {
    fontSize: 14,
    color: COLORS.gray,
    textDecorationLine: "line-through",
  },
  discountBadge: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  discountText: { color: COLORS.white, fontWeight: "700", fontSize: 13 },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginTop: 16,
    marginHorizontal: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: COLORS.navy, marginBottom: 8 },
  description: { fontSize: 14, color: COLORS.gray, lineHeight: 20 },
  includedLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.navy,
    marginTop: 14,
    marginBottom: 6,
  },
  groupHeadingRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 2 },
  diamondBullet: {
    width: 7,
    height: 7,
    backgroundColor: COLORS.blue,
    transform: [{ rotate: "45deg" }],
  },
  groupHeading: { fontSize: 14.5, fontWeight: "600", color: COLORS.navy },
  subItem: { fontSize: 13.5, color: COLORS.gray, marginLeft: 18, marginTop: 2 },
  materialsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 18,
  },
  playCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.navy,
    alignItems: "center",
    justifyContent: "center",
  },
  materialsCount: { fontSize: 15, fontWeight: "700", color: COLORS.navy },
  materialsSub: { fontSize: 12.5, color: COLORS.gray, marginTop: 2 },
  highlightItem: { fontSize: 13.5, color: COLORS.gray, marginTop: 6, lineHeight: 19 },
  featureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 18,
    gap: 10,
  },
  featureCard: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  featureValue: { fontSize: 14, fontWeight: "700", color: COLORS.navy },
  featureLabel: { fontSize: 12, color: COLORS.gray, marginTop: 1 },
  ctaLine: {
    fontSize: 13.5,
    color: COLORS.navy,
    fontWeight: "500",
    paddingHorizontal: 16,
    marginTop: 20,
    lineHeight: 20,
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.gray,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: COLORS.blue,
    borderColor: COLORS.blue,
  },
  termsText: { fontSize: 13.5, color: COLORS.blue, fontWeight: "600" },
  bottomBar: {
  flexDirection: "row",
  paddingHorizontal: 16,
  paddingVertical: 14,
  backgroundColor: "#fff",
  borderTopWidth: 1,
  borderTopColor: "#E5E7EB",
},

addToCartBtn: {
  flex: 1,
  height: 50,
  backgroundColor: "#0A1F44",
  borderRadius: 10,
  justifyContent: "center",
  alignItems: "center",
},

addToCartText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "600",
},

buyNowBtn: {
  flex: 1,
  height: 50,
  backgroundColor: "#D4AF37",
  borderRadius: 10,
  justifyContent: "center",
  alignItems: "center",
},

buyNowDisabled: {
  opacity: 0.5,
},

buyNowText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "600",
},

});