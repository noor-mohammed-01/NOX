import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface BadgeProps {
  count: number;
  style?: any;
}

export const Badge: React.FC<BadgeProps> = ({ count, style }) => {
  if (count === 0) return null;

  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{displayCount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: spacing.xs,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '600',
    fontSize: 10,
  },
});
