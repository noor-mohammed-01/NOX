import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
  NavigationProp,
  RouteProp,
} from '@react-navigation/native';
import { RootStackParamList, Message } from '../types';
import {
  commonStyles,
  colors,
  spacing,
  typography,
  borderRadius,
} from '../theme';
import { Avatar } from '../components/Avatar';
import { ChatBubble } from '../components/ChatBubble';
import { TypingIndicator } from '../components/TypingIndicator';
import { useConnection } from '../context/ConnectionContext';
import { useChat } from '../context/ChatContext';

const ACCENT = '#2f80ff';
const ON_ACCENT = '#ffffff';
const MAX_MESSAGE_LENGTH = 2000;
const CURRENT_USER_ID = '1';

export const Conversation: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Conversation'>>();
  const { chatId } = route.params;

  const [messageText, setMessageText] = useState('');
  const listRef = useRef<FlatList<Message>>(null);
  const sendCountRef = useRef(0);

  const { isOnline } = useConnection();
  const {
    getChat,
    getMessages,
    addMessage,
    startMockTyping,
    setActiveChat,
  } = useChat();

  const chat = getChat(chatId);
  const messages = getMessages(chatId);

  useFocusEffect(
    useCallback(() => {
      setActiveChat(chatId);

      return () => {
        setActiveChat(null);
      };
    }, [chatId, setActiveChat]),
  );

  const canSend = messageText.trim().length > 0;

  const handleSend = useCallback(() => {
    const text = messageText.trim();

    if (text.length === 0) {
      return;
    }

    sendCountRef.current += 1;

    addMessage(chatId, {
      id: `out-${Date.now()}-${sendCountRef.current}`,
      chatId,
      senderId: CURRENT_USER_ID,
      text,
      timestamp: new Date(),
      status: 'sent',
      isOwn: true,
    });

    setMessageText('');
    startMockTyping(chatId);
  }, [addMessage, chatId, messageText, startMockTyping]);

  const handleBack = useCallback(
    () => navigation.goBack(),
    [navigation],
  );

  const handleOpenProfile = useCallback(
    () => navigation.navigate('UserProfile', { userId: chatId }),
    [chatId, navigation],
  );

  const handleSearchChat = useCallback(
    () => navigation.navigate('Search', { chatId }),
    [chatId, navigation],
  );

  const handleViewMedia = useCallback(
    () => navigation.navigate('MediaGallery', { chatId }),
    [chatId, navigation],
  );

  const handleOpenNearby = useCallback(
    () => navigation.navigate('NearbyUsers'),
    [navigation],
  );

  const renderMessage = useCallback(
    ({ item }: { item: Message }) => <ChatBubble message={item} />,
    [],
  );

  const keyExtractor = useCallback(
    (item: Message) => item.id,
    [],
  );

  const scrollToEnd = useCallback(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, []);

  if (!chat) {
    return (
      <View style={commonStyles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Conversation not found</Text>
        </View>
      </View>
    );
  }

  let statusText = chat.isOnline ? 'online' : 'offline';

  if (chat.isTyping) {
    statusText = 'typing...';
  }

  const typingFooter = chat.isTyping ? (
    <View style={styles.typingRow}>
      <View style={styles.typingBubble}>
        <TypingIndicator />
      </View>
    </View>
  ) : null;

  const emptyState = (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No messages yet</Text>
      <Text style={styles.emptySubtitle}>
        Say hello to {chat.name}.
      </Text>
    </View>
  );

  return (
    <View style={commonStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profileTap}
          onPress={handleOpenProfile}
          activeOpacity={0.7}
        >
          <Avatar
            name={chat.name}
            size={40}
            isOnline={chat.isOnline}
          />

          <View style={styles.headerInfo}>
            <Text
              style={styles.headerName}
              numberOfLines={1}
            >
              {chat.name}
            </Text>

            <Text
              style={[
                styles.headerStatus,
                chat.isTyping ? styles.headerStatusTyping : null,
              ]}
            >
              {statusText}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleSearchChat}
          activeOpacity={0.7}
        >
          <Text style={styles.actionText}>Search Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleViewMedia}
          activeOpacity={0.7}
        >
          <Text style={styles.actionText}>View Media</Text>
        </TouchableOpacity>
      </View>

      {!isOnline && (
        <TouchableOpacity
          style={styles.banner}
          onPress={handleOpenNearby}
          activeOpacity={0.8}
        >
          <Text style={styles.bannerText}>
            Switch to nearby communication
          </Text>
        </TouchableOpacity>
      )}

      <FlatList
        ref={listRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={keyExtractor}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={scrollToEnd}
        ListEmptyComponent={emptyState}
        ListFooterComponent={typingFooter ?? undefined}
        keyboardShouldPersistTaps="handled"
      />

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Message"
          placeholderTextColor={colors.textTertiary}
          multiline
          maxLength={MAX_MESSAGE_LENGTH}
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            !canSend && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!canSend}
          activeOpacity={0.7}
        >
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    paddingVertical: spacing.xs,
    paddingRight: spacing.md,
  },
  backText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  profileTap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  headerName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  headerStatus: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  headerStatusTyping: {
    color: colors.online,
  },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
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
  actionText: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '600',
  },
  banner: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.offline,
  },
  bannerText: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    ...typography.body,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
  typingRow: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
  typingBubble: {
    backgroundColor: colors.surface,
    borderRadius: 16,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    ...typography.body,
    flex: 1,
    maxHeight: 120,
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  sendButton: {
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: ACCENT,
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendText: {
    color: ON_ACCENT,
    fontWeight: '600',
  },
});

