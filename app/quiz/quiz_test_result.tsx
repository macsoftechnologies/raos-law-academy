// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
// } from "react-native";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import Svg, { Circle } from "react-native-svg";
// import { router } from "expo-router";
// interface SubmitTestResultData {
//   _id: string;
//   userId: string;
//   testId: string;
//   attemptId: string;
//   totalQuestions: number;
//   attempted: number;
//   correct: number;
//   wrong: number;
//   skipped: number;
//   score: number;
//   percentage: number;
//   accuracy: number;
//   timeSpent: number;
//   totalTime: number;
//   prelimes_result_id: string;
//   createdAt: string; // ISO date string
//   updatedAt: string; // ISO date string
//   __v: number;
//   percentile: number;
//   rank: number;
//   totalParticipants: number;
// }

// interface SubmitTestResultResponse {
//   statusCode: number;
//   data: SubmitTestResultData;
// }

// const NAVY = "#0A1A3B";
// const NAVY_LIGHT = "#23408E";
// const GOLD = "#D8AE24";
// const GOLD_DARK = "#C9A227";
// const MAROON = "#7A1F2B";
// const BG = "#EEF1FB";

// // Replace with real values passed via route params / API response
// const RESULT = {
//   title: "Grand Test - All Subjects",
//   attemptedOn: "Nov 28, 2025",
//   attemptedTime: "3:06 PM",
//   score: 0.0,
//   totalScore: 200,
//   timeSpentLabel: "12:53",
//   totalTimeLabel: "150:00",
//   rank: 88,
//   totalRank: 990,
//   percentile: 12.1,
//   accuracy: 0.0,
// };

// function Ring({
//   size,
//   strokeWidth,
//   color,
//   trackColor,
//   progress,
//   children,
// }: {
//   size: number;
//   strokeWidth: number;
//   color: string;
//   trackColor: string;
//   progress: number; // 0 - 1
//   children?: React.ReactNode;
// }) {
//   const radius = (size - strokeWidth) / 2;
//   const circumference = 2 * Math.PI * radius;
//   const dashOffset = circumference * (1 - progress);

//   return (
//     <View style={{ width: size, height: size }}>
//       <Svg width={size} height={size}>
//         <Circle
//           cx={size / 2}
//           cy={size / 2}
//           r={radius}
//           stroke={trackColor}
//           strokeWidth={strokeWidth}
//           fill="none"
//         />
//         <Circle
//           cx={size / 2}
//           cy={size / 2}
//           r={radius}
//           stroke={color}
//           strokeWidth={strokeWidth}
//           fill="none"
//           strokeDasharray={`${circumference} ${circumference}`}
//           strokeDashoffset={dashOffset}
//           strokeLinecap="round"
//           rotation="-90"
//           origin={`${size / 2}, ${size / 2}`}
//         />
//       </Svg>
//       <View style={styles.ringCenter}>{children}</View>
//     </View>
//   );
// }

// export default function GrandTestResults() {
//  const [testResult, setTestResult] = useState<SubmitTestResultData | null>(null);

//   const scoreProgress = RESULT.totalScore
//     ? RESULT.score / RESULT.totalScore
//     : 0;


//   const rankProgress = RESULT.totalRank
//     ? 1 - RESULT.rank / RESULT.totalRank
//     : 0;
//   const percentileProgress = RESULT.percentile / 100;
//   const accuracyProgress = RESULT.accuracy / 100;

//   const handleCancel = () => {
//     router.back();
//   };

//   const handleReAttempt = () => {
//     router.push("/mock-test/GrandTestTerms" as any);
//   };

//   const handleViewSolutions = () => {
//     router.push("/mock-test/GrandTestSolutions" as any);
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor={BG} />

//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
//           <Ionicons name="chevron-back" size={26} color="#1A1A1A" />
//         </TouchableOpacity>
//         <View style={{ flex: 1, marginLeft: 6 }}>
//           <Text style={styles.headerTitle}>{RESULT.title}</Text>
//           <Text style={styles.headerSubtitle}>
//             Attempted on: {RESULT.attemptedOn} | {RESULT.attemptedTime}
//           </Text>
//         </View>
//       </View>

//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.summaryCard}>
//           <Text style={styles.cardTitle}>Overall Performance Summary</Text>

