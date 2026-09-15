import React from "react";
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
  navyLight: "#14285A",
  gold: "#D4AF37",
  bg: "#F5F6FA",
  white: "#FFFFFF",
  gray: "#8A8F98",
  lightGray: "#E5E7EB",
  blue: "#1E5FA8",
};

type ComboItem = {
  id: string;
  title: string;
  price?: number;
  type: "image" | "document";
  imageUri: string;
  route: string;
};

const COMBO_ITEMS: ComboItem[] = [
  {
    id: "1",
    title: "AP JCJ Civil Laws Notes",
    type: "image",
    imageUri:
      "https://images.unsplash.com/photo-1פֿ-law-book?w=800&q=80",
    route: "/notes/civil-laws",
  },
  {
    id: "2",
    title: "AP JCJ Prelims",
    type: "document",
    imageUri:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
    route: "/notes/prelims",
  },
  {
    id: "3",
    title: "AP JCJ Mains",
    price: 499,
    type: "document",
    imageUri:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
    route: "/notes/mains",
  },
];

export default function NotesCombo() {
  const handleExplore = (item: ComboItem) => {
  if (item.id === "1") {
    // AP JCJ Civil Laws Notes
    router.push("/notes/civil_law");
  } else {
    alert("Coming Soon");
  }
};

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Combinations</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {COMBO_ITEMS.map((item) => (
          <View key={item.id} style={styles.card}>
            <View
              style={[
                styles.imageWrapper,
                item.type === "document" && styles.documentImageWrapper,
              ]}
            >
              <Image
                source={{ uri: item.imageUri }}
                style={styles.cardImage}
                resizeMode="cover"
              />
              {item.type === "document" && (
                <View style={styles.watermarkOverlay}>
                  <Text style={styles.watermarkText}>NOTES</Text>
                </View>
              )}
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              {item.price != null && (
                <Text style={styles.cardPrice}>₹{item.price}</Text>
              )}

              <TouchableOpacity
  style={styles.exploreBtn}
  onPress={() => {
    if (item.id === "1") {
      router.push("/notes/civil_law");
    } else {
      alert("Coming Soon");
    }
  }}
  activeOpacity={0.85}
>
  <Text style={styles.exploreText}>Explore more</Text>
</TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
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
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.navy,
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  scroll: { flex: 1, paddingHorizontal: 16 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    marginTop: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  imageWrapper: {
    width: "100%",
    height: 160,
    backgroundColor: "#000",
  },
  documentImageWrapper: {
    height: 200,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  watermarkOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  watermarkText: {
    fontSize: 40,
    fontWeight: "800",
    color: "rgba(120,120,120,0.35)",
    transform: [{ rotate: "-25deg" }],
    letterSpacing: 4,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.navy,
    marginBottom: 4,
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.blue,
    marginBottom: 10,
  },
  exploreBtn: {
    backgroundColor: COLORS.navy,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 6,
  },
  exploreText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 15,
  },
});