import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function CivilBuy() {
  const [visible, setVisible] = useState(true);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>AP Civil</Text>

        <View style={{ width: 24 }} />
      </View>

      {/* Notes */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {[1, 2, 3, 4].map((item) => (
          <View key={item} style={styles.card}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
              }}
              style={styles.image}
            />

            <Text style={styles.title}>
              {item === 1 ? "Demo Notes" : `Locked Notes ${item}`}
            </Text>

            <View style={styles.bottom}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Real Time examples</Text>
              </View>

              <View style={styles.views}>
                <Ionicons name="eye-outline" size={14} color="#D4A537" />
                <Text style={styles.viewsText}>100+ Views</Text>
              </View>

              <Ionicons
                name="bookmark-outline"
                size={22}
                color="#1B2559"
              />
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Unlock Modal */}
      <Modal transparent animationType="slide" visible={visible}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <TouchableOpacity
              style={styles.close}
              onPress={() => setVisible(false)}
            >
              <Ionicons name="close" size={28} color="#000" />
            </TouchableOpacity>

            {/* <Image
              source={require("../../assets/images/unlock.png")}
              style={styles.unlockImage}
              resizeMode="contain"
            /> */}

            <Text style={styles.unlockTitle}>UNLOCK FULL ACCESS</Text>

            <Text style={styles.unlockSub}>
              To continue watching, purchase the full course
            </Text>

            <TouchableOpacity
              style={styles.buyButton}
            //   onPress={() => router.push("/")}
                       onPress={() => router.push("/explore/coursepackage")}
            >
              <Text style={styles.buyText}>Buy Now</Text>
              <Ionicons
                name="cart-outline"
                size={18}
                color="#fff"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F5F9",
    paddingTop: 45,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 10,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 15,
    padding: 10,
  },

  image: {
    width: "100%",
    height: 170,
    borderRadius: 10,
  },

  title: {
    fontWeight: "700",
    fontSize: 16,
    marginTop: 10,
  },

  bottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },

  tag: {
    backgroundColor: "#FFE8E8",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },

  tagText: {
    color: "#C44",
    fontSize: 12,
  },

  views: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3D6",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },

  viewsText: {
    color: "#D4A537",
    marginLeft: 4,
    fontSize: 12,
  },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  modal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 25,
    alignItems: "center",
  },

  close: {
    position: "absolute",
    right: 20,
    top: 15,
  },

  unlockImage: {
    width: 180,
    height: 140,
    marginTop: 20,
  },

  unlockTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 15,
  },

  unlockSub: {
    textAlign: "center",
    color: "#666",
    fontSize: 18,
    marginVertical: 15,
  },

  buyButton: {
    backgroundColor: "#D4A537",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    paddingVertical: 15,
    borderRadius: 12,
  },

  buyText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
});