import React, { useCallback, useState } from 'react';
import {
  Alert,
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import {
  commonStyles,
  colors,
  spacing,
  typography,
  borderRadius,
} from '../theme';
import { useContacts } from '../context/ContactContext';
import { useChat } from '../context/ChatContext';

const ACCENT = '#2f80ff';
const ON_ACCENT = '#ffffff';
const MAX_NAME_LENGTH = 40;

const INDIAN_PHONE_PATTERN = /^\+91[\s-]*\d(?:[\s-]*\d){9}$/;

const validateName = (value: string): string | null => {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return 'Enter a name.';
  }

  if (trimmed.length > MAX_NAME_LENGTH) {
    return `Name must be ${MAX_NAME_LENGTH} characters or fewer.`;
  }

  return null;
};

const normalizeIndianPhone = (value: string): string | null => {
  const trimmed = value.trim();

  if (!INDIAN_PHONE_PATTERN.test(trimmed)) {
    return null;
  }

  return trimmed.replace(/[\s-]/g, '');
};

export const CreateContact: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { addContact } = useContacts();
  const { ensureChatForContact } = useChat();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handleNameChange = useCallback((value: string) => {
    setName(value);
    setNameError(null);
  }, []);

  const handlePhoneChange = useCallback((value: string) => {
    setPhone(value);
    setPhoneError(null);
  }, []);

  const handleSave = useCallback(() => {
    const nextNameError = validateName(name);
    const normalized = normalizeIndianPhone(phone);

    const nextPhoneError = normalized
      ? null
      : 'Enter a valid Indian number: +91 followed by exactly 10 digits.';

    setNameError(nextNameError);
    setPhoneError(nextPhoneError);

    if (nextNameError || !normalized) {
      return;
    }

    const result = addContact(name, normalized);

    if (!result.ok) {
      if (result.reason === 'duplicate') {
        setPhoneError(
          `This number is already saved as ${result.existing.name}.`,
        );
      } else {
        setNameError('Enter a valid name and number.');
      }
      return;
    }

    ensureChatForContact(result.contact);

    Alert.alert(
      'Contact saved',
      `${result.contact.name} was added to your contacts.`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ],
      { cancelable: false },
    );
  }, [addContact, ensureChatForContact, name, navigation, phone]);

  return (
    <View style={commonStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>New Contact</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Name</Text>

        <TextInput
          style={[styles.input, nameError ? styles.inputError : null]}
          value={name}
          onChangeText={handleNameChange}
          placeholder="Full name"
          placeholderTextColor={colors.textTertiary}
          autoCapitalize="words"
        />

        {nameError ? (
          <Text style={styles.errorText}>{nameError}</Text>
        ) : null}

        <Text style={styles.label}>Phone number</Text>

        <TextInput
          style={[styles.input, phoneError ? styles.inputError : null]}
          value={phone}
          onChangeText={handlePhoneChange}
          placeholder="+91 98765 43210"
          placeholderTextColor={colors.textTertiary}
          keyboardType="phone-pad"
          maxLength={20}
        />

        {phoneError ? (
          <Text style={styles.errorText}>{phoneError}</Text>
        ) : null}

        <Text style={styles.hint}>
          Indian numbers only: +91 and 10 digits.
        </Text>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveText}>Save Contact</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    paddingVertical: spacing.xs,
    paddingRight: spacing.lg,
  },
  backText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text,
  },
  form: {
    padding: spacing.lg,
  },
  label: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  input: {
    ...typography.body,
    color: colors.text,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
    marginTop: spacing.xs,
  },
  hint: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  saveButton: {
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: ACCENT,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  saveText: {
    ...typography.body,
    color: ON_ACCENT,
    fontWeight: '600',
  },
});
