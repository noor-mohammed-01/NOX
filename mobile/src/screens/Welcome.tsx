import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { commonStyles, colors, spacing, typography } from '../theme';
import { Button } from '../components/Button';

export const Welcome: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={[commonStyles.container, commonStyles.center]}>
      <View style={styles.logo}>
        <View style={styles.logoInner} />
      </View>
      <Text style={styles.title}>NOX</Text>
      <Text style={styles.subtitle}>Secure Messenger</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Get Started"
          onPress={() => navigation.navigate('Phone')}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primaryDark,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xxl,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: spacing.xl,
  },
  button: {
    width: '100%',
  },
});
