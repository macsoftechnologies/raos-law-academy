import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";

interface AboutBookSection {
  title: string;
  topics: string[];
}

interface AboutBook {
  description: string;
  sections: AboutBookSection[];
}

interface NotesItem {
  _id: string;
  notes_id: string;
  title: string;
  sub_title: string;
  about_book: AboutBook;
  presentation_image: string;
  isPrintAvail: boolean;
  printNotes_image: string;
  terms_conditions: string;
  subcategory_id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface LawItem {
  _id: string;
  lawId: string;
  title: string;
  law_image: string;
  subcategory_id: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface SubjectItem {
  _id: string;
  subjectId: string;
  title: string;
  subject_image: string;
  law_id: string;
  subcategory_id: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface SubjectNote {
  _id: string;
  subject_notes_id: string;
  notes_id: NotesItem[];
  lawId: LawItem[];
  title: string;
  pdf_url: string;
  isLocked: boolean;
  presentation_image: string;
  subjectId: SubjectItem[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface SubjectNotesResponse {
  statusCode: number;
  message: string;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  data: SubjectNote[];
}

const COLORS = {
  navy: "#23408E",
  gold: "#D8AE24",
  goldDark: "#B8941C",
  pink: "#F6D9DC",
  pinkText: "#8A3B45",
  lightBlue: "#DCE6FB",
  background: "#EEF1FB",
  cardBg: "#FFFFFF",
  lineGray: "#E3E7F0",
  border: "#E7EAF2",
  gray: "#8A8A8A",
};

interface NoteItem {
  id: string;
  title: string;
  price: string;
  previewImage?: any; // require('...') image asset for the note preview
  printedNotes?: boolean;
  singleButton?: boolean;
  route: string;
  lawId?: string; // TODO: wire real lawId per note once backend data replaces NOTES_DATA
}

const NOTES_DATA: NoteItem[] = [
  {
    id: "1",
    title: "AP JCJ Notes",
    price: "₹499",
    singleButton: true,
    previewImage: require("../../../assets/images/pdf1.png"),
    route: "/notes/ap-jcj",
  },
  {
    id: "2",
    title: "AP DDJ Notes",
    price: "₹499",
    previewImage: require("../../../assets/images/pdf1.png"),
    route: "/notes/ap-ddj",
  },
  {
    id: "3",
    title: "TS JCJ Notes",
    price: "₹499",
    printedNotes: true,
    previewImage: require("../../../assets/images/pdf1.png"),
    route: "/notes/ts-jcj",
  },
  {
    id: "4",
    title: "TS DDJ Notes",
    price: "₹499",
    previewImage: require("../../../assets/images/pdf1.png"),
    route: "/notes/ts-ddj",
  },
];

function NoteCard({ item, userId }: { item: NoteItem; userId?: string }) {
  const handleBookmark = (item: NoteItem) => {
    console.log("Bookmarked:", item.title);
  };
  return (
    <View style={styles.card}>
      <View style={styles.previewBox}>
        <Image
          source={item.previewImage}
          style={styles.previewImage}
          resizeMode="cover"
        />
        {item.printedNotes && (
          <View style={styles.printedBadge}>
            <Text style={styles.printedBadgeText}>Printed Notes</Text>
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.titleRow}>
  <Text style={styles.cardTitle}>{item.title}</Text>

  <TouchableOpacity
    onPress={() => console.log("Bookmark clicked for:", item.title)}
    activeOpacity={0.7}
  >
    <Ionicons
      name="bookmark-outline"
      size={22}
      color={COLORS.navy}
    />
  </TouchableOpacity>
</View>
        <View style={styles.priceRow}>
          <Text style={styles.priceText}>{item.price}</Text>
          {!item.singleButton && (
            <TouchableOpacity style={styles.addToCartBtn}>
              <Text style={styles.addToCartText}>Add to cart</Text>
            </TouchableOpacity>
          )}
        </View>

        {item.singleButton ? (
          <TouchableOpacity
            style={styles.exploreBtn}
            activeOpacity={0.9}
            onPress={() => {
              console.log("Explore More Clicked");
              router.push({
                pathname: "/notes_module/pdf_notes/notes_data",
                params: { userId, lawId: item.lawId },
              } as any);
            }}
          >
            <Text style={styles.exploreBtnText}>Explore More</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.exploreBtn}
              activeOpacity={0.9}
              onPress={() => {
                console.log("Explore More clicked");
                router.push({
                  pathname: "/notes_module/pdf_notes/notes_data",
                  params: { userId, lawId: item.lawId },
                } as any);
              }}
            >
              <Text style={styles.exploreBtnText}>Explore More</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buyBtn} activeOpacity={0.9}>
              <Text style={styles.buyBtnText}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        )}
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

export default function Notes() {
  const { userId } = useLocalSearchParams<{ userId: string }>();

  console.log("PDF Notes userId:", userId);
  const [activeTab, setActiveTab] = useState("Notes");

  const [notes, setNotes] = useState<SubjectNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    console.log("useEffect called");

    const fetchUsernoteslist = async () => {
      console.log("API calling...");
      setLoading(true);
      try {
        const response = await axios.get(
          "https://api.raoslawacademy.com/subject-notes?page=1&limit=10"
        );

        console.log("Response:", response.data);

        if (response.data?.statusCode === 200) {
          setNotes(response.data.data);
        }
      } catch (error: any) {
        console.log("API Error:", error);
        console.log("Response:", error?.response?.data);
        setError("Couldn't load notes right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsernoteslist();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notes</Text>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/notes_module/pdf_notes/notes_data",
                params: { userId },
              } as any)
            }
          >
            <Ionicons name="cart-outline" size={26} color="#222" />
          </TouchableOpacity>
        </View>

        {/*
          TODO: `notes` (fetched from the API above) isn't rendered yet —
          the API response shape (SubjectNote[]) doesn't match NoteItem,
          so it can't be dropped straight into NoteCard without mapping
          the fields first. Rendering the static NOTES_DATA for now so
          the screen isn't blank; swap this out once the mapping is done.
        */}
        <FlatList
          data={NOTES_DATA}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NoteCard item={item} userId={userId} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.bottomBar}>
          {bottomTabs.map((tab) => {
            const isActive = activeTab === tab.label;
            return (
              <TouchableOpacity
                key={tab.label}
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
    paddingHorizontal: 20,
    paddingTop: 49,
    paddingBottom: 15,
  },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#222" },
  listContent: { paddingHorizontal: 16, paddingBottom: 20 },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  previewBox: {
    height: 150,
    borderRadius: 12,
    backgroundColor: "#FAFBFD",
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    justifyContent: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  printedBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: COLORS.goldDark,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomLeftRadius: 12,
  },
  printedBadgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  cardFooter: { paddingTop: 12, paddingHorizontal: 4 },
  titleRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#222", flex: 1, marginRight: 8 },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 12,
  },
  priceText: { fontSize: 16, fontWeight: "700", color: "#222" },
  addToCartBtn: {
    backgroundColor: COLORS.pink,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  addToCartText: { color: COLORS.pinkText, fontSize: 13, fontWeight: "700" },
  buttonRow: { flexDirection: "row", gap: 10 },
  exploreBtn: {
    flex: 1,
    backgroundColor: COLORS.lightBlue,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
  },
  exploreBtnText: { color: COLORS.navy, fontSize: 14, fontWeight: "700" },
  buyBtn: {
    flex: 1,
    backgroundColor: COLORS.navy,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
  },
  buyBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
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