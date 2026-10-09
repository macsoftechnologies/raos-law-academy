import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Modal,
  Pressable,
  Linking,
  SafeAreaView,
  BackHandler,
  Alert,
  ActivityIndicator,
} from "react-native";

import { Ionicons, Feather, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCartWishlist } from "@/src/context/CartWishlistContext";
import { getImageUrl, FALLBACK_COURSE_IMAGE, apiClient } from "@/src/api/client";
import { parseApiError } from "@/src/api/errorHandler";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAWER_WIDTH = SCREEN_WIDTH * 0.75;

type Banner = {
  _id: string;
  bannerId: string;
  banner_file: string;
  redirect_link: string;
};

interface Category {
  _id: string;
  categoryId: string;
  category_name: string;
  tag_text?: string;
  presentation_file?: string;
  presentation_image?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CategoriesApiResponse {
  statusCode: number;
  message: string;
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
  limit?: number;
  data: Category[];
}

export interface SubjectLaw {
  _id?: string;
  lawId?: string;
  title?: string;
  law_image?: string;
  subcategory_id?: string;
  categoryId?: string;
}

export interface SubjectSubcategory {
  _id?: string;
  subcategory_id?: string;
  presentation_image?: string;
  title?: string;
  about_course?: string;
  terms_conditions?: string;
  categoryId?: string;
}

export interface SubjectCategory {
  _id?: string;
  categoryId?: string;
  category_name?: string;
  tag_text?: string;
  presentation_file?: string;
}

export interface Subject {
  _id: string;
  subjectId: string;
  title: string;
  subject_image?: string;
  law_id?: SubjectLaw[];
  subcategory_id?: SubjectSubcategory[];
  categoryId?: SubjectCategory[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface SubjectsApiResponse {
  statusCode: number;
  message: string | any;
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
  limit?: number;
  data: Subject[];
}

export interface ComboPlan {
  _id: string;
  planId: string;
  original_price: string;
  strike_price: string;
  duration: string;
  handling_fee: string;
  course_id: string;
  discount_percent: string;
  course_type: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Combo {
  _id: string;
  combo_id: string;
  title: string;
  description: string;
  presentation_image: string;
  subcategory_id: string;
  includes_lectures: boolean;
  includes_notes: boolean;
  includes_prelimes: boolean;
  includes_mains: boolean;
  isEnrolled: boolean;
  availablePlans: ComboPlan[];
  remaining_duration: number | null;
  enroll_date: string | null;
  expiry_date: string | null;
}

export interface ComboListResponse {
  statusCode: number;
  message: string;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  data: Combo[];
}





const BANNER_IMAGE_BASE_URL = "https://api.raoslawacademy.com/uploads/banners/";

export default function Dashboard() {




  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;


  const { cartCount, currentUserId } = useCartWishlist();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [coursecategories, setcategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [subjectlist, setsubjectlist] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [subjectsError, setSubjectsError] = useState<string | null>(null);
  const [subjectImageErrors, setSubjectImageErrors] = useState<Record<string, boolean>>({});
  const [combolist, setcombolist] = useState<Combo[]>([]);
  const [categoryImageErrors, setCategoryImageErrors] = useState<Record<string, boolean>>({});
  const isFetchingCategoriesRef = useRef(false);
  const categoriesFetchedRef = useRef(false);
  const isFetchingSubjectsRef = useRef(false);
  const subjectsFetchedRef = useRef(false);

  const getCategoryStyle = (name?: string) => {
    if (!name || typeof name !== "string") {
      return { color: "#0A1A3B", text: "#fff" };
    }
    if (name.includes("Junior Civil Judge")) return { color: "#23408E", text: "#fff" };
    if (name.includes("Direct District Judge")) return { color: "#C9A227", text: "#0A1A3B" };
    if (name.toLowerCase().includes("guest")) return { color: "#7A1F2B", text: "#fff" };
    return { color: "#0A1A3B", text: "#fff" };
  };

  const openMenu = () => {
    setMenuVisible(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeMenu = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => setMenuVisible(false));
  };

  const handleDrawerNavigate = (route: string) => {
    closeMenu();
    setTimeout(() => router.push(route as any), 260);
  };

  const [activeTab, setActiveTab] = useState("Home");






  const bottomTabs = [
    { label: "Home", icon: "home", type: "Ionicons", route: "/dashboard/dashboard" },
    { label: "Notes", icon: "note-edit-outline", type: "MaterialCommunityIcons", route: "/notes_module/notes_way" },
    { label: "Prelims", icon: "clipboard-text-outline", type: "MaterialCommunityIcons", route: "/prelims/button_prelims" },
    { label: "Mains", icon: "book-open-variant", type: "MaterialCommunityIcons", route: "/mains/before_buying/mains_pre" },
    { label: "Chat", icon: "chatbubble-outline", type: "Ionicons", route: "/chat" },
  ];

  const drawerItems = [
    { icon: "user", label: "Profile", route: "/sidepanel/profile/main_profile" },
    { icon: "layout-dashboard", label: " Marks Dashboard", route: "/sidepanel/marksdashboard/std_dashboard" },
    { icon: "graduation-cap", label: "My Courses", route: "/sidepanel/my_courses/my_course" },
    { icon: "download", label: "My Downloads", route: "/sidepanel/my_dow/screen_dow" },
    { icon: "credit-card", label: "Billing & Payments", route: "/sidepanel/my_bill/billing" },
    { icon: "heart", label: "Wishlist", route: "/sidepanel/wish_list/wishlist" },
    { icon: "shopping-cart", label: "My Cart", route: "/sidepanel/wish_cart/wish_buy" },
    { icon: "help-circle", label: "FAQs", route: "/sidepanel/help_center/help_issue" },
    { icon: "moon", label: "Dark Mode", route: "", isToggle: true },
    { icon: "help-circle", label: "Help Center", route: "/sidepanel/help_center/help" },
    { icon: "gift", label: "Refer & Earn", route: "/sidepanel/referal/refer" },
    { icon: "file-text", label: "Terms & Conditions", route: "/sidepanel/legal/terms_conditions" },
    { icon: "shield", label: "Privacy Policy", route: "/sidepanel/legal/privacy_policy" },
    { icon: "log-out", label: "Logout", route: "/onboardings/login" },
  ];

  const renderTabIcon = (tab: any, isActive: boolean) => {
    const color = isActive ? "#23408E" : "#fff";
    const size = isActive ? 24 : 21;
    if (tab.type === "Ionicons") {
      return <Ionicons name={tab.icon} size={size} color={color} />;
    }
    return <MaterialCommunityIcons name={tab.icon} size={size} color={color} />;
  };


  const handleTabPress = (tab: any) => {
    setActiveTab(tab.label);
    if (tab.params) {
      router.push({ pathname: tab.route, params: tab.params });
    } else {
      router.push(tab.route);
    }
  };

  const handlenavigateToNotifications = () => {
    router.push("/dashboard/notification");
  };

  const handlenavigateToSearch = () => {
    router.push("/dashboard/search");
  };




  useEffect(() => {
    const fetchUserBanners = async () => {
      try {
        const response = await apiClient.get("/banners?page=1&limit=10");
        if (
          response.data?.statusCode === 200 ||
          response.data?.statusCode === 201 ||
          response.status === 200
        ) {
          setBanners(response.data.data || []);
        }
      } catch (error: any) {
        console.log("User Banners API Error:", error?.response?.data || error.message);
      }
    };
    fetchUserBanners();
  }, []);

  const fetchUsercategories = useCallback(async (isRetry = false) => {
    // Prevent duplicate in-flight requests
    if (isFetchingCategoriesRef.current) {
      return;
    }
    isFetchingCategoriesRef.current = true;
    setCategoriesLoading(true);
    setCategoriesError(null);

    try {
      const response = await apiClient.get<CategoriesApiResponse>(
        "/categories?page=1&limit=10"
      );

      const resData = response.data;
      const isHttpSuccess = response.status === 200 || response.status === 201;
      const isPayloadSuccess =
        resData?.statusCode === undefined ||
        resData?.statusCode === 200 ||
        resData?.statusCode === 201;

      if (isHttpSuccess && isPayloadSuccess) {
        // Resolve categories array safely
        let categoriesArray: Category[] | null = null;
        if (Array.isArray(resData?.data)) {
          categoriesArray = resData.data;
        } else if (Array.isArray(resData)) {
          categoriesArray = resData;
        }

        if (categoriesArray !== null) {
          setcategories(categoriesArray);
          setCategoriesError(null);
          categoriesFetchedRef.current = true;
        } else {
          // Unexpected payload structure (missing data array)
          console.warn(
            "[Categories API] Unexpected response format (missing data array):",
            resData
          );
          setcategories([]);
          setCategoriesError(
            resData?.message || "Invalid categories data received from server."
          );
        }
      } else {
        // Payload or HTTP status indicated failure
        const errMsg =
          resData?.message ||
          (typeof (resData as any)?.error === "string" ? (resData as any).error : null) ||
          "Failed to load categories";
        console.warn("[Categories API] Unsuccessful response:", resData);
        setcategories([]);
        setCategoriesError(errMsg);
      }
    } catch (error: any) {
      console.log("Categories API Error:", error?.response?.data || error.message);
      const parsed = parseApiError(error);
      setcategories([]);
      setCategoriesError(parsed.message || "Failed to load categories. Please try again.");
    } finally {
      isFetchingCategoriesRef.current = false;
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsercategories();
  }, [fetchUsercategories]);

  useFocusEffect(
    useCallback(() => {
      // Only re-fetch if not previously loaded and not currently in progress
      if (!categoriesFetchedRef.current && !categoriesLoading && !isFetchingCategoriesRef.current) {
        fetchUsercategories();
      }
    }, [categoriesLoading, fetchUsercategories])
  );

  const fetchUsersubjectlist = useCallback(async () => {
    if (isFetchingSubjectsRef.current) {
      return;
    }
    isFetchingSubjectsRef.current = true;
    setSubjectsLoading(true);
    setSubjectsError(null);

    try {
      const response = await apiClient.get<SubjectsApiResponse>(
        "/subjects?page=1&limit=10"
      );

      const resData = response.data;
      const isHttpSuccess = response.status === 200 || response.status === 201;
      const isPayloadSuccess =
        resData?.statusCode === undefined ||
        resData?.statusCode === 200 ||
        resData?.statusCode === 201;

      if (isHttpSuccess && isPayloadSuccess) {
        let subjectsArray: Subject[] | null = null;
        if (Array.isArray(resData?.data)) {
          subjectsArray = resData.data;
        } else if (Array.isArray(resData)) {
          subjectsArray = resData;
        }

        if (subjectsArray !== null) {
          setsubjectlist(subjectsArray);
          setSubjectsError(null);
          subjectsFetchedRef.current = true;
        } else {
          console.warn(
            "[Subjects API] Unexpected response format (missing data array):",
            resData
          );
          setsubjectlist([]);
          setSubjectsError(
            typeof resData?.message === "string"
              ? resData.message
              : "Invalid subjects data received from server."
          );
        }
      } else {
        let errMsg = "Failed to load subjects";
        if (typeof resData?.message === "string" && resData.message.trim()) {
          errMsg = resData.message;
        } else if (typeof (resData as any)?.error === "string") {
          errMsg = (resData as any).error;
        } else if (resData?.message && typeof resData.message === "object") {
          errMsg =
            (resData.message as any)?.errorResponse?.errmsg ||
            (resData.message as any)?.errmsg ||
            "Server returned an error.";
        }

        console.warn("[Subjects API] Unsuccessful response:", resData);
        setsubjectlist([]);
        setSubjectsError(errMsg);
      }
    } catch (error: any) {
      console.log("Subjects API Error:", error?.response?.data || error.message);
      const parsed = parseApiError(error);
      setsubjectlist([]);
      setSubjectsError(parsed.message || "Failed to load subjects. Please try again.");
    } finally {
      isFetchingSubjectsRef.current = false;
      setSubjectsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsersubjectlist();
  }, [fetchUsersubjectlist]);

  useFocusEffect(
    useCallback(() => {
      if (!subjectsFetchedRef.current && !subjectsLoading && !isFetchingSubjectsRef.current) {
        fetchUsersubjectlist();
      }
    }, [subjectsLoading, fetchUsersubjectlist])
  );





  useEffect(() => {
    const fetchUsercombolist = async () => {
      try {
        const response = await axios.get("https://api.raoslawacademy.com/combos/user/list");
        if (response.data?.statusCode === 200) {
          setcombolist(response.data.data);
        }
      } catch (error: any) {
        console.log("User API Error:", error?.response?.data || error.message);
      }
    };
    fetchUsercombolist();
  }, []);



  const handleBannerPress = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log("Cannot open URL:", url);
      }
    } catch (error) {
      console.log("Error opening banner link:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert('Exit App', 'Are you sure you want to exit?', [
          { text: 'No', onPress: () => null, style: 'cancel' },
          { text: 'Yes', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );








  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={openMenu}>
            <Feather name="menu" size={26} color="#333" />
          </TouchableOpacity>

          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.hello}>Hello👋</Text>
            <Text style={styles.name}>varsha </Text>
          </View>

          <TouchableOpacity onPress={handlenavigateToSearch}>
            <Ionicons name="search-outline" size={25} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlenavigateToNotifications}
            style={{ marginLeft: 15 }}
          >
            <Ionicons name="notifications-outline" size={25} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/sidepanel/wish_cart/wish_buy")}
            style={{ marginLeft: 15, position: "relative" }}
          >
            <Ionicons name="cart-outline" size={25} color="#333" />
            {cartCount > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: -4,
                  right: -6,
                  backgroundColor: "#E53935",
                  borderRadius: 9,
                  minWidth: 16,
                  height: 16,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 2,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 9, fontWeight: "700" }}>
                  {cartCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Banner */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        >
          {banners.map((item) => {
            const bannerUri = getImageUrl(item.banner_file);
            return (
              <TouchableOpacity
                key={item._id}
                activeOpacity={0.9}
                onPress={() => handleBannerPress(item.redirect_link)}
              >
                <Image
                  source={bannerUri ? { uri: bannerUri } : FALLBACK_COURSE_IMAGE}
                  defaultSource={FALLBACK_COURSE_IMAGE}
                  style={styles.banner}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Dots */}
        <View style={styles.dots}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>


        {/* Categories */}
        <Text style={styles.heading}>Categories</Text>
        <View style={styles.whiteCard}>
          {categoriesLoading ? (
            <View style={{ padding: 24, alignItems: "center" }}>
              <ActivityIndicator size="small" color="#23408E" />
              <Text style={{ marginTop: 8, color: "#666", fontSize: 13 }}>
                Loading categories...
              </Text>
            </View>
          ) : categoriesError ? (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={{ color: "#E53935", fontSize: 13, marginBottom: 8, textAlign: "center" }}>
                {categoriesError}
              </Text>
              <TouchableOpacity
                onPress={() => fetchUsercategories(true)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 6,
                  backgroundColor: "#23408E",
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : coursecategories.length === 0 ? (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={{ color: "#666", fontSize: 13 }}>No categories available</Text>
            </View>
          ) : (
            coursecategories.map((item, index) => {
              const categoryTitle = item.category_name || "Category";
              const { color, text } = getCategoryStyle(categoryTitle);
              const rawImage = item.presentation_file || item.presentation_image || "";
              const imgUri = getImageUrl(rawImage);
              const cardKey = item.categoryId || item._id || `category-${index}`;
              const isImgError = !imgUri || categoryImageErrors[cardKey];
              return (
                <View key={cardKey} style={styles.courseCard}>
                  <Image
                    source={isImgError ? FALLBACK_COURSE_IMAGE : { uri: imgUri }}
                    onError={() =>
                      setCategoryImageErrors((prev) => ({ ...prev, [cardKey]: true }))
                    }
                    defaultSource={FALLBACK_COURSE_IMAGE}
                    style={styles.courseImage}
                  />

                  <View style={{ flex: 1, marginLeft: 15 }}>
                    <Text style={styles.courseTitle}>{categoryTitle}</Text>
                    {item.tag_text ? (
                      <Text style={styles.courseSub}>{item.tag_text}</Text>
                    ) : null}

                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: color }]}
                      onPress={() => {
                        console.log("Navigating to courses with categoryId:", item.categoryId);
                        router.push({
                          pathname: "/explore/courses",
                          params: {
                            sub_categoryId: item.categoryId ?? "",
                          },
                        });
                      }}
                    >
                      <Text style={[styles.buttonText, { color: text }]}>Explore Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Subject List */}
        <Text style={styles.heading}>Subject List</Text>
        <View style={styles.whiteCard}>
          {subjectsLoading ? (
            <View style={{ padding: 24, alignItems: "center" }}>
              <ActivityIndicator size="small" color="#23408E" />
              <Text style={{ marginTop: 8, color: "#666", fontSize: 13 }}>
                Loading subjects...
              </Text>
            </View>
          ) : subjectsError ? (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text
                style={{
                  color: "#E53935",
                  fontSize: 13,
                  marginBottom: 8,
                  textAlign: "center",
                }}
              >
                {subjectsError}
              </Text>
              <TouchableOpacity
                onPress={fetchUsersubjectlist}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 6,
                  backgroundColor: "#23408E",
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>
                  Retry
                </Text>
              </TouchableOpacity>
            </View>
          ) : subjectlist.length === 0 ? (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={{ color: "#666", fontSize: 13 }}>
                No subjects available
              </Text>
            </View>
          ) : (
            subjectlist.map((item, index) => {
              const categoryName = item.categoryId?.[0]?.category_name ?? "";
              const subTitle =
                item.subcategory_id?.[0]?.title ??
                item.law_id?.[0]?.title ??
                categoryName;
              const imageFile =
                item.subject_image ||
                item.categoryId?.[0]?.presentation_file ||
                item.subcategory_id?.[0]?.presentation_image ||
                item.law_id?.[0]?.law_image ||
                "";
              const imgUri = getImageUrl(imageFile);
              const cardKey = item._id || item.subjectId || `subject-${index}`;
              const isImgError = !imgUri || subjectImageErrors[cardKey];
              const color = categoryName.includes("Junior Civil Judge")
                ? "#23408E"
                : categoryName.includes("Direct District Judge")
                  ? "#C9A227"
                  : "#0A1A3B";

              return (
                <View key={cardKey} style={styles.courseCard}>
                  <Image
                    source={isImgError ? FALLBACK_COURSE_IMAGE : { uri: imgUri }}
                    onError={() =>
                      setSubjectImageErrors((prev) => ({ ...prev, [cardKey]: true }))
                    }
                    defaultSource={FALLBACK_COURSE_IMAGE}
                    style={styles.courseImage}
                  />

                  <View style={{ flex: 1, marginLeft: 15 }}>
                    <Text style={styles.courseTitle}>{item.title || "Subject"}</Text>
                    {subTitle ? (
                      <Text style={styles.courseSub}>{subTitle}</Text>
                    ) : null}
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: color }]}
                      onPress={() => {
                        router.push({
                          pathname: "/subjectlist/details",
                          params: {
                            subjectId: item._id,
                            userId: currentUserId || undefined,
                          },
                        });
                      }}
                    >
                      <Text style={styles.buttonText}>View All</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Combo Courses */}
        <Text style={styles.heading}>Combo Courses</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 25 }}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {combolist.map((item) => {
            const plan = item.availablePlans?.[0];

            return (
              <View key={item._id} style={styles.comboCard}>
                <View style={styles.comboImageWrap}>
                  {/* <Image
            source={
              item.presentation_image
                ? { uri: `https://api.raoslawacademy.com//${item.presentation_image}` }
              
            }
            style={styles.comboImage}
          /> */}
                  <TouchableOpacity style={styles.bookmarkIcon}>
                    <Ionicons name="bookmark-outline" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.comboTag}>
                  {item.isEnrolled ? "Enrolled" : "Combo"}
                </Text>

                <Text style={styles.comboTitle} numberOfLines={2}>
                  {item.title}
                </Text>

                <Text style={styles.comboPrice}>
                  {plan
                    ? `₹${plan.strike_price}${plan.original_price !== plan.strike_price
                      ? `  ₹${plan.original_price}`
                      : ""
                    }`
                    : "Price unavailable"}
                </Text>

                <View style={styles.comboButtonRow}>
                  <TouchableOpacity
                    style={styles.comboGetButton}
                  // onPress={() => router.push("/combos/civil")}
                  >
                    <Text style={styles.comboGetText}>
                      {item.isEnrolled ? "Continue" : "Get this course"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.comboExploreButton}
                    onPress={() => router.push({
                      pathname: "/combos/civil",
                      params: { userId: "" }
                    })}
                  >
                    <Text style={styles.comboExploreText}>Explore More</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </ScrollView>

      {/* Sticky Bottom Navigation */}
      <View style={styles.bottomBar}>
        {bottomTabs.map((tab, index) => {
          const isActive = activeTab === tab.label;
          return (
            <TouchableOpacity
              key={index}
              style={isActive ? styles.activeTabWrap : styles.tabWrap}
              onPress={() => handleTabPress(tab)}
              activeOpacity={0.8}
            >
              <View style={isActive ? styles.activeTab : styles.inactiveTab}>
                {renderTabIcon(tab, isActive)}
              </View>
              <Text style={isActive ? styles.activeTabLabel : styles.tabLabel}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Offcanvas Menu */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="none"
        onRequestClose={closeMenu}
        statusBarTranslucent
      >
        <View style={StyleSheet.absoluteFill}>
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              styles.overlay,
              { opacity: overlayAnim },
            ]}
          >
            <Pressable style={{ flex: 1 }} onPress={closeMenu} />
          </Animated.View>

          <Animated.View
            style={[
              styles.drawer,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            <View style={styles.drawerHeader}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  ""
                </Text>
              </View>
              <Text style={styles.drawerName}>{"Varsha"}</Text>
              <Text style={styles.drawerSub}>AP JCJ/DDJ Aspirant</Text>
            </View>

            <ScrollView
              style={styles.menuList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 12 }}
            >
              {drawerItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => handleDrawerNavigate(item.route)}
                >
                  <Feather name={item.icon as any} size={20} color="#C9A227" />
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.closeBtn} onPress={closeMenu}>
              <MaterialIcons name="close" size={22} color="#7A1F2B" />
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF1FB",
  },

  headerSafeArea: {
    backgroundColor: "#EEF1FB",
    zIndex: 10,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 30,
    paddingBottom: 16,
  },

  hello: {
    color: "#555",
    fontSize: 16,
  },
  text: { color: "#fff" },

  name: {
    fontWeight: "700",
    fontSize: 20,
    color: "#222",
  },

  banner: {
    width: SCREEN_WIDTH - 40,
    height: 180,
    borderRadius: 18,
    marginHorizontal: 20,
    marginTop: 15,
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 12,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#CFCFCF",
    marginHorizontal: 4,
  },

  activeDot: {
    backgroundColor: "#23408E",
    width: 18,
  },

  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
    marginHorizontal: 20,
    marginBottom: 15,
  },

  whiteCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 10,
    marginBottom: 25,
  },

  courseCard: {
    flexDirection: "row",
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 18,
    elevation: 2,
    padding: 10,
  },

  courseImage: {
    width: 110,
    height: 90,
    borderRadius: 15,
  },

  courseTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },

  courseSub: {
    color: "#999",
    marginVertical: 6,
    fontSize: 15,
  },

  button: {
    alignSelf: "flex-start",
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },

  buttonText: {
    fontWeight: "700",
    fontSize: 15,
  },

  bestSellerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 15,
  },

  bestSellerBar: {
    width: 5,
    height: 22,
    backgroundColor: "#D4A41F",
    borderRadius: 3,
    marginRight: 10,
  },

  subHeading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },

  sellerCard: {
    width: 180,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginRight: 15,
    padding: 10,
    elevation: 2,
  },

  sellerImage: {
    width: "100%",
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
  },

  sellerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    marginBottom: 6,
    height: 36,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },

  price: {
    fontSize: 15,
    fontWeight: "700",
    color: "#222",
    marginRight: 6,
  },

  oldPrice: {
    fontSize: 13,
    color: "#999",
    textDecorationLine: "line-through",
    marginRight: 6,
  },

  off: {
    fontSize: 12,
    color: "#2E9E4E",
    fontWeight: "600",
  },

  comboCard: {
    width: 220,
    backgroundColor: "#fff",

    borderRadius: 16,
    marginRight: 15,
    paddingBottom: 12,
    elevation: 2,
    overflow: "hidden",
  },

  comboImageWrap: {
    position: "relative",
  },

  comboImage: {
    width: "100%",
    height: 130,
  },

  bookmarkIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },

  comboTag: {
    fontSize: 12,
    fontWeight: "700",
    color: "#D4A41F",
    marginTop: 10,
    marginHorizontal: 12,
  },

  comboTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginHorizontal: 12,
    marginVertical: 4,
    height: 42,
  },

  comboPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginHorizontal: 12,
    marginBottom: 10,
  },

  comboButtonRow: {
    flexDirection: "row",
    marginHorizontal: 12,
  },

  comboGetButton: {
    backgroundColor: "#23408E",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 8,
  },

  comboGetText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  comboExploreButton: {
    backgroundColor: "#EEF1FB",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },

  comboExploreText: {
    color: "#23408E",
    fontSize: 12,
    fontWeight: "700",
  },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 78,
    backgroundColor: "#23408E",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  tabWrap: {
    alignItems: "center",
    justifyContent: "center",
  },

  activeTabWrap: {
    alignItems: "center",
    justifyContent: "center",
  },

  inactiveTab: {
    marginBottom: 2,
  },

  activeTab: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#D8AE24",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -32,
    borderWidth: 4,
    borderColor: "#EEF1FB",
  },

  tabLabel: {
    color: "#fff",
    fontSize: 11,
    marginTop: 2,
  },

  activeTabLabel: {
    color: "#fff",
    fontSize: 11,
    marginTop: 2,
    fontWeight: "700",
  },

  // Offcanvas styles
  overlay: {
    backgroundColor: "rgba(10, 26, 59, 0.5)",
  },

  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: "#0A1A3B",
    paddingTop: 60,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },

  drawerHeader: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(201,162,39,0.25)",
    marginBottom: 12,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#C9A227",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0A1A3B",
  },
  drawerName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  drawerSub: {
    fontSize: 12,
    color: "#C9A227",
    marginTop: 2,
  },

  menuList: {
    flex: 1,
    paddingHorizontal: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  menuItemText: {
    marginLeft: 14,
    fontSize: 15,
    fontWeight: "500",
    color: "#fff",
  },

  closeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(201,162,39,0.25)",
  },
  closeBtnText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#7A1F2B",
  },
});