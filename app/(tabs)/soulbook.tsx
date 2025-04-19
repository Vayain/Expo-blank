import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import type { DiaryEntry } from '@/types/diary';
import { useThemeColor } from '@/utils/theme';


const STORAGE_KEY = '@diary_entries';

export default function SoulBookScreen() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [newHighlight, setNewHighlight] = useState('');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setEntries(parsed.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date),
          createdAt: new Date(entry.createdAt),
          updatedAt: entry.updatedAt ? new Date(entry.updatedAt) : undefined,
        })));
      }
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  };

  const saveEntries = async (newEntries: DiaryEntry[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
    } catch (error) {
      console.error('Error saving entries:', error);
    }
  };

  const [selectedMood, setSelectedMood] = useState<string>('');

  const addEntry = async () => {
    if (newHighlight.trim()) {
      const newEntry: DiaryEntry = {
        id: Date.now().toString(),
        date: new Date(),
        highlight: newHighlight.trim(),
        content: newContent.trim(),
        mood: selectedMood,
        createdAt: new Date(),
      };
      const updatedEntries = [newEntry, ...entries];
      setEntries(updatedEntries);
      await saveEntries(updatedEntries);
      setNewHighlight('');
      setNewContent('');
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#E0C1F4', dark: '#42275E' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="book.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">My SoulBook</ThemedText>
      </ThemedView>

      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={styles.highlightInput}
          value={newHighlight}
          onChangeText={setNewHighlight}
          placeholder="What's your highlight for today?"
          placeholderTextColor="#666"
        />
        <TextInput
          style={styles.contentInput}
          value={newContent}
          onChangeText={setNewContent}
          placeholder="Write more about your day..."
          placeholderTextColor="#666"
          multiline
        />
        <ThemedView style={styles.moodContainer}>
          <ThemedText style={styles.moodLabel}>How are you feeling?</ThemedText>
          <ThemedView style={styles.moodButtons}>
            {['😊', '😌', '😐', '😔', '😤'].map((mood) => (
              <TouchableOpacity
                key={mood}
                style={[styles.moodButton, mood === selectedMood && styles.selectedMood]}
                onPress={() => setSelectedMood(mood)}>
                <ThemedText style={styles.moodEmoji}>{mood}</ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </ThemedView>
        <TouchableOpacity 
          style={[styles.addButton, !newHighlight.trim() && styles.addButtonDisabled]} 
          onPress={addEntry}
          disabled={!newHighlight.trim()}>
          <ThemedText style={styles.buttonText}>Add Entry</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.entriesContainer}>
        {entries.map((entry) => (
          <ThemedView key={entry.id} style={styles.entryCard}>
            <ThemedView style={styles.entryHeader}>
              <ThemedText style={styles.date}>
                {entry.date.toLocaleDateString()} {entry.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </ThemedText>
              {entry.mood && (
                <ThemedText style={styles.mood}>{entry.mood}</ThemedText>
              )}
            </ThemedView>
            <ThemedText style={styles.highlight}>{entry.highlight}</ThemedText>
            {entry.content && (
              <ThemedText style={styles.content}>{entry.content}</ThemedText>
            )}
          </ThemedView>
        ))}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  inputContainer: {
    marginHorizontal: 16,
    marginVertical: 24,
  },
  highlightInput: {
    backgroundColor: useThemeColor({}, 'cardBackground'),
    borderRadius: 12,
    padding: 16,
    fontSize: 17,
    marginBottom: 12,
    color: useThemeColor({}, 'text'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    height: 50,
  },
  contentInput: {
    backgroundColor: useThemeColor({}, 'cardBackground'),
    borderRadius: 12,
    padding: 16,
    fontSize: 17,
    marginBottom: 12,
    color: useThemeColor({}, 'text'),
    minHeight: 120,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addButton: {
    backgroundColor: useThemeColor({}, 'accent'),
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonDisabled: {
    backgroundColor: useThemeColor({}, 'disabled'),
    shadowColor: useThemeColor({}, 'disabledShadow'),
  },
  buttonText: {
    color: useThemeColor({}, 'buttonText'),
    fontSize: 16,
    fontWeight: '600',
  },
  entriesContainer: {
    gap: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  entryCard: {
    backgroundColor: useThemeColor({}, 'cardBackground'),
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  date: {
    fontSize: 14,
    color: useThemeColor({}, 'secondaryText'),
    marginBottom: 12,
    fontWeight: '500',
  },
  highlight: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    color: useThemeColor({}, 'text'),
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: useThemeColor({}, 'text'),
  },
  moodContainer: {
    marginBottom: 20,
  },
  moodLabel: {
    fontSize: 15,
    color: useThemeColor({light: '#8E8E93', dark: '#98989D'}, 'secondaryText'),
    marginBottom: 12,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  moodButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  moodButton: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: useThemeColor({light: '#E5E5EA', dark: '#3A3A3C'}, 'border'),
    backgroundColor: useThemeColor({light: '#F2F2F7', dark: '#1C1C1E'}, 'cardBackground'),
  },
  selectedMood: {
    backgroundColor: useThemeColor({light: '#007AFF', dark: '#0A84FF'}, 'accent'),
    borderColor: 'transparent',
    transform: [{ scale: 1.1 }],
  },
  moodEmoji: {
    fontSize: 28,
  },
});