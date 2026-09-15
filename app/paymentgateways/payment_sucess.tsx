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

export default function PaymentSuccess() {
    
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#23408E" />

      {/* Top Blue Section */}
      <View style={styles.topContainer}>
        <Text style={styles.title}>Payment Successful</Text>
        <Text style={styles.subtitle}>
          Your Secure Transaction Is Complete
        </Text>

        {/* <Image
          source={require("../../assets/images/payment-success.png")}
          style={styles.image}
          resizeMode="contain"
        /> */}
      </View>

      {/* Bottom White Section */}
      <View style={styles.bottomContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Payment Method:</Text>
          <Text style={styles.value}>G Pay</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>30 Oct 2025</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Transaction ID:</Text>
          <Text style={styles.value}>VNJVJD</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Subtotal:</Text>
          <Text style={styles.value}>₹99</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>₹99</Text>/
        
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/subjectlist/courseoverviewdetails")}
        >
          <Text style={styles.buttonText}>Back To Course</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#23408E",
  },

  topContainer: {
    flex: 1.15,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  title: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "700",
    marginTop: 20,
  },

  subtitle: {
    color: "#fff",
    fontSize: 18,
    marginTop: 8,
    marginBottom: 20,
    textAlign: "center",
  },

  image: {
    width: 300,
    height: 300,
  },

  bottomContainer: {
    flex: 1,
    backgroundColor: "#F2F4FA",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 25,
    paddingTop: 35,
    justifyContent: "space-between",
    paddingBottom: 30,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  label: {
    fontSize: 17,
    color: "#666",
  },

  value: {
    fontSize: 17,
    fontWeight: "600",
    color: "#444",
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#CFCFCF",
    borderStyle: "dashed",
    marginVertical: 10,
  },

  totalLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },

  totalValue: {
    fontSize: 34,
    fontWeight: "700",
    color: "#000",
  },

  button: {
    backgroundColor: "#23408E",
    height: 58,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 35,
  },

  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
});