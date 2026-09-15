import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const COLORS = {
  navy: "#0A1A3B",
  navyLight: "#23408E",
  gold: "#C9A227",
  goldLight: "#D8AE24",
  maroon: "#7A1F2B",
  bg: "#EDEEF5",
  bgLight: "#EEF1FB",
  blue: "#2F7DE1",
  blueSoft: "#E4F0FE",
  green: "#3FB65F",
  gray: "#6B7280",
  white: "#FFFFFF",
};

export default function AdminSubmit() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const message =
    (params?.message as string) ||
    "Your details update issue will be resolved shortly";

  const handleDone = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <View style={styles.container}>
      {/* Illustration */}
      <View style={styles.illustrationWrap}>
        <View style={styles.blobBg} />

        {/* paper plane */}
        <View style={styles.planeWrap}>
          <MaterialCommunityIcons name="send" size={34} color={COLORS.blue} />
        </View>

        {/* dashed gear accent */}
        <View style={styles.gearWrap}>
          <Feather name="settings" size={20} color={COLORS.bg} />
        </View>

        {/* bell bubble */}
        <View style={styles.bellWrap}>
          <Ionicons name="notifications" size={22} color={COLORS.blue} />
        </View>

        {/* envelope */}
        <View style={styles.envelopeWrap}>
          <View style={styles.envelopeBody}>
            <MaterialCommunityIcons
              name="email"
              size={54}
              color={COLORS.blue}
            />
          </View>
        </View>

        {/* document with check */}
        <View style={styles.docWrap}>
          <View style={styles.doc}>
            <View style={styles.docLine} />
            <View style={[styles.docLine, { width: 20 }]} />
            <View style={[styles.docLine, { width: 26 }]} />
          </View>
          <View style={styles.checkBadge}>
            <Ionicons name="checkmark" size={26} color={COLORS.white} />
          </View>
        </View>

        {/* person */}
        <View style={styles.personWrap}>
          <MaterialCommunityIcons
            name="human-handsup"
            size={46}
            color={COLORS.navy}
          />
        </View>

        {/* base bar */}
        <View style={styles.baseBar} />
      </View>

      {/* Text */}
      <Text style={styles.title}>Submitted Successfully</Text>
      <Text style={styles.subtitle}>{message}</Text>

      {/* CTA */}
      <TouchableOpacity
        style={styles.ctaButton}
        activeOpacity={0.85}
        onPress={handleDone}
      >
        <Text style={styles.ctaText}>Ok, Got It !</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 28,
  },
  illustrationWrap: {
    width: width * 0.82,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  blobBg: {
    position: "absolute",
    width: "100%",
    height: 190,
    borderRadius: 100,
    backgroundColor: COLORS.bgLight,
  },
  planeWrap: {
    position: "absolute",
    top: 8,
    right: 20,
    transform: [{ rotate: "18deg" }],
  },
  gearWrap: {
    position: "absolute",
    bottom: 40,
    right: 8,
    opacity: 0.5,
  },
  bellWrap: {
    position: "absolute",
    top: 55,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.blueSoft,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  envelopeWrap: {
    position: "absolute",
    bottom: 30,
    alignItems: "center",
  },
  envelopeBody: {
    width: 130,
    height: 90,
    borderRadius: 14,
    backgroundColor: COLORS.blueSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  docWrap: {
    position: "absolute",
    top: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  doc: {
    width: 96,
    height: 118,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    paddingTop: 62,
    paddingHorizontal: 16,
    alignItems: "flex-start",
  },
  docLine: {
    height: 5,
    width: 40,
    borderRadius: 3,
    backgroundColor: COLORS.bg,
    marginBottom: 6,
  },
  checkBadge: {
    position: "absolute",
    top: 34,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  personWrap: {
    position: "absolute",
    bottom: 10,
    left: 24,
  },
  baseBar: {
    position: "absolute",
    bottom: -8,
    width: "88%",
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.blue,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.navy,
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.gray,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  ctaButton: {
    marginTop: 80,
    backgroundColor: COLORS.navy,
    paddingVertical: 16,
    paddingHorizontal: 56,
    borderRadius: 12,
    shadowColor: COLORS.navy,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  ctaText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});