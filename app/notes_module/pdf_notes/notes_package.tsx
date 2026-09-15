import React, { useState } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const COLORS = {
  navy: "#23408E",
  navyDisabled: "#A9B4D4",
  gold: "#D8AE24",
  background: "#EEF1FB",
  cardBg: "#FFFFFF",
  border: "#E7EAF2",
  textDark: "#222222",
  textBody: "#3A3F4B",
  redText: "#B23B3B",
  lineGray: "#E3E7F0",
  gray: "#8A8A8A",
  radioBorder: "#C7CEDD",
};

interface PlanOption {
  id: string;
  price: string;
  mrp: string;
  label: string;
}

const PLAN_OPTIONS: PlanOption[] = [
  { id: "1yr", price: "₹45,000", mrp: "₹90,000", label: "for 1 year" },
  { id: "2yr", price: "₹90,000", mrp: "₹1,30,000", label: "for 2 year" },
  { id: "3yr", price: "₹1,35,000", mrp: "₹1,75,000", label: "for 3 year" },
];

const CIVIL_LAWS = [
  "Code of Civil Procedure, 1908 (CPC)",
  "Indian Contract Act, 1872",
  "Transfer of Property Act, 1882 (TPA)",
  "Specific Relief Act, 1963",
  "Indian Easement Act, 1882",
  "The Limitation Act, 1963",
  "The Indian Evidence Act, 1872 (Common to both Civil and Criminal)",
  "The Hindu Marriage Act, 1955",
  "The Hindu Succession Act, 1956",
  "The Registration Act, 1908",
  "The Indian Stamp Act, 1899",
  "The Andhra Pradesh Land Encroachment Act, 1905",
  "The Civil Rules of Practice",
];

const CRIMINAL_LAWS = [
  "Code of Criminal Procedure, 1973 (CrPC)",
  "The Indian Penal Code, 1860 (IPC)",
  "The Indian Evidence Act, 1872 (Common to both Civil and Criminal)",
  "The Negotiable Instruments Act, 1881 (Relevant sections, especially Dishonour of Cheques)",
  "The Protection of Women from Domestic Violence Act, 2005",
  "The Juvenile Justice (Care and Protection of Children) Act, 2015",
  "The Andhra Pradesh Excise Act, 1968",
  "The Andhra Pradesh Gaming Act, 1974",
  "The Criminal Rules of Practice",
];

const TEST_TERMS = [
  "Are you sure you want to start the Civil Laws Mains Test?",
  "Once the test begins, you must complete it within 3 hours.",
  "After submission time, you'll get an additional 15 minutes grace period to scan your answer sheets, convert them into a PDF, and upload the file.",
  "Once started, the test cannot be paused or restarted.",
];

function NotePreviewLines() {
  const lineWidths = ["92%", "78%", "88%", "60%", "85%", "70%", "90%", "55%"];
  return (
    <View style={styles.previewLinesWrap}>
      {lineWidths.map((w, i) => (
        <View
          key={i}
          style={[
            styles.previewLine,
            { width: w as any, marginTop: i === 0 ? 0 : 8 },
          ]}
        />
      ))}
    </View>
  );
}

