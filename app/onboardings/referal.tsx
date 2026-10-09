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
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const CLAIM_REFERRAL_URL = 'https://api.raoslawacademy.com/users/claimreferral';
const DEFAULT_USER_ID = '4237c5bb-30d1-495a-96f8-d70ba48ec110';

export default function Referral() {
  const [code, setCode] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);

  const handleSubmitReferal = async () => {
    const trimmedCode = code.trim();
    if (!trimmedCode) {
      Toast.show({
        type: 'info',
        text1: 'Referral Code',
        text2: 'Please enter a referral code to claim',
        position: 'bottom',
      });
      return;
    }

    try {
      setIsClaiming(true);
      const storedUserId = await AsyncStorage.getItem('userId');
      const userId = storedUserId || DEFAULT_USER_ID;

      const response = await axios.post(CLAIM_REFERRAL_URL, {
        userId,
        referred_by: trimmedCode,
      });

      if (response.data?.statusCode === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: response.data.message || 'Referral claimed successfully 🎉',
          position: 'bottom',
        });
        setTimeout(() => {
          router.push('/dashboard/dashboard');
        }, 1200);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Referral Claim Failed',
          text2: response.data?.message || 'Invalid Referral code',
          position: 'bottom',
        });
      }
    } catch (error: any) {
      console.log('Claim referral error:', error?.response?.data || error.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2:
          error?.response?.data?.message ||
          'Could not claim referral code. Please check and try again.',
        position: 'bottom',
      });
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Toast />

      {/* Illustration */}
      <Image
        source={require('../../assets/images/referal.png')}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Title */}
      <Text style={styles.title}>Enter Your referral code</Text>
      <Text style={styles.subtitle}>To get more coins</Text>

      {/* Input */}
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Paste here..."
          placeholderTextColor="#A0A6B0"
          style={styles.input}
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
        />
      </View>

      {/* Claim Button */}
      <TouchableOpacity
        style={[styles.primaryButton, isClaiming && styles.buttonDisabled]}
        onPress={handleSubmitReferal}
        disabled={isClaiming}
      >
        {isClaiming ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.primaryButtonText}>Claim the referral</Text>
        )}
      </TouchableOpacity>

      {/* Skip Button */}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push('/onboardings/login')}
        disabled={isClaiming}
      >
        <Text style={styles.secondaryButtonText}>Skip For Now</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF1F7',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: '100%',
    height: 260,
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#7A1E1E',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A8A',
    marginTop: 6,
    marginBottom: 30,
  },
  inputWrapper: {
    width: '100%',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#C4C8D0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 30,
    backgroundColor: '#F8FAFF',
  },
  input: {
    fontSize: 15,
    color: '#000',
    letterSpacing: 1.1,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#1E3A8A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 18,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#1E3A8A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#1E3A8A',
    fontSize: 16,
    fontWeight: '700',
  },
});
