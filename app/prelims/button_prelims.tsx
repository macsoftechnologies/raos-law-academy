import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

const COLORS = {
  navy: "#23408E",
  gold: "#D8AE24",
  goldLight: "#F3E7C5",
  background: "#EEF1FB",
  cardBg: "#FFFFFF",
  gray: "#8A8A8A",
  border: "#E7EAF2",
};

export default function ButtonPrelims() {
  const { userId } = useLocalSearchParams<{ userId: string }>();

  console.log("ButtonPrelims userId:", userId);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={26} color={COLORS.navy} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Choose Prelims Option</Text>
          <View style={{ width: 26 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.subtitle}>
            Select how you'd like to prepare
          </Text>

          {/* Purchase */}
          <TouchableOpacity
            style={styles.optionCard}
            activeOpacity={0.9}
            onPress={() =>
              router.push({
                pathname: "/prelims/preparation",
                params: { userId },
              } as any)
            }
          >
            <View style={[styles.iconCircle, { backgroundColor: COLORS.goldLight }]}>
              <MaterialCommunityIcons
                name="cart-outline"
                size={32}
                color={COLORS.navy}
              />
            </View>
            <View style={styles.optionTextWrap}>
              <Text style={styles.optionTitle}>Purchase</Text>
              <Text style={styles.optionDesc}>
                Buy prelims notes and test packages
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={COLORS.gray} />
          </TouchableOpacity>

          {/* Subject Wise Mock Test */}
          <TouchableOpacity
            style={styles.optionCard}
            activeOpacity={0.9}
            onPress={() =>
              router.push({
                pathname: "/subject_mock_test/mock_preparation",
                params: { userId: userId },
              } as any)
            }
          >
            <View style={[styles.iconCircle, { backgroundColor: "#FDEBD0" }]}>
              <MaterialCommunityIcons
                name="book-check-outline"
                size={32}
                color={COLORS.navy}
              />
            </View>
            <View style={styles.optionTextWrap}>
              <Text style={styles.optionTitle}>Subject Wise Mock Test</Text>
              <Text style={styles.optionDesc}>
                Practice topic-focused mock tests
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={COLORS.gray} />
          </TouchableOpacity>

          {/* Grand Test */}
          <TouchableOpacity
            style={styles.optionCard}
            activeOpacity={0.9}
            onPress={() =>
              router.push({
                pathname: "/grandmodule/grand_test",
                params: { userId },
              } as any)
            }
          >
            <View style={[styles.iconCircle, { backgroundColor: "#DCE6FB" }]}>
              <MaterialCommunityIcons
                name="trophy-outline"
                size={32}
                color={COLORS.navy}
              />
            </View>
            <View style={styles.optionTextWrap}>
              <Text style={styles.optionTitle}>Grand Test</Text>
              <Text style={styles.optionDesc}>
                Full-length simulated exam test
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={COLORS.gray} />
          </TouchableOpacity>

          {/* Quiz */}
          <TouchableOpacity
            style={styles.optionCard}
            activeOpacity={0.9}
            onPress={() =>
              router.push({
                pathname: "/quiz/quizz_banner",
                params: { userId },
              } as any)
            }
          >
            <View style={[styles.iconCircle, { backgroundColor: "#F6D9DC" }]}>
              <MaterialCommunityIcons
                name="lightning-bolt-outline"
                size={32}
                color={COLORS.navy}
              />
            </View>
            <View style={styles.optionTextWrap}>
              <Text style={styles.optionTitle}>Quiz</Text>
              <Text style={styles.optionDesc}>
                Quick quizzes to test your recall
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={COLORS.gray} />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 64,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.navy,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 20,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  optionTextWrap: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 13,
    color: COLORS.gray,
    lineHeight: 18,
  },
});