import React, { useState } from 'react';
import { View, TextInput, Button, Image, Text, FlatList, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function GenerateAndSearch() {
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateAndSearch = async () => {
    setLoading(true);
    setImageUrl(null);
    setProducts([]);
    try {
      const res = await axios.post('https://shopai-4.onrender.com/generate-and-search/', { description });
      setImageUrl(res.data.image_url);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const renderProduct = ({ item }: { item: any }) => (
    <View style={styles.productCard}>
      {item.thumbnail && (
        <Image source={{ uri: item.thumbnail }} style={styles.productImage} />
      )}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>{item.price}</Text>
      <TouchableOpacity onPress={() => Linking.openURL(item.link)}>
        <Text style={styles.link}>View Product</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Describe the product..."
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <Button title="Generate and Search" onPress={handleGenerateAndSearch} />
      {loading && <Text style={styles.loading}>Generating and searching...</Text>}
      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      )}
      <FlatList
        data={products}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderProduct}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  input: { borderWidth: 1, padding: 10, marginBottom: 12, borderRadius: 8 },
  image: { width: '100%', height: 300, marginVertical: 16, borderRadius: 12 },
  loading: { marginVertical: 10, fontStyle: 'italic' },
  productCard: { marginBottom: 20, borderBottomWidth: 1, paddingBottom: 10 },
  productImage: { width: '100%', height: 200, borderRadius: 8, marginBottom: 8 },
  title: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  price: { color: 'green', marginBottom: 4 },
  link: { color: 'blue', textDecorationLine: 'underline' },
});