export default function NotesPackage() {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const mrp = "₹599";
  const price = "₹499";
  const shipping = "₹50";
  const total = "₹549";

  const handleBuyNow = () => {
    if (!termsAccepted) return;
    setShowPlanModal(true);
  };

  const handleNext = () => {
    if (!selectedPlan) return;
    setShowPlanModal(false);
    // proceed to payment / next screen with selectedPlan
    router.push("/notes_module/pdf_notes/payment" as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          AP DDJ Notes
        </Text>
        <TouchableOpacity onPress={() => router.push("/notes_module/pdf_notes/Notes")}>
          <Ionicons name="cart-outline" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Preview */}
        <View style={styles.previewBox}>
          <NotePreviewLines />
        </View>

        <Text style={styles.pageTitle}>AP Direct District Judge Notes</Text>

        <View style={styles.aboutHeadingRow}>
          <Text style={styles.aboutEmoji}>📕</Text>
          <Text style={styles.aboutHeading}>About the book</Text>
        </View>
        <Text style={styles.aboutBody}>
          The essential books for the AP Junior Civil Judge exam are the Bare
          Acts for statutory accuracy, Standard Textbooks for conceptual
          depth and case law, and dedicated Judicial Services Manuals for
          exam-specific practice.
        </Text>

        <Text style={styles.topicsHeading}>Total topics covered in this book</Text>

        <Text style={styles.groupHeading}>I. Civil Laws</Text>
        {CIVIL_LAWS.map((law, i) => (
          <View key={i} style={styles.listItemRow}>
            <Text style={styles.listItemNumber}>{i + 1}.</Text>
            <Text style={styles.listItemText}>{law}</Text>
          </View>
        ))}

        <Text style={styles.groupHeading}>II. Criminal Laws</Text>
        {CRIMINAL_LAWS.map((law, i) => (
          <View key={i} style={styles.listItemRow}>
            <Text style={styles.listItemNumber}>{i + 1}.</Text>
            <Text style={styles.listItemText}>{law}</Text>
          </View>
        ))}

        {/* Price Breakdown */}
        <View style={styles.priceCard}>
          <Text style={styles.priceCardHeading}>Price Breakdown</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>MRP</Text>
            <Text style={styles.priceValueStrike}>{mrp}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.priceValue}>{price}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Shipping Price</Text>
            <Text style={styles.priceValue}>{shipping}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabelBold}>Total Price</Text>
            <Text style={styles.priceValueBold}>{total}</Text>
          </View>

          <TouchableOpacity style={styles.couponBtn} activeOpacity={0.9}>
            <Text style={styles.couponBtnText}>Apply Coupon</Text>
          </TouchableOpacity>
        </View>

        {/* Terms & Conditions */}
        <TouchableOpacity
          style={styles.termsRow}
          activeOpacity={0.8}
          onPress={() => setTermsAccepted(!termsAccepted)}
        >
          <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
            {termsAccepted && <Ionicons name="checkmark" size={14} color="#fff" />}
          </View>
          <Text style={styles.termsText}>I accept Terms & Conditions</Text>
          <Ionicons
            name={termsAccepted ? "chevron-up" : "chevron-down"}
            size={18}
            color={COLORS.redText}
            style={{ marginLeft: "auto" }}
          />
        </TouchableOpacity>

        {termsAccepted && (
          <View style={styles.expandedTerms}>
            {TEST_TERMS.map((term, i) => (
              <View key={i} style={styles.listItemRow}>
                <Text style={styles.listItemNumber}>{i + 1}.</Text>
                <Text style={styles.listItemText}>{term}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Buy Now */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.buyBtn,
            !termsAccepted && styles.buyBtnDisabled,
          ]}
          activeOpacity={termsAccepted ? 0.9 : 1}
          disabled={!termsAccepted}
          onPress={handleBuyNow}
        >
          <Text style={styles.buyBtnText}>Buy Now</Text>
        </TouchableOpacity>
      </View>

      {/* Choose Plan Modal */}
      <Modal
        visible={showPlanModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPlanModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowPlanModal(false)}
          />
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Choose your plan</Text>

            {PLAN_OPTIONS.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              return (
                <TouchableOpacity
                  key={plan.id}
                  style={[
                    styles.planRow,
                    isSelected && styles.planRowSelected,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedPlan(plan.id)}
                >
                  <View style={styles.radioOuter}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                  <View style={styles.planPriceWrap}>
                    <Text style={styles.planPrice}>{plan.price}</Text>
                    <Text style={styles.planMrp}>{plan.mrp}</Text>
                  </View>
                  <Text style={styles.planLabel}>{plan.label}</Text>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={[
                styles.nextBtn,
                !selectedPlan && styles.buyBtnDisabled,
              ]}
              activeOpacity={selectedPlan ? 0.9 : 1}
              disabled={!selectedPlan}
              onPress={handleNext}
            >
              <Text style={styles.buyBtnText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: { width: 36, height: 36, justifyContent: "center" },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 30 },
  previewBox: {
    height: 150,
    borderRadius: 12,
    backgroundColor: "#FAFBFD",
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    justifyContent: "center",
    marginBottom: 16,
  },
  previewLinesWrap: { width: "100%" },
  previewLine: { height: 7, borderRadius: 4, backgroundColor: COLORS.lineGray },
  pageTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 14,
  },
  aboutHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  aboutEmoji: { fontSize: 16, marginRight: 6 },
  aboutHeading: { fontSize: 16, fontWeight: "700", color: COLORS.textDark },
  aboutBody: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.textBody,
    marginBottom: 18,
  },
  topicsHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 10,
  },
  groupHeading: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.navy,
    marginTop: 10,
    marginBottom: 8,
  },
  listItemRow: {
    flexDirection: "row",
    marginBottom: 8,
    paddingRight: 4,
  },
  listItemNumber: {
    fontSize: 14,
    color: COLORS.textBody,
    width: 24,
  },
  listItemText: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textBody,
    flex: 1,
  },
  priceCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    marginTop: 20,
  },
  priceCardHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  priceLabel: { fontSize: 14, color: COLORS.textBody },
  priceLabelBold: { fontSize: 15, fontWeight: "700", color: COLORS.textDark },
  priceValue: { fontSize: 14, fontWeight: "600", color: COLORS.textDark },
  priceValueStrike: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.gray,
    textDecorationLine: "line-through",
  },
  priceValueBold: { fontSize: 15, fontWeight: "800", color: COLORS.textDark },
  couponBtn: {
    backgroundColor: COLORS.navy,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 6,
  },
  couponBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.redText,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: COLORS.redText,
    borderColor: COLORS.redText,
  },
  termsText: { fontSize: 14, fontWeight: "700", color: COLORS.redText },
  expandedTerms: {
    marginTop: 12,
    paddingLeft: 4,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: COLORS.cardBg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  buyBtn: {
    backgroundColor: COLORS.navy,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  buyBtnDisabled: {
    backgroundColor: COLORS.navyDisabled,
  },
  buyBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalSheet: {
    backgroundColor: COLORS.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 30,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.lineGray,
    alignSelf: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 16,
  },
  planRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.radioBorder,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  planRowSelected: {
    borderColor: COLORS.navy,
    backgroundColor: "#F3F6FD",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.navy,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.navy,
  },
  planPriceWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  planPrice: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  planMrp: {
    fontSize: 13,
    color: COLORS.gray,
    textDecorationLine: "line-through",
  },
  planLabel: {
    marginLeft: "auto",
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.gold,
  },
  nextBtn: {
    backgroundColor: COLORS.navy,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
});