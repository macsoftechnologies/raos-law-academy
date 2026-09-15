// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
//   Modal,
// } from "react-native";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import { router, useLocalSearchParams } from "expo-router";
// import axios from "axios";

// interface Question {
//   _id: string;
//   questionId: string;
//   prelimes_test_id: string;
//   question: string;
//   options: string[];
//   correctAnswer: number;
//   marks: number;
//   summary: string[];
//   question_number: number;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// interface QuestionsListResponse {
//   statusCode: number;
//   message: string;
//   totalCount: number;
//   currentPage: number;
//   limit: number;
//   totalPages: number;
//   data: Question[];
// }










// // ---- Question data (swap with API response later) ----
// type Question = {
//   id: number;
//   type: string;
//   text: string;
//   options: { key: string; label: string }[];
// };

// const questions: Question[] = [
//   {
//     id: 1,
//     type: "Multiple Choice",
//     text: "Who is known as the 'Father of the Indian Constitution'?",
//     options: [
//       { key: "A", label: "Mahatma Gandhi" },
//       { key: "B", label: "Dr. B.R. Ambedkar" },
//       { key: "C", label: "Jawaharlal Nehru" },
//       { key: "D", label: "Sardar Patel" },
//     ],
//   },
//   {
//     id: 2,
//     type: "Multiple Choice",
//     text: "Under which Article of the Constitution is the Right to Constitutional Remedies guaranteed?",
//     options: [
//       { key: "A", label: "Article 19" },
//       { key: "B", label: "Article 21" },
//       { key: "C", label: "Article 32" },
//       { key: "D", label: "Article 14" },
//     ],
//   },
//   {
//     id: 3,
//     type: "Multiple Choice",
//     text: "Which Order of the Civil Procedure Code, 1908 deals with the Rejection of Plaint?",
//     options: [
//       { key: "A", label: "Order 6" },
//       { key: "B", label: "Order 7" },
//       { key: "C", label: "Order 8" },
//       { key: "D", label: "Order 9" },
//     ],
//   },
//   {
//     id: 4,
//     type: "Multiple Choice",
//     text: "Res judicata is dealt with under which Section of the CPC?",
//     options: [
//       { key: "A", label: "Section 9" },
//       { key: "B", label: "Section 10" },
//       { key: "C", label: "Section 11" },
//       { key: "D", label: "Section 12" },
//     ],
//   },
//   {
//     id: 5,
//     type: "Multiple Choice",
//     text: "A decree passed by a court without jurisdiction is:",
//     options: [
//       { key: "A", label: "Voidable" },
//       { key: "B", label: "Valid" },
//       { key: "C", label: "Void" },
//       { key: "D", label: "Enforceable" },
//     ],
//   },
//   {
//     id: 6,
//     type: "Multiple Choice",
//     text: "Under the CPC, a suit for recovery of immovable property must be filed in the court within whose jurisdiction:",
//     options: [
//       { key: "A", label: "The plaintiff resides" },
//       { key: "B", label: "The defendant resides" },
//       { key: "C", label: "The property is situated" },
//       { key: "D", label: "The cause of action arose only" },
//     ],
//   },
//   {
//     id: 7,
//     type: "Multiple Choice",
//     text: "Which Section of the CPC deals with the doctrine of Res Sub Judice?",
//     options: [
//       { key: "A", label: "Section 9" },
//       { key: "B", label: "Section 10" },
//       { key: "C", label: "Section 11" },
//       { key: "D", label: "Section 89" },
//     ],
//   },
//   {
//     id: 8,
//     type: "Multiple Choice",
//     text: "An appeal against an order rejecting a plaint lies as an appeal from:",
//     options: [
//       { key: "A", label: "An interim order" },
//       { key: "B", label: "A decree" },
//       { key: "C", label: "A judgment only" },
//       { key: "D", label: "No appeal lies" },
//     ],
//   },
//   {
//     id: 9,
//     type: "Multiple Choice",
//     text: "Under Order 39 of the CPC, temporary injunctions are dealt with along with which other rule?",
//     options: [
//       { key: "A", label: "Rule 1 and 2" },
//       { key: "B", label: "Rule 5 and 6" },
//       { key: "C", label: "Rule 10 only" },
//       { key: "D", label: "Rule 15 and 16" },
//     ],
//   },
//   {
//     id: 10,
//     type: "Multiple Choice",
//     text: "Execution of decrees is governed by which Order of the CPC?",
//     options: [
//       { key: "A", label: "Order 20" },
//       { key: "B", label: "Order 21" },
//       { key: "C", label: "Order 22" },
//       { key: "D", label: "Order 23" },
//     ],
//   },
// ];

// const TOTAL_TIME_SECONDS = 3 * 60; // 3:00 total, matches Instructions screen duration

// const NAVY = "#0A1A3B";
// const GOLD = "#C9A227";
// const MAROON = "#7A1F2B";

// type QuestionStatus = "answered" | "notAnswered" | "markedForReview" | "unvisited";

// export default function Test() {
//   const { quizId } = useLocalSearchParams<{ quizId?: string }>();
//   const { prelimes_test_id } = useLocalSearchParams<{ prelimes_test_id?: string }>();

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [answers, setAnswers] = useState<Record<number, string>>({});
//   const [reviewMarked, setReviewMarked] = useState<Record<number, boolean>>({});
//   const [visited, setVisited] = useState<Record<number, boolean>>({ [questions[0].id]: true });
//   const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_SECONDS);
//   const [navModalVisible, setNavModalVisible] = useState(false);
//   const [summaryModalVisible, setSummaryModalVisible] = useState(false);

