import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Demo tasks data (replace with API integration as needed)
const demoTasks = [
  { id: '1', title: 'Design Dashboard', status: 'In Progress', assignee: 'James', due: '2025-06-15' },
  { id: '2', title: 'API Integration', status: 'To Do', assignee: 'Sarah', due: '2025-06-20' },
  { id: '3', title: 'Team Meeting', status: 'Done', assignee: 'Alex', due: '2025-06-10' },
  { id: '4', title: 'Write Docs', status: 'In Review', assignee: 'Chris', due: '2025-06-18' },
];

const statusColors = {
  'To Do': '#ffb347',
  'In Progress': '#668cff',
  'Done': '#4caf50',
  'In Review': '#f57c00',
};

const TASKS_STORAGE_KEY = 'asana_tasks';

const Tasks = () => {
  const [search, setSearch] = useState('');
  const [tasks, setTasks] = useState(demoTasks);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [taskForm, setTaskForm] = useState({ title: '', status: 'To Do', assignee: '', due: '' });

  const filteredTasks = useMemo(() => {
    if (!search) return tasks;
    return tasks.filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.status.toLowerCase().includes(search.toLowerCase()) ||
      t.assignee.toLowerCase().includes(search.toLowerCase())
    );
  }, [tasks, search]);

  // CRUD operations (local/demo)
  const handleAddTask = () => {
    setTasks(prev => [
      ...prev,
      { ...taskForm, id: (Date.now() + Math.random()).toString() },
    ]);
    setModalVisible(false);
    setTaskForm({ title: '', status: 'To Do', assignee: '', due: '' });
    setEditId(null);
  };

  const handleEditTask = (task: any) => {
    setEditId(task.id);
    setTaskForm({
      title: task.title,
      status: task.status,
      assignee: task.assignee,
      due: task.due,
    });
    setModalVisible(true);
  };

  const handleUpdateTask = () => {
    setTasks(prev => prev.map(t => t.id === editId ? { ...t, ...taskForm } : t));
    setModalVisible(false);
    setTaskForm({ title: '', status: 'To Do', assignee: '', due: '' });
    setEditId(null);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  React.useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      try {
        const stored = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
        if (stored) {
          setTasks(JSON.parse(stored));
        } else {
          setTasks(demoTasks);
        }
      } catch (e) {
        setTasks(demoTasks);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  React.useEffect(() => {
    AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks)).catch(() => {});
  }, [tasks]);

  return (
    <View style={taskStyles.container}>
      <View style={taskStyles.header}>
        <Text style={taskStyles.heading}>My Tasks</Text>
        <TouchableOpacity style={taskStyles.fab} onPress={() => { setEditId(null); setTaskForm({ title: '', status: 'To Do', assignee: '', due: '' }); setModalVisible(true); }}>
          <FontAwesome name="plus" color="white" size={24} />
        </TouchableOpacity>
      </View>
      <TextInput
        style={taskStyles.search}
        placeholder="Search tasks..."
        value={search}
        onChangeText={setSearch}
      />
      {loading && <ActivityIndicator size="large" color="#668cff" style={{ marginTop: 20 }} />}
      <FlatList
        data={filteredTasks}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 8 }}
        renderItem={({ item }) => (
          <View style={taskStyles.card}>
            <View style={taskStyles.cardHeader}>
              <Text style={taskStyles.taskTitle}>{item.title}</Text>
              <View style={[taskStyles.statusBadge, { backgroundColor: statusColors[item.status as keyof typeof statusColors] || '#ccc' }]}> 
                <Text style={taskStyles.statusText}>{item.status}</Text>
              </View>
              <View style={{ flexDirection: 'row', marginLeft: 8 }}>
                <TouchableOpacity onPress={() => handleEditTask(item)}>
                  <FontAwesome name="edit" size={18} color="#668cff" style={{ marginRight: 10 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                  <FontAwesome name="trash" size={18} color="#ff4d4d" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={taskStyles.taskMeta}>Assignee: <Text style={taskStyles.metaValue}>{item.assignee}</Text></Text>
            <Text style={taskStyles.taskMeta}>Due: <Text style={taskStyles.metaValue}>{item.due}</Text></Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>No tasks found.</Text>}
      />
      {/* Add/Edit Task Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={taskStyles.modalOverlay}>
          <View style={taskStyles.modalContent}>
            <Text style={taskStyles.modalTitle}>{editId ? 'Edit Task' : 'Add New Task'}</Text>
            <TextInput
              style={taskStyles.input}
              placeholder="Task Title"
              value={taskForm.title}
              onChangeText={text => setTaskForm({ ...taskForm, title: text })}
            />
            <TextInput
              style={taskStyles.input}
              placeholder="Status (To Do, In Progress, Done, In Review)"
              value={taskForm.status}
              onChangeText={text => setTaskForm({ ...taskForm, status: text })}
            />
            <TextInput
              style={taskStyles.input}
              placeholder="Assignee"
              value={taskForm.assignee}
              onChangeText={text => setTaskForm({ ...taskForm, assignee: text })}
            />
            <TextInput
              style={taskStyles.input}
              placeholder="Due Date (YYYY-MM-DD)"
              value={taskForm.due}
              onChangeText={text => setTaskForm({ ...taskForm, due: text })}
            />
            <View style={taskStyles.modalActions}>
              <Pressable style={taskStyles.cancelBtn} onPress={() => { setModalVisible(false); setEditId(null); }}>
                <Text style={{ color: '#668cff', fontWeight: 'bold' }}>Cancel</Text>
              </Pressable>
              {editId ? (
                <Pressable style={taskStyles.addBtn} onPress={handleUpdateTask} disabled={!taskForm.title}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Save</Text>
                </Pressable>
              ) : (
                <Pressable style={taskStyles.addBtn} onPress={handleAddTask} disabled={!taskForm.title}>
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

const taskStyles = StyleSheet.create({
  // ...existing styles...
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
    shadowColor: '#668cff', // Glowing effect
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 2,
    borderColor: '#668cff',
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
    shadowColor: '#668cff', // Glowing effect for card
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
  taskTitle: {
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
  taskMeta: {
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

export default Tasks;