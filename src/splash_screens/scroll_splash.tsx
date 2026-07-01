import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";


const slides = [
  {
    id: "1",
    image: require("../../assets/images/splash1.png"),
    title: "Crime Happens",
    desc: "As shown here, b bootlegger is running away  after stealing a Women's Purse",
  },
  {
    id: "2",
    image: require("../../assets/images/splash2.png"),
    title: "Legal Knowledge",
    desc: "Understand your rights easily",
  },
  {
    id: "3",
    image: require("../../assets/images/splash3.png"),
    title: "Justice for All",
    desc: "Empowering citizens with law",
  },
];

export default function Onboarding() {
  const flatListRef = useRef(null);
  const [index, setIndex] = useState(0);

 const handleScroll = (
  e: NativeSyntheticEvent<NativeScrollEvent>
) => {
  const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
  setIndex(newIndex);
};

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={styles.slide}>
        
       <Text style={styles.rao}>Rao's Law Academy </Text>
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="contain"
            />

            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.desc}</Text>

           
          </View>
        )}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, index === i && styles.activeDot]}
          />
        ))}
      </View>

      {/* Skip Button */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => router.push('/onboardings/login')}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  slide: {
    width,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },

  image: {
    width: width * 0.8,
    height: height * 0.35,
  },

  title: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "700",
    color: "#0000",
    textAlign: "center",
  },

  rao:{
  fontSize : 25,
  color : '#1a3c8b',
  fontWeight : '700'
  },

  desc: {
    maxWidth: width * 0.75,
    textAlign: "center",
    marginTop: 10,
    fontSize: 15,
    color: "#555",
  },

  bottomArt: {
    width,
    height: height * 0.4,
    position: "absolute",
    bottom: 0,
    opacity: 0.7,
  },

  pagination: {
    position: "absolute",
    bottom: 70,
    flexDirection: "row",
    alignSelf: "center",
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },

  activeDot: {
    backgroundColor: "#00C781",
  },

  skipButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#1a3c8b",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },

  skipText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
