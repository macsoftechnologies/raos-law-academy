import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCartWishlist, WishlistItem } from "@/src/context/CartWishlistContext";
import { getImageUrl, FALLBACK_COURSE_IMAGE } from "@/src/api/client";

export default function Wishlist() {
  const [search, setSearch] = useState("");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const {
    wishlistItems,
    loadingWishlist,
    removeFromWishlist,
    moveFromWishlistToCart,
    refreshWishlist,
  } = useCartWishlist();

  const filteredItems = useMemo(() => {
    if (!search.trim()) return wishlistItems;
    const q = search.toLowerCase();
    return wishlistItems.filter((item) => {
      const title = item.courseDetails?.title || "";
      const subtitle = item.courseDetails?.sub_title || "";
      const type = item.enroll_type || "";
      return (
        title.toLowerCase().includes(q) ||
        subtitle.toLowerCase().includes(q) ||
        type.toLowerCase().includes(q)
      );
    });
  }, [wishlistItems, search]);

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
          <Text style={styles.headerTitle}>Wish List</Text>
          <Text style={styles.headerSubtitle}>
            Organize & Review Saved Content
          </Text>
        </View>
        <TouchableOpacity
          style={styles.cartHeaderButton}
          onPress={() => router.push("/sidepanel/wish_cart/wish_buy")}
          hitSlop={10}
        >
          <Ionicons name="cart-outline" size={24} color="#0A1A3B" />
        </TouchableOpacity>
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
          placeholder="Search saved items"
          placeholderTextColor="#8A8FA3"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")} hitSlop={10}>
            <Ionicons name="close-circle" size={18} color="#8A8FA3" />
          </TouchableOpacity>
        )}
      </View>

      {/* Wishlist Items */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loadingWishlist ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#23408E" />
            <Text style={styles.statusText}>Loading wishlist...</Text>
          </View>
        ) : filteredItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-dislike-outline" size={72} color="#A0AEC0" />
            <Text style={styles.emptyTitle}>
              {search ? "No matching items found" : "Your Wishlist is Empty"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {search
                ? "Try searching with different keywords."
                : "Save your favorite courses and subjects to access them anytime."}
            </Text>
            {!search && (
              <TouchableOpacity
                style={styles.exploreBtn}
                onPress={() => router.push("/dashboard/dashboard")}
              >
                <Text style={styles.exploreBtnText}>Explore Courses</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredItems.map((item: WishlistItem) => {
            const imgUri = getImageUrl(
              item.courseDetails?.presentation_image ||
                (item.courseDetails as any)?.printNotes_image
            );
            const isImgError = !imgUri || imageErrors[item.wishlistItemId];
            const title =
              item.courseDetails?.title ||
              item.courseDetails?.sub_title ||
              "Law Academy Course";

            return (
              <View key={item.wishlistItemId || item._id} style={styles.card}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.cardTop}
                  onPress={() =>
                    router.push({
                      pathname: "/explore/coursepackage",
                      params: {
                        sub_categoryId:
                          item.courseDetails?.subcategory_id || item.course_id,
                      },
                    })
                  }
                >
                  <Image
                    source={isImgError ? FALLBACK_COURSE_IMAGE : { uri: imgUri }}
                    onError={() =>
                      setImageErrors((prev) => ({
                        ...prev,
                        [item.wishlistItemId]: true,
                      }))
                    }
                    defaultSource={FALLBACK_COURSE_IMAGE}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                  <View style={styles.cardInfo}>
                    <Text style={styles.itemTitle} numberOfLines={2}>
                      {title}
                    </Text>
                    {item.enroll_type && (
                      <View style={styles.typeBadge}>
                        <Text style={styles.typeBadgeText}>
                          {item.enroll_type.toUpperCase()}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => removeFromWishlist(item.wishlistItemId)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#E53935" />
                    <Text style={styles.removeBtnText}>Remove</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cartBtn}
                    onPress={() => moveFromWishlistToCart(item.wishlistItemId)}
                  >
                    <Ionicons name="cart-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.cartBtnText}>Move to Cart</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
  cartHeaderButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
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
  scrollContent: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    shadowColor: "#0A1A3B",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  thumbnail: {
    width: 90,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#F0F2F7",
  },
  cardInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0A1A3B",
    lineHeight: 22,
  },
  typeBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E8EDFF",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 6,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#23408E",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F0F2F7",
  },
  removeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E53935",
  },
  removeBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#E53935",
  },
  cartBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: "#23408E",
  },
  cartBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
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
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0A1A3B",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7089",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  exploreBtn: {
    marginTop: 20,
    backgroundColor: "#23408E",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  exploreBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});