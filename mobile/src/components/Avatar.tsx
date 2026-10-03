import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colors } from '../theme';

interface AvatarProps {
  name?: string;
  size?: number;
  isOnline?: boolean;
  style?: any;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 40,
  isOnline = false,
  style,
}) => {
  const initials = name
    ? name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <View style={[styles.avatar, { width: size, height: size }]}>
        <Text style={[styles.text, { fontSize: size * 0.4 }]}>{initials}</Text>
      </View>
      {isOnline && (
        <View
          style={[
            styles.onlineIndicator,
            { width: size * 0.25, height: size * 0.25 },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatar: {
    borderRadius: 9999,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: colors.text,
    fontWeight: '600',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 9999,
    backgroundColor: colors.online,
    borderWidth: 2,
    borderColor: colors.background,
  },
});
