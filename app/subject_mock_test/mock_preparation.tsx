import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";

interface MockTestPrelims {
  prelimes_id: string;
  title: string;
}

interface MockTestLaw {
  lawId: string;
  title: string;
}

interface MockTestCourse {
  subcategory_id: string;
  title: string;
}

interface MockTestSubject {
  _id: string;
  mocktest_subject_id: string;
  presentation_image: string;
  title: string;
  no_of_qos: string;
  duration: string;
  prelimes: MockTestPrelims | Record<string, never>;
  law: MockTestLaw | Record<string, never>;
  course: MockTestCourse | Record<string, never>;
}

interface MockTestSubjectsResponse {
  statusCode: number;
  message: string;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  data: MockTestSubject[];
}

const COLORS = {
  navy: "#23408E",
  gold: "#D8AE24",
  pink: "#F6D9DC",
  pinkText: "#8A3B45",
  lightBlue: "#DCE6FB",
  background: "#EEF1FB",
  cardBg: "#FFFFFF",
  lineGray: "#E3E7F0",
  border: "#E7EAF2",
  gray: "#8A8A8A",
};

function hasLaw(law: MockTestSubject["law"]): law is MockTestLaw {
  return "lawId" in law;
}



const bottomTabs = [
  { label: "Home", icon: "home", type: "Ionicons", route: "/dashboard" },
  { label: "Notes", icon: "note-edit-outline", type: "MaterialCommunityIcons", route: "/notes_module" },
  { label: "Prelims", icon: "clipboard-text-outline", type: "MaterialCommunityIcons", route: "/prelims" },
  { label: "Mains", icon: "book-open-variant", type: "MaterialCommunityIcons", route: "/mains" },
  { label: "Chat", icon: "chatbubble-outline", type: "Ionicons", route: "/chat" },
];

export default function MockPreparation() {
  const [activeTab, setActiveTab] = useState("Prelims");
  const [subjectList, setSubjectList] = useState<MockTestSubject[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useLocalSearchParams<{ userId: string }>();

  console.log("mockpreparation userId:", userId);


  const fetchSubjects = async () => {
    setError(null);
    try {
      const response = await axios.get<MockTestSubjectsResponse>(
        "https://api.raoslawacademy.com/prelimes/mocktestsubjects?page=1&limit=10"
      );

      if (response.data.statusCode === 200) {
        setSubjectList(response.data.data);
      } else {
        setError("Couldn't load mock test subjects.");
      }
    } catch (err: any) {
      console.log(err?.response?.data || err.message);
      setError("Couldn't load mock test subjects.");
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

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
            <Ionicons name="arrow-back" size={24} color="#222" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            AP JCJ Subject Wise Mocks
          </Text>
        </View>

        {error ? (
          <View style={styles.centerWrap}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchSubjects}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={subjectList}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <MockSubjectCard item={item} userId={userId} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

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

function MockSubjectCard({ item, userId }: { item: MockTestSubject, userId: string }) {

  return (
    <View style={styles.card}>
      <View style={styles.previewBox}>
        <Image
          source={{ uri: `https://api.raoslawacademy.com/${item.presentation_image}` }}
          style={styles.cardImage}
        />
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.cardTitle}>{item.title}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="help-circle-outline" size={15} color={COLORS.gray} />
            <Text style={styles.metaText}>{item.no_of_qos} Qs</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={15} color={COLORS.gray} />
            <Text style={styles.metaText}>{item.duration} min</Text>
          </View>
          {hasLaw(item.law) && (
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="scale-balance" size={15} color={COLORS.gray} />
              <Text style={styles.metaText} numberOfLines={1}>
                {item.law.title}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.exploreFullBtn}
          activeOpacity={0.9}
          onPress={() => {

            // console.log("Explore more pressed for subject:", item.mocktest_subject_id);
            router.push({
              pathname: "/subject_mock_test/view_mock",
              params: { mocktest_subject_id: item.mocktest_subject_id, userId: userId }, 
            } as any);
          }}
        >
          <Text style={styles.exploreFullText}>Explore more</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 15,
  },
  backBtn: { width: 32, height: 32, justifyContent: "center" },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginLeft: 6,
    flex: 1,
  },
  cardImage: { width: "100%", height: 150, borderRadius: 12 },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  centerWrap: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  errorText: { color: COLORS.gray, fontSize: 14 },
  retryBtn: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: { color: "#fff", fontWeight: "700" },
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
  },
  cardFooter: { paddingTop: 12, paddingHorizontal: 4 },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginBottom: 12,
  },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 12, color: COLORS.gray },
  exploreFullBtn: {
    backgroundColor: COLORS.navy,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  exploreFullText: { color: "#fff", fontSize: 15, fontWeight: "700" },
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


