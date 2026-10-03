import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { commonStyles, colors, spacing, typography } from '../theme';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Avatar } from '../components/Avatar';

export const ProfileSetup: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    if (name.trim().length < 2) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('ChatList');
    }, 1000);
  };

  return (
    <ScrollView style={[commonStyles.container, styles.container]}>
      <View style={styles.avatarContainer}>
        <Avatar name={name || 'User'} size={100} />
      </View>
      <Text style={styles.title}>Create your profile</Text>
      <Input
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <Button
        title="Continue"
        onPress={handleContinue}
        loading={loading}
        disabled={name.trim().length < 2}
        style={styles.button}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  input: {
    marginBottom: spacing.lg,
  },
  button: {
    marginTop: spacing.md,
  },
});
