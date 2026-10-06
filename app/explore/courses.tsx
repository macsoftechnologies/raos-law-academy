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
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const fetchUsercategories = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        "https://api.raoslawacademy.com/categories?page=1&limit=10",
        { headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImZpbmRBZG1pbiI6eyJfaWQiOiI2OTZmNGQ4M2Q4OTRhOWY3Y2Y4NTJhMjEiLCJlbWFpbElkIjoiYWRtaW4xQGdtYWlsLmNvbSIsIm1vYmlsZU51bWJlciI6Ijg5MTk1NTY0MDEiLCJwYXNzd29yZCI6IiQyYiQxMCRMeG83aldsRWUva1ZwZFQ0VFFGSk11akw0Z2F2OEpBZmFyTFV1M290QWp3bFc4NXNkcWlwbSIsInJvbGUiOiJ0ZWFjaGVyIiwiYWNjZXNzX21vZHVsZXMiOlsicXVlc3Rpb25fcGFwZXJzIiwicmVzdWx0cyIsInN0dWRlbnRzIl0sImFkbWluSWQiOiJkNDhkOGNjOC0zZWQ3LTRkNGYtYjVmYy03ZjI0MmE4MTBmOGMiLCJjcmVhdGVkQXQiOiIyMDI2LTAxLTIwVDA5OjQwOjE5Ljk0OVoiLCJ1cGRhdGVkQXQiOiIyMDI2LTA5LTE3VDA5OjM1OjA0Ljk5NloiLCJfX3YiOjAsImFjdGl2ZVRva2VuU2Vzc2lvbklkIjoiOGIyMDE2ZTQtZDk4OC00NjA1LThkNDYtZmE5M2IyZTYwZDJmIiwic2Vzc2lvbkV4cGlyZXNBdCI6IjIwMjYtMDktMjRUMDk6MzU6MDQuMDAwWiJ9fSwic2Vzc2lvbklkIjoiMDRjM2Y1Y2ItNTE1YS00MjYxLTg5Y2ItNGU2MjZhMDZiMzcxIiwiaWF0IjoxNzg5NjQyNjU1LCJleHAiOjE3OTAyNDc0NTV9.dfycU6A67d8WoC8tLCXALz5s00qvvpwqn_uQPFmTHMg` } }
      );
      if (response.data?.statusCode === 200) {
        setCourselist(response.data.data);
      }
    } catch (error: any) {
      console.log("Categories API Error:", error?.response?.data || error.message);
    }
  };
  fetchUsercategories();
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