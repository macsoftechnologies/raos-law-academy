import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { apiClient, DEFAULT_USER_ID, getEffectiveUserId } from "../api/client";
import { showApiErrorToast } from "../api/errorHandler";

export interface WishlistItem {
  _id: string;
  userId: string;
  course_id: string;
  enroll_type: string;
  wishlistItemId: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  courseDetails?: {
    _id?: string;
    notes_id?: string;
    prelimes_id?: string;
    mains_id?: string;
    subcategory_id?: string;
    title?: string;
    sub_title?: string;
    presentation_image?: string;
    about_course?: string;
    terms_conditions?: string;
    [key: string]: any;
  };
}

export interface CartPlan {
  _id?: string;
  planId?: string;
  original_price?: string | number;
  strike_price?: string | number;
  duration?: string;
  handling_fee?: string | number;
  discount_percent?: string | number;
  course_type?: string;
  [key: string]: any;
}

export interface CartItem {
  _id: string;
  userId: string;
  course_id: string;
  enroll_type: string;
  planId: string;
  cartItemId: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  plan?: CartPlan;
  courseDetails?: {
    _id?: string;
    notes_id?: string;
    prelimes_id?: string;
    mains_id?: string;
    title?: string;
    sub_title?: string;
    presentation_image?: string;
    about_course?: string;
    [key: string]: any;
  };
}

export interface CartWishlistContextType {
  // Wishlist
  wishlistItems: WishlistItem[];
  wishlistCount: number;
  loadingWishlist: boolean;
  isInWishlist: (courseIdOrItemId: string) => boolean;
  addToWishlist: (courseId: string, enrollType?: string) => Promise<boolean>;
  removeFromWishlist: (courseIdOrWishlistItemId: string) => Promise<boolean>;
  refreshWishlist: () => Promise<void>;

  // Cart
  cartItems: CartItem[];
  cartCount: number;
  loadingCart: boolean;
  isInCart: (courseIdOrItemId: string) => boolean;
  addToCart: (
    courseId: string,
    enrollType?: string,
    planId?: string
  ) => Promise<boolean>;
  removeFromCart: (cartItemIdOrCourseId: string) => Promise<boolean>;
  moveFromWishlistToCart: (
    wishlistItemId: string,
    planId?: string
  ) => Promise<boolean>;
  refreshCart: () => Promise<void>;

  // User
  currentUserId: string;
}

const CartWishlistContext = createContext<CartWishlistContextType | undefined>(
  undefined
);

const CACHE_KEY_WISHLIST = "@cached_wishlist_items";
const CACHE_KEY_CART = "@cached_cart_items";

