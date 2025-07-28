import { Ionicons } from '@expo/vector-icons'; // Must be a slash '/'
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
// NEW: Import our working API and auth services
import { useAuth } from '@/context/AuthContext';
import { fileService, groupService, userService } from '@/services/api';

const NewGroupChatScreen = () => {
  const router = useRouter();
  const { authData } = useAuth(); // To filter ourselves out of the list

  // --- REPLACED LOGIC: State holds users from our backend ---
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // --- KEPT UI LOGIC: State for creating the group ---
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState(null);

  // --- REPLACED LOGIC: Fetch users from our backend API ---
  useEffect(() => {
    const fetchUsers = async () => {
      if (!authData) return;
      try {
        setLoading(true);
        const users = await userService.getAllUsers();
        setAllUsers(users.filter(user => user.id !== authData.user.id));
      } catch (e) {
        Alert.alert('Error', 'Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [authData]);

  // --- KEPT UI LOGIC, ADAPTED FOR OUR DATA ---
  const filteredUsers = useMemo(() => {
    if (!search.trim()) return allUsers;
    const lowerSearch = search.toLowerCase();
    return allUsers.filter(user =>
      user.username?.toLowerCase().includes(lowerSearch)
    );
  }, [search, allUsers]);

  // --- KEPT UI LOGIC, ADAPTED FOR OUR DATA ---
  const toggleContact = (user) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.some((u) => u.id === user.id)
        ? prevSelected.filter((u) => u.id !== user.id)
        // Add the whole user object, we need the ID
        : [...prevSelected, user]
    );
  };

  // --- KEPT UI LOGIC, NO CHANGES NEEDED ---
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setGroupImage(result.assets[0].uri);
    }
  };

  // Condition to enable the create button
  const canCreate = groupName.trim().length > 1 && selectedUsers.length > 0;

  // --- MODIFIED LOGIC: Call backend API to create group ---
  const handleCreateGroup = async () => {
    if (!canCreate) return;
    try {
      let imageUrl = undefined;
      if (groupImage) {
        imageUrl = await fileService.upload(groupImage);
      }
      const selectedUserIds = selectedUsers.map(u => u.id);
      const group = await groupService.createGroup({
        name: groupName,
        imageUrl,
        memberIds: selectedUserIds,
      });
      Alert.alert("Group Created!", `Name: ${group.name}\nMembers: ${group.memberIds.length}`,[{ text: 'OK', onPress: () => router.replace(`/group-info?groupId=${group.id}`) }]);
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to create group.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'New Group',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <Ionicons name="close-outline" size={28} color="#007AFF" />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={handleCreateGroup} disabled={!canCreate}>
              <Text style={[styles.createButtonTextHeader, !canCreate && styles.createButtonTextHeaderDisabled]}>
                Create
              </Text>
            </Pressable>
          )
        }}
      />

      {/* Group Info Section */}
      <View style={styles.groupInfoContainer}>
        <Pressable onPress={pickImage}>
          {groupImage ? (
            <Image source={{ uri: groupImage }} style={styles.groupImage} />
          ) : (
            <View style={styles.groupImagePlaceholder}>
              <Ionicons name="camera" size={24} color="#007AFF" />
            </View>
          )}
        </Pressable>
        <TextInput
          style={styles.groupNameInput}
          placeholder="Group Name"
          value={groupName}
          onChangeText={setGroupName}
          placeholderTextColor="#999"
        />
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search for people to add..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#999"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const isSelected = selectedUsers.some((u) => u.id === item.id);
            return (
              <Pressable
                style={[styles.contactItem, isSelected && styles.selectedContact]}
                onPress={() => toggleContact(item)}
              >
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarText}>{item.username?.charAt(0).toUpperCase() || '?'}</Text>
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{item.username}</Text>
                </View>
                <View style={styles.selectionCircle}>
                  {isSelected && <Ionicons name="checkmark-circle" size={24} color="#007AFF" />}
                </View>
              </Pressable>
            )
          }}
          style={{ flex: 1, marginTop: 10 }}
        />
      )}
    </SafeAreaView>
  );
};

// --- KEPT & REFINED STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  groupInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  groupImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  groupImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#eef5ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupNameInput: {
    flex: 1,
    marginLeft: 15,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    margin: 16,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  selectedContact: {
    backgroundColor: '#eef5ff',
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eef5ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
  },
  selectionCircle: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonTextHeader: {
      color: '#007AFF',
      fontSize: 16,
      fontWeight: 'bold'
  },
  createButtonTextHeaderDisabled: {
      color: '#b0c4d4',
  }
});

export default NewGroupChatScreen;