//           {/* Score */}
//           <View style={[styles.wideStatBox, { backgroundColor: "#DDE2F0" }]}>
//             <Ring size={44} strokeWidth={4} color={NAVY_LIGHT} trackColor="#B9C0D6" progress={scoreProgress}>
//               <Ionicons name="checkmark" size={16} color={NAVY_LIGHT} />
//             </Ring>
//             <View style={styles.wideStatText}>
//               <Text style={styles.wideStatValue}>
//                 {RESULT.score.toFixed(1)}{" "}
//                 <Text style={styles.wideStatValueMuted}>| {RESULT.totalScore}</Text>
//               </Text>
//               <Text style={styles.wideStatLabel}>Your Score</Text>
//             </View>
//           </View>

//           {/* Time spent */}
//           <View style={[styles.wideStatBox, { backgroundColor: "#E9D7DA" }]}>
//             <Ring size={44} strokeWidth={4} color={MAROON} trackColor="#D8B9BE" progress={0.35}>
//               <Ionicons name="time-outline" size={16} color={MAROON} />
//             </Ring>
//             <View style={styles.wideStatText}>
//               <Text style={styles.wideStatValue}>
//                 {RESULT.timeSpentLabel}{" "}
//                 <Text style={styles.wideStatValueMuted}>| {RESULT.totalTimeLabel}</Text>
//               </Text>
//               <Text style={styles.wideStatLabel}>Time Spent</Text>
//             </View>
//           </View>

//           {/* Rank / Percentile / Accuracy */}
//           <View style={styles.tripleRow}>
//             <View style={[styles.smallStatBox, { backgroundColor: "#EFE4C2" }]}>
//               <Ring size={38} strokeWidth={4} color={GOLD_DARK} trackColor="#DCCB98" progress={rankProgress}>
//                 <Ionicons name="star" size={14} color={GOLD_DARK} />
//               </Ring>
//               <Text style={styles.smallStatValue}>
//                 {RESULT.rank} <Text style={styles.smallStatValueMuted}>| {RESULT.totalRank}</Text>
//               </Text>
//               <Text style={styles.smallStatLabel}>Your Rank</Text>
//             </View>

//             <View style={[styles.smallStatBox, { backgroundColor: "#E9D7DA" }]}>
//               <Ring size={38} strokeWidth={4} color={MAROON} trackColor="#D8B9BE" progress={percentileProgress}>
//                 <Ionicons name="time-outline" size={14} color={MAROON} />
//               </Ring>
//               <Text style={styles.smallStatValue}>
//                 {RESULT.percentile} <Text style={styles.smallStatValueMuted}>| 100</Text>
//               </Text>
//               <Text style={styles.smallStatLabel}>Percentile</Text>
//             </View>

//             <View style={[styles.smallStatBox, { backgroundColor: "#DDE2F0" }]}>
//               <Ring size={38} strokeWidth={4} color={NAVY_LIGHT} trackColor="#B9C0D6" progress={accuracyProgress}>
//                 <MaterialCommunityIcons name="target" size={14} color={NAVY_LIGHT} />
//               </Ring>
//               <Text style={styles.smallStatValue}>
//                 {RESULT.accuracy.toFixed(1)} <Text style={styles.smallStatValueMuted}>| 100</Text>
//               </Text>
//               <Text style={styles.smallStatLabel}>Accuracy</Text>
//             </View>
//           </View>

//           {/* Cancel / Re-Attempt */}
//           <View style={styles.actionRow}>
//             <TouchableOpacity
//               style={styles.cancelBtn}
//               onPress={handleCancel}
//               activeOpacity={0.85}
//             >
//               <Text style={styles.cancelBtnText}>Cancel</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.reattemptBtn}
//               onPress={handleReAttempt}
//               activeOpacity={0.85}
//             >
//               <Text style={styles.reattemptBtnText}>Re- Attempt</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>

