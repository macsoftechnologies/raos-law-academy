import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import Toast from 'react-native-toast-message';

export default function AnotherLogin() {
  const [contactText, setContactText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateOTP = async () => {
    const cleanContact = contactText.trim();
    if (!cleanContact) {
      Toast.show({
        type: 'info',
        text1: 'Validation',
        text2: 'Please enter your mobile number or email',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'https://api.raoslawacademy.com/users/loginanotherway',
        {
          text: cleanContact,
        }
      );

      const statusCode = response.data?.statusCode;
      const message = response.data?.message;
      const userData = response.data?.data;

      if (statusCode === 200 || statusCode === 201) {
        Toast.show({
          type: 'success',
          text1: 'OTP Sent',
          text2: typeof message === 'string' ? message : 'OTP sent successfully.',
        });

        router.push({
          pathname: '/onboardings/mobile_verify',
          params: {
            userId: userData?.userId,
            phone: userData?.mobile_number,
            email: userData?.email,
            name: userData?.name,
            otp: userData?.otp ? String(userData.otp) : '',
          },
        });
        return;
      }

      if (statusCode === 404) {
        Toast.show({
          type: 'error',
          text1: 'User Not Found',
          text2: 'No registered account found. Please sign up first.',
        });
        return;
      }

      Toast.show({
        type: 'error',
        text1: 'Request Failed',
        text2: typeof message === 'string' ? message : 'Unable to generate OTP.',
      });
    } catch (error: any) {
      console.log('Login another way error:', error?.response?.data || error.message);
      const errorMsg = error?.response?.data?.message;
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: typeof errorMsg === 'string' ? errorMsg : 'Network error. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#000" style={styles.backArrow} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sign-in Other Way</Text>
      </View>

      {/* Illustration */}
      <Image
        source={require('../../assets/images/signot.png')}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Info Text */}
      <Text style={styles.infoText}>
        Enter mobile number or email to for{'\n'}signin other way
      </Text>

      {/* Input Label */}
      <Text style={styles.inputLabel}>
        Enter Mobile Number or Mail Id
      </Text>

      {/* Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter 10-digit number or email"
        placeholderTextColor="#9CA3AF"
        keyboardType="default"
        autoCapitalize="none"
        value={contactText}
        onChangeText={setContactText}
      />

      {/* Button */}
      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleGenerateOTP}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Generate OTP</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF1F7',
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  backArrow: {
    marginRight: 10,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },

  image: {
    width: '100%',
    height: 260,
    marginTop: 20,
  },

  infoText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 10,
    lineHeight: 20,
  },

  inputLabel: {
    marginTop: 30,
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
    marginBottom: 10,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  button: {
    marginTop: 40,
    backgroundColor: '#1E3A8A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