//   const currentQuestion = questions[currentIndex];
//   const isLastQuestion = currentIndex === questions.length - 1;

//   // ---- Countdown timer ----
//   useEffect(() => {
//     if (timeLeft <= 0) {
//       // handleFinalSubmit();
//       return;
//     }
//     const timer = setInterval(() => {
//       setTimeLeft((prev) => Math.max(prev - 1, 0));
//     }, 1000);
//     return () => clearInterval(timer);
//   }, [timeLeft]);

//   const formatTime = (seconds: number) => {
//     const m = Math.floor(seconds / 60)
//       .toString()
//       .padStart(2, "0");
//     const s = (seconds % 60).toString().padStart(2, "0");
//     return `${m}:${s}`;
//   };

//   const getQuestionStatus = (question: Question): QuestionStatus => {
//     if (reviewMarked[question.id]) return "markedForReview";
//     if (answers[question.id]) return "answered";
//     if (visited[question.id]) return "notAnswered";
//     return "unvisited";
//   };

//   const goToQuestion = (index: number) => {
//     setCurrentIndex(index);
//     setVisited((prev) => ({ ...prev, [questions[index].id]: true }));
//     setNavModalVisible(false);
//   };

//   const handleSelectOption = (optionKey: string) => {
//     setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionKey }));
//   };

//   const handleToggleReview = () => {
//     setReviewMarked((prev) => ({
//       ...prev,
//       [currentQuestion.id]: !prev[currentQuestion.id],
//     }));
//   };

//   const handlePrevious = () => {
//     if (currentIndex === 0) return;
//     goToQuestion(currentIndex - 1);
//   };

//   const handleSaveNext = () => {
//     if (isLastQuestion) {
//       setSummaryModalVisible(true);
//       return;
//     }
//     goToQuestion(currentIndex + 1);
//   };

//   const handleReport = () => {
//     // Hook this up to your report/flag-question endpoint
//     console.log(`Reported question ${currentQuestion.id}`);
//   };

//   const attemptedCount = questions.filter((q) => answers[q.id]).length;
//   const skippedCount = questions.length - attemptedCount;

// //   const handleFinalSubmit = () => {
// //   setSummaryModalVisible(false);
// //   router.push("/subject_mock_test/summary");
// // };
// useEffect(() => {
//   const fetchQuestions = async () => {
//     if (!prelimes_test_id) return;

//     try {
//       const response = await axios.get(
//         `https://api.raoslawacademy.com/prelimes-tests/getquestionlist?page=1&limit=10&prelimes_test_id=0c7a889d-e09b-48e5-874f-183081fa91b8}`
//       );
//       console.log(response.data);
    
//     } catch (err: any) {
//       console.log(err?.response?.data || err.message);
//     }
//   };

//   fetchQuestions();
// }, [prelimes_test_id]);
//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor="#EDEEF5" />

//       <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
//         {/* Header */}
//         <View style={styles.header}>
//           <View>
//             <Text style={styles.headerTitle}>Civil Procedure Code</Text>
//             <Text style={styles.timeLeftText}>
//               Total Time Left: <Text style={styles.timeLeftValue}>{formatTime(timeLeft)}</Text>
//             </Text>
//           </View>
//           <TouchableOpacity onPress={() => setNavModalVisible(true)} hitSlop={10}>
//             <Ionicons name="menu" size={26} color="#111111" />
//           </TouchableOpacity>
//         </View>

//         {/* Question type + review */}
//         <View style={styles.metaRow}>
//           <View style={styles.typePill}>
//             <Text style={styles.typePillText}>Question Type : {currentQuestion.type}</Text>
//           </View>
//           <TouchableOpacity style={styles.reviewToggle} onPress={handleToggleReview} activeOpacity={0.7}>
//             <Text style={styles.reviewToggleText}>Review</Text>
//             <Ionicons
//               name={reviewMarked[currentQuestion.id] ? "star" : "star-outline"}
//               size={18}
//               color={reviewMarked[currentQuestion.id] ? GOLD : "#111111"}
//             />
//           </TouchableOpacity>
//         </View>

//         {/* Question */}
//         <View style={styles.questionRow}>
//           <View style={styles.questionNumberBox}>
//             <Text style={styles.questionNumberText}>{currentIndex + 1}</Text>
//           </View>
//           <Text style={styles.questionLabel}>Question</Text>
//         </View>
//         <Text style={styles.questionText}>{currentQuestion.text}</Text>

//         {/* Options */}
//         <View style={styles.optionsWrap}>
//           {currentQuestion.options.map((option) => {
//             const selected = answers[currentQuestion.id] === option.key;
//             return (
//               <TouchableOpacity
//                 key={option.key}
//                 style={[styles.optionRow, selected && styles.optionRowSelected]}
//                 onPress={() => handleSelectOption(option.key)}
//                 activeOpacity={0.8}
//               >
//                 <View style={[styles.optionBullet, selected && styles.optionBulletSelected]}>
//                   <Text style={[styles.optionBulletText, selected && styles.optionBulletTextSelected]}>
//                     {option.key}
//                   </Text>
//                 </View>
//                 <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
//                   {option.label}
//                 </Text>
//               </TouchableOpacity>
//             );
//           })}
//         </View>

//         {/* Report */}
//         <TouchableOpacity style={styles.reportRow} onPress={handleReport} activeOpacity={0.7}>
//           <Ionicons name="alert-circle" size={16} color="#D9534F" />
//           <Text style={styles.reportText}>Report</Text>
//         </TouchableOpacity>
//       </ScrollView>

