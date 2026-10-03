import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList, NearbyUser } from '../types';
import { mockNearbyUsers } from '../mock/data';
import { commonStyles, colors, spacing, typography } from '../theme';
import { Avatar } from '../components/Avatar';
import { useContacts } from '../context/ContactContext';
import { useChat } from '../context/ChatContext';

export const NearbyUsers: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { contacts } = useContacts();
  const { ensureChatForContact } = useChat();

  const openNearbyChat = useCallback(
    (user: NearbyUser) => {
      const match = contacts.find((contact) => contact.name === user.name);

      const chatId = ensureChatForContact(
        match ?? {
          id: `nearby-${user.id}`,
          name: user.name,
          phone: '',
        },
      );

      navigation.navigate('Conversation', { chatId });
    },
    [contacts, ensureChatForContact, navigation],
  );

  const renderUserItem = useCallback(
    ({ item }: { item: NearbyUser }) => (
      <TouchableOpacity
        style={styles.userItem}
        onPress={() => openNearbyChat(item)}
        activeOpacity={0.7}
      >
        <Avatar name={item.name} size={50} isOnline={item.isOnline} />

        <View style={styles.userInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.distance}>{item.distance}m away (mock)</Text>
        </View>

        <View
          style={[
            styles.statusIndicator,
            item.isOnline
              ? styles.statusOnline
              : styles.statusOffline,
          ]}
        />
      </TouchableOpacity>
    ),
    [openNearbyChat],
  );

  return (
    <View style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nearby Users</Text>
        <Text style={styles.headerSubtitle}>
          {'Mock nearby users - real Wi-Fi discovery will be added later'}
        </Text>
      </View>

      <FlatList
        data={mockNearbyUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No mock nearby users to show
            </Text>
            <Text style={styles.emptySubtext}>
              Real nearby discovery arrives in a later phase
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text,
  },
  headerSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  list: {
    flex: 1,
  },
  userItem: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  name: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  distance: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusOnline: {
    backgroundColor: colors.online,
  },
  statusOffline: {
    backgroundColor: colors.offline,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});
