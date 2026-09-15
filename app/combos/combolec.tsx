import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";

const NAVY = "#1B2559";
const GOLD = "#D4A537";
const BG = "#F1F3F9";

const SCREEN_WIDTH = Dimensions.get("window").width;
const PLAYER_WIDTH = SCREEN_WIDTH - 32; // matches marginHorizontal: 16 on both sides
const PLAYER_HEIGHT = PLAYER_WIDTH * 0.5625; // 16:9

interface LectureDetail {
  lectureLabel: string; // e.g. "LECTURE 1"
  title: string;
  description: string[];
  youtubeId: string;
  hasNotesPdf: boolean;
}

// Extracts the 11-char YouTube video ID from any common URL shape
function getYoutubeId(url: string): string {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/
  );
  return match ? match[1] : "";
}

const LECTURE: LectureDetail = {
  lectureLabel: "LECTURE 1",
  title: "Introduction Of Civil Procedure Code",
  description: [
    "This introductory video class provides a foundational understanding of the Code of Civil Procedure, 1908 (CPC), the cornerstone legislation governing civil justice administration in India.",
    "Start your journey to becoming a Junior Civil Judge in Andhra Pradesh with the right guidance and resources!",
  ],
  youtubeId: getYoutubeId("https://youtu.be/FBhPc7U8WPY?si=E4KrIc69A8UFeZo5"),
  hasNotesPdf: true,
};

export default function ComboLec() {
  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  const handleNotesPress = () => {
    // TODO: wire up to actual notes PDF viewer / download
    // router.push("/combos/combolec");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color={NAVY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{LECTURE.lectureLabel}</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* YouTube Video Player */}
        <View style={styles.videoWrap}>
          <YoutubePlayer
            height={PLAYER_HEIGHT}
            width={PLAYER_WIDTH}
            play={playing}
            videoId={LECTURE.youtubeId}
            onChangeState={onStateChange}
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>{LECTURE.title}</Text>

        {/* Description */}
        <Text style={styles.sectionHeading}>Description</Text>
        {LECTURE.description.map((paragraph, index) => (
          <Text key={index} style={styles.descriptionText}>
            {paragraph}
          </Text>
        ))}
      </ScrollView>

      {/* Notes PDF Button */}
      {LECTURE.hasNotesPdf && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.notesBtn}
            activeOpacity={0.85}
            onPress={handleNotesPress}
          >
            <Text style={styles.notesBtnText}>Notes PDF</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: NAVY,
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  videoWrap: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: NAVY,
    marginTop: 18,
    marginHorizontal: 16,
    lineHeight: 26,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: "700",
    color: NAVY,
    marginTop: 18,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 13.5,
    color: "#7A7F94",
    lineHeight: 20,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
    backgroundColor: BG,
  },
  notesBtn: {
    backgroundColor: NAVY,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  notesBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});