//       {/* Footer nav buttons */}
//       <View style={styles.footer}>
//         <TouchableOpacity
//           style={[styles.prevBtn, currentIndex === 0 && styles.prevBtnDisabled]}
//           onPress={handlePrevious}
//           disabled={currentIndex === 0}
//           activeOpacity={0.8}
//         >
//           <Ionicons name="chevron-back" size={16} color={NAVY} />
//           <Text style={styles.prevBtnText}>Previous</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.nextBtn} onPress={handleSaveNext} activeOpacity={0.85}>
//           <Text style={styles.nextBtnText}>{isLastQuestion ? "Submit Test" : "Save & Next"}</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Question navigator modal */}
//       <Modal visible={navModalVisible} transparent animationType="fade" onRequestClose={() => setNavModalVisible(false)}>
//         <View style={styles.modalBackdrop}>
//           <View style={styles.navModalSheet}>
//             <View style={styles.navModalHeader}>
//               <View>
//                 <Text style={styles.navModalTitle}>Civil Procedure Code</Text>
//                 <View style={styles.navModalTitleUnderline} />
//               </View>
//               <TouchableOpacity onPress={() => setNavModalVisible(false)} hitSlop={10}>
//                 <Ionicons name="close" size={22} color="#111111" />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.questionsCountRow}>
//               <Text style={styles.questionsCountText}>Questions: {questions.length}</Text>
//               <Ionicons name="information-circle-outline" size={18} color="#111111" />
//             </View>

//             <View style={styles.numberGrid}>
//               {questions.map((q, idx) => {
//                 const status = getQuestionStatus(q);
//                 return (
//                   <TouchableOpacity
//                     key={q.id}
//                     style={[
//                       styles.numberBox,
//                       status === "answered" && styles.numberBoxAnswered,
//                       status === "notAnswered" && styles.numberBoxNotAnswered,
//                       status === "markedForReview" && styles.numberBoxReview,
//                       idx === currentIndex && styles.numberBoxCurrent,
//                     ]}
//                     onPress={() => goToQuestion(idx)}
//                   >
//                     <Text
//                       style={[
//                         styles.numberBoxText,
//                         (status === "answered" || status === "markedForReview") &&
//                           styles.numberBoxTextLight,
//                       ]}
//                     >
//                       {idx + 1}
//                     </Text>
//                   </TouchableOpacity>
//                 );
//               })}
//             </View>

//             <View style={styles.legendGrid}>
//               <View style={styles.legendItem}>
//                 <View style={[styles.legendDot, { backgroundColor: NAVY }]}>
//                   <Ionicons name="checkmark" size={10} color="#FFFFFF" />
//                 </View>
//                 <Text style={styles.legendText}>Answered</Text>
//               </View>
//               <View style={styles.legendItem}>
//                 <View style={[styles.legendDot, { backgroundColor: MAROON }]}>
//                   <Ionicons name="checkmark" size={10} color="#FFFFFF" />
//                 </View>
//                 <Text style={styles.legendText}>Not Answered</Text>
//               </View>
//               <View style={styles.legendItem}>
//                 <View style={[styles.legendDot, { backgroundColor: GOLD }]}>
//                   <Ionicons name="checkmark" size={10} color="#FFFFFF" />
//                 </View>
//                 <Text style={styles.legendText}>Marked For Review</Text>
//               </View>
//               <View style={styles.legendItem}>
//                 <View style={[styles.legendDot, styles.legendDotOutlineMaroon]}>
//                   <Ionicons name="checkmark" size={10} color={MAROON} />
//                 </View>
//                 <Text style={styles.legendText}>Not Answered</Text>
//               </View>
//               <View style={styles.legendItem}>
//                 <View style={[styles.legendDot, styles.legendDotOutlineGold]}>
//                   <Ionicons name="checkmark" size={10} color={GOLD} />
//                 </View>
//                 <Text style={styles.legendText}>Marked For Review</Text>
//               </View>
//             </View>

//             <TouchableOpacity
//               style={styles.submitFromNavBtn}
//               onPress={() => {
//                 setNavModalVisible(false);
//                 setSummaryModalVisible(true);
//               }}
//               activeOpacity={0.85}
//             >
//               <Text style={styles.submitFromNavBtnText}>Submit Test</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* Pre-submit summary modal */}
//       <Modal
//         visible={summaryModalVisible}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setSummaryModalVisible(false)}
//       >
//         <View style={styles.modalBackdrop}>
//           <View style={styles.summaryModalCard}>
//             <Text style={styles.summaryTitle}>Test Summary</Text>
//             <Text style={styles.summarySubtitle}>Your responses are saved successfully!</Text>

//             <View style={styles.summaryTable}>
//               <View style={styles.summaryTableHeaderRow}>
//                 <Text style={[styles.summaryTableCell, styles.summaryTableHeaderText]}>Section</Text>
//                 <Text style={[styles.summaryTableCell, styles.summaryTableHeaderText]}>Attempted</Text>
//                 <Text style={[styles.summaryTableCell, styles.summaryTableHeaderText]}>Skipped</Text>
//               </View>
//               <View style={styles.summaryTableRow}>
//                 <Text style={styles.summaryTableCell}>Civil Law</Text>
//                 <Text style={styles.summaryTableCell}>{attemptedCount}</Text>
//                 <Text style={styles.summaryTableCell}>{skippedCount}</Text>
//               </View>
//               <View style={styles.summaryTableRow}>
//                 <Text style={[styles.summaryTableCell, { fontWeight: "700" }]}>Total</Text>
//                 <Text style={[styles.summaryTableCell, { fontWeight: "700" }]}>{attemptedCount}</Text>
//                 <Text style={[styles.summaryTableCell, { fontWeight: "700" }]}>{skippedCount}</Text>
//               </View>
//             </View>

