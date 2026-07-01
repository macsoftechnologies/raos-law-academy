import { router } from 'expo-router';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

export default function AnotherLogin() {
  return (
    <SafeAreaView style={styles.container}>

  

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
        placeholder="1234567689"
        placeholderTextColor="#9CA3AF"
        keyboardType="default"
      />

      {/* Button */}
      <TouchableOpacity style={styles.button}  onPress={()=> router.push('/onboardings/mobile_verify')}>
        <Text style={styles.buttonText}>Generate OTP</Text>
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
    fontSize: 22,
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
    marginTop: 30,
  },

  infoText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 10,
    lineHeight: 20,
  },

  inputLabel: {
    marginTop: 40,
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
    marginTop: 50,
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