//       {/* View Solutions */}
//       <View style={styles.bottomBar}>
//         <TouchableOpacity
//           style={styles.solutionsBtn}
//           onPress={handleViewSolutions}
//           activeOpacity={0.85}
//         >
//           <Text style={styles.solutionsBtnText}>View Solutions</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: BG,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     paddingHorizontal: 16,
//     paddingTop: 8,
//     paddingBottom: 16,
//   },
//   backBtn: {
//     padding: 4,
//     marginTop: 2,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#1A1A1A",
//   },
//   headerSubtitle: {
//     fontSize: 12,
//     color: "#5A5F73",
//     marginTop: 2,
//   },
//   scrollContent: {
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },
//   summaryCard: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 18,
//     shadowColor: "#000",
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 3 },
//     elevation: 2,
//   },
//   cardTitle: {
//     fontSize: 15,
//     fontWeight: "700",
//     color: "#1A1A1A",
//     marginBottom: 14,
//   },
//   wideStatBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderRadius: 12,
//     padding: 14,
//     marginBottom: 12,
//   },
//   ringCenter: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   wideStatText: {
//     marginLeft: 14,
//   },
//   wideStatValue: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#1A1A1A",
//   },
//   wideStatValueMuted: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#8A8FA3",
//   },
//   wideStatLabel: {
//     fontSize: 13,
//     color: "#3A3A3A",
//     marginTop: 2,
//   },
//   tripleRow: {
//     flexDirection: "row",
//     gap: 10,
//     marginBottom: 16,
//   },
//   smallStatBox: {
//     flex: 1,
//     borderRadius: 12,
//     paddingVertical: 14,
//     alignItems: "center",
//   },
//   smallStatValue: {
//     fontSize: 15,
//     fontWeight: "700",
//     color: "#1A1A1A",
//     marginTop: 8,
//   },
//   smallStatValueMuted: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: "#8A8FA3",
//   },
//   smallStatLabel: {
//     fontSize: 11,
//     color: "#3A3A3A",
//     marginTop: 4,
//   },
//   actionRow: {
//     flexDirection: "row",
//     gap: 12,
//   },
//   cancelBtn: {
//     flex: 1,
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     borderWidth: 1.5,
//     borderColor: MAROON,
//     paddingVertical: 13,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   cancelBtnText: {
//     color: MAROON,
//     fontSize: 15,
//     fontWeight: "700",
//   },
//   reattemptBtn: {
//     flex: 1,
//     backgroundColor: MAROON,
//     borderRadius: 10,
//     paddingVertical: 13,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   reattemptBtnText: {
//     color: "#fff",
//     fontSize: 15,
//     fontWeight: "700",
//   },
//   bottomBar: {
//     paddingHorizontal: 20,
//     paddingTop: 12,
//     paddingBottom: 20,
//   },
//   solutionsBtn: {
//     backgroundColor: NAVY,
//     borderRadius: 12,
//     paddingVertical: 16,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   solutionsBtnText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "700",
//   },
// });
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import Toast from "react-native-toast-message";


interface SubmitTestResultData {
  _id: string;
  userId: string;
  testId: string;
  attemptId: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  skipped: number;
  score: number;
  percentage: number;
  accuracy: number;
  timeSpent: number;
  totalTime: number;
  prelimes_result_id: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
  percentile: number;
  rank: number;
  totalParticipants: number;
}

interface SubmitTestResultResponse {
  statusCode: number;
  data: SubmitTestResultData;
}

interface StartAttemptResponse {
  statusCode: number;
  data: {
    attemptId: string;
    [key: string]: any;
  };
}
export interface Option {
  selectedAnswer: number;
  isCorrect: boolean;
  _id: string;
}

export interface QuestionSummary {
  _id: string;
  questionId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  marks: number;
  summary: string[];
  question_number: number;
}

export interface TestInfo {
  _id: string;
  prelimes_test_id: string;
  prelimes_id: string;
  test_type: string;
  test_number: string;
  title: string;
  no_of_qos: string;
  duration: string;
  mocktest_subject_id: string;
}

export interface AttemptResult {
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  skipped: number;
  score: number;
  percentage: number;
  accuracy: number;
  timeSpent: number;
  totalTime: number;
  percentile: number;
  rank: number;
  totalParticipants: number;
}

export interface TestAttempt {
  _id: string;
  userId: string;
  testId: string;
  answers: Option[];
  startedAt: string;
  submittedAt?: string;
  attemptNumber: number;
  prelimes_attempt_id: string;
  testInfo: TestInfo;
  questions: QuestionSummary[];
  result?: AttemptResult;
}

export interface TestAttemptsResponse {
  statusCode: number;
  message: string;
  data: TestAttempt[];
}
const NAVY = "#0A1A3B";
const NAVY_LIGHT = "#23408E";
const GOLD_DARK = "#C9A227";
const MAROON = "#7A1F2B";
const BG = "#EEF1FB";

// Base URL for the Prelimes Attempts & Results API (see Postman collection)
const API_BASE_URL = "https://api.raoslawacademy.com/prelimes-tests";

