import React, { useCallback } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList, Contact } from '../types';
import { commonStyles, colors, spacing, typography, borderRadius } from '../theme';
import { Avatar } from '../components/Avatar';
import { useContacts } from '../context/ContactContext';
import { useChat } from '../context/ChatContext';

const ACCENT = '#2f80ff';
const ON_ACCENT = '#ffffff';

export const Contacts: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { contacts } = useContacts();
  const { ensureChatForContact } = useChat();

  const openChat = useCallback(
    (contact: Contact) => {
      const chatId = ensureChatForContact(contact);
      navigation.navigate('Conversation', { chatId });
    },
    [ensureChatForContact, navigation],
  );

  const renderContactItem = useCallback(
    ({ item }: { item: Contact }) => (
      <TouchableOpacity
        style={styles.contactItem}
        onPress={() => openChat(item)}
        activeOpacity={0.7}
      >
        <Avatar name={item.name} size={50} />
        <View style={styles.contactInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.phone}>{item.phone}</Text>
        </View>
      </TouchableOpacity>
    ),
    [openChat],
  );

  return (
    <View style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contacts</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateContact')}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>Add Contact</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={contacts}
        renderItem={renderContactItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
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
  addButton: {
    backgroundColor: ACCENT,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  addButtonText: {
    ...typography.bodySmall,
    color: ON_ACCENT,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  contactInfo: {
    marginLeft: spacing.md,
  },
  name: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  phone: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});
