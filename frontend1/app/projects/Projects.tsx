import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { useProjectContext } from '../context/ProjectContext';

const Projects = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { projects, loading, addProject, updateProject, deleteProject } = useProjectContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', status: '', description: '', owner: '' });
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editProject, setEditProject] = useState({ name: '', status: '', description: '', owner: '' });
  const [statusDropdownVisible, setStatusDropdownVisible] = useState(false);

  const statusOptions = ['Planned', 'In Progress', 'Done', 'On Hold'];

  const filteredProjects = useMemo(() => {
    if (!search) return projects;
    return projects.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.status && p.status.toLowerCase().includes(search.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase())) ||
      (p.owner && p.owner.toLowerCase().includes(search.toLowerCase()))
    );
  }, [projects, search]);

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  // Move all state updates to useEffect for performance and mount safety
  useEffect(() => {
    if (!isMounted.current) return;
    // Example: batch updates for add/edit
    if (adding) {
      (async () => {
        await addProject(newProject);
        if (isMounted.current) {
          setAdding(false);
          setModalVisible(false);
          setNewProject({ name: '', status: '', description: '', owner: '' });
        }
      })();
    }
  }, [adding]);

  useEffect(() => {
    if (!isMounted.current) return;
    if (editId && editProject) {
      setEditProject({ ...editProject });
    }
  }, [editId]);

  const handleAddProject = async () => {
    if (!isMounted.current) return;
    setAdding(true);
  };

  const handleEditProject = useCallback((project: any) => {
    if (!isMounted.current) return;
    setEditId(project.id);
    setEditProject({
      name: project.name,
      status: project.status || '',
      description: project.description || '',
      owner: project.owner || '',
    });
    setModalVisible(true);
  }, []);

  const handleUpdateProject = async () => {
    if (!isMounted.current || !editId) return;
    await updateProject(editId, editProject);
    setModalVisible(false);
    setEditId(null);
    setEditProject({ name: '', status: '', description: '', owner: '' });
  };

  const handleDeleteProject = async (id: string) => {
    await deleteProject(id);
  };

  return (
    <View className="flex-1 bg-[#f7faff] dark:bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-10 pb-4 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">Projects</Text>
        <TouchableOpacity
          className="w-12 h-12 rounded-full bg-[#668cff] items-center justify-center border-2 border-[#668cff] shadow-md"
          style={{
            shadowColor: '#668cff',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 12,
            elevation: 10,
          }}
          onPress={() => {
            setEditId(null);
            setModalVisible(true);
          }}
        >
          <FontAwesome name="plus" color="white" size={28} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <TextInput
        className="border border-gray-200 dark:border-gray-700 rounded-md p-3 text-base bg-white dark:bg-neutral-800 dark:text-white m-4"
        placeholder="Search projects..."
        placeholderTextColor={isDark ? '#ccc' : undefined}
        value={search}
        onChangeText={setSearch}
      />

      {loading && <ActivityIndicator size="large" color="#668cff" className="mt-5" />}

      {/* Project List */}
      <FlatList
        data={filteredProjects}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 8 }}
        ListEmptyComponent={
          <Text className="text-center text-gray-400 dark:text-gray-500 mt-10">No projects found.</Text>
        }
        renderItem={({ item }) => (
          <View
            className="bg-white dark:bg-neutral-900 rounded-2xl p-4 my-2 mx-1 border border-[#668cff]"
            style={{
              shadowColor: '#668cff',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.12,
              shadowRadius: 10,
              elevation: 3,
            }}
          >
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-lg font-bold text-gray-900 dark:text-white">{item.name}</Text>
              <View className="flex-row">
                <TouchableOpacity onPress={() => handleEditProject(item)}>
                  <FontAwesome name="edit" size={20} color="#668cff" style={{ marginRight: 16 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteProject(item.id)}>
                  <FontAwesome name="trash" size={20} color="#ff4d4d" />
                </TouchableOpacity>
              </View>
            </View>
            <Text className="text-sm font-semibold text-[#668cff] mb-1">{item.status}</Text>
            <Text className="text-base text-gray-700 dark:text-gray-300 mb-1">{item.description}</Text>
            <Text className="text-sm italic text-gray-400">{item.owner}</Text>
          </View>
        )}
      />

      {/* Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/20 justify-center items-center">
          <View className="w-[90%] bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg">
            <Text className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {editId ? 'Edit Project' : 'Add New Project'}
            </Text>

            {/* Form Fields */}
            {(['name', 'description', 'owner'] as Array<keyof typeof newProject>).map(field => (
              <TextInput
                key={field}
                className="border border-gray-200 dark:border-gray-700 rounded-md p-3 text-base bg-[#f7faff] dark:bg-neutral-800 dark:text-white mb-3"
                placeholder={field[0].toUpperCase() + field.slice(1)}
                placeholderTextColor={isDark ? '#ccc' : undefined}
                value={editId ? editProject[field] : newProject[field]}
                onChangeText={text =>
                  editId
                    ? setEditProject({ ...editProject, [field]: text })
                    : setNewProject({ ...newProject, [field]: text })
                }
              />
            ))}

            {/* Status Dropdown */}
            <TouchableOpacity
              className="border border-gray-200 dark:border-gray-700 rounded-md p-3 flex-row justify-between items-center bg-white dark:bg-neutral-800 mb-3"
              onPress={() => setStatusDropdownVisible(true)}
            >
              <Text
                className={`${
                  (editId ? editProject.status : newProject.status) ? 'text-gray-800 dark:text-white' : 'text-gray-400'
                } text-base`}
              >
                {(editId ? editProject.status : newProject.status) || 'Select Status...'}
              </Text>
              <FontAwesome name="chevron-down" size={18} color="#668cff" />
            </TouchableOpacity>

            {/* Status Options */}
            <Modal
              visible={statusDropdownVisible}
              transparent
              animationType="fade"
              onRequestClose={() => setStatusDropdownVisible(false)}
            >
              <Pressable className="flex-1 bg-black/20" onPress={() => setStatusDropdownVisible(false)}>
                <View className="absolute top-[35%] left-[5%] right-[5%] bg-white dark:bg-neutral-900 rounded-xl p-4 shadow-lg">
                  {statusOptions.map(option => (
                    <TouchableOpacity
                      key={option}
                      className="py-3 border-b border-gray-100 dark:border-gray-700"
                      onPress={() => {
                        editId
                          ? setEditProject({ ...editProject, status: option })
                          : setNewProject({ ...newProject, status: option });
                        setStatusDropdownVisible(false);
                      }}
                    >
                      <Text className="text-base text-gray-800 dark:text-white">{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Pressable>
            </Modal>

            {/* Action Buttons */}
            <View className="flex-row justify-end mt-4 space-x-3">
              <Pressable
                className="px-4 py-2 rounded-md bg-[#f7faff] dark:bg-neutral-700"
                onPress={() => {
                  setModalVisible(false);
                  setEditId(null);
                }}
              >
                <Text className="text-[#668cff] font-bold">Cancel</Text>
              </Pressable>
              <Pressable
                className="px-4 py-2 rounded-md bg-[#668cff] border-2 border-[#668cff]"
                style={{
                  shadowColor: '#668cff',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.7,
                  shadowRadius: 10,
                  elevation: 8,
                }}
                disabled={adding || !(editId ? editProject.name : newProject.name)}
                onPress={editId ? handleUpdateProject : handleAddProject}
              >
                <Text className="text-white font-bold">
                  {adding ? (editId ? 'Saving...' : 'Adding...') : editId ? 'Save' : 'Add'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Projects;
