import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCartWishlist } from "@/src/context/CartWishlistContext";
import { getImageUrl, FALLBACK_COURSE_IMAGE } from "@/src/api/client";

export default function WishCart() {
  const [search, setSearch] = useState("");
  const { wishlistItems } = useCartWishlist();

  const filteredItems = wishlistItems.filter((item) => {
    const title = item.courseDetails?.title || "";
    return title.toLowerCase().includes(search.toLowerCase());
  });

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
        <View>
          <Text style={styles.headerTitle}>Wish List</Text>
          <Text style={styles.headerSubtitle}>
            Organize & Review Saved Content
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#8A8FA3"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search items"
          placeholderTextColor="#8A8FA3"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Grid */}
      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {filteredItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items found</Text>
          </View>
        ) : (
          filteredItems.map((item) => {
            const imgUri = getImageUrl(item.courseDetails?.presentation_image);
            return (
              <TouchableOpacity
                key={item.wishlistItemId || item._id}
                style={styles.lectureCard}
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: "/sidepanel/wish_list/wishlist",
                  })
                }
              >
                <Image
                  source={imgUri ? { uri: imgUri } : FALLBACK_COURSE_IMAGE}
                  defaultSource={FALLBACK_COURSE_IMAGE}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
                <View style={styles.cardBody}>
                  <Text style={styles.lectureTitle} numberOfLines={1}>
                    {item.courseDetails?.title || "Saved Course"}
                  </Text>
                  <View style={styles.lectureBadge}>
                    <Text style={styles.lectureBadgeText}>
                      {item.enroll_type || "Course"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
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
    marginBottom: 20,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0A1A3B",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#6B7089",
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 20,
    shadowColor: "#0A1A3B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#0A1A3B",
  },
  grid: {
    paddingBottom: 24,
  },
  lectureCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 14,
    overflow: "hidden",
    shadowColor: "#0A1A3B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  thumbnail: {
    width: "100%",
    height: 140,
    backgroundColor: "#F0F2F7",
  },
  cardBody: {
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lectureTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0A1A3B",
    flex: 1,
  },
  lectureBadge: {
    backgroundColor: "#E8EDFF",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  lectureBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#23408E",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7089",
  },
});