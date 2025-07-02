import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
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

  // Typing animation for heading
  const headings = ["Start Something Great", "Let's get that project done."];
  const [displayedHeading, setDisplayedHeading] = useState('');
  const [headingIndex, setHeadingIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const current = headings[headingIndex];
    if (!isDeleting && charIndex < current.length) {
      timeout = setTimeout(() => {
        setDisplayedHeading(current.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 60);
    } else if (!isDeleting && charIndex === current.length) {
      // Pause before deleting or switching
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 900);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplayedHeading(current.slice(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      }, 30);
    } else if (isDeleting && charIndex === 0) {
      // Switch to next heading
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setHeadingIndex((headingIndex + 1) % headings.length);
      }, 300);
    }
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, headingIndex]);

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
      {/* Header with gradient and icon */}
      <View style={{flex: 1, position: 'relative',marginTop:5,backgroundColor:'white'}}>
        <Text style={styles.heading}>{displayedHeading}<Text style={{color:'#668cff'}}>|</Text></Text>
      </View>
      {/* Action cards */}
      <View style={styles.actionCardsRow}>
        <TouchableOpacity style={styles.actionCard} onPress={() => { setStep('project'); setModalVisible(true); }}>
          <FontAwesome name="group" size={32} color="#668cff" style={{ marginBottom: 10 }} />
          <Text style={styles.actionCardTitle}>New Project</Text>
          <Text style={styles.actionCardDesc}>Organize work, assign teammates, and track progress.</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard} onPress={() => { setStep('task'); setModalVisible(true); }}>
          <FontAwesome name="check-square" size={32} color="#4caf50" style={{ marginBottom: 10 }} />
          <Text style={styles.actionCardTitle}>New Task</Text>
          <Text style={styles.actionCardDesc}>Break down work, set due dates, and assign owners.</Text>
        </TouchableOpacity>
      </View>
      {/* Recent Projects horizontal cards */}
      <Text style={styles.sectionTitle}>Recent Projects</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.projectsScroll}>
        {projects.length === 0 ? (
          <View style={styles.emptyProjectCard}>
            <Text style={styles.emptyText}>No projects yet. Start by creating one!</Text>
          </View>
        ) : (
          projects.slice(-6).reverse().map((proj) => (
            <View key={proj.id} style={styles.projectCardH}>
              <View style={styles.projectCardHeader}>
                <Text style={styles.projectName}>{proj.name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(proj.status) }]}>
                  <Text style={styles.statusBadgeText}>{proj.status || 'Draft'}</Text>
                </View>
              </View>
              <Text style={styles.projectMetaH}>{proj.description}</Text>
              <View style={styles.projectCardFooter}>
                <FontAwesome name="user" size={14} color="#668cff" />
                <Text style={styles.projectMetaValueH}>{proj.owner || 'No Owner'}</Text>
                {proj.assignee ? (
                  <View style={styles.assigneeBadge}><Text style={styles.assigneeText}>{proj.assignee}</Text></View>
                ) : null}
              </View>
            </View>
          ))
        )}
      </ScrollView>
      {/* Modal for multi-step form (unchanged) */}
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
    </View>
  );
};

// Helper for status color
type StatusType = string | undefined;
function getStatusColor(status: StatusType): string {
  switch ((status || '').toLowerCase()) {
    case 'active': return '#4caf50';
    case 'planning': return '#ff9800';
    case 'done': return '#668cff';
    case 'on hold': return '#bdbdbd';
    default: return '#e0e0e0';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7faff',
    padding: 0,
    paddingTop: 0,
  },
  headerWrap: {
    position: 'relative',
    overflow: 'hidden',
    paddingBottom: 30, // increased for more space below header
    marginBottom: 48, // increased for more space below header area
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: 'rgba(102,140,255,0.8)',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    zIndex: 1,
  },
  headerIcon: {
    position: 'absolute',
    top: 48, // moved down a bit for better balance
    left: 24,
    zIndex: 2,
    width: 32,
    height: 32,
    // Reduce icon size visually
    // No need for fontSize here, handled in JSX
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 60,
    marginLeft: 24,
    marginBottom:10,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(102,140,255,0.12)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  subheading: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 28,
    marginLeft: 24,
  },
  actionCardsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
    paddingHorizontal: 24,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  actionCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 8,
    marginBottom: 4,
  },
  actionCardDesc: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#668cff',
    marginLeft: 24,
    marginBottom: 8,
    marginTop: 32, // increased margin to push recent projects up
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    marginLeft: 24,
    marginBottom: 16,
  },
  projectsScroll: {
    paddingLeft: 24,
    paddingRight: 8,
    paddingBottom: 64, // increased for more space below recent projects
  },
  emptyProjectCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  projectCardH: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    width: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  projectCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  statusBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  statusBadgeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  projectMetaH: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  projectCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  projectMetaValueH: {
    color: '#668cff',
    fontWeight: '600',
    fontSize: 14,
  },
  assigneeBadge: {
    backgroundColor: '#f0f4ff',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  assigneeText: {
    color: '#668cff',
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 4,
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