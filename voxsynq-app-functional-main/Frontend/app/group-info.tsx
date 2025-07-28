import Avatar from '@/components/Avatar';
import { useAuth } from '@/context/AuthContext';
import { useUpdateGroup } from '@/context/GroupContext';
import { fileService, groupService, userService } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

const GroupInfoScreen = () => {
  const router = useRouter();
  const { groupId } = useLocalSearchParams();
  const { authData } = useAuth();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [addingMembers, setAddingMembers] = useState(false);
  const [selectedToAdd, setSelectedToAdd] = useState([]);
  const updateGroup = useUpdateGroup();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchData();
  }, [groupId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const groupData = await groupService.getGroup(Number(groupId));
      setGroup(groupData);
      setNewName(groupData.name);
      setNewImage(groupData.imageUrl);
      const memberList = await groupService.getGroupMembers(Number(groupId));
      setMembers(memberList);
      console.log('Fetched group members:', memberList);
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to load group info.');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = group && authData?.user?.id === group.createdById;

  const handleEdit = () => setEditing(true);
  const handleCancelEdit = () => {
    setEditing(false);
    setNewName(group.name);
    setNewImage(group.imageUrl);
  };
  const handleSaveEdit = async () => {
    try {
      let imageUrl = newImage;
      if (newImage && newImage !== group.imageUrl && newImage.startsWith('file')) {
        imageUrl = await fileService.upload(newImage);
      }
      const updated = await groupService.updateGroup(Number(groupId), { name: newName, imageUrl });
      updateGroup(updated); // Ensure context is updated instantly
      setGroup(updated);
      setEditing(false);
      Alert.alert('Success', 'Group updated!');
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to update group.');
    }
  };
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera roll permissions needed!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setNewImage(result.assets[0].uri);
    }
  };
  const handleRemoveMember = async (userId) => {
    Alert.alert('Remove Member', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: async () => {
        try {
          await groupService.removeMember(Number(groupId), userId);
          fetchData();
        } catch (e) {
          Alert.alert('Error', e.message || 'Failed to remove member.');
        }
      }}
    ]);
  };
  const handleDeleteGroup = async () => {
    Alert.alert('Delete Group', 'Are you sure? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await groupService.deleteGroup(Number(groupId));
          Alert.alert('Group deleted');
          router.replace('/(tabs)/chats');
        } catch (e) {
          Alert.alert('Error', e.message || 'Failed to delete group.');
        }
      }}
    ]);
  };
  const openAddMembers = async () => {
    setAddingMembers(true);
    try {
      const users = await userService.getAllUsers();
      // Exclude current members
      const memberIds = members.map(m => m.id);
      setAllUsers(users.filter(u => !memberIds.includes(u.id)));
    } catch (e) {
      Alert.alert('Error', 'Failed to load users.');
    }
  };
  const handleAddSelectedMembers = async () => {
    try {
      for (const user of selectedToAdd) {
        await groupService.addMember(Number(groupId), user.id);
      }
      setAddingMembers(false);
      setSelectedToAdd([]);
      fetchData();
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to add members.');
    }
  };
  if (loading || !group) {
    return <SafeAreaView style={styles.container}><ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} /></SafeAreaView>;
  }
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Group Info', headerBackTitle: 'Back' }} />
      {/* Add a functional back icon at the top left */}
      <Pressable style={{ position: 'absolute', top: 50, left: 20, zIndex: 10, padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 }} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#2196F3" />
      </Pressable>
      <View style={styles.profileContainer}>
        <Pressable disabled={!isAdmin || !editing} onPress={pickImage}>
          {newImage && !imageError ? (
            <Image source={{ uri: newImage }} style={styles.avatar} onError={() => setImageError(true)} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="people" size={48} color="#007AFF" />
            </View>
          )}
        </Pressable>
        {editing ? (
          <TextInput
            style={styles.nameInput}
            value={newName}
            onChangeText={setNewName}
            placeholder="Group Name"
          />
        ) : (
          <Text style={styles.name}>{group.name}</Text>
        )}
        <Text style={styles.createdAt}>Created: {new Date(group.createdAt).toLocaleDateString()}</Text>
        {isAdmin && !editing && (
          <Pressable style={styles.editButton} onPress={handleEdit}>
            <Ionicons name="create-outline" size={20} color="#007AFF" />
            <Text style={styles.editButtonText}>Edit</Text>
          </Pressable>
        )}
        {editing && (
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Pressable style={styles.saveButton} onPress={handleSaveEdit}>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
            <Pressable style={styles.cancelButton} onPress={handleCancelEdit}>
              <Ionicons name="close" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Cancel</Text>
            </Pressable>
          </View>
        )}
      </View>
      <View style={styles.membersHeader}>
        <Text style={styles.membersTitle}>Members ({members.length})</Text>
        {isAdmin && !addingMembers && (
          <Pressable style={styles.addButton} onPress={openAddMembers}>
            <Ionicons name="person-add" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
        )}
      </View>
      {addingMembers ? (
        <>
          <FlatList
            data={allUsers}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => {
              const selected = selectedToAdd.some(u => u.id === item.id);
              return (
                <Pressable style={[styles.memberItem, selected && styles.selectedMember]} onPress={() => {
                  setSelectedToAdd(selected
                    ? selectedToAdd.filter(u => u.id !== item.id)
                    : [...selectedToAdd, item]);
                }}>
                  <Avatar imageUrl={item.profilePictureUrl} name={item.username} size={36} />
                  {selected && <Ionicons name="checkmark-circle" size={20} color="#007AFF" style={{ marginLeft: 10 }} />}
                </Pressable>
              );
            }}
            style={{ maxHeight: 200, marginBottom: 10 }}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginHorizontal: 16 }}>
            <Pressable style={styles.saveButton} onPress={handleAddSelectedMembers}>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Add Selected</Text>
            </Pressable>
            <Pressable style={styles.cancelButton} onPress={() => { setAddingMembers(false); setSelectedToAdd([]); }}>
              <Ionicons name="close" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <FlatList
          data={members}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => {
            const isCurrentUser = item.id === authData?.user?.id;
            const isAdminMember = item.admin === true;
            let badgeText = '';
            if (isCurrentUser && isAdminMember) badgeText = 'You • Admin';
            else if (isCurrentUser) badgeText = 'You';
            else if (isAdminMember) badgeText = 'Admin';
            const memberContent = (
              <>
                <Avatar imageUrl={item.profilePictureUrl} name={item.username} size={36} />
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Text style={styles.memberName}>{item.username}</Text>
                {badgeText !== '' && <Text style={styles.adminBadge}>{badgeText}</Text>}
                </View>
                {isAdmin && !item.admin && (
                  <Pressable style={styles.removeButton} onPress={() => handleRemoveMember(item.id)}>
                    <Ionicons name="remove-circle" size={20} color="#ff4444" />
                  </Pressable>
                )}
              </>
            );
            return isCurrentUser ? (
              <View style={styles.memberItem}>{memberContent}</View>
            ) : (
              <Pressable
                style={styles.memberItem}
                onPress={() => router.push({
                  pathname: '/contactInfo',
                  params: {
                    userId: item.id,
                    contactId: item.id,
                    contactName: item.username,
                    contactEmail: item.email,
                    createdAt: item.createdAt,
                  }
                })}
              >
                {memberContent}
              </Pressable>
            );
          }}
          style={{ maxHeight: 250, marginBottom: 10 }}
        />
      )}
      {isAdmin && !editing && (
        <Pressable style={styles.deleteButton} onPress={handleDeleteGroup}>
          <Ionicons name="trash" size={20} color="#fff" />
          <Text style={styles.deleteButtonText}>Delete Group</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  profileContainer: { alignItems: 'center', paddingTop: 60, paddingBottom: 20, backgroundColor: '#fff' },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#eef5ff', justifyContent: 'center', alignItems: 'center' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#000', marginTop: 10 },
  nameInput: { fontSize: 22, fontWeight: 'bold', color: '#000', marginTop: 10, borderBottomWidth: 1, borderColor: '#ccc', width: 200, textAlign: 'center' },
  createdAt: { fontSize: 14, color: '#888', marginTop: 4 },
  editButton: { flexDirection: 'row', alignItems: 'center', marginTop: 10, backgroundColor: '#eef5ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  editButtonText: { color: '#007AFF', fontWeight: 'bold', marginLeft: 6 },
  saveButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#007AFF', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, marginRight: 8 },
  saveButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 6 },
  cancelButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#888', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  membersHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 10, marginBottom: 4 },
  membersTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#007AFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  addButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 6 },
  memberItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  selectedMember: { backgroundColor: '#eef5ff' },
  avatarSmall: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#eef5ff', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontSize: 18, color: '#007AFF', fontWeight: 'bold' },
  memberName: { fontSize: 16, fontWeight: '500', flex: 1, marginLeft: 10 },
  adminBadge: { backgroundColor: '#4CAF50', color: '#fff', fontWeight: 'bold', fontSize: 12, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginLeft: 8 },
  removeButton: { marginLeft: 10 },
  deleteButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ff4444', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, alignSelf: 'center', marginTop: 20 },
  deleteButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 8 },
});

export default GroupInfoScreen; 