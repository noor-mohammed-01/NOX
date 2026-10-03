import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useNavigation, NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { commonStyles, colors, spacing, typography } from '../theme';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

type OTPRouteProp = RouteProp<RootStackParamList, 'OTP'>;

interface Props {
  route: OTPRouteProp;
}

export const OTP: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { phone } = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = () => {
    if (otp.length !== 6) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('ProfileSetup');
    }, 1000);
  };

  return (
    <View style={[commonStyles.container, styles.container]}>
      <Text style={styles.title}>Enter verification code</Text>
      <Text style={styles.subtitle}>Code sent to {phone}</Text>
      <Input
        placeholder="123456"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={6}
        style={styles.input}
      />
      <Button
        title="Verify"
        onPress={handleVerify}
        loading={loading}
        disabled={otp.length !== 6}
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
});
