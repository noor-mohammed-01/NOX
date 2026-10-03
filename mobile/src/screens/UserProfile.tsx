import React, { useCallback, useMemo } from 'react';
import {
  Alert,
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  NavigationProp,
  RouteProp,
} from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { mockNearbyUsers } from '../mock/data';
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

export const UserProfile: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'UserProfile'>>();
  const { userId } = route.params;

  const { contacts } = useContacts();
  const { chats, ensureChatForContact } = useChat();

  const profile = useMemo(() => {
    const contact = contacts.find((item) => item.id === userId);
    const existingChat = chats.find((item) => item.id === userId);
    const nearby = mockNearbyUsers.find(
      (item) => `nearby-${item.id}` === userId,
    );

    if (!contact && !existingChat && !nearby) {
      return null;
    }

    return {
      name:
        contact?.name ??
        existingChat?.name ??
        nearby?.name ??
        'Unknown',
      phone: contact?.phone ?? '',
      isOnline:
        existingChat?.isOnline ??
        nearby?.isOnline ??
        false,
      chatId: existingChat?.id,
      contact,
    };
  }, [chats, contacts, userId]);

  const handleBack = useCallback(
    () => navigation.goBack(),
    [navigation],
  );

  const resolveChatId = useCallback((): string | undefined => {
    if (!profile) {
      return undefined;
    }

    if (profile.chatId) {
      return profile.chatId;
    }

    return profile.contact
      ? ensureChatForContact(profile.contact)
      : undefined;
  }, [ensureChatForContact, profile]);

  const handleSearchMessages = useCallback(() => {
    const resolvedChatId = resolveChatId();

    if (resolvedChatId) {
      navigation.navigate('Search', {
        chatId: resolvedChatId,
      });
    }
  }, [navigation, resolveChatId]);

  const handleViewMedia = useCallback(() => {
    const resolvedChatId = resolveChatId();

    navigation.navigate(
      'MediaGallery',
      resolvedChatId
        ? { chatId: resolvedChatId }
        : undefined,
    );
  }, [navigation, resolveChatId]);

  const showMockAlert = useCallback((label: string) => {
    Alert.alert(
      label,
      'Mock action: not available in Phase 1.',
    );
  }, []);

  const renderAction = (
    title: string,
    onPress: () => void,
  ) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.menuText}>{title}</Text>
      <Text style={styles.menuArrow}>{'\u203A'}</Text>
    </TouchableOpacity>
  );

  if (!profile) {
    return (
      <View style={commonStyles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>
            User not found
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={commonStyles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBack}
        activeOpacity={0.7}
      >
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Avatar
          name={profile.name}
          size={100}
          isOnline={profile.isOnline}
        />

        <Text style={styles.name}>{profile.name}</Text>

        <Text style={styles.status}>
          {profile.isOnline ? 'Online' : 'Offline'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Info</Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>
            {profile.phone.length > 0
              ? profile.phone
              : 'Number not available'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chat</Text>

        {renderAction(
          'Search Messages',
          handleSearchMessages,
        )}

        {renderAction('View Media', handleViewMedia)}

        {renderAction(
          'Mute Notifications (Mock)',
          () => showMockAlert('Mute Notifications'),
        )}
      </View>

      <TouchableOpacity
        style={styles.blockButton}
        onPress={() => showMockAlert('Block User')}
        activeOpacity={0.8}
      >
        <Text style={styles.blockText}>
          Block User (Mock)
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  backButton: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    alignSelf: 'flex-start',
  },
  backText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  header: {
    alignItems: 'center',
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  name: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.md,
  },
  status: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    fontWeight: '600',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  infoCard: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
  },
  infoLabel: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  infoValue: {
    ...typography.body,
    color: colors.text,
    marginTop: spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  menuText: {
    ...typography.body,
    color: colors.text,
  },
  menuArrow: {
    ...typography.body,
    color: colors.textTertiary,
  },
  blockButton: {
    margin: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.error,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  blockText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  notFound: {
    alignItems: 'center',
    padding: spacing.xxl,
  },
  notFoundText: {
    ...typography.body,
    color: colors.textTertiary,
  },
});
