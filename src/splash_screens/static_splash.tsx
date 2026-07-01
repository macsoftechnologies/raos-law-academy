import React from "react";
import { View, Image, Text, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/law_logo.jpg")}
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.rao}>
        Welcome to Rao's Law Academy
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0000",
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: 200,
    height: 200,
    borderRadius: 100, 
  },

  rao: {
    marginTop: 20,
    fontSize: 20,
    color: "#1a3c8b",
    fontWeight: "600", 
    textAlign: "center",
  },
});
