import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList, Chat } from '../types';
import {
  commonStyles,
  colors,
  spacing,
  typography,
  borderRadius,
} from '../theme';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { useChat } from '../context/ChatContext';

export const ChatList: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { chats } = useChat();

  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        navigation.navigate('Conversation', { chatId: item.id })
      }
      activeOpacity={0.7}
    >
      <Avatar name={item.name} size={50} isOnline={item.isOnline} />

      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.name}>{item.name}</Text>

          {item.lastMessageTime && (
            <Text style={styles.time}>
              {new Date(item.lastMessageTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          )}
        </View>

        <View style={styles.chatFooter}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.isTyping
              ? 'typing...'
              : item.lastMessage ?? 'No messages yet'}
          </Text>

          {item.unreadCount > 0 && (
            <Badge count={item.unreadCount} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.7}
        >
          <Text style={styles.pillText}>Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Search')}
          activeOpacity={0.7}
        >
          <Text style={styles.pillText}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('NewChat')}
          activeOpacity={0.7}
        >
          <Text style={styles.pillText}>New Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Contacts')}
          activeOpacity={0.7}
        >
          <Text style={styles.pillText}>Contacts</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No chats yet</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text,
  },
  settingsButton: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.xs,
  },
  pillText: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  chatInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  time: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
    marginRight: spacing.sm,
  },
  emptyContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textTertiary,
  },
});
