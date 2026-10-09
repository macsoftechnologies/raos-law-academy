import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function Registration() {
  const [isChecked, setIsChecked] = useState(false);
  const [username, Setname] = useState("");
  const [useremail, Setemail] = useState("");
  const [userphonenumber, Setphonenumber] = useState("");
  const [usercreatepassword, Setcreatepassword] = useState("");
  const [userconfirmpassword, Setconfirmpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const isSubmitting = useRef(false);
  const lastSubmitTime = useRef(0);

  const handleUserRegistration = async () => {
    if (isSubmitting.current || loading) {
      return;
    }
    const now = Date.now();
    if (now - lastSubmitTime.current < 2000) {
      return;
    }
    isSubmitting.current = true;
    lastSubmitTime.current = now;

    const cleanName = username.trim();
    const cleanEmail = useremail.trim().toLowerCase();
    const rawDigits = userphonenumber.replace(/\D/g, "");
    const cleanPhone = rawDigits.length > 10 ? rawDigits.slice(-10) : rawDigits;
    const cleanPassword = usercreatepassword.trim();
    const cleanConfirmPassword = userconfirmpassword.trim();

    if (!cleanName) {
      isSubmitting.current = false;
      Toast.show({
        type: "info",
        text1: "Validation",
        text2: "Please enter name",
      });
      return;
    }

    if (!cleanEmail) {
      isSubmitting.current = false;
      Toast.show({
        type: "info",
        text1: "Validation",
        text2: "Please enter email",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      isSubmitting.current = false;
      Toast.show({
        type: "error",
        text1: "Invalid Email",
        text2: "Please enter a valid email address",
      });
      return;
    }

    if (!cleanPhone) {
      isSubmitting.current = false;
      Toast.show({
        type: "info",
        text1: "Validation",
        text2: "Please enter phone number",
      });
      return;
    }

    // Phone validation
    if (cleanPhone.length !== 10) {
      isSubmitting.current = false;
      Toast.show({
        type: "error",
        text1: "Invalid Phone Number",
        text2: "Phone number must contain 10 digits",
      });
      return;
    }

    if (!cleanPassword) {
      isSubmitting.current = false;
      Toast.show({
        type: "info",
        text1: "Validation",
        text2: "Please enter password",
      });
      return;
    }

    // Password validation
    if (cleanPassword.length < 6) {
      isSubmitting.current = false;
      Toast.show({
        type: "error",
        text1: "Weak Password",
        text2: "Password must be at least 6 characters",
      });
      return;
    }

    if (!cleanConfirmPassword) {
      isSubmitting.current = false;
      Toast.show({
        type: "info",
        text1: "Validation",
        text2: "Please confirm your password",
      });
      return;
    }

    if (cleanPassword !== cleanConfirmPassword) {
      isSubmitting.current = false;
      Toast.show({
        type: "error",
        text1: "Password Mismatch",
        text2: "Passwords do not match",
      });
      return;
    }

    // Checkbox validation
    if (!isChecked) {
      isSubmitting.current = false;
      Toast.show({
        type: "info",
        text1: "Validation",
        text2: "Please accept the declaration",
      });
      return;
    }

    console.log("Registration payload:", {
      name: cleanName,
      email: cleanEmail,
      mobile_number: cleanPhone,
    });

    isSubmitting.current = true;
    setLoading(true);

    try {
      // Clear any leftover sessions before creating a new user
      await AsyncStorage.multiRemove([
        "token",
        "@login-token",
        "userId",
        "userName",
        "referral_code",
        "userPhone",
        "userEmail",
      ]);

      const response = await axios.post(
        "https://api.raoslawacademy.com/users/register",
        {
          name: cleanName,
          email: cleanEmail,
          mobile_number: cleanPhone,
          password: cleanPassword,
        }
      );

      console.log("Registration API response:", response.data);
      const statusCode = response.data?.statusCode;
      const message = response.data?.message;

      if (statusCode === 200 || statusCode === 201) {
        const registeredUser = response.data?.data;
        const newUserId = registeredUser?.userId;
        const otp = registeredUser?.otp;

        Toast.show({
          type: "success",
          text1: "Registration Successful",
          text2: "Please verify your account to activate it.",
        });

        // Navigate to Activate/Verify Account per required flow
        router.push({
          pathname: "/onboardings/mobile_verify",
          params: {
            userId: newUserId,
            phone: cleanPhone,
            email: cleanEmail,
            name: cleanName,
            otp: otp ? String(otp) : "",
            fromRegistration: "true",
          },
        });
        return;
      }

      if (statusCode === 409) {
        let conflictDetails = "An account with this email or mobile number already exists.";
        try {
          const [emailCheck, phoneCheck] = await Promise.allSettled([
            axios.post("https://api.raoslawacademy.com/users/loginanotherway", { text: cleanEmail }),
            axios.post("https://api.raoslawacademy.com/users/loginanotherway", { text: cleanPhone }),
          ]);

          const emailExists =
            emailCheck.status === "fulfilled" && emailCheck.value.data?.statusCode === 200;
          const phoneExists =
            phoneCheck.status === "fulfilled" && phoneCheck.value.data?.statusCode === 200;

          if (emailExists && phoneExists) {
            conflictDetails = "Both this email and phone number are already registered to existing accounts.";
          } else if (phoneExists) {
            conflictDetails = `Mobile number (${cleanPhone}) is already registered. Please use another mobile number.`;
          } else if (emailExists) {
            conflictDetails = `Email (${cleanEmail}) is already registered. Please use another email.`;
          }
        } catch {}

        Toast.show({
          type: "error",
          text1: "User already exists",
          text2: conflictDetails,
        });
        return;
      }

      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: typeof message === "string" ? message : "Unable to register. Please check your details.",
      });
    } catch (error: any) {
      console.log("Registration catch error:", error.response?.data || error.message);
      const errorStatus = error.response?.data?.statusCode || error.response?.status;
      const errorMsg = error.response?.data?.message;

      if (errorStatus === 409 || errorMsg === "User already existed") {
        let conflictDetails = "An account with this email or mobile number already exists.";
        try {
          const [emailCheck, phoneCheck] = await Promise.allSettled([
            axios.post("https://api.raoslawacademy.com/users/loginanotherway", { text: cleanEmail }),
            axios.post("https://api.raoslawacademy.com/users/loginanotherway", { text: cleanPhone }),
          ]);

          const emailExists =
            emailCheck.status === "fulfilled" && emailCheck.value.data?.statusCode === 200;
          const phoneExists =
            phoneCheck.status === "fulfilled" && phoneCheck.value.data?.statusCode === 200;

          if (emailExists && phoneExists) {
            conflictDetails = "Both this email and phone number are already registered to existing accounts.";
          } else if (phoneExists) {
            conflictDetails = `Mobile number (${cleanPhone}) is already registered. Please use another mobile number.`;
          } else if (emailExists) {
            conflictDetails = `Email (${cleanEmail}) is already registered. Please use another email.`;
          }
        } catch {}

        Toast.show({
          type: "error",
          text1: "User already exists",
          text2: conflictDetails,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Registration Error",
          text2: typeof errorMsg === "string" ? errorMsg : "Network error or server unavailable. Please try again.",
        });
      }
    } finally {
      isSubmitting.current = false;
      setLoading(false);
    }
  };




  return (
    <View style={styles.root}>

      {/* ================= HEADER (FIXED) ================= */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/images/lawmale.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* ================= FORM (SCROLLABLE) ================= */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.card}>
            <Text style={styles.title}>Create New Account</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput value={username} onChangeText={Setname} style={styles.input} />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              keyboardType="email-address"
              value={useremail}
              onChangeText={Setemail}
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              keyboardType="phone-pad"
              value={userphonenumber}
              onChangeText={Setphonenumber}
            />

            <Text style={styles.label}>Create Password</Text>
            <TextInput
              style={styles.input}
              keyboardType="visible-password"
              value={usercreatepassword}
              onChangeText={Setcreatepassword}

            />

            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={styles.passwordInput}
                secureTextEntry
                value={userconfirmpassword}
                onChangeText={Setconfirmpassword}
              />
              <Text style={styles.eye}>👁️</Text>
            </View>

            {/* ================= CHECKBOX ================= */}
            <View style={styles.checkboxRow}>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  isChecked && styles.checkboxChecked,
                ]}
                onPress={() => setIsChecked(!isChecked)}
                activeOpacity={0.7}
              >
                {isChecked && <Text style={styles.checkMark}>✓</Text>}
              </TouchableOpacity>

              <Text style={styles.checkboxText}>
                Entered carefully and fill according to aadhar card{'\n'}
                These details once registered cannot be edited in profile
              </Text>
            </View>


            <TouchableOpacity
              style={[styles.button, (loading || isSubmitting.current) && { opacity: 0.7 }]}
              onPress={handleUserRegistration}
              disabled={loading || isSubmitting.current}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign up</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.footerText}>
                Already Registered?{' '}
                <Text style={styles.signIn}>Sign in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}


