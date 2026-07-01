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
import Toast from 'react-native-toast-message';


export default function Referral() {


const handleSubmitReferal = () => {
  Toast.show({
    type: 'success',
    text1: 'Success',
    text2: 'Referral code applied 🎉',
    position: 'bottom',
  });
};

  return (
    <SafeAreaView style={styles.container}>
        <Toast/>
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
        />
      </View>

      {/* Claim Button */}
      <TouchableOpacity style={styles.primaryButton} onPress={handleSubmitReferal}>
        <Text style={styles.primaryButtonText}>Claim the referral</Text>
      </TouchableOpacity>

      {/* Skip Button */}
      <TouchableOpacity style={styles.secondaryButton} onPress={()=> router.push('/onboardings/login')}>
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
  },

  primaryButton: {
    width: '100%',
    backgroundColor: '#1E3A8A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 18,
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
