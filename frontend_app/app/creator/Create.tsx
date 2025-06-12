import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useProjectContext } from '../context/ProjectContext';

const TASKS_STORAGE_KEY = 'asana_tasks';

const Create = () => {
  const { addProject, projects } = useProjectContext();
  const [step, setStep] = useState<'choose' | 'project' | 'task' | 'done'>('choose');
  const [modalVisible, setModalVisible] = useState(false);
  // Project form (add assignee field)
  const [projectForm, setProjectForm] = useState({ name: '', status: '', description: '', owner: '', assignee: '' });
  // Task form
  const [taskForm, setTaskForm] = useState({ title: '', status: 'To Do', assignee: '', due: '' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add Task (local, persistent)
  const handleAddTask = async () => {
    setCreating(true);
    setError(null);
    try {
      const stored = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      let tasks: any[] = [];
      if (stored) {
        try {
          tasks = JSON.parse(stored);
        } catch {
          tasks = [];
        }
      }
      const newTask = { ...taskForm, id: (Date.now() + Math.random()).toString() };
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify([...tasks, newTask]));
      setStep('done');
    } catch (e) {
      setError('Failed to add task');
    } finally {
      setCreating(false);
    }
  };

  // Add Project (via context)
  const handleAddProject = async () => {
    setCreating(true);
    setError(null);
    try {
      await addProject(projectForm);
      setStep('done');
    } catch (e) {
      setError('Failed to add project');
    } finally {
      setCreating(false);
    }
  };

  // Reset forms and step
  const reset = () => {
    setProjectForm({ name: '', status: '', description: '', owner: '', assignee: '' });
    setTaskForm({ title: '', status: 'To Do', assignee: '', due: '' });
    setStep('choose');
    setModalVisible(false);
    setError(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.heading}>Create</Text>
        <Text style={styles.subheading}>Add a new Project or Task</Text>
        <View style={styles.btnRow}>
          <TouchableOpacity style={[styles.btn, { marginRight: 16 }]} onPress={() => { setStep('project'); setModalVisible(true); }}>
            <FontAwesome name="group" size={22} color="#fff" style={{ marginRight: 10 }} />
            <Text style={styles.btnText}>New Project</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, { marginLeft: 16 }]} onPress={() => { setStep('task'); setModalVisible(true); }}>
            <FontAwesome name="check-square" size={22} color="#fff" style={{ marginRight: 10 }} />
            <Text style={styles.btnText}>New Task</Text>
          </TouchableOpacity>
        </View>
        {/* Show current projects below buttons */}
        <Text style={styles.sectionTitle}>Current Projects</Text>
        {projects.length === 0 ? (
          <Text style={styles.emptyText}>No projects yet.</Text>
        ) : (
          projects.slice(-3).map((proj) => (
            <View key={proj.id} style={styles.projectCard}>
              <Text style={styles.projectName}>{proj.name}</Text>
              <Text style={styles.projectMeta}>Status: <Text style={styles.projectMetaValue}>{proj.status}</Text></Text>
              <Text style={styles.projectMeta}>Owner: <Text style={styles.projectMetaValue}>{proj.owner}</Text></Text>
              {proj.assignee && <Text style={styles.projectMeta}>Assignee: <Text style={styles.projectMetaValue}>{proj.assignee}</Text></Text>}
            </View>
          ))
        )}
        {/* Modal for multi-step form */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={reset}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                {error && <Text style={styles.error}>{error}</Text>}
                {step === 'project' && (
                  <>
                    <Text style={styles.modalTitle}>Add New Project</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Project Name"
                      value={projectForm.name}
                      onChangeText={text => setProjectForm({ ...projectForm, name: text })}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Status (Active, Planning, Done, On Hold)"
                      value={projectForm.status}
                      onChangeText={text => setProjectForm({ ...projectForm, status: text })}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Description"
                      value={projectForm.description}
                      onChangeText={text => setProjectForm({ ...projectForm, description: text })}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Owner"
                      value={projectForm.owner}
                      onChangeText={text => setProjectForm({ ...projectForm, owner: text })}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Assignee"
                      value={projectForm.assignee}
                      onChangeText={text => setProjectForm({ ...projectForm, assignee: text })}
                    />
                    <View style={styles.modalActions}>
                      <Pressable style={styles.cancelBtn} onPress={reset}>
                        <Text style={{ color: '#668cff', fontWeight: 'bold' }}>Cancel</Text>
                      </Pressable>
                      <Pressable style={styles.addBtn} onPress={handleAddProject} disabled={!projectForm.name || creating}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>{creating ? 'Adding...' : 'Add'}</Text>
                      </Pressable>
                    </View>
                  </>
                )}
                {step === 'task' && (
                  <>
                    <Text style={styles.modalTitle}>Add New Task</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Task Title"
                      value={taskForm.title}
                      onChangeText={text => setTaskForm({ ...taskForm, title: text })}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Status (To Do, In Progress, Done, In Review)"
                      value={taskForm.status}
                      onChangeText={text => setTaskForm({ ...taskForm, status: text })}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Assignee"
                      value={taskForm.assignee}
                      onChangeText={text => setTaskForm({ ...taskForm, assignee: text })}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Due Date (YYYY-MM-DD)"
                      value={taskForm.due}
                      onChangeText={text => setTaskForm({ ...taskForm, due: text })}
                    />
                    <View style={styles.modalActions}>
                      <Pressable style={styles.cancelBtn} onPress={reset}>
                        <Text style={{ color: '#668cff', fontWeight: 'bold' }}>Cancel</Text>
                      </Pressable>
                      <Pressable style={styles.addBtn} onPress={handleAddTask} disabled={!taskForm.title || creating}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>{creating ? 'Adding...' : 'Add'}</Text>
                      </Pressable>
                    </View>
                  </>
                )}
                {step === 'done' && (
                  <View style={{ alignItems: 'center', padding: 24 }}>
                    <FontAwesome name="check-circle" size={48} color="#4caf50" style={{ marginBottom: 16 }} />
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#222', marginBottom: 8 }}>Created!</Text>
                    <TouchableOpacity style={styles.doneBtn} onPress={reset}>
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Done</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7faff',
    padding: 0,
    paddingTop: 0,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    marginLeft: 24,
    marginTop: 12,
  },
  subheading: {
    fontSize: 18,
    color: '#444',
    marginBottom: 32,
    marginLeft: 24,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#668cff',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    margin:10
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#668cff',
    marginLeft: 24,
    marginBottom: 8,
    marginTop: 8,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    marginLeft: 24,
    marginBottom: 16,
  },
  projectCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  projectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  projectMeta: {
    fontSize: 14,
    color: '#444',
    marginBottom: 1,
  },
  projectMetaValue: {
    color: '#668cff',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#222',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
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
  },
  doneBtn: {
    marginTop: 16,
    backgroundColor: '#668cff',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  error: {
    color: '#ff4d4d',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default Create;