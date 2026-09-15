import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { Toast } from "react-native-toast-message/lib/src/Toast";

interface NotesCourseDetails {
  _id: string;
  notes_id: string;
  title: string;
  sub_title: string;
  about_book: {
    description: string;
    sections: {
      title: string;
      topics: string[];
    }[];
  };
  presentation_image: string;
  isPrintAvail: boolean;
  printNotes_image: string;
  terms_conditions: string;
  subcategory_id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface MainsCourseDetails {
  _id: string;
  mains_id: string;
  title: string;
  sub_title: string;
  about_course: string;
  course_points: string[];
  terms_conditions: string;
  presentation_image: string;
  subcategory_id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PrelimesCourseDetails {
  _id: string;
  prelimes_id: string;
  title: string;
  sub_title: string;
  about_course: string;
  course_points: string[];
  terms_conditions: string;
  presentation_image: string;
  subcategory_id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ComboCourseDetails {
  _id: string;
  combo_id: string;
  title: string;
  description: string;
  presentation_image: string;
  categoryId: string;
  subcategory_id: string;
  includes_lectures: boolean;
  includes_notes: boolean;
  includes_prelimes: boolean;
  includes_mains: boolean;
  mains_ids: string[];
  prelimes_ids: string[];
  lecture_config: {
    access_type: string;
    law_id: string;
  };
  notes_config: {
    access_type: string;
    law_id: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

type CourseDetails =
  | NotesCourseDetails
  | MainsCourseDetails
  | PrelimesCourseDetails
  | ComboCourseDetails;

type EnrollType =
  | "full-course"
  | "subject-wise"
  | "notes"
  | "mains"
  | "prelimes"
  | "combination";

interface UserCourseEnrollment {
  _id: string;
  enroll_id: string;
  userId: string;
  course_id: string;
  enroll_date: string;
  expiry_date: string;
  payment_id: string;
  status: string;
  enroll_type: EnrollType;
  planId: string;
  coupon_code?: string;
  final_price?: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  courseDetails?: CourseDetails;
}

interface GetUserCoursesResponse {
  statusCode: number;
  message: string;
  data: UserCourseEnrollment[];
}

const API_BASE_URL = "https://api.raoslawacademy.com";

type Tab = "Active" | "Completed";



export default function MyCourse() {
  const { userId } = useLocalSearchParams<{ userId?: string }>();

  const [activeTab, setActiveTab] = useState<Tab>("Active");
  const [enrollments, setEnrollments] = useState<UserCourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserCourses();
  }, [userId]);

  const fetchUserCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.post<GetUserCoursesResponse>(
        `https://api.raoslawacademy.com/enrollments/user_courses`,
        { userId :"4237c5bb-30d1-495a-96f8-d70ba48ec110" },
      );

      if (response.data.statusCode === 200) {
        setEnrollments(response.data.data ?? []);
        console.log("User Courses Response:", response.data.data);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: response.data.message || "Couldn't load your courses.",
        });
      }
    } catch (error: any) {
      console.error("Error fetching user courses:", error?.response?.data || error.message);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Couldn't load your courses. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const normalizedTab = (status: string): Tab =>
    status?.toLowerCase() === "completed" ? "Completed" : "Active";

  const visibleCourses = enrollments.filter(
    (enrollment) => normalizedTab(enrollment.status) === activeTab
  );


  const handleContinueCourse = (enrollment: UserCourseEnrollment) => {
  const { courseDetails, enroll_type, course_id, enroll_id } = enrollment;

  if (!courseDetails) {
    Toast.show({
      type: "error",
      text1: "Course unavailable",
      text2: "We couldn't find details for this course.",
    });
    return;
  }

  switch (enroll_type) {
    case "notes":
      router.push({
        pathname: "/sidepanel/my_courses/ap_course",
        params: {
        overviewdata: JSON.stringify(courseDetails),
        },
      });
      break;

    case "mains":
      router.push({
        pathname: "/sidepanel/my_courses/ap_course",
        params: {
          overviewdata: JSON.stringify(courseDetails),
        },
      });
      break;

    case "prelimes":
      router.push({
        pathname: "/sidepanel/my_courses/ap_course",
        params: {
           overviewdata: JSON.stringify(courseDetails),
        },
      });
      break;

    case "combination":
      router.push({
        pathname:"/sidepanel/my_courses/ap_course",
        params: {
          id: (courseDetails as ComboCourseDetails).combo_id,
          enrollId: enroll_id,
        },
      });
      break;

    case "full-course":
    case "subject-wise":
      router.push({
        pathname:"/sidepanel/my_courses/ap_course",
        params: {
          id: course_id,
          enrollId: enroll_id,
        },
      });
      break;

    default:
      Toast.show({
        type: "error",
        text1: "Unsupported course type",
        text2: `Can't open course type "${enroll_type}".`,
      });
  }
};

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDEEF5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={26} color="#0A1A3B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Courses</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Active" && styles.tabActive]}
          activeOpacity={0.85}
          onPress={() => setActiveTab("Active")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Active" && styles.tabTextActive,
            ]}
          >
            Active
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "Completed" && styles.tabActive]}
          activeOpacity={0.85}
          onPress={() => setActiveTab("Completed")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Completed" && styles.tabTextActive,
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#23408E" style={{ marginTop: 40 }} />
        ) : visibleCourses.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="book-outline"
              size={40}
              color="#9CA3AF"
            />
            <Text style={styles.emptyText}>
              No {activeTab.toLowerCase()} courses yet
            </Text>
          </View>
        ) : (
          visibleCourses.map((enrollment) => {
            const title = enrollment.courseDetails?.title ?? "Untitled Course";
            const imageUrl =
              enrollment.courseDetails?.presentation_image ??
              "https://images.unsplash.com/photo-1589578527966-fdac0f44566c?w=400";
            // No progress field exists on the API yet — defaulting to 0.
            const percent = 0;

            return (
              <View key={enrollment.enroll_id} style={styles.courseCard}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.courseImage}
                  resizeMode="cover"
                />

                <View style={styles.courseBody}>
                  <Text style={styles.courseTitle}>{title}</Text>

                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${percent}%` },
                      ]}
                    />
                  </View>

                  <View style={styles.courseFooter}>
                    <Text style={styles.percentText}>
                      {percent}% Completed
                    </Text>
<TouchableOpacity
  style={styles.continueButton}
  activeOpacity={0.85}
  onPress={() => handleContinueCourse(enrollment)}
>
  <Text style={styles.continueText}>Continue</Text>
</TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        )}

       
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEEF5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 12,
    gap: 8,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0A1A3B",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    backgroundColor: "#23408E",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#23408E",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 10,
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  courseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  courseImage: {
    width: "100%",
    height: 140,
    backgroundColor: "#D8DEEE",
  },
  courseBody: {
    padding: 16,
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D8DEEE",
    overflow: "hidden",
    marginBottom: 10,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: "#23408E",
  },
  courseFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  percentText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  continueButton: {
    backgroundColor: "#D8AE24",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 22,
  },
  continueText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0A1A3B",
  },
  orderCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  orderImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#D8DEEE",
  },
  orderInfo: {
    flex: 1,
    gap: 2,
  },
  orderNumber: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  orderQty: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  shipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  shipText: {
    fontSize: 12,
    color: "#DC2626",
    fontWeight: "600",
  },
  orderPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#23408E",
  },
});