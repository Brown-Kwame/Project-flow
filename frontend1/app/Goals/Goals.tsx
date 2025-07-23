import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
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

const demoGoals = [
  { id: '1', title: 'Launch New Feature', status: 'In Progress', owner: 'James', due: '2025-07-01' },
  { id: '2', title: 'Increase User Retention', status: 'To Do', owner: 'Sarah', due: '2025-08-01' },
  { id: '3', title: 'Reduce Bug Count', status: 'Done', owner: 'Alex', due: '2025-06-10' },
];

const GOALS_STORAGE_KEY = 'asana_goals';

const statusColors = {
  'To Do': '#fbbf24',         // amber-400
  'In Progress': '#60a5fa',   // blue-400
  'Done': '#4ade80',          // green-400
};

const Goals = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [goals, setGoals] = useState(demoGoals);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [goalForm, setGoalForm] = useState({ title: '', status: 'To Do', owner: '', due: '' });
  const [search, setSearch] = useState('');
  const isMounted = useRef(false);

  const filteredGoals = useMemo(() => {
    if (!search) return goals;
    const term = search.toLowerCase();
    return goals.filter(g =>
      g.title.toLowerCase().includes(term) ||
      g.status.toLowerCase().includes(term) ||
      g.owner?.toLowerCase().includes(term)
    );
  }, [goals, search]);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  // Move all state updates to useEffect for performance and mount safety
  useEffect(() => {
    if (!isMounted.current) return;
    // Example: batch updates for add/edit
    if (editId && goalForm) {
      setGoalForm({ ...goalForm });
    }
  }, [editId]);

  const handleAddGoal = useCallback(() => {
    if (!isMounted.current) return;
    setGoals(prev => [...prev, { ...goalForm, id: Date.now().toString() }]);
    setModalVisible(false);
    setGoalForm({ title: '', status: 'To Do', owner: '', due: '' });
    setEditId(null);
  }, [goalForm]);

  const handleEditGoal = useCallback((goal: any) => {
    if (!isMounted.current) return;
    setEditId(goal.id);
    setGoalForm({ title: goal.title, status: goal.status, owner: goal.owner, due: goal.due });
    setModalVisible(true);
  }, []);

  const handleUpdateGoal = useCallback(() => {
    if (!isMounted.current) return;
    setGoals(prev => prev.map(g => (g.id === editId ? { ...g, ...goalForm } : g)));
    setModalVisible(false);
    setGoalForm({ title: '', status: 'To Do', owner: '', due: '' });
    setEditId(null);
  }, [editId, goalForm]);

  const handleDeleteGoal = useCallback((id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  }, []);

  useEffect(() => {
    const loadGoals = async () => {
      setLoading(true);
      try {
        const stored = await AsyncStorage.getItem(GOALS_STORAGE_KEY);
        if (stored) setGoals(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load goals:', e);
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
    <View className={`${isDark ? 'bg-black' : 'bg-[#f7faff]'} flex-1`}>
      <View className={`${isDark ? 'bg-neutral-900' : 'bg-white'} flex-row items-center justify-between px-4 pt-10 pb-4 border-b border-gray-200`}>
        <Text className={`${isDark ? 'text-white' : 'text-[#222]'} text-2xl font-bold`}>Team Goals</Text>
        <TouchableOpacity
          className="bg-blue-500 w-11 h-11 rounded-full items-center justify-center shadow-md"
          onPress={() => {
            setEditId(null);
            setGoalForm({ title: '', status: 'To Do', owner: '', due: '' });
            setModalVisible(true);
          }}
        >
          <FontAwesome name="plus" color="white" size={24} />
        </TouchableOpacity>
      </View>

      <TextInput
        className={`${isDark ? 'bg-neutral-800 text-white' : 'bg-white text-black'} border border-gray-200 rounded-md px-4 py-3 mx-4 my-4 text-base`}
        placeholder="Search goals..."
        placeholderTextColor={isDark ? '#aaa' : '#666'}
        value={search}
        onChangeText={setSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#668cff" className="mt-5" />
      ) : (
        <FlatList
          data={filteredGoals}
          keyExtractor={item => item.id}
          initialNumToRender={6}
          maxToRenderPerBatch={10}
          removeClippedSubviews
          windowSize={5}
          contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 8 }}
          ListEmptyComponent={<Text className="text-center text-gray-500 mt-10">No goals found.</Text>}
          renderItem={({ item }) => (
            <View className={`${isDark ? 'bg-neutral-900 border-blue-500' : 'bg-white border-blue-500'} rounded-2xl my-2 mx-1.5 p-4 border shadow-md`}>
              <View className="flex-row justify-between items-center mb-1.5">
                <Text className={`${isDark ? 'text-white' : 'text-[#222]'} text-lg font-bold`}>{item.title}</Text>
                <View
                  className="rounded-xl px-3 py-1"
                  style={{ backgroundColor: statusColors[item.status as keyof typeof statusColors] || '#ccc' }}
                >
                  <Text className="text-white text-xs font-bold">{item.status}</Text>
                </View>
                <View className="flex-row ml-2">
                  <TouchableOpacity onPress={() => handleEditGoal(item)}>
                    <FontAwesome name="edit" size={18} color="#668cff" className="mr-2.5" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteGoal(item.id)}>
                    <FontAwesome name="trash" size={18} color="#ff4d4d" />
                  </TouchableOpacity>
                </View>
              </View>
              <Text className={`${isDark ? 'text-gray-300' : 'text-[#444]'} text-sm`}>
                Owner: <Text className="text-blue-500 font-semibold">{item.owner}</Text>
              </Text>
              <Text className={`${isDark ? 'text-gray-300' : 'text-[#444]'} text-sm`}>
                Due: <Text className="text-blue-500 font-semibold">{item.due}</Text>
              </Text>
            </View>
          )}
        />
      )}

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/30 justify-center items-center">
          <View className={`${isDark ? 'bg-neutral-900' : 'bg-white'} w-[90%] rounded-2xl p-6 shadow-lg`}>
            <Text className={`${isDark ? 'text-white' : 'text-[#222]'} text-xl font-bold mb-4`}>
              {editId ? 'Edit Goal' : 'Add New Goal'}
            </Text>

            {['title', 'status', 'owner', 'due'].map((field, i) => (
              <TextInput
                key={i}
                className={`${isDark ? 'bg-neutral-800 text-white' : 'bg-[#f7faff] text-black'} border border-gray-200 rounded-md px-4 py-3 mb-3 text-base`}
                placeholder={field === 'due' ? 'Due Date (YYYY-MM-DD)' : `Goal ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                placeholderTextColor={isDark ? '#aaa' : '#666'}
                value={goalForm[field as keyof typeof goalForm]}
                onChangeText={text => setGoalForm(prev => ({ ...prev, [field]: text }))}
              />
            ))}

            <View className="flex-row justify-end space-x-3 mt-2">
              <Pressable
                className="bg-gray-100 px-4 py-2 rounded-md"
                onPress={() => {
                  setModalVisible(false);
                  setEditId(null);
                }}
              >
                <Text className="text-blue-500 font-bold">Cancel</Text>
              </Pressable>
              <Pressable
                className="bg-blue-500 px-4 py-2 rounded-md shadow-md"
                onPress={editId ? handleUpdateGoal : handleAddGoal}
                disabled={!goalForm.title}
              >
                <Text className="text-white font-bold">{editId ? 'Save' : 'Add'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Goals;
