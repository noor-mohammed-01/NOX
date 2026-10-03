import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';

export const TypingIndicator: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={[styles.dot, styles.dot1]} />
      <View style={[styles.dot, styles.dot2]} />
      <View style={[styles.dot, styles.dot3]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textTertiary,
    marginHorizontal: 2,
  },
  dot1: {
    opacity: 0.3,
  },
  dot2: {
    opacity: 0.6,
  },
  dot3: {
    opacity: 1,
  },
});
