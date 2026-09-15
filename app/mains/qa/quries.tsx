import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

interface QAItem {
  id: string;
  qa_id: string;
  title: string;
  totalQuestions: number;
  durationMins: number;
  isPurchased: boolean;
}

const QA_DATA: QAItem[] = [
  {
    id: "1",
    qa_id: "mains-qa-1",
    title: "Mains Q&A-1",
    totalQuestions: 200,
    durationMins: 150,
    isPurchased: false,
  },
  {
    id: "2",
    qa_id: "mains-qa-2",
    title: "Mains Q&A-2",
    totalQuestions: 200,
    durationMins: 150,
    isPurchased: false,
  },
  {
    id: "3",
    qa_id: "mains-qa-3",
    title: "Mains Q&A-3",
    totalQuestions: 200,
    durationMins: 150,
    isPurchased: false,
  },
];

const NAVY = "#0A1A3B";
const GOLD = "#D8AE24";

export default function MainsQAScreen() {
  const { mains_id } = useLocalSearchParams<{ mains_id?: string }>();
  const [unlockVisible, setUnlockVisible] = useState(false);

  const handleWatchNow = (item: QAItem) => {
    if (!item.isPurchased) {
      setUnlockVisible(true);
      return;
    }
    router.push({
      pathname: "/mains-qa/video", // adjust to your actual route
      params: { qa_id: item.qa_id, mains_id },
    } as any);
  };

  const handleViewPdf = (item: QAItem) => {
    if (!item.isPurchased) {
      setUnlockVisible(true);
      return;
    }
    router.push({
      pathname: "/mains-qa/pdf-viewer", // adjust to your actual route
      params: { qa_id: item.qa_id, mains_id },
    } as any);
  };

  const handleBuyNow = () => {
    setUnlockVisible(false);
    router.push({
      pathname: "/mains/checkout", // adjust to your actual route
      params: { mains_id },
    } as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDEEF5" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#111111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AP JCJ Mains Preparation Q & A</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {QA_DATA.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.previewBox}>
              <Text style={styles.previewBold}>
                (iii) The "participatory model" which emphasizes a
                constructive participation of the community in the
                mainstreaming of the erring juveniles and the minimization of
                legal intervention in their lives.
              </Text>
              <Text style={styles.previewBold}>
                Principles under the Juvenile Justice (Care and Protection of
                Children) Act 2015
              </Text>
              <Text style={styles.previewText}>
                The JJ Act has dedicated a chapter to Principles, thus
                emphasising the importance of reading the Act in the light of
                the principles while implementing the same.
              </Text>
              <Text style={styles.previewBold}>
                1 Principle of presumption of innocence:
              </Text>
              <Text style={styles.previewText}>
                Any child shall be presumed to be an innocent of any mala fide
                or criminal intent up to the age of eighteen years.
              </Text>
              <Text style={styles.watermark}>PDF</Text>
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{item.title}</Text>

              <View style={styles.badgeRow}>
                <View style={styles.quesBadge}>
                  <Ionicons name="document-text-outline" size={13} color="#7A1F2B" />
                  <Text style={styles.quesBadgeText}>{item.totalQuestions} Ques</Text>
                </View>
                <View style={styles.durationBadge}>
                  <Ionicons name="time-outline" size={13} color="#8A6A0E" />
                  <Text style={styles.durationBadgeText}>{item.durationMins} mins</Text>
                </View>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.watchBtn}
                  onPress={() => handleWatchNow(item)}
                >
                  <Text style={styles.watchBtnText}>Watch now</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.pdfBtn}
                  onPress={() => handleViewPdf(item)}
                >
                  <Text style={styles.pdfBtnText}>View Pdf</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={unlockVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setUnlockVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setUnlockVisible(false)}
            >
              <Ionicons name="close" size={22} color="#111111" />
            </TouchableOpacity>

            <Image
              source={{ uri: "https://your-cdn.com/unlock-illustration.png" }}
              style={styles.modalImage}
              resizeMode="contain"
            />

            <Text style={styles.modalTitle}>UNLOCK FULL ACCESS</Text>
            <Text style={styles.modalSubtitle}>
              To continue watching, purchase the full course
            </Text>

            <TouchableOpacity style={styles.buyBtn} onPress={handleBuyNow}>
              <Text style={styles.buyBtnText}>Buy Now</Text>
              <Ionicons name="cart" size={18} color={NAVY} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#EDEEF5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 14,
    paddingTop: 20,
  },
  backBtn: { padding: 10, marginRight: 4 },
  headerTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#111111",
    flex: 1,
    flexShrink: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  previewBox: {
    backgroundColor: "#F7F8FC",
    paddingHorizontal: 14,
    paddingVertical: 12,
    height: 160,
    overflow: "hidden",
  },
  previewBold: {
    fontSize: 9,
    fontWeight: "700",
    color: "#3A3F55",
    marginBottom: 3,
  },
  previewText: {
    fontSize: 8.5,
    color: "#6B7086",
    marginBottom: 3,
    lineHeight: 11,
  },
  watermark: {
    position: "absolute",
    alignSelf: "center",
    top: "40%",
    fontSize: 30,
    fontWeight: "700",
    color: NAVY,
    opacity: 0.1,
    letterSpacing: 4,
    transform: [{ rotate: "-20deg" }],
  },
  cardBody: { padding: 16 },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  quesBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#F6DADE",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  quesBadgeText: { color: "#7A1F2B", fontSize: 12, fontWeight: "600" },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FBEBC7",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  durationBadgeText: { color: "#8A6A0E", fontSize: 12, fontWeight: "600" },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  watchBtn: {
    flex: 1,
    backgroundColor: "#D8E3F7",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
  },
  watchBtnText: { color: NAVY, fontSize: 14, fontWeight: "700" },
  pdfBtn: {
    flex: 1,
    backgroundColor: NAVY,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
  },
  pdfBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(10, 26, 59, 0.55)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 36,
    alignItems: "center",
  },
  closeBtn: {
    alignSelf: "flex-end",
    padding: 6,
    marginBottom: 4,
  },
  modalImage: {
    width: 220,
    height: 160,
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111111",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#5A5A5A",
    textAlign: "center",
    marginBottom: 22,
    lineHeight: 20,
  },
  buyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: GOLD,
    borderRadius: 12,
    paddingVertical: 15,
    width: "100%",
  },
  buyBtnText: { color: NAVY, fontSize: 16, fontWeight: "700" },
});