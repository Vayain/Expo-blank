
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import type { DiaryEntry } from '@/types/diary';

export default function SoulBookScreen() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [newHighlight, setNewHighlight] = useState('');

  const addEntry = () => {
    if (newHighlight.trim()) {
      const newEntry: DiaryEntry = {
        id: Date.now().toString(),
        date: new Date(),
        highlight: newHighlight.trim(),
        createdAt: new Date(),
      };
      setEntries([newEntry, ...entries]);
      setNewHighlight('');
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
          style={styles.input}
          value={newHighlight}
          onChangeText={setNewHighlight}
          placeholder="What's your highlight for today?"
          placeholderTextColor="#666"
          multiline
        />
        <TouchableOpacity style={styles.addButton} onPress={addEntry}>
          <ThemedText style={styles.buttonText}>Add Entry</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.entriesContainer}>
        {entries.map((entry) => (
          <ThemedView key={entry.id} style={styles.entryCard}>
            <ThemedText style={styles.date}>
              {entry.date.toLocaleDateString()}
            </ThemedText>
            <ThemedText style={styles.entryText}>{entry.highlight}</ThemedText>
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
  input: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
    color: '#2C3E50',
    backgroundColor: '#fff',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#8B5CF6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
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
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontWeight: '500',
  },
  entryText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2C3E50',
  },
});
