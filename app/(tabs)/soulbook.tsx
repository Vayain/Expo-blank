
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import type { DiaryEntry } from '@/types/diary';

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
      headerBackgroundColor={{ light: '#F0F7FF', dark: '#1A2138' }}
      headerImage={
        <IconSymbol
          size={310}
          color="rgba(108,136,255,0.15)"
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
    marginVertical: 28,
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 24,
    borderRadius: 24,
    shadowColor: '#6C88FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  highlightInput: {
    borderWidth: 1,
    borderColor: '#E8EFFF',
    borderRadius: 16,
    padding: 16,
    fontSize: 17,
    marginBottom: 14,
    color: '#2D3748',
    backgroundColor: '#FAFBFF',
    height: 54,
    fontWeight: '500',
  },
  contentInput: {
    borderWidth: 1,
    borderColor: '#E8EFFF',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    marginBottom: 14,
    color: '#2D3748',
    backgroundColor: '#FAFBFF',
    minHeight: 120,
    textAlignVertical: 'top',
    lineHeight: 24,
  },
  addButton: {
    backgroundColor: '#6C88FF',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#6C88FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonDisabled: {
    backgroundColor: '#B8B8B8',
    shadowColor: '#B8B8B8',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  entriesContainer: {
    gap: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  entryCard: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.98)',
    shadowColor: '#6C88FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E8EFFF',
    marginHorizontal: 2,
    marginVertical: 6,
  },
  date: {
    fontSize: 14,
    color: '#6C88FF',
    marginBottom: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  highlight: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    color: '#2D3748',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#718096',
    letterSpacing: 0.1,
  },
  moodContainer: {
    marginBottom: 16,
  },
  moodLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  moodButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  moodButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  selectedMood: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  moodEmoji: {
    fontSize: 24,
  },
});