const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#EEF1F7',
  },

  flex: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 150, // safe for gesture navigation
    backgroundColor: '#EEF1F7',
  },

  /* ================= HEADER ================= */
  imageContainer: {
    backgroundColor: '#CBD3E6',
    height: height * 0.34,
    justifyContent: 'flex-end',
    paddingBottom: height * 0.03,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  image: {
    width,
    height: height * 0.26,
    alignSelf: 'center',
  },

  /* ================= CARD ================= */
  card: {
    backgroundColor: '#EEF1F7',
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    color: '#7A7A7A',
    marginBottom: 6,
    marginTop: 10,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
  },

  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 15,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
  },

  eye: {
    fontSize: 16,
    color: '#999',
  },

  /* ================= CHECKBOX ================= */
  checkboxRow: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'flex-start',
  },

  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: '#333',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 3,
  },

  checkboxChecked: {
    backgroundColor: '#1E5BFF',
    borderColor: '#1E5BFF',
  },

  checkMark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  checkboxText: {
    fontSize: 12,
    color: '#444',
    lineHeight: 16,
    flex: 1,
  },

  /* ================= BUTTON ================= */
  button: {
    backgroundColor: '#B9C4DE',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 25,
  },

  buttonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },

  /* ================= FOOTER ================= */
  footerText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 13,
    color: '#777',
  },

  signIn: {
    color: '#1E5BFF',
    fontWeight: '600',
  },
});

