import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { router } from "expo-router";

export default function PaymentFailure() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7B1F1F" />

      {/* Top Section */}
      <View style={styles.topContainer}>
        {/* <Image
          source={require("../../assets/images/payment-failure.png")}
          style={styles.image}
          resizeMode="contain"
        /> */}
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomContainer}>
        <Text style={styles.title}>Payment Failure</Text>

        <Text style={styles.subtitle}>
          Hey, seems like there was some trouble.
        </Text>

        <Text style={styles.subtitle}>
          We are there with you. Just hold back.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.back()} // or router.push("/payment")
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7B1F1F",
  },

  topContainer: {
    flex: 1.15,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  image: {
    width: 330,
    height: 330,
  },

  bottomContainer: {
    flex: 1,
    backgroundColor: "#F2F4FA",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 35,
    paddingBottom: 30,
    justifyContent: "space-between",
  },

  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#7B1F1F",
    marginTop: 10,
  },

  subtitle: {
    fontSize: 18,
    color: "#8C8C8C",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 28,
  },

  button: {
    width: "100%",
    height: 58,
    backgroundColor: "#7B1F1F",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
});