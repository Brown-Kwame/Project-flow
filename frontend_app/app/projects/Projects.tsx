import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useProjectContext } from '../context/ProjectContext';

const Projects = () => {
  const { projects, loading, error, addProject, updateProject, deleteProject } = useProjectContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', status: '', description: '', owner: '' });
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editProject, setEditProject] = useState({ name: '', status: '', description: '', owner: '' });
  const [statusDropdownVisible, setStatusDropdownVisible] = useState(false);

  const statusOptions = ['Planned', 'In Progress', 'Done', 'On Hold'];

  // Filter projects by search
  const filteredProjects = useMemo(() => {
    if (!search) return projects;
    return projects.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.status && p.status.toLowerCase().includes(search.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase())) ||
      (p.owner && p.owner.toLowerCase().includes(search.toLowerCase()))
    );
  }, [projects, search]);

  const handleAddProject = async () => {
    setAdding(true);
    await addProject(newProject);
    setAdding(false);
    setModalVisible(false);
    setNewProject({ name: '', status: '', description: '', owner: '' });
  };

  const handleEditProject = useCallback((project: any) => {
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
    if (!editId) return;
    setAdding(true);
    await updateProject(editId, editProject);
    setAdding(false);
    setModalVisible(false);
    setEditId(null);
    setEditProject({ name: '', status: '', description: '', owner: '' });
  };

  const handleDeleteProject = async (id: string) => {
    await deleteProject(id);
  };

  return (
    <View style={styles.container1}>
      <View style={styles.header}>
        <Text style={styles.heading}>Projects</Text>
        <TouchableOpacity style={styles.fab} onPress={() => { setEditId(null); setModalVisible(true); }}>
          <FontAwesome name="plus" color="white" size={28} />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.search}
        placeholder="Search projects..."
        value={search}
        onChangeText={setSearch}
      />
      {loading && <ActivityIndicator size="large" color="#668cff" style={{ marginTop: 20 }} />}
      {error && <Text style={{ color: 'red', margin: 20 }}>{error}</Text>}
      <FlatList
        data={filteredProjects}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 8 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.projectName}>{item.name}</Text>
              <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => handleEditProject(item)}>
                  <FontAwesome name="edit" size={20} color="#668cff" style={{ marginRight: 16 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteProject(item.id)}>
                  <FontAwesome name="trash" size={20} color="#ff4d4d" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.projectStatus}>{item.status}</Text>
            <Text style={styles.projectDesc}>{item.description}</Text>
            <Text style={styles.projectOwner}>{item.owner}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>No projects found.</Text>}
      />
      {/* Add/Edit Project Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editId ? 'Edit Project' : 'Add New Project'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Project Name"
              value={editId ? editProject.name : newProject.name}
              onChangeText={text => editId ? setEditProject({ ...editProject, name: text }) : setNewProject({ ...newProject, name: text })}
            />
            {/* Status Dropdown with label */}
            <View style={{ marginBottom: 12 }}>
              <Text style={{ marginLeft: 4, marginBottom: 4, fontWeight: '600', color: '#222' }}>Status</Text>
              <TouchableOpacity
                style={[styles.input, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff' }]}
                onPress={() => setStatusDropdownVisible(true)}
                activeOpacity={0.7}
              >
                <Text style={{ color: (editId ? editProject.status : newProject.status) ? '#222' : '#888', fontSize: 16 }}>
                  {(editId ? editProject.status : newProject.status) || 'Select Status...'}
                </Text>
                <FontAwesome name="chevron-down" size={18} color="#668cff" />
              </TouchableOpacity>
              {/* Status Options Modal */}
              <Modal
                visible={statusDropdownVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setStatusDropdownVisible(false)}
              >
                <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }} onPress={() => setStatusDropdownVisible(false)}>
                  <View style={{ position: 'absolute', left: '5%', right: '5%', top: '35%', backgroundColor: '#fff', borderRadius: 12, padding: 16, elevation: 10 }}>
                    {statusOptions.map(option => (
                      <TouchableOpacity
                        key={option}
                        style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }}
                        onPress={() => {
                          if (editId) setEditProject({ ...editProject, status: option });
                          else setNewProject({ ...newProject, status: option });
                          setStatusDropdownVisible(false);
                        }}
                      >
                        <Text style={{ color: '#222', fontSize: 16 }}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </Pressable>
              </Modal>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={editId ? editProject.description : newProject.description}
              onChangeText={text => editId ? setEditProject({ ...editProject, description: text }) : setNewProject({ ...newProject, description: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Owner"
              value={editId ? editProject.owner : newProject.owner}
              onChangeText={text => editId ? setEditProject({ ...editProject, owner: text }) : setNewProject({ ...newProject, owner: text })}
            />
            <View style={styles.modalActions}>
              <Pressable style={styles.cancelBtn} onPress={() => { setModalVisible(false); setEditId(null); }}>
                <Text style={{ color: '#668cff', fontWeight: 'bold' }}>Cancel</Text>
              </Pressable>
              {editId ? (
                <Pressable style={styles.addBtn} onPress={handleUpdateProject} disabled={adding || !editProject.name}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>{adding ? 'Saving...' : 'Save'}</Text>
                </Pressable>
              ) : (
                <Pressable style={styles.addBtn} onPress={handleAddProject} disabled={adding || !newProject.name}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>{adding ? 'Adding...' : 'Add'}</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Projects;

const styles = StyleSheet.create({
  container1: {
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
    width: 48,
    height: 48,
    borderRadius: 24,
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
    padding: 18,
    marginVertical: 8,
    marginHorizontal: 4,
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
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  projectStatus: {
    fontSize: 14,
    color: '#668cff',
    marginBottom: 4,
    fontWeight: '600',
  },
  projectDesc: {
    fontSize: 15,
    color: '#444',
    marginBottom: 2,
  },
  projectOwner: {
    fontSize: 13,
    color: '#888',
    fontStyle: 'italic',
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