import React from 'react';
import { TouchableOpacity, StyleSheet, Text, ActivityIndicator, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing, typography } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}) => {
  const isDisabled = disabled || loading;

  const getBackgroundColor = () => {
    if (isDisabled) return colors.surfaceLight;
    if (variant === 'primary') return colors.primary;
    if (variant === 'secondary') return colors.secondary;
    return 'transparent';
  };

  const getTextColor = () => {
    if (isDisabled) return colors.textTertiary;
    if (variant === 'outline') return colors.primary;
    return colors.text;
  };

  const getBorderColor = () => {
    if (variant === 'outline') return colors.primary;
    return 'transparent';
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: getBackgroundColor(), borderColor: getBorderColor() }, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
  },
  text: {
    ...typography.body,
    fontWeight: '600',
  },
});
