import React, { useState } from 'react';
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
} from 'react-native';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function Registration() {
  const [isChecked, setIsChecked] = useState(false);

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
            <TextInput style={styles.input} />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              keyboardType="email-address"
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Create Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
            />

            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={styles.passwordInput}
                secureTextEntry
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

            
            <TouchableOpacity style={styles.button} onPress={()=> router.push('/onboardings/referal')}>
              <Text style={styles.buttonText}>Sign up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={router.back}>
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
    paddingBottom:150, // safe for gesture navigation
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

