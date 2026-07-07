import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

export default function ForgotPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#222" />
        </TouchableOpacity>

        {/* Top Illustration */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/images/fgimg.png")} // Change path
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>Forgot Password</Text>

        <Text style={styles.subtitle}>
          Create a new password. Ensure it differs from{"\n"}
          previous ones for security
        </Text>

        {/* Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Create New Password</Text>

          <View style={styles.inputWrapper}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="Enter Password"
              style={styles.input}
            />

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye" : "eye-off"}
                size={22}
                color="#888"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password</Text>

          <View style={styles.inputWrapper}>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirm}
              placeholder="Confirm Password"
              style={styles.input}
            />

            <TouchableOpacity
              onPress={() => setShowConfirm(!showConfirm)}
            >
              <Ionicons
                name={showConfirm ? "eye" : "eye-off"}
                size={22}
                color="#888"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Update Password</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EEF1FB",
    flexGrow: 1,
    paddingBottom: 30,
  },

  backBtn: {
    marginTop: 55,
    marginLeft: 20,
  },

  imageContainer: {
    width: width,
    height: 330,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DCE2F5",
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    marginTop: 10,
  },

  image: {
    width: width * 0.72,
    height: 250,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#222",
    textAlign: "center",
    marginTop: 30,
  },

  subtitle: {
    textAlign: "center",
    color: "#8E8E93",
    fontSize: 16,
    marginTop: 12,
    lineHeight: 24,
  },

  inputGroup: {
    marginTop: 28,
    paddingHorizontal: 28,
  },

  label: {
    fontSize: 15,
    color: "#666",
    marginBottom: 10,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D8D8D8",
    paddingHorizontal: 15,
  },

  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
  },

  button: {
    marginHorizontal: 28,
    marginTop: 48,
    height: 56,
    backgroundColor: "#23408E",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});