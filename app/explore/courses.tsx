import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

interface Category {
  _id: string;
  categoryId: string;
  category_name: string;
  tag_text: string;
  presentation_file: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface SubCategory {
  _id: string;
  subcategory_id: string;
  presentation_image: string;
  title: string;
  about_course: string;
  terms_conditions: string;
  categoryId: Category[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface SubCategoriesResponse {
  statusCode: number;
  message: string;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  data: SubCategory[];
}

const IMAGE_BASE_URL = "https://api.raoslawacademy.com/uploads/subcategories/";

export default function Courses() {
  const { sub_categoryId } = useLocalSearchParams<{ sub_categoryId: string }>();

  console.log("received subcategory id: " + sub_categoryId);
  

  const [courselist, setCourselist] = useState<SubCategory[]>([]);

  const handleBuyNow = (course: SubCategory) => {
    console.log("Buy:", course.title);
  };

  const handleViewDetails = (course: SubCategory) => {
    router.push({
      pathname: "/explore/courseoverview",
      params: { sub_categoryId: course.subcategory_id },
    
    });
  };

 useEffect(() => {
  const fetchUsercourselist = async () => {
    try {
      const response = await axios.get("https://api.raoslawacademy.com/subcategories?page=1&limit=10"); // <-- confirm correct endpoint
      if (response.data?.statusCode === 200) {
        setCourselist(response.data.data);
      } 
    } catch (error: any) {
      console.log("User API Error:", error?.response?.data || error.message);
    }
  };
  fetchUsercourselist();
}, []);

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
        {courselist.map((item) => (
          <View key={item._id} style={styles.card}>
            <Image
              source={
                item.presentation_image
                  ? { uri: `https://api.raoslawacademy.com/${item.presentation_image}` }
                  : require("../../assets/images/Rectangle40.png")
              }
              style={styles.image}
            />

            <View style={styles.content}>
              <Text style={styles.title}>{item.title}</Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.buyButton}
                  onPress={(() => handleBuyNow(item))}
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
    fontSize: 20,
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
    height: 180,
    resizeMode: "cover",
  },

  content: {
    padding: 16,
  },

  title: {
    fontSize: 18,
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
    fontSize: 25,
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
    fontSize: 17,
    fontWeight: "700",
  },

  detailsText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});