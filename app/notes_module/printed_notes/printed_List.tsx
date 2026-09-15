import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

interface NotesPlan {
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

interface AboutBookSection {
  title: string;
  topics: string[];
}

interface AboutBook {
  description: string;
  sections: AboutBookSection[];
}

interface PrintedNoteItem {
  _id: string;
  notes_id: string;
  title: string;
  sub_title: string;
  about_book: AboutBook;
  presentation_image: string;
  isPrintAvail: boolean;
  printNotes_image: string;
  subcategory_id: string;
  availablePlans: NotesPlan[];
}

interface PrintedNotesResponse {
  statusCode: number;
  message: string;
  data: PrintedNoteItem[];
}

const COLORS = {
  navy: "#23408E",
  gold: "#D8AE24",
  lightBlue: "#DCE6FB",
  background: "#EEF1FB",
  cardBg: "#FFFFFF",
  border: "#E7EAF2",
  textDark: "#222222",
  gray: "#8A8A8A",
  green: "#3C8A4C",
  redStrike: "#B23B3B",
};

interface BestSeller {
  id: string;
  title: string;
  price: string;
  mrp: string;
  discount: string;
  coverImage?: any; // require('...')
  route: string;
}

interface PrintedNote {
  id: string;
  title: string;
  price: string;
  coverImage?: any; // require('...')
  route: string;
}

const BEST_SELLERS: BestSeller[] = [
  {
    id: "1",
    title: "Andhra Pradesh Junior Civil Judge Notes",
    price: "₹499",
    coverImage: require("../../../assets/images/notes60.png"),
    mrp: "₹599",
    discount: "16% off",
    route: "/notes/ap-jcj",
  },
  {
    id: "2",
    title: "Andhra Pradesh Civil Judge Notes",
    price: "₹499",
    mrp: "₹599",
    coverImage: require("../../../assets/images/notes60.png"),
    discount: "16% off",
    route: "/notes/ap-ddj",
  },
];

const PRINTED_NOTES: PrintedNote[] = [
  { id: "1", title: "AP JCJ Notes", price: "₹499",   coverImage: require("../../../assets/images/notes1.png"), route: "/notes/ap-jcj" },
  { id: "2", title: "AP DDJ Notes", price: "₹499",   coverImage: require("../../../assets/images/notes1.png"),route: "/notes/ap-ddj" },
  { id: "3", title: "TS JCJ Notes", price: "₹499",   coverImage: require("../../../assets/images/notes33.png"),route: "/notes/ts-jcj" },
  { id: "4", title: "TS DDJ Notes", price: "₹499",   coverImage: require("../../../assets/images/notes61.png"),route: "/notes/ts-ddj" },
];

function BestSellerCard({ item }: { item: BestSeller }) {
  return (
    <TouchableOpacity
      style={styles.bestSellerCard}
      activeOpacity={0.9}
      onPress={() => router.push(item.route as any)}
    >
      <View style={styles.bestSellerCover}>
        {item.coverImage ? (
          <Image
            source={item.coverImage}
            style={styles.bestSellerCoverImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.coverPlaceholder}>
            <MaterialCommunityIcons name="book-open-page-variant" size={26} color="#fff" />
          </View>
        )}
      </View>
      <View style={styles.bestSellerInfo}>
        <Text style={styles.bestSellerTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.bestSellerPriceRow}>
          <Text style={styles.bestSellerPrice}>{item.price}</Text>
          <Text style={styles.bestSellerMrp}>{item.mrp}</Text>
          <Text style={styles.bestSellerDiscount}>({item.discount})</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function PrintedNoteCard({ item }: { item: PrintedNote }) {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.coverBox}
        activeOpacity={0.9}
        onPress={() => router.push(item.route as any)}
      >
        {item.coverImage ? (
          <Image
            source={item.coverImage}
            style={styles.coverImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.coverPlaceholderLarge}>
            <MaterialCommunityIcons name="book-open-page-variant" size={40} color="#fff" />
            <Text style={styles.coverPlaceholderText}>{item.title}</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.cardFooter}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardPrice}>{item.price}</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.addToCartBtn} activeOpacity={0.9}>
            <Text style={styles.addToCartText}>Add to cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buyBtn}
            activeOpacity={0.9}
            onPress={() => router.push("/notes_module/printed_notes/printed_package")}
          >
            <Text style={styles.buyBtnText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const bottomTabs = [
  { label: "Home", icon: "home", type: "Ionicons", route: "/dashboard" },
  { label: "Notes", icon: "note-edit-outline", type: "MaterialCommunityIcons", route: "/notes_module" },
  { label: "Prelims", icon: "clipboard-text-outline", type: "MaterialCommunityIcons", route: "/prelims" },
  { label: "Mains", icon: "book-open-variant", type: "MaterialCommunityIcons", route: "/mains" },
  { label: "Chat", icon: "chatbubble-outline", type: "Ionicons", route: "/chat" },
];

export default function PrintedList() {
  const { userId } = useLocalSearchParams<{ userId: string }>();

console.log("Printed Notes userId:", userId);
  const [activeTab, setActiveTab] = React.useState("Notes");

  const renderTabIcon = (tab: any, isActive: boolean) => {
    const color = isActive ? COLORS.navy : "#fff";
    const size = isActive ? 24 : 21;
    if (tab.type === "Ionicons") {
      return <Ionicons name={tab.icon} size={size} color={color} />;
    }
    return <MaterialCommunityIcons name={tab.icon} size={size} color={color} />;
  };

  const handleTabPress = (tab: any) => {
    setActiveTab(tab.label);
    router.push(tab.route);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>PrintedNotes</Text>
          <TouchableOpacity onPress={() => router.push("/notes_module/pdf_notes/Notes")}>
            <Ionicons name="cart-outline" size={26} color={COLORS.textDark} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={PRINTED_NOTES}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PrintedNoteCard item={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.bestSellerSection}>
              <View style={styles.bestSellerHeadingRow}>
                <View style={styles.bestSellerBar} />
                <Text style={styles.bestSellerHeading}>Best Seller</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.bestSellerScroll}
              >
                {BEST_SELLERS.map((item) => (
                  <BestSellerCard key={item.id} item={item} />
                ))}
              </ScrollView>
            </View>
          }
        />

        {/* Bottom Navigation */}
        <View style={styles.bottomBar}>
          {bottomTabs.map((tab, index) => {
            const isActive = activeTab === tab.label;
            return (
              <TouchableOpacity
                key={index}
                style={isActive ? styles.activeTabWrap : styles.tabWrap}
                onPress={() => handleTabPress(tab)}
                activeOpacity={0.8}
              >
                <View style={isActive ? styles.activeTab : styles.inactiveTab}>
                  {renderTabIcon(tab, isActive)}
                </View>
                <Text style={isActive ? styles.activeTabLabel : styles.tabLabel}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 15,
  },
  backBtn: { width: 32, height: 32, justifyContent: "center" },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textDark,
    flex: 1,
    marginLeft: 4,
    
  },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },

  // Best seller section
  bestSellerSection: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bestSellerHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  bestSellerBar: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: COLORS.navy,
    marginRight: 8,
  },
  bestSellerHeading: { fontSize: 15, fontWeight: "700", color: COLORS.textDark },
  bestSellerScroll: { paddingHorizontal: 14, gap: 12 },
  bestSellerCard: {
    width: 260,
    flexDirection: "row",
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 10,
  },
  bestSellerCover: {
    width: 70,
    height: 90,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 10,
  },
  bestSellerCoverImage: { width: "100%", height: "100%" },
  coverPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.navy,
    justifyContent: "center",
    alignItems: "center",
  },
  bestSellerInfo: { flex: 1, justifyContent: "center" },
  bestSellerTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 6,
    lineHeight: 17,
  },
  bestSellerPriceRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 4 },
  bestSellerPrice: { fontSize: 14, fontWeight: "800", color: COLORS.textDark },
  bestSellerMrp: {
    fontSize: 12,
    color: COLORS.gray,
    textDecorationLine: "line-through",
  },
  bestSellerDiscount: { fontSize: 12, fontWeight: "700", color: COLORS.green },

  // Printed note card
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  coverBox: {
    height: 190,
    backgroundColor: "#0E1B3D",
  },
  coverImage: { width: "100%", height: "100%" },
  coverPlaceholderLarge: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.navy,
    paddingHorizontal: 20,
  },
  coverPlaceholderText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
  },
  cardFooter: { padding: 16 },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 6,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 14,
  },
  buttonRow: { flexDirection: "row", gap: 10 },
  addToCartBtn: {
    flex: 1,
    backgroundColor: COLORS.lightBlue,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
  },
  addToCartText: { color: COLORS.navy, fontSize: 14, fontWeight: "700" },
  buyBtn: {
    flex: 1,
    backgroundColor: COLORS.navy,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
  },
  buyBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },

  // Bottom nav
  bottomBar: {
    height: 78,
    backgroundColor: COLORS.navy,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  tabWrap: { alignItems: "center", justifyContent: "center" },
  activeTabWrap: { alignItems: "center", justifyContent: "center" },
  inactiveTab: { marginBottom: 2 },
  activeTab: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.gold,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -32,
    borderWidth: 4,
    borderColor: COLORS.background,
  },
  tabLabel: { color: "#fff", fontSize: 11, marginTop: 2 },
  activeTabLabel: { color: "#fff", fontSize: 11, marginTop: 2, fontWeight: "700" },
});