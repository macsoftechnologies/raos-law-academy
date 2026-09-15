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
import Toast from "react-native-toast-message";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
const [useremail,Setemail]=useState("")
  const [userphonenumber,Setphonenumber]=useState("")
  const [userpassword,Setpassword]=useState("")



  

 const  handleUserLogin = async () => {
  if (!useremail.trim()) {
    Toast.show({
      type: "info",
      text1: "Validation",
      text2: "Please enter email",
    });
    return;
  }

  if (!userphonenumber.trim()) {
    Toast.show({
      type: "info",
      text1: "Validation",
      text2: "Please enter phone number",
    });
    return;
  }

  if (!userpassword.trim()) {
    Toast.show({
      type: "info",
      text1: "Validation",
      text2: "Please enter password",
    });
    return;
  }

  try {
    const response = await axios.post(
     "https://api.raoslawacademy.com/users/login",
      {
        "email": useremail,
       "mobile_number": userphonenumber,
        "password": userpassword,
      }
    );



    console.log({
      useremail,
      userphonenumber,
      userpassword

    });
    


     console.log(response.data.message);
    //  console.log(response.data.data.name  + "name recieved");
     console.log(response.data.data.userId +"userid recieved");

    //  var username = response.data.data.name;
    //  var userid= response.data.data.userId;
     

    if(response.data.statusCode===200){
      Toast.show({
        type:"success",
        text1: "Login Successful.Please verify your account.",
      });
const token="123456" ;
await AsyncStorage.multiSet([["@login-token", token]])
       router.push({
pathname: '/onboardings/verify_otp',
// params: {
//   "userId":userid,
//   "name": username??"",
  
// }
})
    }

if(response.data.statusCode===404){
      Toast.show({
        type:"error",
        text1: "Invalid credentials",
      });
    }


  } catch (error: any) {
    console.log(error.response?.data || error);

    Toast.show({
      type: "error",
      text1: "Login Failed",
      text2: error.response?.data?.message || "Something went wrong",
    });
  }
};

  const [secure, setSecure] = useState(true);

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
            <TextInput  value={useremail} onChangeText={Setemail}
              style={styles.input}
              placeholder="Enter email" 
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Phone */}
            <Text style={styles.label}>Phone Number</Text>
            <TextInput value={userphonenumber} onChangeText={Setphonenumber}
              style={styles.input}
              placeholder="Enter phone number"
              keyboardType="number-pad"
            />

            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordBox}>
              <TextInput value={userpassword} onChangeText={Setpassword}
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
            <TouchableOpacity style={styles.loginBtn} onPress={handleUserLogin}>
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
})
