import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface WishlistItemData {
  _id: string;
  userId: string;
  course_id: string;
  enroll_type: string; // e.g. "notes" — could narrow to a union if you know all values, e.g. "notes" | "printed" | "video"
  wishlistItemId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface WishlistResponse {
  statusCode: number;
  message: string;
  data: WishlistItemData;
}




interface WishlistFolder {
  id: string;
  title: string;
  itemCount: number;
}

const WISHLIST_DATA = [
  {
    id: "1",
    title: "Civil Procedure Code",
    itemCount: 2,
   route: "/sidepanel/wish_list/wish_cart",
  },
  {
    id: "2",
    title: "Indian Evidence Act",
    itemCount: 2,
    route: "/sidepanel/wish_list/wish_cart",
   
  },
  {
    id: "3",
    title: "Specific Relief Act",
    itemCount: 2,
    route: "/sidepanel/wish_list/wish_cart",
   
  },
  {
    id: "4",
    title: "Indian Penal Code",
    itemCount: 2,
    route: "/sidepanel/wish_list/wish_cart",
    
  },
  {
    id: "5",
    title: "Mains Preparation",
    itemCount: 2,
    route: "/sidepanel/wish_list/wish_cart",
    
  },
  {
    id: "6",
    title: "Prelims Preparation",
    itemCount: 2,
    route: "/sidepanel/wish_list/wish_cart",
    
  },
];

export default function Wishlist() {
  const [search, setSearch] = useState("");

  const filteredFolders = WISHLIST_DATA.filter((folder) =>
    folder.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDEEF5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
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
          placeholder="Search folders"
          placeholderTextColor="#8A8FA3"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Folder Grid */}
      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {filteredFolders.map((folder) => (
          <TouchableOpacity
            key={folder.id}
            style={styles.folderCard}
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname: "/sidepanel/wish_list/wish_cart",
                params: { id: folder.id },
              })
            }
          >
            <View style={styles.folderTab} />
            <Text style={styles.folderTitle} numberOfLines={2}>
              {folder.title}
            </Text>
            <View style={styles.itemBadge}>
              <Text style={styles.itemBadgeText}>
                {folder.itemCount} Items
              </Text>
            </View>
          </TouchableOpacity>
        ))}
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
    marginBottom: 24,
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
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 24,
  },
  folderCard: {
    width: "47%",
    minHeight: 130,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    justifyContent: "space-between",
    overflow: "hidden",
    shadowColor: "#0A1A3B",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  folderTab: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    borderTopWidth: 34,
    borderLeftWidth: 34,
    borderTopColor: "#7A1F2B",
    borderLeftColor: "transparent",
    borderTopRightRadius: 18,
  },
  folderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0A1A3B",
    lineHeight: 21,
    marginTop: 6,
  },
  itemBadge: {
    alignSelf: "flex-end",
    backgroundColor: "#C9A227",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  itemBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});