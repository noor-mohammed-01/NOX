import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { commonStyles, colors, spacing, typography } from '../theme';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const Phone: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePhone = (value: string): boolean => {
    if (!value || value.trim().length === 0) {
      setError('Phone number is required');
      return false;
    }

    const cleanPhone = value.replace(/[\s]/g, '');

    if (!cleanPhone.startsWith('+91')) {
      setError('Phone number must start with +91');
      return false;
    }

    const digitsOnly = cleanPhone.replace(/[+]/g, '');

    if (!/^\d+$/.test(digitsOnly)) {
      setError('Phone number must contain only digits after +91');
      return false;
    }

    if (digitsOnly.length !== 12) {
      setError('Phone number must be +91 followed by exactly 10 digits');
      return false;
    }

    setError('');
    return true;
  };

  const handleContinue = () => {
    if (!validatePhone(phone)) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('OTP', { phone });
    }, 1000);
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    if (error) validatePhone(value);
  };

  return (
    <View style={[commonStyles.container, styles.container]}>
      <Text style={styles.title}>Enter your phone number</Text>
      <Text style={styles.subtitle}>We'll send you a verification code</Text>
      <Input
        placeholder="+91 9876543210"
        value={phone}
        onChangeText={handlePhoneChange}
        keyboardType="phone-pad"
        style={styles.input}
        error={!!error}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button
        title="Continue"
        onPress={handleContinue}
        loading={loading}
        disabled={phone.length < 13}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  input: {
    marginBottom: spacing.lg,
  },
  button: {
    marginTop: spacing.md,
  },
  error: {
    ...typography.bodySmall,
    color: colors.error,
    marginBottom: spacing.md,
  },
});
