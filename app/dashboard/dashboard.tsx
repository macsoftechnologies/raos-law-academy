import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router,useLocalSearchParams} from "expo-router";


const { width } = Dimensions.get("window");

export default function Dashboard() {

const {userId,name}  = useLocalSearchParams<{ userId: string; name: string }>();


console.log("User ID received:", userId);
console.log("Name received:", name);




  const categories = [
    {
      title: "Junior Civil Judge",
      subtitle: "Path way to Justice",
      image: require("../../assets/images/1JCD.png"),
      color: "#23408E",
    },
    {
      title: "Direct District Judge",
      subtitle: "The Step to Fairness",
      image: require("../../assets/images/2DDJ.png"),
      color: "#D4A41F",
    },
    {
      title: "Guest Lectures",
      subtitle: "Guiding Hand of the Court",
      image: require("../../assets/images/3GL.png"),
      color: "#F3E7C5",
      text: "#000",
    },
  ];

  const subjectList = [
    {
      title: "JCJ Subject list",
      subtitle: "Path way to Justice",
      image: require("../../assets/images/1JCD.png"),
      color: "#23408E",
    },
    {
      title: "DJ Subject List",
      subtitle: "The Step to Fairness",
      image: require("../../assets/images/2DDJ.png"),
      color: "#D4A41F",
    },
  ];

  const bestSellers = [
    {
      title: "Andhra Pradesh Junior Civil Judge Notes",
      price: "₹499",
      oldPrice: "₹599",
      off: "16% off",
      image: require("../../assets/images/BS1.png"),
    },
    {
      title: "Andhra Pradesh Direct District Civil Judge Notes",
      price: "₹499",
      oldPrice: "₹599",
      off: "16% off",
      image: require("../../assets/images/BS2.png"),
    },
  ];

  const comboCourses = [
    {
      tag: "Combo Offer",
      title: "Combo of AP Civil & Criminal",
      price: "₹499",
      image: require("../../assets/images/cc1.png"),
    },
    {
      tag: "Combo Offer",
      title: "Combo of Notification & Framing Issues",
      price: "₹499",
      image: require("../../assets/images/cc2.png"),
    },
  ];

  const bottomTabs = [
    { label: "Home", icon: "home", type: "Ionicons", active: true },
    { label: "Notes", icon: "note-edit-outline", type: "MaterialCommunityIcons" },
    { label: "Prelims", icon: "clipboard-text-outline", type: "MaterialCommunityIcons" },
    { label: "Mains", icon: "book-open-variant", type: "MaterialCommunityIcons" },
    { label: "Chat", icon: "chatbubble-outline", type: "Ionicons" },
  ];

  const renderTabIcon = (tab:any) => {
    const color = tab.active ? "#23408E" : "#fff";
    const size = tab.active ? 24 : 21;
    if (tab.type === "Ionicons") {
      return <Ionicons name={tab.icon} size={size} color={color} />;
    }
    return (
      <MaterialCommunityIcons name={tab.icon} size={size} color={color} />
    );
  };


  const handlenavigateToNotifications = () => {
    router.push("/dashboard/notification");
  }

  const handlenavigateToSearch = () => {
    router.push("/dashboard/search");
  }
  const handlenavigateToCourses = () => {
    router.push("/explore/courses");
  }
  const handlenavigateToCourseOverview = () => {
    router.push("/explore/courseoverview");
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Feather name="menu" size={26} color="#333" />
          </TouchableOpacity>

          <View style={{ flex: 1, marginLeft: 15}}>
            <Text style={styles.hello}>Hello👋</Text>
            <Text style={styles.name}>Bhagya Sree</Text>
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
        </View>

        {/* Banner */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        >
          <Image
            source={require("../../assets/images/bb1.png")}
            style={styles.banner}
          />
          <Image
            source={require("../../assets/images/bb1.png")}
            style={styles.banner}
          />
          <Image
            source={require("../../assets/images/bb1.png")}
            style={styles.banner}
          /> */
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
          {categories.map((item, index) => (
            <View key={index} style={styles.courseCard}>
              <Image source={item.image} style={styles.courseImage} />

              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={styles.courseTitle}>{item.title}</Text>
                <Text style={styles.courseSub}>{item.subtitle}</Text>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: item.color }]}
                   onPress={() => {
    if (item.title === "Junior Civil Judge") {
      router.push("/explore/courses");
    }
  }}
                >
                  <Text
                    style={[styles.buttonText, { color: item.text || "#fff" }]}
                  >
                    Explore Now
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Subject List */}
        <Text style={styles.heading}>Subject List</Text>

        <View style={styles.whiteCard}>
          {subjectList.map((item, index) => (
            <View key={index} style={styles.courseCard}>
              <Image source={item.image} style={styles.courseImage} />

              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={styles.courseTitle}>{item.title}</Text>
                <Text style={styles.courseSub}>{item.subtitle}</Text>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: item.color }]}
                >
                  <Text
                    style={[styles.buttonText]}
                  >
                    View All
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Best Seller */}
        <View style={styles.bestSellerHeader}>
          <View style={styles.bestSellerBar} />
          <Text style={styles.subHeading}>Best Seller</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 25 }}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {bestSellers.map((item, index) => (
            <View key={index} style={styles.sellerCard}>
              <Image source={item.image} style={styles.sellerImage} />
              <Text style={styles.sellerTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>{item.price}</Text>
                <Text style={styles.oldPrice}>{item.oldPrice}</Text>
                <Text style={styles.off}>({item.off})</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Combo Courses */}
        <Text style={styles.heading}>Combo Courses</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 25 }}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {comboCourses.map((item, index) => (
            <View key={index} style={styles.comboCard}>
              <View style={styles.comboImageWrap}>
                <Image source={item.image} style={styles.comboImage} />
                <TouchableOpacity style={styles.bookmarkIcon}>
                  <Ionicons name="bookmark-outline" size={18} color="#fff" />
                </TouchableOpacity>
              </View>

              <Text style={styles.comboTag}>{item.tag}</Text>
              <Text style={styles.comboTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.comboPrice}>{item.price}</Text>

              <View style={styles.comboButtonRow}>
                <TouchableOpacity style={styles.comboGetButton}>
                  <Text style={styles.comboGetText}>Get this course</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.comboExploreButton}>
                  <Text style={styles.comboExploreText}>Explore More</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomBar}>
        {bottomTabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={tab.active ? styles.activeTabWrap : styles.tabWrap}
          >
            <View style={tab.active ? styles.activeTab : styles.inactiveTab}>
              {renderTabIcon(tab)}
            </View>
            <Text
              style={tab.active ? styles.activeTabLabel : styles.tabLabel}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF1FB",
    paddingTop: 55,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 20,
  },

  hello: {
    color: "#555",
    fontSize: 16,
  },
  text:{color:"#fff"},

  name: {
    fontWeight: "700",
    fontSize: 20,
    color: "#222",
  },

  banner: {
    width: width - 40,
    height: 165,
    borderRadius: 18,
    marginHorizontal: 20,
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
});