import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const demoGoals = [
  { id: '1', title: 'Launch New Feature', status: 'In Progress', owner: 'James', due: '2025-07-01' },
  { id: '2', title: 'Increase User Retention', status: 'To Do', owner: 'Sarah', due: '2025-08-01' },
  { id: '3', title: 'Reduce Bug Count', status: 'Done', owner: 'Alex', due: '2025-06-10' },
];

const GOALS_STORAGE_KEY = 'asana_goals';

const statusColors = {
  'To Do': '#ffb347',
  'In Progress': '#668cff',
  'Done': '#4caf50',
};

const Goals = () => {
  const [goals, setGoals] = useState(demoGoals);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [goalForm, setGoalForm] = useState({ title: '', status: 'To Do', owner: '', due: '' });
  const [search, setSearch] = useState('');

  const filteredGoals = useMemo(() => {
    if (!search) return goals;
    return goals.filter(g =>
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.status.toLowerCase().includes(search.toLowerCase()) ||
      (g.owner && g.owner.toLowerCase().includes(search.toLowerCase()))
    );
  }, [goals, search]);

  const handleAddGoal = () => {
    setGoals(prev => [
      ...prev,
      { ...goalForm, id: (Date.now() + Math.random()).toString() },
    ]);
    setModalVisible(false);
    setGoalForm({ title: '', status: 'To Do', owner: '', due: '' });
    setEditId(null);
  };

  const handleEditGoal = (goal: any) => {
    setEditId(goal.id);
    setGoalForm({
      title: goal.title,
      status: goal.status,
      owner: goal.owner,
      due: goal.due,
    });
    setModalVisible(true);
  };

  const handleUpdateGoal = () => {
    setGoals(prev => prev.map(g => g.id === editId ? { ...g, ...goalForm } : g));
    setModalVisible(false);
    setGoalForm({ title: '', status: 'To Do', owner: '', due: '' });
    setEditId(null);
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  useEffect(() => {
    const loadGoals = async () => {
      setLoading(true);
      try {
        const stored = await AsyncStorage.getItem(GOALS_STORAGE_KEY);
        if (stored) {
          setGoals(JSON.parse(stored));
        } else {
          setGoals(demoGoals);
        }
      } catch (e) {
        setGoals(demoGoals);
      } finally {
        setLoading(false);
      }
    };
    loadGoals();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals)).catch(() => {});
  }, [goals]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Team Goals</Text>
        <TouchableOpacity style={styles.fab} onPress={() => { setEditId(null); setGoalForm({ title: '', status: 'To Do', owner: '', due: '' }); setModalVisible(true); }}>
          <FontAwesome name="plus" color="white" size={24} />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.search}
        placeholder="Search goals..."
        value={search}
        onChangeText={setSearch}
      />
      {loading && <ActivityIndicator size="large" color="#668cff" style={{ marginTop: 20 }} />}
      <FlatList
        data={filteredGoals}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 8 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.goalTitle}>{item.title}</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status as keyof typeof statusColors] || '#ccc' }]}> 
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
              <View style={{ flexDirection: 'row', marginLeft: 8 }}>
                <TouchableOpacity onPress={() => handleEditGoal(item)}>
                  <FontAwesome name="edit" size={18} color="#668cff" style={{ marginRight: 10 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteGoal(item.id)}>
                  <FontAwesome name="trash" size={18} color="#ff4d4d" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.goalMeta}>Owner: <Text style={styles.metaValue}>{item.owner}</Text></Text>
            <Text style={styles.goalMeta}>Due: <Text style={styles.metaValue}>{item.due}</Text></Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>No goals found.</Text>}
      />
      {/* Add/Edit Goal Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editId ? 'Edit Goal' : 'Add New Goal'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Goal Title"
              value={goalForm.title}
              onChangeText={text => setGoalForm({ ...goalForm, title: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Status (To Do, In Progress, Done)"
              value={goalForm.status}
              onChangeText={text => setGoalForm({ ...goalForm, status: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Owner"
              value={goalForm.owner}
              onChangeText={text => setGoalForm({ ...goalForm, owner: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Due Date (YYYY-MM-DD)"
              value={goalForm.due}
              onChangeText={text => setGoalForm({ ...goalForm, due: text })}
            />
            <View style={styles.modalActions}>
              <Pressable style={styles.cancelBtn} onPress={() => { setModalVisible(false); setEditId(null); }}>
                <Text style={{ color: '#668cff', fontWeight: 'bold' }}>Cancel</Text>
              </Pressable>
              {editId ? (
                <Pressable style={styles.addBtn} onPress={handleUpdateGoal} disabled={!goalForm.title}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Save</Text>
                </Pressable>
              ) : (
                <Pressable style={styles.addBtn} onPress={handleAddGoal} disabled={!goalForm.title}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Add</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7faff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
  },
  fab: {
    backgroundColor: '#668cff',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  search: {
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 8,
    padding: 12,
    margin: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 4,
    padding: 18,
    shadowColor: '#668cff', // Glowing effect
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: '#668cff',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  goalMeta: {
    fontSize: 14,
    color: '#444',
    marginBottom: 2,
  },
  metaValue: {
    color: '#668cff',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f7faff',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 12,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#f7faff',
    marginRight: 8,
  },
  addBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#668cff',
    shadowColor: '#668cff', // Glowing effect
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#668cff',
  },
});

export default Goals;