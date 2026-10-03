import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  NavigationProp,
  RouteProp,
} from '@react-navigation/native';
import { RootStackParamList } from '../types';
import {
  commonStyles,
  colors,
  spacing,
  typography,
  borderRadius,
} from '../theme';
import { useChat } from '../context/ChatContext';

const ACCENT = '#2f80ff';
const ON_ACCENT = '#ffffff';
const COLUMNS = 3;

type MediaKind = 'image' | 'video' | 'file';

type MockMedia = {
  id: string;
  kind: MediaKind;
  title: string;
  meta: string;
  tint: string;
};

const KIND_LABEL: Record<MediaKind, string> = {
  image: 'IMG',
  video: 'VIDEO',
  file: 'FILE',
};

const TABS: { key: MediaKind; label: string }[] = [
  { key: 'image', label: 'Images' },
  { key: 'video', label: 'Videos' },
  { key: 'file', label: 'Files' },
];

const MOCK_MEDIA: MockMedia[] = [
  { id: 'm1', kind: 'image', title: 'IMG_0412.jpg', meta: '1.8 MB', tint: '#1f3a5f' },
  { id: 'm2', kind: 'image', title: 'IMG_0413.jpg', meta: '2.1 MB', tint: '#3a1f5f' },
  { id: 'm3', kind: 'image', title: 'IMG_0420.jpg', meta: '950 KB', tint: '#1f5f4a' },
  { id: 'm4', kind: 'image', title: 'IMG_0431.jpg', meta: '3.4 MB', tint: '#5f3a1f' },
  { id: 'm5', kind: 'image', title: 'IMG_0442.jpg', meta: '1.2 MB', tint: '#5f1f3a' },
  { id: 'm6', kind: 'image', title: 'IMG_0450.jpg', meta: '2.7 MB', tint: '#3a5f1f' },
  { id: 'v1', kind: 'video', title: 'VID_0087.mp4', meta: '0:42 - 12.4 MB', tint: '#1f4a5f' },
  { id: 'v2', kind: 'video', title: 'VID_0091.mp4', meta: '1:15 - 28.9 MB', tint: '#4a1f5f' },
  { id: 'v3', kind: 'video', title: 'VID_0102.mp4', meta: '0:18 - 5.6 MB', tint: '#5f4a1f' },
  { id: 'f1', kind: 'file', title: 'project_notes.pdf', meta: '320 KB', tint: '#2a2f3a' },
  { id: 'f2', kind: 'file', title: 'schedule.xlsx', meta: '86 KB', tint: '#2a3a2f' },
  { id: 'f3', kind: 'file', title: 'report_draft.docx', meta: '212 KB', tint: '#3a2a2f' },
  { id: 'f4', kind: 'file', title: 'archive.zip', meta: '4.2 MB', tint: '#2f2a3a' },
];

