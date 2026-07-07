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

export default function LoginScreen() {
  const [secure, setSecure] = useState(true);


const handlecarry = ()  =>{
    router.push({
pathname: '/dashboard/dashboard',
params: {
  "userId": 1232,
  "name": "varsha",
  
}
})
}

  return (
    <View style={{ flex: 1, backgroundColor: "#EEF1F7" }}>

      <View style={styles.topContainer}>
        <Image
          source={require("../../assets/images/lady.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>


      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          
        >
          {/* Form Content */}
          <View style={styles.content}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to access your account</Text>

            {/* Email */}
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Phone */}
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              keyboardType="number-pad"
            />

            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordBox}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                secureTextEntry={secure}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setSecure(!secure)}>
                <Ionicons
                  name={secure ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#777"
                />
              </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotBox}  onPress={()=> router.push('/onboardings/forgot_password')}>
              <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>

          {/* Login Button */}
            <TouchableOpacity style={styles.loginBtn} onPress={handlecarry}>
              <Text style={styles.loginText}>Login</Text>         
            </TouchableOpacity>

            <TouchableOpacity style={{
              justifyContent: 'center',
              alignItems:'center',
              paddingTop : 15
            }}   onPress={()=> router.push('/onboardings/signin-other')}>
              <Text style={{color:'#000', fontWeight :'700'}}>Sign-in Other way</Text>
            </TouchableOpacity>

            {/* Footer */}
            <Text style={styles.signup}>
  Don’t have an account?{" "}
  <Text
    style={styles.signupLink}
    onPress={() => router.push("/onboardings/registration")}
  >
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
 
  image: {
    width: width * 0.7,
    height: 220,
  },

  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 10,
  },

  subtitle: {
    textAlign: "center",
    color: "#777",
    marginBottom: 25,
  },

  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    marginTop: 10,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },

  passwordBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },

  passwordInput: {
    flex: 1,
  },

  forgotBox: {
    alignItems: "flex-end",
    marginTop: 8,
  },

  forgot: {
    color: "#8B0000",
    fontSize: 13,
  },

  loginBtn: {
    backgroundColor: "#1E3A8A",
    height: 55,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  loginText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  signup: {
    textAlign: "center",
    marginTop: 20,
    color: "#555",
  },

  signupLink: {
    color: "#1E3A8A",
    fontWeight: "600",
  },
});
