import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  NavigationProp,
  RouteProp,
} from '@react-navigation/native';
import { RootStackParamList, Message, Contact } from '../types';
import {
  commonStyles,
  colors,
  spacing,
  typography,
  borderRadius,
} from '../theme';
import { Avatar } from '../components/Avatar';
import { useChat } from '../context/ChatContext';
import { useContacts } from '../context/ContactContext';

const ACCENT = '#2f80ff';

type GlobalResult = {
  id: string;
  name: string;
  subtitle: string;
  contact?: Contact;
};

const renderHighlighted = (
  text: string,
  needle: string,
): React.ReactNode => {
  const lower = text.toLowerCase();
  const target = needle.toLowerCase();
  const parts: React.ReactNode[] = [];

  if (target.length === 0) {
    return text;
  }

  let cursor = 0;
  let key = 0;
  let index = lower.indexOf(target, cursor);

  while (index !== -1) {
    if (index > cursor) {
      parts.push(text.slice(cursor, index));
    }

    parts.push(
      <Text key={key} style={styles.highlight}>
        {text.slice(index, index + target.length)}
      </Text>,
    );

    key += 1;
    cursor = index + target.length;
    index = lower.indexOf(target, cursor);
  }

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return parts.length > 0 ? parts : text;
};

const formatTime = (value: Date) =>
  new Date(value).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

export const Search: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Search'>>();

  const chatId = route.params?.chatId;

  const [query, setQuery] = useState('');

  const {
    chats,
    getChat,
    getMessages,
    ensureChatForContact,
  } = useChat();

  const { contacts } = useContacts();

  const trimmedQuery = query.trim();
  const needle = trimmedQuery.toLowerCase();
  const chat = chatId ? getChat(chatId) : undefined;

  const globalResults = useMemo<GlobalResult[]>(() => {
    if (chatId || needle.length === 0) {
      return [];
    }

    const compact = needle.replace(/\s/g, '');
    const found = new Map<string, GlobalResult>();

    chats.forEach((item) => {
      if (item.name.toLowerCase().includes(needle)) {
        found.set(item.id, {
          id: item.id,
          name: item.name,
          subtitle: item.lastMessage ?? 'No messages yet',
        });
      }
    });

    contacts.forEach((item) => {
      const matches =
        item.name.toLowerCase().includes(needle) ||
        item.phone.replace(/\s/g, '').includes(compact);

      if (matches && !found.has(item.id)) {
        found.set(item.id, {
          id: item.id,
          name: item.name,
          subtitle: item.phone || 'No number',
          contact: item,
        });
      }
    });

    return Array.from(found.values());
  }, [chatId, chats, contacts, needle]);

  const messageResults = useMemo<Message[]>(() => {
    if (!chatId || needle.length === 0) {
      return [];
    }

    return getMessages(chatId)
      .filter((message) =>
        message.text.toLowerCase().includes(needle),
      )
      .reverse();
  }, [chatId, getMessages, needle]);

  const handleBack = useCallback(
    () => navigation.goBack(),
    [navigation],
  );

  const handleClear = useCallback(
    () => setQuery(''),
    [],
  );

  const openGlobalResult = useCallback(
    (result: GlobalResult) => {
      const targetId = result.contact
        ? ensureChatForContact(result.contact)
        : result.id;

      navigation.navigate('Conversation', { chatId: targetId });
    },
    [ensureChatForContact, navigation],
  );

  const renderGlobalItem = useCallback(
    ({ item }: { item: GlobalResult }) => (
      <TouchableOpacity
        style={styles.resultItem}
        onPress={() => openGlobalResult(item)}
        activeOpacity={0.7}
      >
        <Avatar name={item.name} size={44} />

        <View style={styles.resultInfo}>
          <Text style={styles.resultName}>
            {renderHighlighted(item.name, trimmedQuery)}
          </Text>

          <Text style={styles.resultSub} numberOfLines={1}>
            {item.subtitle}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [openGlobalResult, trimmedQuery],
  );

  const chatName = chat?.name;

  const renderMessageItem = useCallback(
    ({ item }: { item: Message }) => (
      <TouchableOpacity
        style={styles.messageItem}
        onPress={handleBack}
        activeOpacity={0.7}
      >
        <View style={styles.messageMeta}>
          <Text style={styles.resultName}>
            {item.isOwn ? 'You' : chatName ?? 'Contact'}
          </Text>

          <Text style={styles.resultSub}>
            {formatTime(item.timestamp)}
          </Text>
        </View>

        <Text style={styles.messageText}>
          {renderHighlighted(item.text, trimmedQuery)}
        </Text>
      </TouchableOpacity>
    ),
    [chatName, handleBack, trimmedQuery],
  );

  const globalKey = useCallback(
    (item: GlobalResult) => item.id,
    [],
  );

  const messageKey = useCallback(
    (item: Message) => item.id,
    [],
  );

  const renderEmpty = (
    title: string,
    subtitle?: string,
  ) => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>{title}</Text>

      {subtitle ? (
        <Text style={styles.emptySubtitle}>{subtitle}</Text>
      ) : null}
    </View>
  );

  const isConversationMode = chatId !== undefined;

  const title = isConversationMode
    ? `Search in ${chatName ?? 'chat'}`
    : 'Search';

  const placeholder = isConversationMode
    ? 'Search messages'
    : 'Search chats and contacts';

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

        <Text
          style={styles.headerTitle}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          autoFocus
          autoCorrect={false}
          returnKeyType="search"
        />

        {query.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            activeOpacity={0.7}
          >
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {isConversationMode ? (
        <FlatList
          data={messageResults}
          renderItem={renderMessageItem}
          keyExtractor={messageKey}
          style={styles.list}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            trimmedQuery.length === 0
              ? renderEmpty(
                  'Type to search messages in this chat',
                )
              : renderEmpty(
                  `No messages match "${trimmedQuery}"`,
                )
          }
        />
      ) : (
        <FlatList
          data={globalResults}
          renderItem={renderGlobalItem}
          keyExtractor={globalKey}
          style={styles.list}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            trimmedQuery.length === 0
              ? renderEmpty(
                  'Search your chats and contacts',
                  'Search by name or phone number (mock data)',
                )
              : renderEmpty(
                  `No chats or contacts match "${trimmedQuery}"`,
                )
          }
        />
      )}
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
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  input: {
    ...typography.body,
    flex: 1,
    color: colors.text,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  clearButton: {
    marginLeft: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  clearText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  resultName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  resultSub: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  messageItem: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  messageMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  messageText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  highlight: {
    color: ACCENT,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyTitle: {
    ...typography.body,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
