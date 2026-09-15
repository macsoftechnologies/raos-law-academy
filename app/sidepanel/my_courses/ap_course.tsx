import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";



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

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800";

const EXTRAS = [
  {
    icon: "account-group" as const,
    title: "Guest Lectures",
    subtitle: "Learn by top advocates",
  },
  {
    icon: "monitor" as const,
    title: "Available on PC",
    subtitle: "Wider screen, sharper quality",
  },
];

function isNotes(c: CourseDetails): c is NotesCourseDetails {
  return "notes_id" in c;
}
function isMains(c: CourseDetails): c is MainsCourseDetails {
  return "mains_id" in c;
}
function isPrelimes(c: CourseDetails): c is PrelimesCourseDetails {
  return "prelimes_id" in c;
}
function isCombo(c: CourseDetails): c is ComboCourseDetails {
  return "combo_id" in c;
}

interface CourseViewModel {
  title: string;
  subtitle?: string;
  about: string;
  image: string;
  highlights: string[];
}

function toViewModel(courseDetails: CourseDetails): CourseViewModel {
  if (isNotes(courseDetails)) {
    return {
      title: courseDetails.title,
      subtitle: courseDetails.sub_title,
      about: courseDetails.about_book?.description ?? "",
      image: courseDetails.presentation_image || FALLBACK_IMAGE,
      highlights:
        courseDetails.about_book?.sections?.flatMap((s) => s.topics) ?? [],
    };
  }

  if (isMains(courseDetails) || isPrelimes(courseDetails)) {
    return {
      title: courseDetails.title,
      subtitle: courseDetails.sub_title,
      about: courseDetails.about_course,
      image: courseDetails.presentation_image || FALLBACK_IMAGE,
      highlights: courseDetails.course_points ?? [],
    };
  }

  if (isCombo(courseDetails)) {
    const highlights: string[] = [];
    if (courseDetails.includes_lectures) highlights.push("Includes video lectures");
    if (courseDetails.includes_notes) highlights.push("Includes study notes");
    if (courseDetails.includes_prelimes) highlights.push("Covers Prelims preparation");
    if (courseDetails.includes_mains) highlights.push("Covers Mains preparation");

    return {
      title: courseDetails.title,
      about: courseDetails.description,
      image: courseDetails.presentation_image || FALLBACK_IMAGE,
      highlights,
    };
  }

  // Exhaustiveness fallback — shouldn't be reached given the union above.
  return {
    title: "Course",
    about: "",
    image: FALLBACK_IMAGE,
    highlights: [],
  };
}

export default function ApCourse() {
  const { overviewdata, enrollId } = useLocalSearchParams<{
    overviewdata?: string;
    enrollId?: string;
  }>();

  let courseDetails: CourseDetails | null = null;
  try {
    courseDetails = overviewdata ? JSON.parse(overviewdata) : null;
  } catch (error) {
    console.error("Error parsing course overview data:", error);
  }

  if (!courseDetails) {
    return (
      <View style={[styles.screen, styles.centerFill]}>
        <StatusBar barStyle="dark-content" backgroundColor="#EDEEF5" />
        <Text style={styles.errorText}>No course data available.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12 }}>
          <Text style={styles.errorLink}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const course = toViewModel(courseDetails);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDEEF5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={26} color="#0A1A3B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {course.title}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <Image source={{ uri: course.image }} style={styles.heroImage} />

        {/* Title + Status */}
        <View style={styles.titleRow}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>In Progress</Text>
          </View>
        </View>

        {course.subtitle ? (
          <Text style={styles.subtitleText}>{course.subtitle}</Text>
        ) : null}

        <View style={styles.divider} />

        {/* About */}
        <Text style={styles.sectionTitle}>About the course</Text>
        <Text style={styles.aboutText}>{course.about}</Text>

        {/* Highlights */}
        {course.highlights.length > 0 ? (
          <View style={styles.highlightsList}>
            {course.highlights.map((item, idx) => (
              <View key={idx} style={styles.highlightRow}>
                <View style={styles.bulletDot} />
                <Text style={styles.highlightText}>{item}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Extras box */}
        <View style={styles.extrasBox}>
          <Text style={styles.extrasTitle}>
            what additional things will you get?
          </Text>
          <View style={styles.extrasRow}>
            {EXTRAS.map((extra, idx) => (
              <View key={idx} style={styles.extraItem}>
                <View style={styles.extraIconCircle}>
                  <MaterialCommunityIcons
                    name={extra.icon}
                    size={16}
                    color="#0A1A3B"
                  />
                </View>
                <Text style={styles.extraTitle}>{extra.title}</Text>
                <Text style={styles.extraSubtitle}>{extra.subtitle}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Closing text */}
        <Text style={styles.closingText}>
          Start your journey with the right guidance and resources!
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#EDEEF5",
  },
  centerFill: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7A1F2B",
    textAlign: "center",
  },
  errorLink: {
    fontSize: 14,
    fontWeight: "700",
    color: "#23408E",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    gap: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#0A1A3B",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  heroImage: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: "#D8DEEE",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  courseTitle: {
    flex: 1,
    fontSize: 19,
    fontWeight: "700",
    color: "#0A1A3B",
    lineHeight: 25,
  },
  statusBadge: {
    backgroundColor: "#7A1F2B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  subtitleText: {
    fontSize: 13.5,
    color: "#7A7F94",
    marginTop: 6,
  },
  divider: {
    height: 1,
    backgroundColor: "#D8DCEA",
    marginVertical: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0A1A3B",
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#7A7F94",
  },
  highlightsList: {
    marginTop: 16,
    gap: 8,
  },
  highlightRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#8A8FA3",
    marginTop: 7,
  },
  highlightText: {
    fontSize: 13.5,
    color: "#5C6178",
    flex: 1,
  },
  extrasBox: {
    backgroundColor: "#FBF0C7",
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
  },
  extrasTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0A1A3B",
    marginBottom: 14,
  },
  extrasRow: {
    flexDirection: "row",
    gap: 16,
  },
  extraItem: {
    flex: 1,
  },
  extraIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#D8AE24",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  extraTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0A1A3B",
    marginBottom: 2,
  },
  extraSubtitle: {
    fontSize: 12,
    color: "#8A8358",
    lineHeight: 16,
  },
  closingText: {
    fontSize: 14.5,
    fontWeight: "600",
    color: "#0A1A3B",
    lineHeight: 22,
    marginTop: 22,
  },
});