import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import axios from "axios";
import Toast from "react-native-toast-message";

const OTP_LENGTH = 4;
const PHONE_NUMBER = "1234567890"; // TODO: pass in via params/context

export default function MobileVerify() {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [token, setToken] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");

    if (code.length !== OTP_LENGTH) {
      Toast.show({ type: "error", text1: "Please enter the complete OTP" });
      return;
    }

    setIsVerifying(true);
    try {
      const response = await axios.post(
        "https://api.raoslawacademy.com/users/verify",
     {
    "userId": "7b682881-2d36-41b4-aca9-a9540bff291f",
    "otp": "12345"
}
      );

      if (response.data.statusCode === 200) {
        setToken(response.data.token);

        Toast.show({
          type: "success",
          text1: "OTP verified successfully",
        });

        router.push("/dashboard/dashboard"); // TODO: update to your actual route
      } else {
        Toast.show({
          type: "error",
          text1: response.data.message ?? "Invalid OTP, please try again",
        });
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      Toast.show({
        type: "error",
        text1: "Something went wrong. Please try again.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      // TODO: call resend OTP API
      Toast.show({ type: "success", text1: "OTP resent" });
    } catch (error) {
      console.error("Resend OTP failed:", error);
      Toast.show({ type: "error", text1: "Couldn't resend OTP, try again" });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#C7CCE8" />

      <View style={styles.heroSection}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#0A1A3B" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>Verify your Mobile Number</Text>
        <Text style={styles.subtitle}>We sent a OTP to {PHONE_NUMBER}</Text>
        <Text style={styles.subtitle}>
          enter {OTP_LENGTH} digit code that mentioned in the sms
        </Text>

        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
             ref={(el) => { inputRefs.current[index] = el; }}
              style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        <View style={styles.resendRow}>
          <Text style={styles.resendText}>Haven't got the SMS yet? </Text>
          <TouchableOpacity onPress={handleResend} disabled={isResending}>
            <Text style={styles.resendLink}>
              {isResending ? "Resending..." : "Resend OTP"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.verifyBtn, isVerifying && styles.verifyBtnDisabled]}
          onPress={handleVerify}
          disabled={isVerifying}
        >
          {isVerifying ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.verifyBtnText}>Verify</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#EEF0F8" },
  heroSection: {
    backgroundColor: "#C7CCE8",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingBottom: 24,
    alignItems: "center",
  },
  backBtn: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0A1A3B",
    marginTop: 28,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#8A8FA3",
    marginTop: 6,
    textAlign: "center",
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 32,
  },
  otpBox: {
    width: 52,
    height: 52,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#D9DCEA",
    fontSize: 20,
    fontWeight: "700",
    color: "#0A1A3B",
    backgroundColor: "#FFFFFF",
  },
  otpBoxFilled: {
    borderColor: "#0A1A3B",
  },
  resendRow: {
    flexDirection: "row",
    marginTop: 20,
  },
  resendText: { fontSize: 13, color: "#8A8FA3" },
  resendLink: { fontSize: 13, color: "#23408E", fontWeight: "600", textDecorationLine: "underline" },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  verifyBtn: {
    backgroundColor: "#0A1A3B",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    minHeight: 52,
    justifyContent: "center",
  },
  verifyBtnDisabled: {
    opacity: 0.6,
  },
  verifyBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});