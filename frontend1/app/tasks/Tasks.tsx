import FontAwesome from '@expo/vector-icons/FontAwesome';
import { fetchTasksByUserId, createTask, updateTask, deleteTask, Task } from '../../services/tasksApi';
import { useUser } from '../context/UserContext';
import React, { useMemo, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { Colors } from '@/constants/Colors';

export default function Tasks() {
  const { profile } = useUser();
  // You may need to get the JWT token from your auth context or storage
  const jwtToken = '';
 
  const userId = typeof (profile as any)?.id === 'number' ? (profile as any).id : 1;

  const [search, setSearch] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [taskForm, setTaskForm] = useState({ title: '', status: 'To Do' });

  const colorMode = useColorScheme() === 'dark' ? 'dark' : 'light';
  const theme = Colors[colorMode];

  const filteredTasks = useMemo(() => {
    if (!search) return tasks;
    return tasks.filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.status.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, tasks]);

  const handleAddTask = async () => {
    setLoading(true);
    try {
      const newTask: Omit<Task, 'id' | 'creationDate' | 'lastUpdatedDate'> = {
        title: taskForm.title,
        status: taskForm.status as any,
        description: '',
        userId,
        projectId: 1, // Replace with actual project ID if needed
      };
      const created = await createTask(newTask, jwtToken);
      setTasks(prev => [...prev, created]);
      setModalVisible(false);
      setTaskForm({ title: '', status: 'To Do' });
      setEditId(null);
    } catch (e) {
      // handle error
    }
    setLoading(false);
  };

  const handleEditTask = (task: Task) => {
    setEditId(task.id ? String(task.id) : null);
    setTaskForm({ title: task.title, status: task.status });
    setModalVisible(true);
  };

  const handleUpdateTask = async () => {
    if (!editId) return;
    setLoading(true);
    try {
      const updated: Task = {
        id: Number(editId),
        title: taskForm.title,
        status: taskForm.status as any,
        description: '',
        userId,
        projectId: 1, // Replace with actual project ID if needed
      };
      const result = await updateTask(Number(editId), updated, jwtToken);
      setTasks(prev => prev.map(t => (String(t.id) === editId ? result : t)));
      setModalVisible(false);
      setTaskForm({ title: '', status: 'To Do' });
      setEditId(null);
    } catch (e) {
      // handle error
    }
    setLoading(false);
  };

  const handleDeleteTask = async (id: string) => {
    setLoading(true);
    try {
      await deleteTask(Number(id), jwtToken);
      setTasks(prev => prev.filter(t => String(t.id) !== id));
    } catch (e) {
      // handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      try {
        const fetched = await fetchTasksByUserId(userId, jwtToken);
        setTasks(fetched);
      } catch (e) {
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, [userId, jwtToken]);

  const renderStatusBadge = (status: string) => {
    let bgColor = 'bg-gray-400';
    if (status === 'To Do') bgColor = 'bg-yellow-400';
    else if (status === 'In Progress') bgColor = 'bg-blue-400';
    else if (status === 'Done') bgColor = 'bg-green-500';
    else if (status === 'In Review') bgColor = 'bg-orange-500';

    return (
      <View className={`rounded-full px-3 py-1 ${bgColor}`}>
        <Text className="text-white text-xs font-bold">{status}</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white dark:bg-neutral-900">
      <View className="flex-row items-center justify-between px-4 pt-12 pb-4 border-b border-gray-200 dark:border-neutral-700">
        <Text className="text-2xl font-bold text-black dark:text-white">My Tasks</Text>
        <TouchableOpacity
          className="w-11 h-11 bg-blue-500 rounded-full items-center justify-center border-2 border-blue-500 shadow-lg"
          onPress={() => {
            setEditId(null);
            setTaskForm({ title: '', status: 'To Do' });
            setModalVisible(true);
          }}
        >
          <FontAwesome name="plus" size={22} color="white" />
        </TouchableOpacity>
      </View>

      <TextInput
        className="border border-gray-300 dark:border-gray-600 rounded-md px-4 py-3 text-base text-black dark:text-white bg-white dark:bg-neutral-800 mx-4 mt-4"
        placeholder="Search tasks..."
        placeholderTextColor={theme.icon}
        value={search}
        onChangeText={setSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" color={theme.tint} className="mt-6" />
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 8 }}
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-10 dark:text-neutral-400">No tasks found.</Text>
          }
          renderItem={({ item }) => (
            <View className="bg-white dark:bg-neutral-800 rounded-2xl border border-blue-400 shadow-md p-4 my-2 mx-1">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-lg font-semibold text-black dark:text-white">{item.title}</Text>
                <View className="flex-row items-center">
                  {renderStatusBadge(item.status)}
                  <View className="flex-row ml-4">
                    <TouchableOpacity onPress={() => handleEditTask(item)}>
                      <FontAwesome name="edit" size={20} color={theme.tint} style={{ marginRight: 16 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteTask(String(item.id))}>
                      <FontAwesome name="trash" size={20} color="#ff4d4d" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      )}

      {/* Modal */}
      <Modal transparent visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 bg-black/20 justify-center items-center px-4">
          <View className="w-full bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg">
            <Text className="text-xl font-bold mb-4 text-black dark:text-white">
              {editId ? 'Edit Task' : 'Add New Task'}
            </Text>
            <TextInput
              className="border border-gray-300 dark:border-gray-600 rounded-md px-4 py-3 mb-3 text-black dark:text-white bg-white dark:bg-neutral-800"
              placeholder="Task Title"
              placeholderTextColor={theme.icon}
              value={taskForm.title}
              onChangeText={text => setTaskForm({ ...taskForm, title: text })}
            />
            <TextInput
              className="border border-gray-300 dark:border-gray-600 rounded-md px-4 py-3 mb-3 text-black dark:text-white bg-white dark:bg-neutral-800"
              placeholder="Status (To Do, In Progress...)"
              placeholderTextColor={theme.icon}
              value={taskForm.status}
              onChangeText={text => setTaskForm({ ...taskForm, status: text })}
            />
            {/* Assignee and Due fields removed as they are not in Task type */}
            <View className="flex-row justify-end space-x-4">
              <Pressable onPress={() => setModalVisible(false)}>
                <Text className="text-blue-500 font-bold">Cancel</Text>
              </Pressable>
              <Pressable
                className="bg-blue-500 px-4 py-2 rounded-lg"
                disabled={!taskForm.title}
                onPress={editId ? handleUpdateTask : handleAddTask}
              >
                <Text className="text-white font-bold">{editId ? 'Save' : 'Add'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
