import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";

interface IdProofData {
  _id: string;
  proof_id: string;
  idType: string;
  id_number: string;
  proof_file: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface GetIdProofsResponse {
  statusCode: number;
  message: string;
  data: IdProofData[];
}

type IdProofRecord = {
  id: string;
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  accentColor: string;
  number: string;
  hasFile: boolean;
};

// Static shell — icons/colors/titles stay fixed, number/hasFile get filled from the API
const SECTION_META: Omit<IdProofRecord, "number" | "hasFile">[] = [
  { id: "aadhar", title: "Aadhar Number", icon: "card-account-details-outline", accentColor: "#23408E" },
  { id: "pan", title: "PAN Number", icon: "card-outline" as any, accentColor: "#7A1F2B" },
  { id: "passport", title: "Passport Number", icon: "passport-biometric" as any, accentColor: "#D8AE24" },
];

// idType values from the API are matched against these (case-insensitive)
const ID_TYPE_MAP: Record<string, string> = {
  aadhar: "Aadhar",
  pan: "PAN",
  passport: "Passport",
};

function CertificateThumb() {
  return (
    <View style={styles.certThumb}>
      <View style={styles.certBand} />
      <View style={styles.certContent}>
        <MaterialIcons name="workspace-premium" size={14} color="#D8AE24" />
        <Text style={styles.certLabel}>CERTIFICATE</Text>
        <View style={styles.certLine} />
        <View style={[styles.certLine, { width: "60%" }]} />
      </View>
      <View style={styles.certCapBadge}>
        <MaterialCommunityIcons name="school" size={14} color="#0A1A3B" />
      </View>
      <View style={styles.certDot} />
    </View>
  );
}

export default function IdDetails() {
  const { userId, student: studentParam } = useLocalSearchParams<{
    userId?: string;
    student?: string;
  }>();

  const student = studentParam ? JSON.parse(studentParam) : null;
  const resolvedUserId = student?.userId ?? userId;

  const [idProofData, setIdProofData] = useState<IdProofRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIdProofs = async () => {


      setLoading(true);
      setError(null);

      try {
        const token = /* pull from wherever this app stores it — AsyncStorage/SecureStore/context */ "";

        const response = await axios.post<GetIdProofsResponse>(
          "https://api.raoslawacademy.com/users/getuserIDs",
          { userId: "4237c5bb-30d1-495a-96f8-d70ba48ec110" },
          { headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImZpbmRVc2VyIjp7Il9pZCI6IjZhNWYzYjNmMjFjYjczOGI2MmQ2NWRhYSIsIm5hbWUiOiJWYXJzaGEiLCJlbWFpbCI6InZhc3VwYWxsaXZhcnNoYUBnbWFpbC5jb20iLCJtb2JpbGVfbnVtYmVyIjoiOTg0OTE4NzQ5MiIsInBhc3N3b3JkIjoiJDJiJDEwJHlWbFhKTUd2RmRwTGxtdEN0bDY0UE95bC80Z1dPNS94T282cDEyNGdDd2JqZUhKdG5JV2J5Iiwib3RwIjoiMzc5NzI2IiwicmVmZXJyYWxfY29kZSI6Ikc5SE82UkVQIiwicm9sZSI6InN0dWRlbnQiLCJ1c2VySWQiOiJhMTI1YjllMS05ZDAxLTQxYzQtOGVlOC03ZWQ0MmY0YWVmODQiLCJjcmVhdGVkQXQiOiIyMDI2LTA3LTIxVDA5OjI2OjIzLjYyOFoiLCJ1cGRhdGVkQXQiOiIyMDI2LTA5LTAyVDA5OjExOjQ0LjIwNFoiLCJfX3YiOjAsImFjdGl2ZVRva2VuU2Vzc2lvbklkIjoiIiwic2Vzc2lvbkV4cGlyZXNBdCI6IjIwMjYtMDktMDlUMDk6MTE6NDQuMDAwWiJ9fSwic2Vzc2lvbklkIjoiMTJlOWRjYzAtODRlOS00YWJiLTljNWQtNWE4ZDAxNzgwZjU4IiwiaWF0IjoxNzg4MzQ1Mjg1LCJleHAiOjE3ODg5NTAwODV9.kFlZtCWpQNT-s0pvpCuWOckrFopPFsnKx3-KI5Mtk7A` } }
        );

        if (response.data?.statusCode === 200) {
          const proofs = response.data.data;

          const merged: IdProofRecord[] = SECTION_META.map((section) => {
            const expectedType = ID_TYPE_MAP[section.id];
            // If there are duplicates, this takes the most recently updated one
            const matches = proofs.filter(
              (p) => p.idType.toLowerCase() === expectedType.toLowerCase()
            );
            const match = matches.sort(
              (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            )[0];

            return {
              ...section,
              number: match ? match.id_number : "Not submitted",
              hasFile: !!match?.proof_file,
            };
          });

          setIdProofData(merged);
        } else {
          setError(response.data?.message || "Couldn't load ID proofs.");
        }
      } catch (err: any) {
        console.error("Error fetching ID proofs:", err?.response?.data || err.message);
        setError("Couldn't load ID proofs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchIdProofs();
  }, [resolvedUserId]);

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

        <Text style={styles.headerTitle}>ID Proofs</Text>

        <TouchableOpacity
          style={styles.editButton}
          activeOpacity={0.7}
          onPress={() => {
            router.push({
              pathname: "/sidepanel/profile/id_proof",
              params: {
                student: JSON.stringify(student),
                userId: resolvedUserId,
              },
            });
          }}
        >
          <Feather name="edit-2" size={14} color="#0A1A3B" />
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#0A1A3B" />
        </View>
      ) : error ? (
        <View style={styles.centerState}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {idProofData.map((item) => (
            <View
              key={item.id}
              style={[styles.card, { borderColor: item.accentColor }]}
            >
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={20}
                  color={item.accentColor}
                />
                <Text style={[styles.cardTitle, { color: item.accentColor }]}>
                  {item.title}
                </Text>
              </View>

              <View style={styles.cardBody}>
                <CertificateThumb />

                <View style={styles.cardInfo}>
                  <Text style={styles.infoLabel}>Number :</Text>
                  <Text style={styles.infoValue}>{item.number}</Text>
                  {!item.hasFile && (
                    <Text style={styles.noFileText}>No file uploaded</Text>
                  )}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
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
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#0A1A3B",
    textAlign: "center",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  editText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0A1A3B",
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#B91C1C",
    textAlign: "center",
    paddingHorizontal: 30,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  cardBody: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  cardInfo: {
    justifyContent: "center",
    gap: 4,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  infoValue: {
    fontSize: 15,
    color: "#374151",
  },
  noFileText: {
    fontSize: 12,
    color: "#B91C1C",
    marginTop: 2,
  },
  certThumb: {
    width: 110,
    height: 70,
    borderRadius: 8,
    backgroundColor: "#F4F1E8",
    borderWidth: 1,
    borderColor: "#D8DEEE",
    overflow: "hidden",
    justifyContent: "center",
  },
  certBand: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: "#0A1A3B",
  },
  certContent: {
    alignItems: "center",
    marginTop: 6,
  },
  certLabel: {
    fontSize: 6,
    fontWeight: "700",
    color: "#0A1A3B",
    letterSpacing: 0.5,
    marginTop: 2,
  },
  certLine: {
    width: "75%",
    height: 2,
    backgroundColor: "#D8DEEE",
    borderRadius: 1,
    marginTop: 4,
  },
  certCapBadge: {
    position: "absolute",
    bottom: 4,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#EDEEF5",
    alignItems: "center",
    justifyContent: "center",
  },
  certDot: {
    position: "absolute",
    bottom: 2,
    left: "50%",
    marginLeft: -3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#B91C1C",
  },
});