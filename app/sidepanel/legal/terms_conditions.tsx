import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import axios from "axios";
import { apiClient } from "@/src/api/client";
import { parseApiError } from "@/src/api/errorHandler";

interface TestTermItem {
  _id: string;
  test_term_id: string;
  testType: string;
  terms_conditions: string[];
  instructions: string[];
  createdAt?: string;
  updatedAt?: string;
}

export default function TermsConditionsScreen() {
  const [termsList, setTermsList] = useState<TestTermItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTerms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(
        "/test-terms?page=1&limit=10"
      );
      if (
        response.data?.statusCode === 200 ||
        response.data?.statusCode === 201 ||
        response.status === 200
      ) {
        setTermsList(response.data.data || []);
      } else {
        setError(response.data?.message || "Failed to load Terms & Conditions");
      }
    } catch (err: any) {
      console.log("Terms & Conditions API error:", err?.response?.data || err.message);
      const parsed = parseApiError(err);
      setError(parsed.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTerms();
  }, [fetchTerms]);

  const filteredTerms = termsList.filter((item) => {
    if (selectedFilter === "ALL") return true;
    return item.testType?.toUpperCase() === selectedFilter;
  });

  const getTestTypeLabel = (type: string) => {
    switch (type?.toUpperCase()) {
      case "GT":
        return "Grand Tests (GT)";
      case "SMT":
        return "Subject Wise Mock Tests (SMT)";
      case "QZ":
        return "Quizzes (QZ)";
      default:
        return `${type} Assessment`;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDEEF5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={10}
        >
          <Ionicons name="chevron-back" size={24} color="#0A1A3B" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Terms & Conditions</Text>
          <Text style={styles.headerSubtitle}>
            Rules, guidelines & test policies
          </Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {["ALL", "GT", "SMT", "QZ"].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterPill,
              selectedFilter === filter && styles.filterPillActive,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter === "ALL" ? "All Policies" : filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#23408E" />
            <Text style={styles.statusText}>
              Loading Terms & Conditions...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Ionicons name="alert-circle-outline" size={44} color="#E53935" />
            <Text style={[styles.statusText, { color: "#E53935", textAlign: "center" }]}>
              {error}
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchTerms}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredTerms.length === 0 ? (
          <View style={styles.centerContainer}>
            <Ionicons name="document-text-outline" size={54} color="#A0AEC0" />
            <Text style={styles.statusText}>
              No terms found for this category.
            </Text>
          </View>
        ) : (
          filteredTerms.map((item, index) => (
            <View key={item._id || item.test_term_id || index} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {getTestTypeLabel(item.testType)}
                  </Text>
                </View>
              </View>

              {/* Terms Section */}
              {item.terms_conditions && item.terms_conditions.length > 0 && (
                <View style={styles.sectionBlock}>
                  <Text style={styles.sectionTitle}>General Terms</Text>
                  {item.terms_conditions.map((term, tIdx) => (
                    <View key={tIdx} style={styles.bulletRow}>
                      <Text style={styles.bulletNumber}>{tIdx + 1}.</Text>
                      <Text style={styles.bulletText}>{term}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Instructions Section */}
              {item.instructions && item.instructions.length > 0 && (
                <View style={[styles.sectionBlock, { marginTop: 14 }]}>
                  <Text style={styles.sectionTitle}>Examination Instructions</Text>
                  {item.instructions.map((inst, iIdx) => (
                    <View key={iIdx} style={styles.bulletRow}>
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={16}
                        color="#23408E"
                        style={{ marginTop: 2, marginRight: 8 }}
                      />
                      <Text style={styles.bulletText}>{inst}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEEF5",
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0A1A3B",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#6B7089",
    marginTop: 2,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E2E5F0",
  },
  filterPillActive: {
    backgroundColor: "#23408E",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0A1A3B",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#0A1A3B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  badge: {
    backgroundColor: "#E8EDFF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#23408E",
  },
  sectionBlock: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0A1A3B",
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  bulletNumber: {
    fontSize: 13,
    fontWeight: "700",
    color: "#23408E",
    marginRight: 8,
    minWidth: 16,
  },
  bulletText: {
    fontSize: 13,
    color: "#4A5568",
    lineHeight: 19,
    flex: 1,
  },
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  statusText: {
    fontSize: 14,
    color: "#6B7089",
    marginTop: 10,
  },
  retryButton: {
    marginTop: 14,
    paddingHorizontal: 20,
    paddingVertical: 9,
    backgroundColor: "#23408E",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});
