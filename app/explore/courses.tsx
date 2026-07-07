import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const COURSES = [
  {
    id: 1,
    title: "Andhra Pradesh Junior Civil Judge",
    price: "₹90,000",
    oldPrice: "₹1,30,000",
    image: require("../../assets/images/Rectangle40.png"),
  },
  {
  id: 2,
  title: "Telangana Junior Civil Judge",
  price: "₹90,000",
  oldPrice: "₹1,30,000",
  image: require("../../assets/images/Rectangle41.png"),
 },

];

export default function Courses() {
  const handleBuyNow = (course: (typeof COURSES)[number]) => {
    console.log("Buy:", course.title);
  };

  const handleViewDetails = (course: (typeof COURSES)[number]) => {
    console.log("Details:", course.title);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Junior Civil Judge</Text>

        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {COURSES.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={item.image} style={styles.image} />

            <View style={styles.content}>
              <Text style={styles.title}>{item.title}</Text>

              <View style={styles.priceRow}>
                <Text style={styles.price}>{item.price}</Text>
                <Text style={styles.oldPrice}>{item.oldPrice}</Text>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.buyButton}
                  onPress={() => handleBuyNow(item)}
                >
                  <Text style={styles.buyText}>Buy Now</Text>
                </TouchableOpacity>

              <TouchableOpacity
  style={styles.detailsButton}
  onPress={() => router.push("/explore/courseoverview")}
>
  <Text style={styles.detailsText}>View Details</Text>
</TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF1F8",
    paddingHorizontal: 16,
    paddingTop: 50,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  image: {
    width: "100%",
    height: 190,
    resizeMode: "cover",
  },

  content: {
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
    marginBottom: 10,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  price: {
    fontSize: 30,
    color: "#23439C",
    fontWeight: "bold",
  },

  oldPrice: {
    marginLeft: 10,
    fontSize: 18,
    color: "#666",
    textDecorationLine: "line-through",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  buyButton: {
    flex: 1,
    backgroundColor: "#C9D8FB",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 8,
  },

  detailsButton: {
    flex: 1,
    backgroundColor: "#23439C",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 8,
  },

  buyText: {
    color: "#23439C",
    fontSize: 18,
    fontWeight: "700",
  },

  detailsText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});