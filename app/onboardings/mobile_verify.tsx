import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';

export default function VerifyOTP() {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input when value entered
    if (value && index < otp.length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Illustration */}
      <Image
        source={require('../../assets/images/otplaw.png')}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Title */}
      <Text style={styles.title}>Verify your Mobile Number</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>We sent a OTP to 1234567890</Text>
      <Text style={styles.subtitleSmall}>
        enter 4 digit code that mentioned in the sms
      </Text>

      {/* OTP Boxes */}
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
          ref={(ref) => {
  inputs.current[index] = ref;
}}

            value={digit}
            onChangeText={(value) => handleChange(value, index)}
            style={[
              styles.otpBox,
              digit !== '' && styles.otpBoxFilled,
            ]}
            maxLength={1}
            keyboardType="number-pad"
            textAlign="center"
          />
        ))}
      </View>

      {/* Resend */}
      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Haven’t got the SMS yet? </Text>
        <Text style={styles.resendLink}>Resend OTP</Text>
      </View>

      {/* Verify Button */}
      <TouchableOpacity style={styles.verifyButton}>
        <Text style={styles.verifyButtonText}>Verify</Text>
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
    marginTop: 20,
  },

  backArrow: {
    fontSize: 22,
  },

  image: {
    width: '100%',
    height: 260,
    marginTop: 40,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 20,
    color: '#000',
  },

  subtitle: {
    textAlign: 'center',
    marginTop: 10,
    color: '#6B7280',
    fontSize: 14,
  },

  subtitleSmall: {
    textAlign: 'center',
    marginTop: 4,
    color: '#9CA3AF',
    fontSize: 13,
  },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    paddingHorizontal: 10,
  },

  otpBox: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    textAlign: 'center',
    fontSize: 18,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },

  otpBoxFilled: {
    borderColor: '#1E3A8A',
  },

  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },

  resendText: {
    color: '#6B7280',
  },

  resendLink: {
    color: '#1E3A8A',
    fontWeight: '600',
  },

  verifyButton: {
    marginTop: 60,
    backgroundColor: '#1E3A8A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
