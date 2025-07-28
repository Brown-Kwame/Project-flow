import { userService } from '@/services/api';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const EditProfileScreen = () => {
  const router = useRouter();
  // Placeholder user info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    userService.getMe().then((data) => {
      if (mounted) {
        setName(data.username || '');
        setEmail(data.email || '');
      }
    });
    return () => { mounted = false; };
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      await userService.updateMe({ username: name, email });
      Alert.alert('Profile updated!');
      router.back();
    } catch (e: any) {
      setError(e.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.cancel}>Cancel</Text></TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}><Text style={styles.save}>{loading ? 'Saving...' : 'Save'}</Text></TouchableOpacity>
      </View>
      <View style={styles.form}>
        {error ? <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text> : null}
        <Text style={styles.label}>Username</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter your username" />
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Enter your email" keyboardType="email-address" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  cancel: { color: '#007AFF', fontSize: 16 },
  save: { color: '#007AFF', fontSize: 16 },
  form: { padding: 20 },
  label: { fontSize: 14, color: '#666', marginTop: 18, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#fafafa' },
});

export default EditProfileScreen; 