export function CartWishlistProvider({ children }: { children: ReactNode }) {
  const [currentUserId, setCurrentUserId] = useState<string>(DEFAULT_USER_ID);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState<boolean>(false);
  const [loadingCart, setLoadingCart] = useState<boolean>(false);

  // Initialize userId and cached items
  useEffect(() => {
    const init = async () => {
      try {
        const effectiveId = await getEffectiveUserId();
        setCurrentUserId(effectiveId);

        const cachedWish = await AsyncStorage.getItem(CACHE_KEY_WISHLIST);
        if (cachedWish) {
          try {
            setWishlistItems(JSON.parse(cachedWish));
          } catch {}
        }

        const cachedCart = await AsyncStorage.getItem(CACHE_KEY_CART);
        if (cachedCart) {
          try {
            setCartItems(JSON.parse(cachedCart));
          } catch {}
        }
      } catch (err) {
        console.warn("Error initializing CartWishlist storage:", err);
      }
    };
    init();
  }, []);

  // Fetch Wishlist from API
  const refreshWishlist = useCallback(async () => {
    try {
      setLoadingWishlist(true);
      const userId = await getEffectiveUserId();
      const response = await apiClient.post("/wishlist/list", { userId });
      if (
        response.data?.statusCode === 200 ||
        response.data?.statusCode === 201 ||
        response.status === 200 ||
        response.status === 201
      ) {
        const items: WishlistItem[] = response.data.data || [];
        setWishlistItems(items);
        await AsyncStorage.setItem(CACHE_KEY_WISHLIST, JSON.stringify(items));
      }
    } catch (error) {
      if (__DEV__) {
        console.log("Failed to fetch wishlist:", error);
      }
    } finally {
      setLoadingWishlist(false);
    }
  }, []);

  // Fetch Cart from API
  const refreshCart = useCallback(async () => {
    try {
      setLoadingCart(true);
      const userId = await getEffectiveUserId();
      const response = await apiClient.post("/cart/list", { userId });
      if (
        response.data?.statusCode === 200 ||
        response.data?.statusCode === 201 ||
        response.status === 200 ||
        response.status === 201
      ) {
        const items: CartItem[] = response.data.data || [];
        setCartItems(items);
        await AsyncStorage.setItem(CACHE_KEY_CART, JSON.stringify(items));
      }
    } catch (error) {
      if (__DEV__) {
        console.log("Failed to fetch cart:", error);
      }
    } finally {
      setLoadingCart(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    refreshWishlist();
    refreshCart();
  }, [refreshWishlist, refreshCart]);

  // Check if item is in wishlist
  const isInWishlist = useCallback(
    (id: string): boolean => {
      if (!id) return false;
      const cleanId = String(id).trim().toLowerCase();
      return wishlistItems.some((item) => {
        return (
          item.course_id?.toLowerCase() === cleanId ||
          item.wishlistItemId?.toLowerCase() === cleanId ||
          item._id?.toLowerCase() === cleanId ||
          item.courseDetails?.notes_id?.toLowerCase() === cleanId ||
          item.courseDetails?.prelimes_id?.toLowerCase() === cleanId ||
          item.courseDetails?.mains_id?.toLowerCase() === cleanId ||
          item.courseDetails?.subcategory_id?.toLowerCase() === cleanId ||
          item.courseDetails?._id?.toLowerCase() === cleanId
        );
      });
    },
    [wishlistItems]
  );

  // Add to Wishlist
  const addToWishlist = useCallback(
    async (courseId: string, enrollType = "notes"): Promise<boolean> => {
      if (!courseId) return false;
      const userId = await getEffectiveUserId();

      if (isInWishlist(courseId)) {
        Toast.show({
          type: "info",
          text1: "Already in Wishlist",
          text2: "This course is already saved in your wishlist.",
        });
        return true;
      }

      try {
        const response = await apiClient.post("/wishlist/add", {
          userId,
          course_id: courseId,
          enroll_type: enrollType,
        });

        if (
          response.data?.statusCode === 200 ||
          response.data?.statusCode === 201 ||
          response.status === 200 ||
          response.status === 201
        ) {
          Toast.show({
            type: "success",
            text1: "Added to Wishlist",
            text2: response.data?.message || "Course added to your wishlist.",
          });
          await refreshWishlist();
          return true;
        } else {
          Toast.show({
            type: "error",
            text1: "Wishlist",
            text2: response.data?.message || "Could not add to wishlist.",
          });
          return false;
        }
      } catch (error: any) {
        showApiErrorToast(error, "Wishlist Error");
        return false;
      }
    },
    [isInWishlist, refreshWishlist]
  );

  // Remove from Wishlist
  const removeFromWishlist = useCallback(
    async (id: string): Promise<boolean> => {
      if (!id) return false;
      const cleanId = String(id).trim().toLowerCase();
      const userId = await getEffectiveUserId();

      // Find wishlistItemId if courseId or noteId was passed
      const found = wishlistItems.find(
        (item) =>
          item.wishlistItemId?.toLowerCase() === cleanId ||
          item.course_id?.toLowerCase() === cleanId ||
          item._id?.toLowerCase() === cleanId ||
          item.courseDetails?.notes_id?.toLowerCase() === cleanId ||
          item.courseDetails?.prelimes_id?.toLowerCase() === cleanId ||
          item.courseDetails?.mains_id?.toLowerCase() === cleanId ||
          item.courseDetails?.subcategory_id?.toLowerCase() === cleanId ||
          item.courseDetails?._id?.toLowerCase() === cleanId
      );

      const wishlistItemId = found ? found.wishlistItemId : id;

      try {
        const response = await apiClient.post("/wishlist/remove", {
          userId,
          wishlistItemId,
        });

        if (
          response.data?.statusCode === 200 ||
          response.data?.statusCode === 201 ||
          response.status === 200 ||
          response.status === 201
        ) {
          Toast.show({
            type: "success",
            text1: "Removed from Wishlist",
            text2:
              response.data?.message || "Course removed from your wishlist.",
          });
          // Optimistically update
          setWishlistItems((prev) =>
            prev.filter((item) => item.wishlistItemId !== wishlistItemId)
          );
          await refreshWishlist();
          return true;
        } else {
          Toast.show({
            type: "error",
            text1: "Wishlist",
            text2: response.data?.message || "Could not remove from wishlist.",
          });
          return false;
        }
      } catch (error: any) {
        showApiErrorToast(error, "Wishlist Error");
        return false;
      }
    },
    [wishlistItems, refreshWishlist]
  );

  // Check if item is in cart
  const isInCart = useCallback(
    (id: string): boolean => {
      if (!id) return false;
      const cleanId = String(id).trim().toLowerCase();
      return cartItems.some((item) => {
        return (
          item.course_id?.toLowerCase() === cleanId ||
          item.cartItemId?.toLowerCase() === cleanId ||
          item.planId?.toLowerCase() === cleanId ||
          item._id?.toLowerCase() === cleanId ||
          item.courseDetails?.notes_id?.toLowerCase() === cleanId ||
          item.courseDetails?.prelimes_id?.toLowerCase() === cleanId ||
          item.courseDetails?.mains_id?.toLowerCase() === cleanId ||
          item.courseDetails?.subcategory_id?.toLowerCase() === cleanId ||
          item.courseDetails?._id?.toLowerCase() === cleanId
        );
      });
    },
    [cartItems]
  );

  // Helper to resolve planId for a course
  const resolvePlanId = async (
    courseId: string,
    providedPlanId?: string
  ): Promise<string> => {
    if (providedPlanId && providedPlanId.trim()) {
      return providedPlanId.trim();
    }
    try {
      const res = await apiClient.post("/plans/bycourse", {
        course_id: courseId,
      });
      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data.data[0].planId;
      }
    } catch {}
    // Fallback to default planId if bycourse returns empty
    return "0f8de1d9-4af9-4215-ac8e-45dddfde3375";
  };

  // Add to Cart
  const addToCart = useCallback(
    async (
      courseId: string,
      enrollType = "prelimes",
      planId?: string
    ): Promise<boolean> => {
      if (!courseId) return false;
      const userId = await getEffectiveUserId();

      try {
        const effectivePlanId = await resolvePlanId(courseId, planId);

        const response = await apiClient.post("/cart/add", {
          userId,
          course_id: courseId,
          enroll_type: enrollType,
          planId: effectivePlanId,
        });

        if (
          response.data?.statusCode === 200 ||
          response.data?.statusCode === 201 ||
          response.status === 200 ||
          response.status === 201
        ) {
          Toast.show({
            type: "success",
            text1: "Added to Cart",
            text2: response.data?.message || "Item added to your cart.",
          });
          await refreshCart();
          return true;
        } else {
          Toast.show({
            type: "error",
            text1: "Cart",
            text2: response.data?.message || "Could not add item to cart.",
          });
          return false;
        }
      } catch (error: any) {
        showApiErrorToast(error, "Cart Error");
        return false;
      }
    },
    [refreshCart]
  );

  // Remove from Cart
  const removeFromCart = useCallback(
    async (id: string): Promise<boolean> => {
      if (!id) return false;
      const cleanId = String(id).trim().toLowerCase();
      const userId = await getEffectiveUserId();

      const found = cartItems.find(
        (item) =>
          item.cartItemId?.toLowerCase() === cleanId ||
          item.course_id?.toLowerCase() === cleanId ||
          item._id?.toLowerCase() === cleanId ||
          item.planId?.toLowerCase() === cleanId ||
          item.courseDetails?.notes_id?.toLowerCase() === cleanId ||
          item.courseDetails?.prelimes_id?.toLowerCase() === cleanId ||
          item.courseDetails?.mains_id?.toLowerCase() === cleanId ||
          item.courseDetails?.subcategory_id?.toLowerCase() === cleanId ||
          item.courseDetails?._id?.toLowerCase() === cleanId
      );

      const cartItemId = found ? found.cartItemId : id;

      try {
        const response = await apiClient.post("/cart/remove", {
          userId,
          cartItemId,
        });

        if (
          response.data?.statusCode === 200 ||
          response.data?.statusCode === 201 ||
          response.status === 200 ||
          response.status === 201
        ) {
          Toast.show({
            type: "success",
            text1: "Removed from Cart",
            text2: response.data?.message || "Item removed from your cart.",
          });
          setCartItems((prev) =>
            prev.filter((item) => item.cartItemId !== cartItemId)
          );
          await refreshCart();
          return true;
        } else {
          Toast.show({
            type: "error",
            text1: "Cart",
            text2: response.data?.message || "Could not remove item from cart.",
          });
          return false;
        }
      } catch (error: any) {
        showApiErrorToast(error, "Cart Error");
        return false;
      }
    },
    [cartItems, refreshCart]
  );

  // Move from Wishlist to Cart
  const moveFromWishlistToCart = useCallback(
    async (wishlistItemId: string, planId?: string): Promise<boolean> => {
      if (!wishlistItemId) return false;
      const cleanId = String(wishlistItemId).trim().toLowerCase();
      const userId = await getEffectiveUserId();

      const foundWish = wishlistItems.find(
        (item) =>
          item.wishlistItemId?.toLowerCase() === cleanId ||
          item.course_id?.toLowerCase() === cleanId ||
          item._id?.toLowerCase() === cleanId
      );
      const courseId = foundWish ? foundWish.course_id : "";
      const effectivePlanId = await resolvePlanId(courseId, planId);

      try {
        const response = await apiClient.post("/cart/move-from-wishlist", {
          userId,
          wishlistItemId: foundWish ? foundWish.wishlistItemId : wishlistItemId,
          planId: effectivePlanId,
        });

        if (
          response.data?.statusCode === 200 ||
          response.data?.statusCode === 201 ||
          response.status === 200 ||
          response.status === 201
        ) {
          Toast.show({
            type: "success",
            text1: "Moved to Cart",
            text2: response.data?.message || "Item moved from wishlist to cart.",
          });
          await Promise.all([refreshWishlist(), refreshCart()]);
          return true;
        } else {
          Toast.show({
            type: "error",
            text1: "Cart",
            text2: response.data?.message || "Could not move item to cart.",
          });
          return false;
        }
      } catch (error: any) {
        showApiErrorToast(error, "Cart Error");
        return false;
      }
    },
    [wishlistItems, refreshWishlist, refreshCart]
  );

  return (
    <CartWishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        loadingWishlist,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        refreshWishlist,
        cartItems,
        cartCount: cartItems.length,
        loadingCart,
        isInCart,
        addToCart,
        removeFromCart,
        moveFromWishlistToCart,
        refreshCart,
        currentUserId,
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
}

export function useCartWishlist(): CartWishlistContextType {
  const context = useContext(CartWishlistContext);
  if (!context) {
    if (__DEV__) {
      console.warn("useCartWishlist called outside CartWishlistProvider. Returning fallback state.");
    }
    return {
      wishlistItems: [],
      wishlistCount: 0,
      loadingWishlist: false,
      isInWishlist: () => false,
      addToWishlist: async () => false,
      removeFromWishlist: async () => false,
      refreshWishlist: async () => {},
      cartItems: [],
      cartCount: 0,
      loadingCart: false,
      isInCart: () => false,
      addToCart: async () => false,
      removeFromCart: async () => false,
      moveFromWishlistToCart: async () => false,
      refreshCart: async () => {},
      currentUserId: DEFAULT_USER_ID,
    };
  }
  return context;
}

