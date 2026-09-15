import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Animated,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import Toast from "react-native-toast-message";

interface QuizTest {
  _id: string;
  prelimes_test_id: string;
  prelimes_id: string;
  test_type: string; // "QZ" for quizzes — may also be "SMT" etc. based on earlier payload
  test_number: string;
  title: string;
  no_of_qos: string; // number of questions, returned as a string
  duration: string; // minutes, returned as a string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

interface QuizListResponse {
  statusCode: number;
  message: string;
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  data: QuizTest[];
}

const NAVY = "#0E1C42";
const MAROON = "#7A2430";
const GOLD_BG = "#F3D9A0";
const GOLD_TEXT = "#8A6A1E";
const BLUE_BTN = "#2A4FB8";
const BG = "#EEF1FB";
const CARD_BG = "#FFFFFF";
const TEXT_DARK = "#161B22";
const TEXT_MUTED = "#6B7280";
const SHIMMER_COLOR = "#D8DCE8";

const API_BASE_URL = "https://api.raoslawacademy.com/prelimes-tests";

export default function QuizzesScreen() {
  const { userId } = useLocalSearchParams<{ userId?: string }>();

  const [quizzes, setQuizzes] = useState<QuizTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchQuizzes = async (cancelledRef?: { current: boolean }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<QuizListResponse>(
        `${API_BASE_URL}?page=1&limit=10&test_type=QZ`
      );

      if (cancelledRef?.current) return;

      if (response.data.statusCode === 200) {
        setQuizzes(response.data.data);
      } else {
        setError("Couldn't load quizzes.");
      }
    } catch (err) {
      if (cancelledRef?.current) return;
      console.error("Failed to fetch quizzes:", err);
      setError("Couldn't load quizzes.");
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Couldn't load quizzes. Pull down to retry.",
      });
    } finally {
      if (!cancelledRef?.current) setLoading(false);
    }
  };

  useEffect(() => {
    const cancelledRef = { current: false };
    fetchQuizzes(cancelledRef);
    return () => {
      cancelledRef.current = true;
    };
  }, []);

  const handleRetry = () => {
    fetchQuizzes();
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(search.trim().toLowerCase())
  );

  const handleAttempt = (quiz: QuizTest) => {
    router.push('/quiz/quiz_instructions');
  };

  const handleResult = (quiz: QuizTest) => {
    router.push({
      pathname: "/grandmodule/test_summary" as any,
      params: {
        testId: quiz.prelimes_test_id,
        userId: userId ?? "",
        title: quiz.title,
      },
    });
  };

  const handlePlayNow = () => {
    if (filteredQuizzes.length > 0) {
      handleAttempt(filteredQuizzes[0]);
    } else if (quizzes.length > 0) {
      handleAttempt(quizzes[0]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={26} color={TEXT_DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quizzes</Text>
          <View style={styles.backBtn} />
        </View>

        {/* Hero banner */}
        <View style={styles.banner}>
          <View style={styles.bannerSparkle1} />
          <View style={styles.bannerSparkle2} />
          <View style={styles.bannerSparkle3} />

          <View style={styles.bannerTextCol}>
            <Text style={styles.bannerTitle}>
              Test Your Knowledge with Quizzes
            </Text>
            <Text style={styles.bannerSubtitle}>
              You're just looking for a playful way to learn new facts, our
              quizzes are designed to entertain and educate.
            </Text>
            <TouchableOpacity
              style={styles.playNowBtn}
              activeOpacity={0.85}
              onPress={handlePlayNow}
            >
              <Text style={styles.playNowText}>Play Now</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.trophyWrap}>
            <MaterialCommunityIcons name="trophy" size={72} color="#F3D9A0" />
          </View>
        </View>

        {/* Search bar */}
        {loading ? (
          <SearchBarShimmer />
        ) : (
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Ionicons name="search" size={18} color={TEXT_MUTED} />
              <TextInput
                placeholder="Search for.."
                placeholderTextColor={TEXT_MUTED}
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
                autoCorrect={false}
                returnKeyType="search"
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch("")} hitSlop={8}>
                  <Ionicons name="close-circle" size={18} color={TEXT_MUTED} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity style={styles.filterBtn} activeOpacity={0.8}>
              <Ionicons name="options-outline" size={20} color={TEXT_DARK} />
            </TouchableOpacity>
          </View>
        )}

        {/* Quiz list */}
        {loading ? (
          <View style={styles.list}>
            <QuizCardShimmer />
            <QuizCardShimmer />
            <QuizCardShimmer />
          </View>
        ) : error ? (
          <View style={styles.centerBlock}>
            <Ionicons name="alert-circle-outline" size={32} color={MAROON} />
            <Text style={styles.centerText}>{error}</Text>
            <TouchableOpacity onPress={handleRetry} style={styles.retryBtn}>
              <Text style={styles.retryBtnText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredQuizzes.length === 0 ? (
          <View style={styles.centerBlock}>
            <Text style={styles.centerText}>No quizzes found.</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {filteredQuizzes.map((quiz) => (
              <QuizCard
                key={quiz._id}
                title={quiz.title}
                questionCount={parseInt(quiz.no_of_qos, 10) || 0}
                onResult={() => handleResult(quiz)}
                onAttempt={() => handleAttempt(quiz)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function useShimmerOpacity() {
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return pulse;
}

function SearchBarShimmer() {
  const pulse = useShimmerOpacity();

  return (
    <View style={styles.searchRow}>
      <Animated.View style={[styles.searchBoxShimmer, { opacity: pulse }]} />
      <Animated.View style={[styles.filterBtnShimmer, { opacity: pulse }]} />
    </View>
  );
}

function QuizCardShimmer() {
  const pulse = useShimmerOpacity();

  return (
    <View style={styles.quizCard}>
      <Animated.View style={[styles.avatar, styles.shimmerBlock, { opacity: pulse }]} />
      <View style={styles.quizInfo}>
        <Animated.View
          style={[styles.shimmerLine, styles.shimmerTitleLine, { opacity: pulse }]}
        />
        <Animated.View
          style={[styles.shimmerLine, styles.shimmerMetaLine, { opacity: pulse }]}
        />
        <View style={styles.quizActions}>
          <Animated.View style={[styles.shimmerBtn, { opacity: pulse }]} />
          <Animated.View style={[styles.shimmerBtn, { opacity: pulse }]} />
        </View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------

function QuizAvatar() {
  return (
    <View style={styles.avatar}>
      <MaterialCommunityIcons name="scale-balance" size={26} color="#1E3A8A" />
    </View>
  );
}

function QuizCard({
  title,
  questionCount,
  onResult,
  onAttempt,
}: {
  title: string;
  questionCount: number;
  onResult: () => void;
  onAttempt: () => void;
}) {
  return (
    <View style={styles.quizCard}>
      <QuizAvatar />
      <View style={styles.quizInfo}>
        <Text style={styles.quizTitle}>{title}</Text>
        <Text style={styles.quizMeta}>{questionCount} Questions</Text>
        <View style={styles.quizActions}>
          <TouchableOpacity
            style={styles.resultBtn}
            onPress={onResult}
            activeOpacity={0.8}
          >
            <Text style={styles.resultBtnText}>Result</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.attemptBtn}
            onPress={onAttempt}
            activeOpacity={0.85}
          >
            <Text style={styles.attemptBtnText}>Attempt</Text>
            <Ionicons name="chevron-forward" size={14} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 24,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    paddingBottom: 14,
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_DARK,
  },

  // Banner
  banner: {
    flexDirection: "row",
    backgroundColor: NAVY,
    borderRadius: 18,
    padding: 18,
    overflow: "hidden",
    marginBottom: 18,
  },
  bannerTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 22,
    marginBottom: 6,
  },
  bannerSubtitle: {
    color: "#C7CEE6",
    fontSize: 11.5,
    lineHeight: 16,
    marginBottom: 14,
  },
  playNowBtn: {
    backgroundColor: BLUE_BTN,
    alignSelf: "flex-start",
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
  },
  playNowText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  trophyWrap: {
    width: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerSparkle1: {
    position: "absolute",
    top: 14,
    right: 60,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ffffff55",
  },
  bannerSparkle2: {
    position: "absolute",
    top: 40,
    right: 20,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#ffffff44",
  },
  bannerSparkle3: {
    position: "absolute",
    bottom: 18,
    right: 90,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#ffffff33",
  },

  // Search
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD_BG,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: TEXT_DARK,
  },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: CARD_BG,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBoxShimmer: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: SHIMMER_COLOR,
  },
  filterBtnShimmer: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: SHIMMER_COLOR,
  },

  // Loading / error / empty states
  centerBlock: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    gap: 8,
  },
  centerText: {
    fontSize: 13,
    color: TEXT_MUTED,
    textAlign: "center",
  },
  retryBtn: {
    marginTop: 4,
    backgroundColor: NAVY,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },

  // Quiz list
  list: {
    gap: 14,
  },
  quizCard: {
    flexDirection: "row",
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#E4E9F7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  quizInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 15.5,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 3,
  },
  quizMeta: {
    fontSize: 12.5,
    color: TEXT_MUTED,
    marginBottom: 10,
  },
  quizActions: {
    flexDirection: "row",
    gap: 10,
  },
  resultBtn: {
    backgroundColor: GOLD_BG,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  resultBtnText: {
    color: GOLD_TEXT,
    fontSize: 12.5,
    fontWeight: "700",
  },
  attemptBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: MAROON,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 2,
  },
  attemptBtnText: {
    color: "#fff",
    fontSize: 12.5,
    fontWeight: "700",
    marginRight: 2,
  },

  // Shimmer (quiz card)
  shimmerBlock: {
    backgroundColor: SHIMMER_COLOR,
  },
  shimmerLine: {
    borderRadius: 4,
    backgroundColor: SHIMMER_COLOR,
  },
  shimmerTitleLine: {
    height: 14,
    width: "70%",
    marginBottom: 8,
  },
  shimmerMetaLine: {
    height: 11,
    width: "40%",
    marginBottom: 12,
  },
  shimmerBtn: {
    flex: 1,
    height: 32,
    borderRadius: 8,
    backgroundColor: SHIMMER_COLOR,
  },
});