import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { mockCurrentUser } from '../mock/data';
import {
  commonStyles,
  colors,
  spacing,
  typography,
  borderRadius,
} from '../theme';
import { Avatar } from '../components/Avatar';
import { useConnection } from '../context/ConnectionContext';

const SWITCH_TRACK = {
  false: colors.offline,
  true: colors.online,
};

export const Profile: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { isOnline, setIsOnline } = useConnection();

  const renderMenuItem = (title: string, onPress: () => void) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.menuText}>{title}</Text>
      <Text style={styles.menuArrow}>{'\u203A'}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={commonStyles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Avatar
          name={mockCurrentUser.name}
          size={80}
          isOnline={isOnline}
        />
        <Text style={styles.name}>{mockCurrentUser.name}</Text>
        <Text style={styles.phone}>{mockCurrentUser.phone}</Text>
        <Text style={styles.status}>{mockCurrentUser.status}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connection (Mock)</Text>

        <View
          style={[
            styles.connectionCard,
            isOnline ? styles.cardOnline : styles.cardOffline,
          ]}
        >
          <View style={styles.connectionRow}>
            <View style={styles.connectionInfo}>
              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.statusDot,
                    isOnline ? styles.dotOnline : styles.dotOffline,
                  ]}
                />
                <Text style={styles.connectionState}>
                  {isOnline ? 'Online' : 'Offline'}
                </Text>
              </View>

              <Text style={styles.connectionNote}>
                {isOnline
                  ? 'Chats use the online path (simulated).'
                  : 'Offline mode (simulated). Chats show the nearby-communication option.'}
              </Text>
            </View>

            <Switch
              value={isOnline}
              onValueChange={setIsOnline}
              trackColor={SWITCH_TRACK}
              thumbColor={colors.text}
            />
          </View>

          <Text style={styles.mockLabel}>
            MOCK: this toggle only changes the UI. No real network or Wi-Fi
            connection is used.
          </Text>
        </View>

        {renderMenuItem('Nearby Users (Mock)', () =>
          navigation.navigate('NearbyUsers'),
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        {renderMenuItem('Account', () => {})}
        {renderMenuItem('Privacy', () => {})}
        {renderMenuItem('Notifications', () => {})}
        {renderMenuItem('Security', () => {})}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        {renderMenuItem('Theme', () => {})}
        {renderMenuItem('Language', () => {})}
        {renderMenuItem('Storage', () => {})}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        {renderMenuItem('Help', () => {})}
        {renderMenuItem('About', () => {})}
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        activeOpacity={0.7}
      >
        <Text style={styles.logoutText}>Log Out</Text>
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
  phone: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  status: {
    ...typography.bodySmall,
    color: colors.textTertiary,
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
  connectionCard: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  cardOnline: {
    borderColor: colors.online,
  },
  cardOffline: {
    borderColor: colors.offline,
  },
  connectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  connectionInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  dotOnline: {
    backgroundColor: colors.online,
  },
  dotOffline: {
    backgroundColor: colors.offline,
  },
  connectionState: {
    ...typography.h2,
    color: colors.text,
  },
  connectionNote: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  mockLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.md,
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
  logoutButton: {
    margin: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.error,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  logoutText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
});
