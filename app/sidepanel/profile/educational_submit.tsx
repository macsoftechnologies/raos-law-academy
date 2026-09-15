import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

export default function EducationalSubmit() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDEEF5" />

      <View style={styles.content}>
        {/* Illustration */}
        <View style={styles.illustrationWrap}>
          <View style={styles.orangeBlob} />

          {/* Floating decorative icons */}
          <View style={[styles.floatIcon, styles.floatIconTopLeft]}>
            <Feather name="message-square" size={18} color="#0A1A3B" />
          </View>
          <View style={[styles.floatIcon, styles.floatIconTopRight]}>
            <Ionicons name="person-circle-outline" size={20} color="#0A1A3B" />
          </View>
          <View style={[styles.floatIcon, styles.floatIconMidLeft]}>
            <MaterialIcons name="lock-outline" size={18} color="#0A1A3B" />
          </View>
          <View style={[styles.floatIcon, styles.floatIconMidRight]}>
            <MaterialIcons name="vpn-key" size={16} color="#0A1A3B" />
          </View>
          <View style={[styles.floatIcon, styles.floatIconBottomLeft]}>
            <Ionicons name="alert-circle-outline" size={16} color="#7A1F2B" />
          </View>

          {/* Central document + shield */}
          <View style={styles.documentCard}>
            {Array.from({ length: 6 }).map((_, i) => (
              <View key={i} style={styles.docLine} />
            ))}

            <View style={styles.shield}>
              <MaterialCommunityIcons
                name="shield-check-outline"
                size={40}
                color="#EDEEF5"
              />
              <View style={styles.lockBadge}>
                <MaterialIcons name="lock" size={16} color="#0A1A3B" />
              </View>
            </View>
          </View>

          {/* Gavel base */}
          <View style={styles.gavelBase} />

          <View style={[styles.floatIcon, styles.floatIconLowRight]}>
            <MaterialIcons name="chat-bubble-outline" size={16} color="#0A1A3B" />
          </View>
        </View>

        {/* Text */}
        <Text style={styles.title}>Submitted Successfully</Text>
        <Text style={styles.subtitle}>
          We keep your information secure and never{"\n"}share it with third
          parties
        </Text>
      </View>

      {/* Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={() => router.push("/sidepanel/profile/educational_details")}
        >
          <Text style={styles.buttonText}>Ok, Got It !</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEEF5",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  illustrationWrap: {
    width: width * 0.85,
    height: width * 0.85,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  orangeBlob: {
    position: "absolute",
    width: "78%",
    height: "78%",
    borderRadius: 999,
    backgroundColor: "#D9622B",
    opacity: 0.95,
  },
  documentCard: {
    width: "58%",
    height: "62%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    paddingTop: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  docLine: {
    width: "100%",
    height: 5,
    borderRadius: 3,
    backgroundColor: "#D8DEEE",
    marginBottom: 8,
  },
  shield: {
    position: "absolute",
    bottom: -18,
    width: 70,
    height: 78,
    borderRadius: 16,
    backgroundColor: "#0A1A3B",
    alignItems: "center",
    justifyContent: "center",
  },
  lockBadge: {
    position: "absolute",
    bottom: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#D8AE24",
    alignItems: "center",
    justifyContent: "center",
  },
  gavelBase: {
    position: "absolute",
    bottom: "6%",
    width: "70%",
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0A1A3B",
    opacity: 0.9,
  },
  floatIcon: {
    position: "absolute",
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  floatIconTopLeft: { top: "16%", left: "4%" },
  floatIconTopRight: { top: "12%", right: "8%" },
  floatIconMidLeft: { top: "42%", left: "0%" },
  floatIconMidRight: { top: "40%", right: "2%" },
  floatIconBottomLeft: { bottom: "22%", left: "2%" },
  floatIconLowRight: { bottom: "10%", right: "6%" },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#23408E",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: "#0A1A3B",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0A1A3B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});