import React, { useState } from 'react';
import { View, Button, Image, Text, FlatList, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function UploadImage() {
  const [image, setImage] = useState<string | null>(null);
  const [products, setProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: false,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      setImage(localUri);
      uploadImage(localUri);
    }
  };

  const uploadImage = async (uri: string) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', {
      uri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    } as any);

    try {
      const res = await axios.post('http://127.0.0.1:8000/search-products/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an Image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {loading && <Text>Searching for products...</Text>}
      <FlatList
        data={products}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => <Text style={styles.item}>• {item}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  image: { width: '100%', height: 300, marginVertical: 16 },
  item: { marginBottom: 8 },
});
