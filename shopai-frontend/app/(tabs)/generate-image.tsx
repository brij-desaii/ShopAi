import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';

export default function GenerateImage() {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setImage(null);
    try {
      const res = await axios.post('http://127.0.0.1:8000/generate-image', { description });
      setImage(res.data.image);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Generate Image</Text>
      <TextInput
        placeholder="Describe your product..."
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <Button title="Generate" onPress={handleGenerate} />
      {loading && <Text>Generating...</Text>}
      {image && (
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="contain"
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, padding: 10, marginBottom: 12, borderRadius: 8 },
  image: { width: '100%', height: 300, marginTop: 16 },
});