export const MediaGallery: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'MediaGallery'>>();
  const chatId = route.params?.chatId;
  const { getChat } = useChat();
  const { width } = useWindowDimensions();

  const [activeTab, setActiveTab] = useState<MediaKind>('image');
  const [selected, setSelected] = useState<MockMedia | null>(null);

  const chat = chatId ? getChat(chatId) : undefined;

  const items = useMemo(
    () => MOCK_MEDIA.filter((item) => item.kind === activeTab),
    [activeTab],
  );

  const cellSize = Math.floor(
    (width -
      spacing.lg * 2 -
      spacing.sm * (COLUMNS - 1)) /
      COLUMNS,
  );

  const cellStyle = useMemo(
    () => ({
      width: cellSize,
      height: cellSize,
    }),
    [cellSize],
  );

  const handleBack = useCallback(
    () => navigation.goBack(),
    [navigation],
  );

  const handleClose = useCallback(
    () => setSelected(null),
    [],
  );

  const keyExtractor = useCallback(
    (item: MockMedia) => item.id,
    [],
  );

  const renderTile = useCallback(
    ({ item }: { item: MockMedia }) => (
      <TouchableOpacity
        style={[
          styles.tile,
          cellStyle,
          { backgroundColor: item.tint },
        ]}
        onPress={() => setSelected(item)}
        activeOpacity={0.8}
      >
        <Text style={styles.tileLabel}>
          {KIND_LABEL[item.kind]}
        </Text>
        <Text style={styles.tileCaption} numberOfLines={1}>
          {item.title}
        </Text>
      </TouchableOpacity>
    ),
    [cellStyle],
  );

  const renderFileRow = useCallback(
    ({ item }: { item: MockMedia }) => (
      <TouchableOpacity
        style={styles.fileRow}
        onPress={() => setSelected(item)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.fileBadge,
            { backgroundColor: item.tint },
          ]}
        >
          <Text style={styles.fileBadgeText}>
            {KIND_LABEL[item.kind]}
          </Text>
        </View>

        <View style={styles.fileInfo}>
          <Text
            style={styles.fileTitle}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text style={styles.fileMeta}>{item.meta}</Text>
        </View>
      </TouchableOpacity>
    ),
    [],
  );

  const emptyState = (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>
        No {activeTab === 'file' ? 'files' : `${activeTab}s`} yet
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

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Media</Text>
          <Text style={styles.headerSubtitle}>
            {chat
              ? `Shared with ${chat.name}`
              : 'All shared media'}
          </Text>
        </View>
      </View>

      <View style={styles.mockBanner}>
        <Text style={styles.mockBannerText}>
          MOCK MEDIA - placeholder items only. No real files are loaded.
        </Text>
      </View>

      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.tabActive,
            ]}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key &&
                  styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'file' ? (
        <FlatList
          key="files"
          data={items}
          renderItem={renderFileRow}
          keyExtractor={keyExtractor}
          style={styles.list}
          ListEmptyComponent={emptyState}
        />
      ) : (
        <FlatList
          key="grid"
          data={items}
          renderItem={renderTile}
          keyExtractor={keyExtractor}
          numColumns={COLUMNS}
          columnWrapperStyle={styles.gridRow}
          style={styles.list}
          contentContainerStyle={styles.gridContent}
          ListEmptyComponent={emptyState}
        />
      )}

      <Modal
        visible={selected !== null}
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View
          style={[
            commonStyles.container,
            styles.viewer,
          ]}
        >
          <View style={styles.viewerPreviewWrap}>
            <View
              style={[
                styles.viewerPreview,
                {
                  backgroundColor:
                    selected?.tint ?? colors.surface,
                },
              ]}
            >
              <Text style={styles.viewerPreviewLabel}>
                {selected
                  ? KIND_LABEL[selected.kind]
                  : ''}
              </Text>
            </View>
          </View>

          <Text style={styles.viewerTitle}>
            {selected?.title}
          </Text>

          <Text style={styles.viewerMeta}>
            {selected?.meta}
          </Text>

          <Text style={styles.viewerMock}>
            MOCK MEDIA - this is a placeholder, not a real file.
          </Text>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            activeOpacity={0.8}
          >
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text,
  },
  headerSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  mockBanner: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mockBannerText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '600',
  },
  tabRow: {
    flexDirection: 'row',
    padding: spacing.md,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
  },
  tabActive: {
    backgroundColor: ACCENT,
  },
  tabText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: ON_ACCENT,
  },
  list: {
    flex: 1,
  },
  gridContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  gridRow: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  tile: {
    borderRadius: borderRadius.md,
    justifyContent: 'space-between',
    padding: spacing.sm,
  },
  tileLabel: {
    ...typography.caption,
    color: ON_ACCENT,
    fontWeight: '700',
  },
  tileCaption: {
    ...typography.caption,
    color: ON_ACCENT,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  fileBadge: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileBadgeText: {
    ...typography.caption,
    color: ON_ACCENT,
    fontWeight: '700',
  },
  fileInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  fileTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  fileMeta: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyTitle: {
    ...typography.body,
    color: colors.textTertiary,
  },
  viewer: {
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  viewerPreviewWrap: {
    alignItems: 'center',
  },
  viewerPreview: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewerPreviewLabel: {
    ...typography.h2,
    color: ON_ACCENT,
    fontWeight: '700',
  },
  viewerTitle: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.lg,
  },
  viewerMeta: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  viewerMock: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.md,
  },
  closeButton: {
    marginTop: spacing.xl,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: ACCENT,
    alignItems: 'center',
  },
  closeText: {
    ...typography.body,
    color: ON_ACCENT,
  },
});
