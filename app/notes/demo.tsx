import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Demo() {
  const [showModal, setShowModal] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Demo Notes</Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Demo Note */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => alert("Open PDF / Image here")}
        >
          <View style={styles.card}>
            {/* <Image
              source={require("../../assets/images/demo-note.png")}
              style={styles.image}
              resizeMode="cover"
            /> */}

            <Text style={styles.title}>Demo Notes</Text>

            <View style={styles.row}>
              <View style={styles.tagPink}>
                <Text style={styles.tagPinkText}>Real Time examples</Text>
              </View>

              <View style={styles.tagGold}>
                <Ionicons
                  name="eye-outline"
                  size={14}
                  color="#C9A227"
                />
                <Text style={styles.tagGoldText}>100+ Views</Text>
              </View>

              <Ionicons
                name="bookmark-outline"
                size={22}
                color="#0F2557"
              />
            </View>
          </View>
        </TouchableOpacity>

        {/* Locked Note */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setShowModal(true)}
        >
          <View style={styles.card}>
            {/* <Image
              source={require("../../assets/images/demo-note.png")}
              style={styles.image}
            /> */}

            <View style={styles.lockOverlay}>
              <Ionicons
                name="lock-closed"
                size={40}
                color="#0F2557"
              />
            </View>

            <Text style={styles.title}>Civil Procedure Code Notes</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Popup */}
      <Modal
        transparent
        visible={showModal}
        animationType="slide"
      >
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <TouchableOpacity
              style={styles.close}
              onPress={() => setShowModal(false)}
            >
              <Ionicons name="close" size={28} />
            </TouchableOpacity>
{/* 
            <Image
              source={require("../../assets/images/unlock.png")}
              style={styles.unlockImage}
              resizeMode="contain"
            /> */}

            <Text style={styles.unlockTitle}>
              UNLOCK FULL ACCESS
            </Text>

            <Text style={styles.unlockSub}>
              To continue watching, purchase the full course
            </Text>

            <TouchableOpacity
              style={styles.buyBtn}
              onPress={() => router.push("/notes/civil_buy")}
            >
              <Text style={styles.buyText}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6FA" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 45,
    paddingBottom: 15,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
    marginBottom: 20,
  },

  image: {
    width: "100%",
    height: 180,
    borderRadius: 12,
  },

  title: {
    marginTop: 10,
    fontWeight: "700",
    fontSize: 18,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },

  tagPink: {
    backgroundColor: "#F6D9DC",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  tagPinkText: {
    color: "#8A3B45",
  },

  tagGold: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3E8C8",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  tagGoldText: {
    color: "#8A6D1D",
    marginLeft: 5,
  },

  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.45)",
  },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  popup: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    alignItems: "center",
  },

  close: {
    position: "absolute",
    right: 20,
    top: 15,
  },

  unlockImage: {
    width: 170,
    height: 140,
  },

  unlockTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 10,
  },

  unlockSub: {
    textAlign: "center",
    color: "#666",
    marginVertical: 15,
    fontSize: 17,
  },

  buyBtn: {
    backgroundColor: "#C9A227",
    width: "80%",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  buyText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
});