//             <View style={styles.warningRow}>
//               <Ionicons name="alert-circle" size={16} color={GOLD} />
//               <Text style={styles.warningText}>Are you sure want to submit the test?</Text>
//             </View>

//             <View style={styles.summaryBtnRow}>
//               <TouchableOpacity
//                 style={styles.summaryCancelBtn}
//                 onPress={() => setSummaryModalVisible(false)}
//                 activeOpacity={0.8}
//               >
//                 <Text style={styles.summaryCancelBtnText}>Cancel</Text>
//               </TouchableOpacity>
//              <TouchableOpacity
//   style={styles.summarySubmitBtn}
//   onPress={() => {
//     console.log("Submit Test button pressed");
//     // router.push("/subject_mock_test/summary");
//   }}
//   activeOpacity={0.85}
// >
//   <Text style={styles.summarySubmitBtnText}>Submit Test</Text>
// </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: "#EDEEF5" },
//   scrollContent: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 20 },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: 14,
//   },
//   headerTitle: { fontSize: 18, fontWeight: "700", color: "#111111" },
//   timeLeftText: { fontSize: 13, color: "#111111", marginTop: 4 },
//   timeLeftValue: { color: "#D9534F", fontWeight: "700" },
//   metaRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 18,
//   },
//   typePill: {
//     backgroundColor: "#D6DCEE",
//     borderRadius: 8,
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//   },
//   typePillText: { fontSize: 12, color: "#333333", fontWeight: "500" },
//   reviewToggle: { flexDirection: "row", alignItems: "center", gap: 4 },
//   reviewToggleText: { fontSize: 13, color: "#111111" },
//   questionRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
//   questionNumberBox: {
//     width: 30,
//     height: 30,
//     borderRadius: 6,
//     backgroundColor: "#D6DCEE",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   questionNumberText: { fontSize: 14, fontWeight: "700", color: "#111111" },
//   questionLabel: { fontSize: 15, fontWeight: "700", color: "#111111" },
//   questionText: { fontSize: 16, lineHeight: 24, color: "#111111", marginBottom: 20 },
//   optionsWrap: { gap: 12, marginBottom: 24 },
//   optionRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#C7CCDA",
//     borderRadius: 10,
//     paddingVertical: 14,
//     paddingHorizontal: 14,
//     gap: 12,
//   },
//   optionRowSelected: { backgroundColor: NAVY },
//   optionBullet: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     backgroundColor: "#FFFFFF",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   optionBulletSelected: { backgroundColor: "#FFFFFF" },
//   optionBulletText: { fontSize: 13, fontWeight: "700", color: "#111111" },
//   optionBulletTextSelected: { color: NAVY },
//   optionLabel: { fontSize: 14, color: "#111111", flex: 1 },
//   optionLabelSelected: { color: "#FFFFFF", fontWeight: "500" },
//   reportRow: { flexDirection: "row", alignItems: "center", gap: 6 },
//   reportText: { color: "#D9534F", fontSize: 14, fontWeight: "600" },
//   footer: {
//     flexDirection: "row",
//     gap: 12,
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     backgroundColor: "#EDEEF5",
//   },
//   prevBtn: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 4,
//     backgroundColor: "#C7CCDA",
//     borderRadius: 10,
//     paddingVertical: 14,
//   },
//   prevBtnDisabled: { opacity: 0.6 },
//   prevBtnText: { color: NAVY, fontSize: 14, fontWeight: "700" },
//   nextBtn: {
//     flex: 1,
//     backgroundColor: NAVY,
//     borderRadius: 10,
//     paddingVertical: 14,
//     alignItems: "center",
//   },
//   nextBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },

//   // Nav modal
//   modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
//   navModalSheet: {
//     backgroundColor: "#FFFFFF",
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//     paddingBottom: 28,
//   },
//   navModalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: 12,
//   },
//   navModalTitle: { fontSize: 16, fontWeight: "700", color: "#111111" },
//   navModalTitleUnderline: {
//     height: 3,
//     width: 60,
//     backgroundColor: MAROON,
//     marginTop: 6,
//     borderRadius: 2,
//   },
//   questionsCountRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     marginBottom: 16,
//   },
//   questionsCountText: { fontSize: 14, fontWeight: "700", color: "#111111" },
//   numberGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
//   numberBox: {
//     width: 40,
//     height: 40,
//     borderRadius: 8,
//     borderWidth: 1.5,
//     borderColor: "#B5B5B5",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   numberBoxAnswered: { backgroundColor: NAVY, borderColor: NAVY },
//   numberBoxNotAnswered: { borderColor: MAROON },
//   numberBoxReview: { backgroundColor: GOLD, borderColor: GOLD },
//   numberBoxCurrent: { borderColor: GOLD, borderWidth: 2 },
//   numberBoxText: { fontSize: 14, fontWeight: "700", color: "#111111" },
//   numberBoxTextLight: { color: "#FFFFFF" },
//   legendGrid: { gap: 12, marginBottom: 20 },
//   legendItem: { flexDirection: "row", alignItems: "center", gap: 8 },
//   legendDot: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   legendDotOutlineMaroon: { backgroundColor: "#FFFFFF", borderWidth: 1.5, borderColor: MAROON },
//   legendDotOutlineGold: { backgroundColor: "#FFFFFF", borderWidth: 1.5, borderColor: GOLD },
//   legendText: { fontSize: 13, color: "#111111" },
//   submitFromNavBtn: {
//     backgroundColor: NAVY,
//     borderRadius: 10,
//     paddingVertical: 15,
//     alignItems: "center",
//   },
//   submitFromNavBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },

