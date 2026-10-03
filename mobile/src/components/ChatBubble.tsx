import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Message } from '../types';
import { colors, borderRadius, spacing, typography } from '../theme';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isOwn = message.isOwn;

  const renderStatus = () => {
    if (!isOwn) return null;
    const statusIcon = message.status === 'read' ? '✓✓' : message.status === 'delivered' ? '✓✓' : '✓';
    const statusColor = message.status === 'read' ? colors.textSecondary : colors.textTertiary;
    return <Text style={[styles.status, { color: statusColor }]}>{statusIcon}</Text>;
  };

  return (
    <View style={[styles.container, isOwn ? styles.own : styles.other]}>
      <View style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
        <Text style={styles.text}>{message.text}</Text>
        <View style={styles.footer}>
          <Text style={styles.time}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          {renderStatus()}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  own: {
    justifyContent: 'flex-end',
  },
  other: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  ownBubble: {
    backgroundColor: colors.messageOwn,
    borderBottomRightRadius: borderRadius.sm,
  },
  otherBubble: {
    backgroundColor: colors.messageOther,
    borderBottomLeftRadius: borderRadius.sm,
  },
  text: {
    ...typography.body,
    color: colors.text,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing.xs,
  },
  time: {
    ...typography.caption,
    color: colors.textTertiary,
    marginRight: spacing.xs,
  },
  status: {
    ...typography.caption,
  },
});