/** Format an ISO date string -> "Nov 28, 2025" */
function formatDate(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Format an ISO date string -> "3:06 PM" */
function formatTime(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/** Format seconds (may be fractional) -> "mm:ss" */
function formatDuration(totalSeconds?: number) {
  if (totalSeconds == null || isNaN(totalSeconds)) return "0:00";
  const totalWhole = Math.round(totalSeconds);
  const minutes = Math.floor(totalWhole / 60);
  const seconds = totalWhole % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function Ring({
  size,
  strokeWidth,
  color,
  trackColor,
  progress,
  children,
}: {
  size: number;
  strokeWidth: number;
  color: string;
  trackColor: string;
  progress: number; // 0 - 1
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, progress || 0));
  const dashOffset = circumference * (1 - clamped);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.ringCenter}>{children}</View>
    </View>
  );
}


 
  export default function QuizTestResults() {
  const { title, prelimes_test_id, userId, prelimes_attempt_id } =
    useLocalSearchParams<{
      title?: string;
      prelimes_test_id?: string;
      userId?: string;
      prelimes_attempt_id?: string;
    }>();

  useEffect(() => {
    console.log("GrandTestResults params:", {
      title,
      prelimes_test_id,
      userId,
      prelimes_attempt_id,
    });
  }, []);


  const [testResult, setTestResult] = useState<SubmitTestResultData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reattempting, setReattempting] = useState(false);
   const [loadingSolutions, setLoadingSolutions] = useState(false);


  

  const handleCancel = () => {
    router.back();
  };



  useEffect(()=>{
  const fetchTestResult= async()=>{
    try {
      const response=await axios.get("https://api.raoslawacademy.com/prelimes-tests/55c8a349-54be-43a4-a1a8-cd23630035a5")
      if(response.data.statusCode===200){
        setTestResult(
          response.data.data
        );

        console.log(response.data.data);
        
      }
    } catch (error) {
       Toast.show({
                type: "error",
                text1: "Error",
                text2: "your test result.",
              });
    }
  } 
  fetchTestResult();
  },[])

  const handleReAttempt = async () => {
    if (reattempting) return;
    setReattempting(true);
    try {
      const response = await axios.post<StartAttemptResponse>(
        `https://api.raoslawacademy.com/prelimes-tests/user_attempts`,
        {
          userId: userId ?? "",
          testId: prelimes_test_id ?? "",
        }
      );

      const newAttemptId = response.data?.data?.attemptId;

      router.push({
        pathname: "/mock-test/GrandTestTerms" as any,
        params: {
          userId: userId ?? "",
          prelimes_test_id: prelimes_test_id ?? "",
          prelimes_attempt_id: newAttemptId ?? "",
        },
      });
    } catch (err) {
      console.error("Failed to start re-attempt:", err);
      setError("Couldn't start a new attempt. Please try again.");
    } finally {
      setReattempting(false);
    }
  };

 const handleViewSolutions = async () => {
  router.push({
        pathname: "/quiz/quiz_solutions",
        params: {
          testId: prelimes_test_id ?? "",
          userId: "9325e7d0-b08f-4e7c-9d8d-7d4adadf101d",
          prelimes_attempt_id:"0c7a889d-e09b-48e5-874f-183081fa91b8",
        },
      });
 
};



  // Error / empty state
  if (error || !testResult) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centerContent]}>
        <StatusBar barStyle="dark-content" backgroundColor={BG} />
        <Ionicons name="alert-circle-outline" size={40} color={MAROON} />
        <Text style={styles.errorText}>{error ?? "No result found."}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => router.back()}>
          <Text style={styles.retryBtnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // --- Derive UI values from the API response ---
  const totalScore = testResult.totalQuestions; // 1 mark per question
  const scoreProgress = totalScore ? testResult.score / totalScore : 0;
  const rankProgress = testResult.totalParticipants
    ? 1 - testResult.rank / testResult.totalParticipants
    : 0;
  const percentileProgress = testResult.percentile / 100;
  const timeProgress = testResult.totalTime
    ? testResult.timeSpent / testResult.totalTime
    : 0;
  const accuracyProgress = testResult.accuracy / 100;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 6 }}>
          <Text style={styles.headerTitle}>
            {title ?? "Grand Test - All Subjects"}
          </Text>
          <Text style={styles.headerSubtitle}>
            Attempted on: {formatDate(testResult.createdAt)} |{" "}
            {formatTime(testResult.createdAt)}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Overall Performance Summary</Text>

          {/* Score */}
          <View style={[styles.wideStatBox, { backgroundColor: "#DDE2F0" }]}>
            <Ring
              size={44}
              strokeWidth={4}
              color={NAVY_LIGHT}
              trackColor="#B9C0D6"
              progress={scoreProgress}
            >
              <Ionicons name="checkmark" size={16} color={NAVY_LIGHT} />
            </Ring>
            <View style={styles.wideStatText}>
              <Text style={styles.wideStatValue}>
                {testResult.score.toFixed(1)}{" "}
                <Text style={styles.wideStatValueMuted}>| {totalScore}</Text>
              </Text>
              <Text style={styles.wideStatLabel}>Your Score</Text>
            </View>
          </View>

          {/* Time spent */}
          <View style={[styles.wideStatBox, { backgroundColor: "#E9D7DA" }]}>
            <Ring
              size={44}
              strokeWidth={4}
              color={MAROON}
              trackColor="#D8B9BE"
              progress={timeProgress}
            >
              <Ionicons name="time-outline" size={16} color={MAROON} />
            </Ring>
            <View style={styles.wideStatText}>
              <Text style={styles.wideStatValue}>
                {formatDuration(testResult.timeSpent)}{" "}
                <Text style={styles.wideStatValueMuted}>
                  | {formatDuration(testResult.totalTime)}
                </Text>
              </Text>
              <Text style={styles.wideStatLabel}>Time Spent</Text>
            </View>
          </View>

          {/* Rank / Percentile / Accuracy */}
          <View style={styles.tripleRow}>
            <View style={[styles.smallStatBox, { backgroundColor: "#EFE4C2" }]}>
              <Ring
                size={38}
                strokeWidth={4}
                color={GOLD_DARK}
                trackColor="#DCCB98"
                progress={rankProgress}
              >
                <Ionicons name="star" size={14} color={GOLD_DARK} />
              </Ring>
              <Text style={styles.smallStatValue}>
                {testResult.rank}{" "}
                <Text style={styles.smallStatValueMuted}>
                  | {testResult.totalParticipants}
                </Text>
              </Text>
              <Text style={styles.smallStatLabel}>Your Rank</Text>
            </View>

            <View style={[styles.smallStatBox, { backgroundColor: "#E9D7DA" }]}>
              <Ring
                size={38}
                strokeWidth={4}
                color={MAROON}
                trackColor="#D8B9BE"
                progress={percentileProgress}
              >
                <Ionicons name="time-outline" size={14} color={MAROON} />
              </Ring>
              <Text style={styles.smallStatValue}>
                {testResult.percentile}{" "}
                <Text style={styles.smallStatValueMuted}>| 100</Text>
              </Text>
              <Text style={styles.smallStatLabel}>Percentile</Text>
            </View>

            <View style={[styles.smallStatBox, { backgroundColor: "#DDE2F0" }]}>
              <Ring
                size={38}
                strokeWidth={4}
                color={NAVY_LIGHT}
                trackColor="#B9C0D6"
                progress={accuracyProgress}
              >
                <MaterialCommunityIcons
                  name="target"
                  size={14}
                  color={NAVY_LIGHT}
                />
              </Ring>
              <Text style={styles.smallStatValue}>
                {testResult.accuracy.toFixed(1)}{" "}
                <Text style={styles.smallStatValueMuted}>| 100</Text>
              </Text>
              <Text style={styles.smallStatLabel}>Accuracy</Text>
            </View>
          </View>

          {/* Cancel / Re-Attempt */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleCancel}
              activeOpacity={0.85}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.reattemptBtn, reattempting && { opacity: 0.6 }]}
              onPress={handleReAttempt}
              activeOpacity={0.85}
              disabled={reattempting}
            >
              {reattempting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.reattemptBtnText}>Re-Attempt</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* View Solutions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.solutionsBtn}
          onPress={handleViewSolutions}
          activeOpacity={0.85}
        >
          <Text style={styles.solutionsBtnText}>View Solutions</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#5A5F73",
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
    color: "#3A3A3A",
    textAlign: "center",
  },
  retryBtn: {
    marginTop: 16,
    backgroundColor: NAVY,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backBtn: {
    padding: 4,
    marginTop: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#5A5F73",
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 14,
  },
  wideStatBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  ringCenter: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  wideStatText: {
    marginLeft: 14,
  },
  wideStatValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  wideStatValueMuted: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8A8FA3",
  },
  wideStatLabel: {
    fontSize: 13,
    color: "#3A3A3A",
    marginTop: 2,
  },
  tripleRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  smallStatBox: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  smallStatValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 8,
  },
  smallStatValueMuted: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8A8FA3",
  },
  smallStatLabel: {
    fontSize: 11,
    color: "#3A3A3A",
    marginTop: 4,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: MAROON,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    color: MAROON,
    fontSize: 15,
    fontWeight: "700",
  },
  reattemptBtn: {
    flex: 1,
    backgroundColor: MAROON,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  reattemptBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  solutionsBtn: {
    backgroundColor: NAVY,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  solutionsBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});