//   // Summary modal
//   summaryModalCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 18,
//     padding: 20,
//     marginHorizontal: 16,
//     marginBottom: "auto",
//     marginTop: "auto",
//   },
//   summaryTitle: { fontSize: 18, fontWeight: "700", color: "#111111", marginBottom: 4 },
//   summarySubtitle: { fontSize: 13, color: "#5A5A5A", marginBottom: 16 },
//   summaryTable: { borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 10, overflow: "hidden", marginBottom: 16 },
//   summaryTableHeaderRow: { flexDirection: "row", backgroundColor: "#F4F4F4", paddingVertical: 10 },
//   summaryTableRow: {
//     flexDirection: "row",
//     paddingVertical: 10,
//     borderTopWidth: 1,
//     borderTopColor: "#EEEEEE",
//   },
//   summaryTableCell: { flex: 1, textAlign: "center", fontSize: 13, color: "#111111" },
//   summaryTableHeaderText: { fontWeight: "700" },
//   warningRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     backgroundColor: "#FBF3D9",
//     borderRadius: 8,
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     marginBottom: 18,
//   },
//   warningText: { fontSize: 13, color: "#7A5C10", flex: 1 },
//   summaryBtnRow: { flexDirection: "row", gap: 12 },
//   summaryCancelBtn: {
//     flex: 1,
//     borderRadius: 10,
//     paddingVertical: 14,
//     alignItems: "center",
//     borderWidth: 1.5,
//     borderColor: MAROON,
//   },
//   summaryCancelBtnText: { color: MAROON, fontSize: 14, fontWeight: "700" },
//   summarySubmitBtn: {
//     flex: 1,
//     borderRadius: 10,
//     paddingVertical: 14,
//     alignItems: "center",
//     backgroundColor: MAROON,
//   },
//   summarySubmitBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
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
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { Toast } from "react-native-toast-message/lib/src/Toast";


interface Answer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  _id: string;
}

interface AttemptResultData {
  _id: string;
  userId: string;
  testId: string;
  answers: Answer[];
  startedAt: string; // ISO date string
  attemptNumber: number;
  prelimes_attempt_id: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
  submittedAt: string; // ISO date string
}

interface AttemptResultResponse {
  statusCode: number;
  message: string;
  data: AttemptResultData;
}

// ---- API response shapes ----
interface ApiQuestion {
  _id: string;
  questionId: string;
  prelimes_test_id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  marks: number;
  summary: string[];
  question_number: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface QuestionsListResponse {
  statusCode: number;
  message: string;
  totalCount: number;
  currentPage: number;
  limit: number;
  totalPages: number;
  data: ApiQuestion[];
}

// ---- UI-local shape (keeps existing render logic working) ----
type Question = {
  id: string; // questionId
  type: string;
  text: string;
  options: { key: string; label: string }[];
};

const OPTION_KEYS = ["A", "B", "C", "D", "E", "F"];

function mapApiQuestion(q: ApiQuestion): Question {
  return {
    id: q.questionId,
    type: "Multiple Choice",
    text: q.question,
    options: q.options.map((label, idx) => ({
      key: OPTION_KEYS[idx] ?? String(idx),
      label,
    })),
  };
}

const TOTAL_TIME_SECONDS = 3 * 60;

const NAVY = "#0A1A3B";
const GOLD = "#C9A227";
const MAROON = "#7A1F2B";

type QuestionStatus = "answered" | "notAnswered" | "markedForReview" | "unvisited";


export default function Test() {
  const { quizId } = useLocalSearchParams<{ quizId?: string }>();
  const { prelimes_test_id,prelimes_attempt_id } = useLocalSearchParams<{ prelimes_test_id?: string ,prelimes_attempt_id: string}>();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [questionsError, setQuestionsError] = useState<string | null>(null);
const [result, setResult] = useState<AttemptResultData | null>(null);


  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [reviewMarked, setReviewMarked] = useState<Record<string, boolean>>({});
  const [visited, setVisited] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_SECONDS);
  const [navModalVisible, setNavModalVisible] = useState(false);
  const [summaryModalVisible, setSummaryModalVisible] = useState(false);

