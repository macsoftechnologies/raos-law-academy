import React, { useState, useEffect } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";

interface SubCategoryDetails {
  _id: string;
  subcategory_id: string;
  presentation_image: string;
  title: string;
  about_course: string;
  terms_conditions: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface SubCategoryDetailsResponse {
  statusCode: number;
  message: string;
  data: SubCategoryDetails;
}










const PLANS = [
  { id: "1y", price: 45000, original: 90000, label: "for 1 year" },
  { id: "2y", price: 90000, original: 130000, label: "for 2 year" },
  { id: "3y", price: 135000, original: 175000, label: "for 3 year" },
];

const TERMS = [
  "Are you sure you want to start the Civil Laws Mains Test?",
  "Once the test begins, you must complete it within 3 hours.",
  "After submission time, you'll get an additional 15 minutes grace period to scan your answer sheets, convert them into a PDF, and upload the file.",
  "Once started, the test cannot be paused or restarted.",
];

export default function Coursepackage() {

  const { sub_categoryId } = useLocalSearchParams<{ sub_categoryId: string }>();

  

  const [coursepackage, setCoursepackage] = useState<SubCategoryDetails[]>([]);


  //  useEffect(() => {
  //   if (!sub_categoryId) return;

  //   const fetchUsercourselist = async () => {
  //     try {
  //       const response = await axios.post<SubCategoryDetails>(
  //         `https://api.raoslawacademy.com/subcategories/getbycategory`, 
  //         {
  //              "subcategory_id": "37634c0a-1deb-4cee-aaa9-888f60af09c9"
  //         }
  //       );
  //       if (response.data?.statusCode === 200) {
  //         setCoursepackage(response.data.data);
  //       }
  //     } catch (error: any) {
  //       console.log("User API Error:", error?.response?.data || error.message);
  //     }
  //   };
  //   fetchUsercourselist();
  // }, [sub_categoryId]);



  const [termsExpanded, setTermsExpanded] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [planModalVisible, setPlanModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(PLANS[0].id);

  const [payModalVisible, setPayModalVisible] = useState(false);
  const [couponInput, setCouponInput] = useState("");

  const plan = PLANS.find((p) => p.id === selectedPlan)!;
  console.log(plan+"plan details");
  
  const handlingFee = 53;
  const total = plan.price + handlingFee;

  const openBuyFlow = () => {
    if (!termsAccepted) return;
    setPlanModalVisible(true);
  };

  const confirmPlan = () => {
    setPlanModalVisible(false);
    setPayModalVisible(true);
  };


  const handlePayOnline = () => {
  console.log("Price:", plan.price);
  console.log("Internet Handling Fee:", handlingFee);
  console.log("Total:", total);

  router.push({
    pathname: "/paymentgateways/razorpay",
    params: {
      price: plan.price,
      handlingFee: handlingFee,
      total: total,
    },
  });
};

  return (
    <SafeAreaView style={styles.safe}>


      <StatusBar barStyle="dark-content" />


      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Andhra Pradesh JCJ Course</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9",
          }}
          style={styles.banner}
        />

        <View style={styles.content}>
          <Text style={styles.courseTitle}>Andhra Pradesh Junior Civil Judge Course</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>₹45,000</Text>
            <Text style={styles.strike}>₹90,000</Text>
            <View style={styles.offBadge}>
              <Text style={styles.offText}>40% off</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>About the course</Text>
          <Text style={styles.description}>
            Prepare effectively for the AP Junior Civil Judge Exam (Prelims & Mains)
            with our comprehensive course designed by expert faculty. The course
            offers separate classes for Civil Laws and Criminal Laws, ensuring clear
            understanding and focused learning.
          </Text>

          <View style={styles.materialsRow}>
            <View style={styles.playCircle}>
              <Ionicons name="play" size={16} color="#fff" />
            </View>
            <View>
              <Text style={styles.materialsTitle}>100+ Learning Materials</Text>
              <Text style={styles.materialsSub}>250 files, 200 Video, 500 Tests</Text>
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
            Start your journey to becoming a Junior Civil Judge in Andhra Pradesh
            with the right guidance and resources!
          </Text>

          {/* Terms */}
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
              {TERMS.map((t, i) => (
                <View style={styles.termRow} key={i}>
                  <Text style={styles.termIndex}>{i + 1}.</Text>
                  <Text style={styles.termText}>{t}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.cartBtn}>
          <Text style={styles.cartBtnText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buyBtn, !termsAccepted && styles.buyBtnDisabled]}
          disabled={!termsAccepted}
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
          {PLANS.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={styles.planRow}
              onPress={() => setSelectedPlan(p.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.radio, selectedPlan === p.id && styles.radioSelected]}>
                {selectedPlan === p.id && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.planPrice}>₹{p.price.toLocaleString("en-IN")}</Text>
              <Text style={styles.planOriginal}>₹{p.original.toLocaleString("en-IN")}</Text>
              <Text style={styles.planLabel}>{p.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.nextBtn} onPress={confirmPlan}>
            <Text style={styles.nextBtnText}>Next</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Payment / coupon modal */}
      <Modal visible={payModalVisible} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setPayModalVisible(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Andhra Pradesh Junior Civil Judge Course</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Price</Text>
            <Text style={styles.summaryValue}>₹{plan.price.toLocaleString("en-IN")}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Internet Handling Fee</Text>
            <Text style={styles.summaryValue}>₹{handlingFee}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { fontWeight: "700" }]}>Total</Text>
            <Text style={[styles.summaryValue, { fontWeight: "700" }]}>
              ₹{total.toLocaleString("en-IN")}
            </Text>
          </View>

          <TouchableOpacity style={styles.couponBtn}>
            <Text style={styles.couponBtnText}>Apply Coupon</Text>
          </TouchableOpacity>

          <View style={styles.couponInputRow}>
            <Text style={styles.couponPlaceholder}>
              {couponInput || "Discount Coupon"}
            </Text>
            <TouchableOpacity onPress={() => setCouponInput("")}>
              <Text style={styles.applyLink}>Apply</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.payBtn}  onPress={handlePayOnline}>
            <Text style={styles.payBtnText}>Pay Online</Text>
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
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111",paddingTop: 40},

  banner: { width: "100%", height: 180 },

  content: { paddingHorizontal: 16, paddingTop: 16 },

  courseTitle: { fontSize: 20, fontWeight: "700", color: "#111" },

  priceRow: { flexDirection: "row", alignItems: "center", marginTop: 8, gap: 8 },
  price: { fontSize: 20, fontWeight: "700", color: NAVY },
  strike: { fontSize: 15, color: "#888", textDecorationLine: "line-through" },
  offBadge: {
    marginLeft: "auto",
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
  },
  cartBtnText: { color: NAVY, fontWeight: "700", fontSize: 14 },
  buyBtn: {
    flex: 1,
    backgroundColor: NAVY,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
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

  couponBtn: {
    backgroundColor: NAVY,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 12,
  },
  couponBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },

  couponInputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d8dce6",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 10,
  },
  couponPlaceholder: { flex: 1, fontSize: 13.5, color: "#999" },
  applyLink: { fontSize: 13.5, color: "#666", fontWeight: "600" },

  payBtn: {
    backgroundColor: NAVY,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  payBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});