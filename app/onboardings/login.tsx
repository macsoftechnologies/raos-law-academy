import React, { useState, useEffect, useRef } from "react";
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
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const params = useLocalSearchParams<{ email?: string; phone?: string }>();
  const [useremail, Setemail] = useState(params.email || "");
  const [userphonenumber, Setphonenumber] = useState(params.phone || "");
  const [userpassword, Setpassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const isSubmitting = useRef(false);
  const lastSubmitTime = useRef(0);

  useEffect(() => {
    if (params.email) Setemail(params.email);
    if (params.phone) Setphonenumber(params.phone);
  }, [params.email, params.phone]);

  const handleUserLogin = async () => {
    // 1. Prevent duplicate / concurrent requests immediately
    if (isSubmitting.current || loading) {
      return;
    }
    const now = Date.now();
    if (now - lastSubmitTime.current < 2000) {
      return;
    }
    isSubmitting.current = true;
    lastSubmitTime.current = now;

    // 2. Normalize inputs
    const trimmedEmail = useremail.trim();
    const cleanEmail = trimmedEmail.toLowerCase();
    const rawDigits = userphonenumber.replace(/\D/g, "");
    const cleanPhone = rawDigits.length > 10 ? rawDigits.slice(-10) : rawDigits;
    const cleanPassword = userpassword.trim();

    if (!cleanEmail) {
      isSubmitting.current = false;
      Toast.show({ type: "info", text1: "Validation", text2: "Please enter email" });
      return;
    }
    if (!cleanPhone || cleanPhone.length !== 10) {
      isSubmitting.current = false;
      Toast.show({
        type: "info",
        text1: "Validation",
        text2: "Please enter a valid 10-digit phone number",
      });
      return;
    }
    if (!cleanPassword) {
      isSubmitting.current = false;
      Toast.show({ type: "info", text1: "Validation", text2: "Please enter password" });
      return;
    }

    setLoading(true);

    try {
      // 3. Log exact outgoing payload before calling API
      console.log("Login request payload:", {
        email: cleanEmail,
        mobile_number: cleanPhone,
        password: cleanPassword ? "******" : "",
      });

      let response = await axios.post("https://api.raoslawacademy.com/users/login", {
        email: cleanEmail,
        mobile_number: cleanPhone,
        password: cleanPassword,
      });

      console.log("Login response:", response.data);
      let statusCode = response.data?.statusCode;
      let message = response.data?.message;

      // Smart Resolution Fallback:
      // If 404 User Not Found, check casing or query loginanotherway to verify account
      if (statusCode === 404) {
        if (trimmedEmail !== cleanEmail) {
          console.log("Retrying login with original email casing:", trimmedEmail);
          try {
            const retryRes = await axios.post("https://api.raoslawacademy.com/users/login", {
              email: trimmedEmail,
              mobile_number: cleanPhone,
              password: cleanPassword,
            });
            console.log("Login retry response:", retryRes.data);
            if (retryRes.data?.statusCode === 200 || retryRes.data?.statusCode === 201) {
              response = retryRes;
              statusCode = retryRes.data?.statusCode;
              message = retryRes.data?.message;
            } else if (retryRes.data?.statusCode === 400) {
              statusCode = 400;
              message = retryRes.data?.message;
            }
          } catch {}
        }

        if (statusCode === 404) {
          try {
            const phoneCheck = await axios.post("https://api.raoslawacademy.com/users/loginanotherway", {
              text: cleanPhone,
            });
            if (phoneCheck.data?.statusCode === 200 && phoneCheck.data?.data?.email) {
              const registeredEmail = phoneCheck.data.data.email;
              if (registeredEmail !== cleanEmail) {
                console.log("Retrying login with registered email found in DB:", registeredEmail);
                const retryWithDbEmail = await axios.post("https://api.raoslawacademy.com/users/login", {
                  email: registeredEmail,
                  mobile_number: cleanPhone,
                  password: cleanPassword,
                });
                if (retryWithDbEmail.data?.statusCode === 200 || retryWithDbEmail.data?.statusCode === 201) {
                  response = retryWithDbEmail;
                  statusCode = retryWithDbEmail.data?.statusCode;
                  message = retryWithDbEmail.data?.message;
                } else if (retryWithDbEmail.data?.statusCode === 400) {
                  statusCode = 400;
                  message = retryWithDbEmail.data?.message;
                }
              }
            }
          } catch {}
        }
      }

      if (statusCode === 200 || statusCode === 201) {
        const userData = response.data?.data;
        const userId = userData?.userId;
        const userName = userData?.name || "";
        const returnedOtp = userData?.otp;

        if (!userId) {
          Toast.show({
            type: "error",
            text1: "Login Error",
            text2: "Invalid user session returned from server.",
          });
          return;
        }

        // Use a token from the login response if present; otherwise try auto-verify
        let sessionToken: string = response.data?.token || userData?.token || "";

        if (!sessionToken) {
          try {
            const verifyRes = await axios.post("https://api.raoslawacademy.com/users/verify", {
              userId: userId,
              otp: returnedOtp ? String(returnedOtp) : "12345",
            });
            console.log("Auto-verify response:", verifyRes.data);
            if (verifyRes.data?.statusCode === 200 && verifyRes.data?.token) {
              sessionToken = verifyRes.data.token.trim();
            }
          } catch (e) {
            console.log("Auto-verify token on login:", e);
          }
        }

        // Clear any old session before saving current user
        await AsyncStorage.multiRemove([
          "token",
          "@login-token",
          "userId",
          "userName",
          "referral_code",
          "userPhone",
          "userEmail",
        ]);

        const itemsToStore: [string, string][] = [
          ["userId", userId],
          ["userEmail", cleanEmail],
          ["userPhone", cleanPhone],
        ];
        if (sessionToken) {
          itemsToStore.push(["token", sessionToken]);
          itemsToStore.push(["@login-token", sessionToken]);
        }
        if (userData?.referral_code) {
          itemsToStore.push(["referral_code", userData.referral_code]);
        }
        if (userName) {
          itemsToStore.push(["userName", userName]);
        }
        await AsyncStorage.multiSet(itemsToStore);

        Toast.show({
          type: "success",
          text1: "Login Successful",
          text2: `Welcome back${userName ? ", " + userName : ""}!`,
        });

        // Login -> Dashboard (no OTP verify screen)
        router.replace("/dashboard/dashboard");
        return;
      }

      if (statusCode === 404) {
        Toast.show({
          type: "error",
          text1: "User Not Found",
          text2: "No account found matching this email and phone number. Please check your details or sign up.",
        });
        return;
      }

      if (statusCode === 400) {
        Toast.show({
          type: "error",
          text1: "Incorrect Password",
          text2: typeof message === "string" ? message : "The password entered is incorrect.",
        });
        return;
      }

      if (statusCode === 409) {
        Toast.show({
          type: "error",
          text1: "Conflict",
          text2: typeof message === "string" ? message : "User session conflict.",
        });
        return;
      }

      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: typeof message === "string" ? message : "Invalid credentials. Please try again.",
      });
    } catch (error: any) {
      console.log("Login catch error:", error.response?.data || error.message);
      const errorStatus = error.response?.data?.statusCode || error.response?.status;
      const errorMsg = error.response?.data?.message;

      if (errorStatus === 404 || errorMsg === "User Not Found") {
        Toast.show({
          type: "error",
          text1: "User Not Found",
          text2: "No account found matching this email and phone number.",
        });
      } else if (errorStatus === 400 || errorMsg === "Password incorrect") {
        Toast.show({
          type: "error",
          text1: "Incorrect Password",
          text2: "The password entered is incorrect.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Login Error",
          text2: typeof errorMsg === "string" ? errorMsg : "Network error. Please check your connection.",
        });
      }
    } finally {
      isSubmitting.current = false;
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#EEF1F7" }}>
      <View style={styles.topContainer}>
        <Image
          source={require("../../assets/images/lady.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to access your account</Text>

            <Text style={styles.label}>Email Address</Text>
            <TextInput
              value={useremail}
              onChangeText={Setemail}
              style={styles.input}
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              value={userphonenumber}
              onChangeText={Setphonenumber}
              style={styles.input}
              placeholder="Enter phone number"
              keyboardType="number-pad"
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordBox}>
              <TextInput
                value={userpassword}
                onChangeText={Setpassword}
                style={styles.passwordInput}
                placeholder="Password"
                secureTextEntry={secure}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setSecure(!secure)}>
                <Ionicons name={secure ? "eye-off-outline" : "eye-outline"} size={22} color="#777" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotBox} onPress={() => router.push("/onboardings/forgot_password")}>
              <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginBtn, loading && { opacity: 0.7 }]}
              onPress={handleUserLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginText}>Login</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={{ justifyContent: "center", alignItems: "center", paddingTop: 15 }}
              onPress={() => router.push("/onboardings/signin-other")}
            >
              <Text style={{ color: "#000", fontWeight: "700" }}>Sign-in Other way</Text>
            </TouchableOpacity>

            <Text style={styles.signup}>
              Don’t have an account?{" "}
              <Text style={styles.signupLink} onPress={() => router.push("/onboardings/registration")}>
                Signup
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    backgroundColor: "#CBD3E6",
    height: 300,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  image: { width: width * 0.7, height: 220 },
  contentContainer: { paddingHorizontal: 20, paddingBottom: 30 },
  content: { flex: 1 },
  title: { fontSize: 26, fontWeight: "700", textAlign: "center", marginTop: 10 },
  subtitle: { textAlign: "center", color: "#777", marginBottom: 25 },
  label: { fontSize: 14, color: "#666", marginBottom: 5, marginTop: 10 },
  input: { backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 15, height: 50 },
  passwordBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  passwordInput: { flex: 1 },
  forgotBox: { alignItems: "flex-end", marginTop: 8 },
  forgot: { color: "#8B0000", fontSize: 13 },
  loginBtn: {
    backgroundColor: "#1E3A8A",
    height: 55,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },
  loginText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  signup: { textAlign: "center", marginTop: 20, color: "#555" },
  signupLink: { color: "#1E3A8A", fontWeight: "600" },
});