  // ---- Fetch questions for this test ----
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!prelimes_test_id) {
        setQuestionsError("No test selected.");
        setLoadingQuestions(false);
        return;
      }

      setLoadingQuestions(true);
      setQuestionsError(null);
      try {
        const response = await axios.get<QuestionsListResponse>(
          `https://api.raoslawacademy.com/prelimes-tests/getquestionlist`,   {
    params: {
      page: 1,
      limit: 10,
      prelimes_test_id : "0c7a889d-e09b-48e5-874f-183081fa91b8",
    },
  }
        );



        console.log("QUESTIONS RESPONSE:", response.data);

        if (response.data.statusCode === 200 && response.data.data.length > 0) {
          const mapped = response.data.data
            .sort((a, b) => a.question_number - b.question_number)
            .map(mapApiQuestion);
          setQuestions(mapped);
          setVisited({ [mapped[0].id]: true });
        } else {
          setQuestionsError(response.data.message || "No questions found for this test.");
        }
      } catch (err: any) {
        console.log(err?.response?.data || err.message);
        setQuestionsError(err?.response?.data?.message || "Couldn't load questions.");
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, [prelimes_test_id]);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  // ---- Countdown timer ----
  useEffect(() => {
    if (loadingQuestions || questions.length === 0) return;
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, loadingQuestions, questions.length]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const getQuestionStatus = (question: Question): QuestionStatus => {
    if (reviewMarked[question.id]) return "markedForReview";
    if (answers[question.id]) return "answered";
    if (visited[question.id]) return "notAnswered";
    return "unvisited";
  };

  const goToQuestion = (index: number) => {
    setCurrentIndex(index);
    setVisited((prev) => ({ ...prev, [questions[index].id]: true }));
    setNavModalVisible(false);
  };

  const handleSelectOption = (optionKey: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionKey }));
  };

  const handleToggleReview = () => {
    setReviewMarked((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  const handlePrevious = () => {
    if (currentIndex === 0) return;
    goToQuestion(currentIndex - 1);
  };

const handleSkip = () => {
  if (!currentQuestion) return;

  if (isLastQuestion) {
    setSummaryModalVisible(true);
  } else {
    goToQuestion(currentIndex + 1);
  }
};

  const optionKeyToNumber = (key: string): number => {
  return OPTION_KEYS.indexOf(key) + 1;
};

const handleSaveNext = async () => {
  if (!currentQuestion) return;

  const selectedKey = answers[currentQuestion.id]; // e.g. "A", "B", "C"...
  console.log("selected question id:", currentQuestion.id);
  console.log("selected option key:", selectedKey);

  if (selectedKey === undefined) {
    Toast.show({
      type: "error",
      text1: "No answer selected",
      text2: "Please select an option before continuing.",
    });
    return;
  }


  const selectedAnswer = optionKeyToNumber(selectedKey); // "A" -> 1, "B" -> 2, ...
  console.log("selected option as number:", selectedAnswer);

  try {
    const response = await axios.post(
      `https://api.raoslawacademy.com/prelimes-tests/55c8a349-54be-43a4-a1a8-cd23630035a5/answer`,
      {
        questionId: currentQuestion.id,
        selectedAnswer, // converted number, matches API contract
      }
    );

    if (response.data.statusCode === 200) {
      console.log(response.data.data);
      setResult(response.data.data);

      if (isLastQuestion) {
        setSummaryModalVisible(true);
      } else {
        goToQuestion(currentIndex + 1);
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: response.data.message || "Couldn't save the answer.",
      });
    }
  } catch (error: any) {
    console.error("Error saving answer:", error?.response?.data || error.message);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: error?.response?.data?.message || "Couldn't save the answer. Please try again.",
    });
  }
};

const handleSubmitTest = async () => {
  try {
    const response = await axios.post(
      `https://api.raoslawacademy.com/prelimes-tests/${prelimes_attempt_id}/submit`
    );

    if (response.data.statusCode===400){
          Toast.show({
        type: "success",
        text1: "Test submitted",
        text2: "Your answers have been already submitted.",
      });
      router.push({
        pathname:'/grandmodule/grand_test_results'
      });
    }

    if (response.data.statusCode === 200) {
      console.log(response.data.data);
      setResult(response.data.data);

      Toast.show({
        type: "success",
        text1: "Test submitted",
        text2: "Your answers have been submitted successfully.",
      });

      router.push({
        pathname: "/subject_mock_test/view_result",
        params: {
          prelimes_test_id: " 726e06e3-974b-4f42-939e-665e8d256e67",
        },
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: response.data.message || "Couldn't submit the test.",
      });
    }
  } catch (error: any) {
    console.log(error);
    
    console.error("Error submitting test:", error?.response?.data || error.message);
  
  }
};




  const handleReport = () => {
    console.log(`Reported question ${currentQuestion.id}`);
  };

  const attemptedCount = questions.filter((q) => answers[q.id]).length;
  const skippedCount = questions.length - attemptedCount;

  if (loadingQuestions) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centerWrap]}>
        <ActivityIndicator size="large" color={NAVY} />
      </SafeAreaView>
    );
  }

  if (questionsError || questions.length === 0) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centerWrap]}>
        <Text style={styles.errorText}>{questionsError ?? "No questions available."}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDEEF5" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Civil Procedure Code</Text>
            <Text style={styles.timeLeftText}>
              Total Time Left: <Text style={styles.timeLeftValue}>{formatTime(timeLeft)}</Text>
            </Text>
          </View>
          <TouchableOpacity onPress={() => setNavModalVisible(true)} hitSlop={10}>
            <Ionicons name="menu" size={26} color="#111111" />
          </TouchableOpacity>
        </View>

        {/* Question type + review */}
        <View style={styles.metaRow}>
          <View style={styles.typePill}>
            <Text style={styles.typePillText}>Question Type : {currentQuestion.type}</Text>
          </View>
          <TouchableOpacity style={styles.reviewToggle} onPress={handleToggleReview} activeOpacity={0.7}>
            <Text style={styles.reviewToggleText}>Review</Text>
            <Ionicons
              name={reviewMarked[currentQuestion.id] ? "star" : "star-outline"}
              size={18}
              color={reviewMarked[currentQuestion.id] ? GOLD : "#111111"}
            />
          </TouchableOpacity>
        </View>

        {/* Question */}
        <View style={styles.questionRow}>
          <View style={styles.questionNumberBox}>
            <Text style={styles.questionNumberText}>{currentIndex + 1}</Text>
          </View>
          <Text style={styles.questionLabel}>Question</Text>
        </View>
        <Text style={styles.questionText}>{currentQuestion.text}</Text>

        {/* Options */}
        <View style={styles.optionsWrap}>
          {currentQuestion.options.map((option) => {
            const selected = answers[currentQuestion.id] === option.key;
            return (
              <TouchableOpacity
                key={option.key}
                style={[styles.optionRow, selected && styles.optionRowSelected]}
                onPress={() => handleSelectOption(option.key)}
                activeOpacity={0.8}
              >
                <View style={[styles.optionBullet, selected && styles.optionBulletSelected]}>
                  <Text style={[styles.optionBulletText, selected && styles.optionBulletTextSelected]}>
                    {option.key}
                  </Text>
                </View>
                <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Report */}
        <TouchableOpacity style={styles.reportRow} onPress={handleReport} activeOpacity={0.7}>
          <Ionicons name="alert-circle" size={16} color="#D9534F" />
          <Text style={styles.reportText}>Report</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer nav buttons
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.prevBtn, currentIndex === 0 && styles.prevBtnDisabled]}
          onPress={handlePrevious}
          disabled={currentIndex === 0}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={16} color={NAVY} />
          <Text style={styles.prevBtnText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextBtn} onPress={handleSaveNext} activeOpacity={0.85}>
          <Text style={styles.nextBtnText}>{isLastQuestion ? "Submit Test" : "Save & Next"}</Text>
        </TouchableOpacity>
      </View> */}

