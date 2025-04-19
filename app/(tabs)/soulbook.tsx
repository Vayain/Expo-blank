
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
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <IconSymbol
          size={310}
          color="rgba(255,255,255,0.15)"
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
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 6,
  },
  highlightInput: {
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
    borderRadius: 14,
    padding: 16,
    fontSize: 17,
    marginBottom: 14,
    color: '#11181C',
    backgroundColor: '#fff',
    height: 54,
    fontWeight: '500',
  },
  contentInput: {
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    marginBottom: 14,
    color: '#11181C',
    backgroundColor: '#fff',
    minHeight: 120,
    textAlignVertical: 'top',
    lineHeight: 24,
  },
  addButton: {
    backgroundColor: '#0A7EA4',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#0A7EA4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
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
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 2,
  },
  date: {
    fontSize: 14,
    color: '#0A7EA4',
    marginBottom: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  highlight: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    color: '#11181C',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#687076',
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
