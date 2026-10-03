import React from 'react';
import { TextInput, StyleSheet, View, ViewStyle, TextInputProps } from 'react-native';
import { colors, borderRadius, spacing, typography } from '../theme';

interface InputProps extends TextInputProps {
  style?: ViewStyle;
  error?: boolean;
}

export const Input: React.FC<InputProps> = ({ style, error = false, ...props }) => {
  return (
    <View style={[styles.container, error && styles.errorContainer, style]}>
      <TextInput
        style={[styles.input, error && styles.errorInput]}
        placeholderTextColor={colors.textTertiary}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  errorContainer: {
    borderColor: colors.error,
  },
  input: {
    height: 48,
    paddingHorizontal: spacing.md,
    ...typography.body,
    color: colors.text,
  },
  errorInput: {
    color: colors.error,
  },
});