<View style={styles.footer}>
  <TouchableOpacity
    style={[styles.prevBtn, currentIndex === 0 && styles.prevBtnDisabled]}
    onPress={handlePrevious}
    disabled={currentIndex === 0}
    activeOpacity={0.8}
  >
    <Ionicons name="chevron-back" size={16} color={NAVY} />
    <Text style={styles.prevBtnText}>Previous</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.skipBtn} onPress={handleSkip} activeOpacity={0.8}>
    <Text style={styles.skipBtnText}>Skip</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.nextBtn} onPress={handleSaveNext} activeOpacity={0.85}>
    <Text style={styles.nextBtnText}>{isLastQuestion ? "Submit Test" : "Save & Next"}</Text>
  </TouchableOpacity>
</View>


      {/* Question navigator modal */}
      <Modal visible={navModalVisible} transparent animationType="fade" onRequestClose={() => setNavModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.navModalSheet}>
            <View style={styles.navModalHeader}>
              <View>
                <Text style={styles.navModalTitle}>Civil Procedure Code</Text>
                <View style={styles.navModalTitleUnderline} />
              </View>
              <TouchableOpacity onPress={() => setNavModalVisible(false)} hitSlop={10}>
                <Ionicons name="close" size={22} color="#111111" />
              </TouchableOpacity>
            </View>

            <View style={styles.questionsCountRow}>
              <Text style={styles.questionsCountText}>Questions: {questions.length}</Text>
              <Ionicons name="information-circle-outline" size={18} color="#111111" />
            </View>

            <View style={styles.numberGrid}>
              {questions.map((q, idx) => {
                const status = getQuestionStatus(q);
                return (
                  <TouchableOpacity
                    key={q.id}
                    style={[
                      styles.numberBox,
                      status === "answered" && styles.numberBoxAnswered,
                      status === "notAnswered" && styles.numberBoxNotAnswered,
                      status === "markedForReview" && styles.numberBoxReview,
                      idx === currentIndex && styles.numberBoxCurrent,
                    ]}
                    onPress={() => goToQuestion(idx)}
                  >
                    <Text
                      style={[
                        styles.numberBoxText,
                        (status === "answered" || status === "markedForReview") &&
                          styles.numberBoxTextLight,
                      ]}
                    >
                      {idx + 1}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.legendGrid}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: NAVY }]}>
                  <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                </View>
                <Text style={styles.legendText}>Answered</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: MAROON }]}>
                  <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                </View>
                <Text style={styles.legendText}>Not Answered</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: GOLD }]}>
                  <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                </View>
                <Text style={styles.legendText}>Marked For Review</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.legendDotOutlineMaroon]}>
                  <Ionicons name="checkmark" size={10} color={MAROON} />
                </View>
                <Text style={styles.legendText}>Not Answered</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.legendDotOutlineGold]}>
                  <Ionicons name="checkmark" size={10} color={GOLD} />
                </View>
                <Text style={styles.legendText}>Marked For Review</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.submitFromNavBtn}
              onPress={() => {
                setNavModalVisible(false);
                setSummaryModalVisible(true);
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.submitFromNavBtnText}>Submit Test</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Pre-submit summary modal */}
      <Modal
        visible={summaryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSummaryModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.summaryModalCard}>
            <Text style={styles.summaryTitle}>Test Summary</Text>
            <Text style={styles.summarySubtitle}>Your responses are saved successfully!</Text>

            <View style={styles.summaryTable}>
              <View style={styles.summaryTableHeaderRow}>
                <Text style={[styles.summaryTableCell, styles.summaryTableHeaderText]}>Section</Text>
                <Text style={[styles.summaryTableCell, styles.summaryTableHeaderText]}>Attempted</Text>
                <Text style={[styles.summaryTableCell, styles.summaryTableHeaderText]}>Skipped</Text>
              </View>
              <View style={styles.summaryTableRow}>
                <Text style={styles.summaryTableCell}>Civil Law</Text>
                <Text style={styles.summaryTableCell}>{attemptedCount}</Text>
                <Text style={styles.summaryTableCell}>{skippedCount}</Text>
              </View>
            
              <View style={styles.summaryTableRow}>
                <Text style={[styles.summaryTableCell, { fontWeight: "700" }]}>Total</Text>
                <Text style={[styles.summaryTableCell, { fontWeight: "700" }]}>{attemptedCount}</Text>
                <Text style={[styles.summaryTableCell, { fontWeight: "700" }]}>{skippedCount}</Text>
              </View>
            </View>

            <View style={styles.warningRow}>
              <Ionicons name="alert-circle" size={16} color={GOLD} />
              <Text style={styles.warningText}>Are you sure want to submit the test?</Text>
            </View>

            <View style={styles.summaryBtnRow}>
              <TouchableOpacity
                style={styles.summaryCancelBtn}
                onPress={() => setSummaryModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.summaryCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.summarySubmitBtn}
                onPress={handleSubmitTest}
                activeOpacity={0.85}
              >
                <Text style={styles.summarySubmitBtnText}>Submit Test</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#EDEEF5" },
  centerWrap: { justifyContent: "center", alignItems: "center" },
  errorText: { color: "#8A8A8A", fontSize: 14, textAlign: "center", paddingHorizontal: 20 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111111" },
  timeLeftText: { fontSize: 13, color: "#111111", marginTop: 4 },
  timeLeftValue: { color: "#D9534F", fontWeight: "700" },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  footer: {
  flexDirection: "row",
  gap: 10,
  paddingHorizontal: 20,
  paddingTop: 55,
  paddingBottom: 34,
  backgroundColor: "#EDEEF5",
},
  typePill: {
    backgroundColor: "#D6DCEE",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  typePillText: { fontSize: 12, color: "#333333", fontWeight: "500" },
  reviewToggle: { flexDirection: "row", alignItems: "center", gap: 4 },
  reviewToggleText: { fontSize: 13, color: "#111111" },
  questionRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  questionNumberBox: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: "#D6DCEE",
    alignItems: "center",
    justifyContent: "center",
  },
  questionNumberText: { fontSize: 14, fontWeight: "700", color: "#111111" },
  questionLabel: { fontSize: 15, fontWeight: "700", color: "#111111" },
  questionText: { fontSize: 16, lineHeight: 24, color: "#111111", marginBottom: 20 },
  optionsWrap: { gap: 12, marginBottom: 24 },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#C7CCDA",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 12,
  },
  optionRowSelected: { backgroundColor: NAVY },
  optionBullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  optionBulletSelected: { backgroundColor: "#FFFFFF" },
  optionBulletText: { fontSize: 13, fontWeight: "700", color: "#111111" },
  optionBulletTextSelected: { color: NAVY },
  optionLabel: { fontSize: 14, color: "#111111", flex: 1 },
  optionLabelSelected: { color: "#FFFFFF", fontWeight: "500" },
  reportRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  reportText: { color: "#D9534F", fontSize: 14, fontWeight: "600" },
  
  prevBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#C7CCDA",
    borderRadius: 10,
    paddingVertical: 14,
  },
  prevBtnDisabled: { opacity: 0.6 },
  prevBtnText: { color: NAVY, fontSize: 14, fontWeight: "700" },
  nextBtn: {
    flex: 1,
    backgroundColor: NAVY,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  nextBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  navModalSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 28,
  },
  navModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  navModalTitle: { fontSize: 16, fontWeight: "700", color: "#111111" },
  navModalTitleUnderline: {
    height: 3,
    width: 60,
    backgroundColor: MAROON,
    marginTop: 6,
    borderRadius: 2,
  },
  questionsCountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  questionsCountText: { fontSize: 14, fontWeight: "700", color: "#111111" },
  numberGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  numberBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#B5B5B5",
    alignItems: "center",
    justifyContent: "center",
  },
  numberBoxAnswered: { backgroundColor: NAVY, borderColor: NAVY },
  numberBoxNotAnswered: { borderColor: MAROON },
  numberBoxReview: { backgroundColor: GOLD, borderColor: GOLD },
  numberBoxCurrent: { borderColor: GOLD, borderWidth: 2 },
  numberBoxText: { fontSize: 14, fontWeight: "700", color: "#111111" },
  numberBoxTextLight: { color: "#FFFFFF" },
  legendGrid: { gap: 12, marginBottom: 20 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  legendDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  legendDotOutlineMaroon: { backgroundColor: "#FFFFFF", borderWidth: 1.5, borderColor: MAROON },
  legendDotOutlineGold: { backgroundColor: "#FFFFFF", borderWidth: 1.5, borderColor: GOLD },
  legendText: { fontSize: 13, color: "#111111" },
  submitFromNavBtn: {
    backgroundColor: NAVY,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
  },

  skipBtn: {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "transparent",
  borderRadius: 10,
  paddingVertical: 14,
  borderWidth: 1.5,
  borderColor: MAROON,
},
skipBtnText: { color: MAROON, fontSize: 14, fontWeight: "700" },
  submitFromNavBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
  summaryModalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: "auto",
    marginTop: "auto",
  },
  summaryTitle: { fontSize: 18, fontWeight: "700", color: "#111111", marginBottom: 4 },
  summarySubtitle: { fontSize: 13, color: "#5A5A5A", marginBottom: 16 },
  summaryTable: { borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 10, overflow: "hidden", marginBottom: 16 },
  summaryTableHeaderRow: { flexDirection: "row", backgroundColor: "#F4F4F4", paddingVertical: 10 },
  summaryTableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  summaryTableCell: { flex: 1, textAlign: "center", fontSize: 13, color: "#111111" },
  summaryTableHeaderText: { fontWeight: "700" },
  warningRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FBF3D9",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 18,
  },
  warningText: { fontSize: 13, color: "#7A5C10", flex: 1 },
  summaryBtnRow: { flexDirection: "row", gap: 12 },
  summaryCancelBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: MAROON,
  },
  summaryCancelBtnText: { color: MAROON, fontSize: 14, fontWeight: "700" },
  summarySubmitBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: MAROON,
  },
  summarySubmitBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
});