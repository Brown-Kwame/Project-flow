import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Keyboard,Switch, useColorScheme, FlatList} from 'react-native';
import {Feather, MaterialIcons, Ionicons, FontAwesome,MaterialCommunityIcons } from '@expo/vector-icons';

// Type Definitions
type Task = {
  id: string;
  title: string;
  due: string;
  completed: boolean;
  category?: string;
  project?: string;
  date?: string;
};

type Project = {
  id: string;
  name: string;
  members: number;
  progress: number;
};

type Goal = {
  id: string;
  title: string;
  progress: number;
  deadline: string;
};

type Portfolio = {
  id: string;
  title: string;
  items: number;
  lastUpdated: string;
};

const HomeScreen = () => {
  // State Management
  const [greeting, setGreeting] = useState('Good evening');
  const [activeTab, setActiveTab] = useState<'home' | 'tasks' | 'search' | 'notifications' | 'profile'>('home');
  const [activeContentTab, setActiveContentTab] = useState<'projects' | 'goals' | 'portfolios'>('projects');
  const [showSearch, setShowSearch] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [showTaskScreen, setShowTaskScreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [doNotDisturb, setDoNotDisturb] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [recentlyAssignedCount] = useState(5);
 const [isDarkMode, setIsDarkMode] = useState(false)


  // Data
  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: '1', 
      title: 'Complete project proposal', 
      due: 'Today', 
      completed: false, 
      category: 'Schedule', 
      project: 'Management of tasks', 
      date: 'Aug 21, 2023' 
    },
    { 
      id: '2', 
      title: 'Team meeting', 
      due: 'Tomorrow', 
      completed: true, 
      category: 'Plan', 
      project: 'Management of tasks', 
      date: 'Aug 18, 2023' 
    },
    { 
      id: '3', 
      title: 'Review designs', 
      due: 'In 2 days', 
      completed: false, 
      category: 'Do today', 
      date: 'Aug 23, 2023' 
    },
  ]);
  
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', name: 'Management of tasks', members: 3, progress: 45 },
    { id: '2', name: 'Product Launch', members: 5, progress: 72 },
  ]);
  
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', title: 'Complete React Native Certification', progress: 65, deadline: 'Dec 31, 2023' },
    { id: '2', title: 'Read 12 books this year', progress: 42, deadline: 'Dec 31, 2023' },
  ]);

  const [portfolios, setPortfolios] = useState<Portfolio[]>([
    { id: '1', title: 'Mobile App Portfolio', items: 8, lastUpdated: '2 days ago' },
    { id: '2', title: 'Web Design Projects', items: 12, lastUpdated: '1 week ago' },
  ]);

  // Effects
 useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
  }, []);

  // Helper Functions
  const renderProgressBar = (progress: number) => (
    <View style={styles.progressBarBackground}>
      <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
    </View>
  );
  // Task Functions
  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Navigation Functions
  const navigateToTab = (tab: typeof activeTab) => {
    setShowSearch(false);
    setShowInbox(false);
    setShowTaskScreen(false);
    setActiveTab(tab);
  };

  const handleSearchPress = () => {
    setShowSearch(true);
    setShowInbox(false);
    setShowTaskScreen(false);
    setActiveTab('search');
  };

  const handleBackFromSearch = () => {
    setShowSearch(false);
    setSearchQuery('');
    Keyboard.dismiss();
    navigateToTab('home');
  };

  const handleInboxPress = () => {
    setShowInbox(true);
    setShowSearch(false);
    setShowTaskScreen(false);
    setActiveTab('notifications');
  };

  const handleNewTaskFromInbox = () => {
    setShowInbox(false);
    setShowTaskScreen(true);
    setSelectedTask(null);
  };

  const handleBackFromInbox = () => {
    setShowInbox(false);
    navigateToTab('home');
  };

  const handleNewTaskPress = () => {
    setSelectedTask(null);
    setShowTaskScreen(true);
  };

  const handleTaskPress = (task: Task) => {
    setSelectedTask(task);
    setShowTaskScreen(true);
  };

  const handleBackFromTask = () => {
    setShowTaskScreen(false);
  };

  const handleSaveTask = (updatedTask: Omit<Task, 'id' | 'completed'>) => {
    if (selectedTask) {
      setTasks(tasks.map(task => 
        task.id === selectedTask.id ? { ...selectedTask, ...updatedTask } : task
      ));
    } else {
      setTasks([...tasks, {
        ...updatedTask,
        id: Date.now().toString(),
        completed: false
      }]);
    }
    setShowTaskScreen(false);
  };

  // Screen Components
  const SearchScreen = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchHeader}>
        <TouchableOpacity onPress={handleBackFromSearch}>
          <Ionicons name="arrow-back" size={24} color="#bb86fc" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for tasks, projects, people, teams, and more..."
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus={true}
        />
      </View>
      <View style={styles.searchContent}>
        <Text style={styles.searchPlaceholder}>Start typing to search...</Text>
      </View>
    </View>
  );

  const InboxScreen = () => (
    <View style={styles.inboxContainer}>
      <View style={styles.inboxHeader}>
        <TouchableOpacity onPress={handleBackFromInbox}>
          <Ionicons name="arrow-back" size={24} color="#bb86fc" />
        </TouchableOpacity>
        <Text style={styles.inboxTitle}>Inbox</Text>
      </View>
      
      <View style={styles.inboxContent}>
        <View style={styles.inboxMessage}>
          <Ionicons name="alert-circle-outline" size={24} color="#ff4444" />
          <Text style={styles.inboxMessageText}>Trouble connecting</Text>
          <TouchableOpacity style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.newTaskButton}
          onPress={handleNewTaskFromInbox}
        >
          <Text style={styles.newTaskButtonText}>+ New task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ProfileScreen = () => (
  <ScrollView style={styles.profileContainer}>
    <View style={styles.profileHeader}>
      <View style={styles.profileAvatar}>
        <FontAwesome name="user-circle-o" size={64} color="#bb86fc" />
      </View>
      <View style={styles.profileTextContainer}>
        <Text style={styles.profileName}>Tagoe Shadrach</Text>
        <Text style={styles.profileEmail}>tagoeshady@gmail.com</Text>
      </View>
    </View>

    <View style={styles.profileSection}>
      <Text style={styles.sectionTitle}>Organizations</Text>
      <View style={styles.profileItem}>
        <View style={styles.profileItemContent}>
          <Text style={styles.itemText}>My workspace</Text>
          <Text style={styles.itemSubtext}>tagoeshaddy@gmail.com</Text>
        </View>
      </View>
    </View>

    <View style={styles.profileSection}>
      <Text style={styles.sectionTitle}>Plan</Text>
      <View style={styles.profileItem}>
        <View style={styles.profileItemContent}>
          <Text style={styles.itemText}>Asana Personal</Text>
          <Text style={styles.itemSubtext}>10 seats</Text>
        </View>
      </View>
    </View>

    <View style={styles.profileSection}>
      <Text style={styles.sectionTitle}>Notifications</Text>
      <View style={styles.profileItem}>
        <View style={styles.profileItemContent}>
          <Text style={styles.itemText}>Do not disturb</Text>
        </View>
        <Switch
          value={doNotDisturb}
          onValueChange={setDoNotDisturb}
          trackColor={{ false: '#767577', true: '#bb86fc' }}
          thumbColor={doNotDisturb ? '#f5f5f5' : '#f4f3f4'}
        />
      </View>
      <View style={styles.profileItem}>
        <View style={styles.profileItemContent}>
          <Text style={styles.itemText}>Push notifications</Text>
          <Text style={styles.itemActionText}>Turn on notifications</Text>
        </View>
      </View>
    </View>

    <View style={styles.profileSection}>
      <Text style={styles.sectionTitle}>Support</Text>
      <View style={styles.profileItem}>
        <View style={styles.profileItemContent}>
          <Text style={styles.itemText}>Android guide</Text>
        </View>
      </View>
      <View style={styles.profileItem}>
        <View style={styles.profileItemContent}>
          <Text style={styles.itemText}>Contact support</Text>
        </View>
      </View>
    </View>

    <View style={styles.profileSection}>
      <Text style={styles.sectionTitle}>App</Text>
      <View style={styles.profileItem}>
        <View style={styles.profileItemContent}>
          <Text style={styles.itemText}>Display settings</Text>
        </View>
      </View>
      <View style={styles.profileItem}>
        <View style={styles.profileItemContent}>
          <Text style={styles.itemText}>Language</Text>
        </View>
      </View>
      <View style={styles.profileItem}>
        <View style={styles.profileItemContent}>
          <Text style={styles.itemText}>Privacy policy</Text>
        </View>
      </View>
      <View style={styles.profileItem}>
        <View style={styles.profileItemContent}>
          <Text style={styles.itemText}>Terms of service</Text>
        </View>
      </View>
      <View style={styles.profileItem}>
        <View style={styles.profileItemContent}>
          <Text style={styles.itemText}>Licenses</Text>
        </View>
      </View>
      <View style={styles.profileItem}>
        <View style={styles.profileItemContent}>
          <Text style={styles.itemText}>App version</Text>
          <Text style={styles.itemSubtext}>8.44.5 (8440500)</Text>
        </View>
      </View>
    </View>
  </ScrollView>
);
  const TaskScreen = ({ task, onSave, onBack }: {
    task: Task | null;
    onSave: (task: Omit<Task, 'id' | 'completed'>) => void;
    onBack: () => void;
  }) => {
    const [taskTitle, setTaskTitle] = useState(task?.title || '');
    const [taskProject, setTaskProject] = useState(task?.project || '');
    const [taskDue, setTaskDue] = useState(task?.due || '');
    const [taskCategory, setTaskCategory] = useState(task?.category || '');

    return (
      <View style={styles.taskScreenContainer}>
        <View style={styles.taskScreenHeader}>
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#bb86fc" />
          </TouchableOpacity>
          <Text style={styles.taskScreenTitle}>
            {task ? 'Edit Task' : 'New Task'}
          </Text>
          <TouchableOpacity 
            onPress={() => onSave({
              title: taskTitle,
              project: taskProject,
              due: taskDue,
              category: taskCategory,
              date: new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })
            })}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.taskScreenContent}>
          <TextInput
            style={styles.taskTitleInput}
            placeholder="Task title"
            placeholderTextColor="#aaa"
            value={taskTitle}
            onChangeText={setTaskTitle}
            autoFocus={!task}
          />

          <View style={styles.taskSection}>
            <Text style={styles.sectionLabel}>Project</Text>
            <TextInput
              style={styles.taskInput}
              placeholder="Add project"
              placeholderTextColor="#aaa"
              value={taskProject}
              onChangeText={setTaskProject}
            />
          </View>

          <View style={styles.taskSection}>
            <Text style={styles.sectionLabel}>Due date</Text>
            <TextInput
              style={styles.taskInput}
              placeholder="Add due date"
              placeholderTextColor="#aaa"
              value={taskDue}
              onChangeText={setTaskDue}
            />
          </View>

          <View style={styles.taskSection}>
            <Text style={styles.sectionLabel}>Category</Text>
            <TextInput
              style={styles.taskInput}
              placeholder="Add category"
              placeholderTextColor="#aaa"
              value={taskCategory}
              onChangeText={setTaskCategory}
            />
          </View>

          {task && (
            <TouchableOpacity 
              style={styles.deleteTaskButton}
              onPress={() => {
                deleteTask(task.id);
                onBack();
              }}
            >
              <Text style={styles.deleteTaskButtonText}>Delete Task</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  };

  const TaskItem = ({ task, onPress }: { task: Task; onPress: () => void }) => (
    <TouchableOpacity 
      style={styles.taskItem}
      onPress={onPress}
    >
      <TouchableOpacity 
        onPress={(e) => {
          e.stopPropagation();
          toggleTaskCompletion(task.id);
        }}
        style={styles.taskCheckbox}
      >
        <Ionicons 
          name={task.completed ? "checkbox-outline" : "square-outline"} 
          size={24} 
          color={task.completed ? "#4CAF50" : "#aaa"} 
        />
      </TouchableOpacity>
      <View style={styles.taskDetails}>
        {task.category && (
          <Text style={styles.taskCategoryText}>{task.category}</Text>
        )}
        <Text style={[styles.taskTitleText, task.completed && styles.completedTask]}>
          {task.title}
        </Text>
        {task.project && (
          <Text style={styles.taskProjectText}>{task.project}</Text>
        )}
        {task.date && (
          <Text style={styles.taskDateText}>{task.date}</Text>
        )}
      </View>
      <TouchableOpacity 
        onPress={(e) => {
          e.stopPropagation();
          deleteTask(task.id);
        }}
      >
        <Feather name="trash-2" size={20} color="#ff4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const TasksScreen = () => {
    const categories = [
      { name: 'Recently assigned', count: recentlyAssignedCount },
      { name: 'Do today', count: tasks.filter(t => t.category === 'Do today').length },
      { name: 'Do next week', count: tasks.filter(t => t.category === 'Do next week').length },
      { name: 'Do later', count: tasks.filter(t => t.category === 'Do later').length },
    ];

    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>My tasks</Text>
        {categories.map((category) => (
          <View key={category.name}>
            <View style={styles.taskCategory}>
              <Text style={styles.categoryTitle}>{category.name}</Text>
              <Text style={styles.categoryCount}>{category.count}</Text>
            </View>

            {tasks
              .filter(task => task.category === category.name)
              .map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onPress={() => handleTaskPress(task)} 
                />
              ))}
          </View>
        ))}

        <TouchableOpacity style={styles.addSectionButton}>
          <Text style={styles.addSectionButtonText}>Add a custom section</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.newTaskButton}
          onPress={handleNewTaskPress}
        >
          <Text style={styles.newTaskButtonText}>+ New task</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const ContentTabs = () => (
    <View style={styles.contentTabsContainer}>
      <View style={styles.tabButtonsContainer}>
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeContentTab === 'projects' && styles.activeTabButton
          ]}
          onPress={() => setActiveContentTab('projects')}
        >
          <Text style={[
            styles.tabButtonText,
            activeContentTab === 'projects' && styles.activeTabButtonText
          ]}>
            Projects
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeContentTab === 'goals' && styles.activeTabButton
          ]}
          onPress={() => setActiveContentTab('goals')}
        >
          <Text style={[
            styles.tabButtonText,
            activeContentTab === 'goals' && styles.activeTabButtonText
          ]}>
            Goals
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeContentTab === 'portfolios' && styles.activeTabButton
          ]}
          onPress={() => setActiveContentTab('portfolios')}
        >
          <Text style={[
            styles.tabButtonText,
            activeContentTab === 'portfolios' && styles.activeTabButtonText
          ]}>
            Portfolios
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabContent}>
        {activeContentTab === 'projects' && (
          <View>
            {projects.map(project => (
              <TouchableOpacity key={project.id} style={styles.projectCard}>
                <View style={styles.projectHeader}>
                  <Text style={styles.projectTitle}>{project.name}</Text>
                  <Text style={styles.projectMembers}>{project.members} members</Text>
                </View>
                {renderProgressBar(project.progress)}
                <Text style={styles.progressText}>{project.progress}% complete</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        {activeContentTab === 'goals' && (
          <View>
            {goals.map(goal => (
              <TouchableOpacity key={goal.id} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.goalDeadline}>{goal.deadline}</Text>
                </View>
                {renderProgressBar(goal.progress)}
                <Text style={styles.progressText}>{goal.progress}% complete</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        {activeContentTab === 'portfolios' && (
          <View>
            {portfolios.map(portfolio => (
              <TouchableOpacity key={portfolio.id} style={styles.portfolioCard}>
                <View style={styles.portfolioHeader}>
                  <Text style={styles.portfolioTitle}>{portfolio.title}</Text>
                  <Text style={styles.portfolioItems}>{portfolio.items} items</Text>
                </View>
                <Text style={styles.portfolioUpdated}>Updated {portfolio.lastUpdated}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  const MainContent = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.greeting}>{greeting}, Tagoe Shadrach</Text>
      
      <View style={styles.section}>
        <ContentTabs />
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Tasks</Text>
          <TouchableOpacity onPress={() => navigateToTab('tasks')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        
        {tasks.slice(0, 3).map(task => (
          <TaskItem 
            key={task.id} 
            task={task} 
            onPress={() => handleTaskPress(task)} 
          />
        ))}
      </View>
    </ScrollView>
  );

  const TabBar = () => (
    <View style={styles.tabBar}>
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => navigateToTab('home')}
      >
        <Feather 
          name="home" 
          size={24} 
          color={activeTab === 'home' ? '#bb86fc' : '#aaa'} 
        />
        <Text style={styles.tabLabel}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => navigateToTab('tasks')}
      >
        <MaterialIcons 
          name="check-box" 
          size={24} 
          color={activeTab === 'tasks' ? '#bb86fc' : '#aaa'} 
        />
        <Text style={styles.tabLabel}>Tasks</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={handleSearchPress}
      >
        <Feather 
          name="search" 
          size={24} 
          color={activeTab === 'search' ? '#bb86fc' : '#aaa'} 
        />
        <Text style={styles.tabLabel}>Search</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={handleInboxPress}
      >
        <Ionicons 
          name="notifications-outline" 
          size={24} 
          color={activeTab === 'notifications' ? '#bb86fc' : '#aaa'} 
        />
        <Text style={styles.tabLabel}>Alerts</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => navigateToTab('profile')}
      >
        <FontAwesome 
          name="user-circle-o" 
          size={24} 
          color={activeTab === 'profile' ? '#bb86fc' : '#aaa'} 
        />
        <Text style={styles.tabLabel}>Profile</Text>
      </TouchableOpacity>
    </View>
  );

return (
    <View style={styles.container}>
      {showSearch ? (
        <SearchScreen />
      ) : showInbox ? (
        <InboxScreen />
      ) : showTaskScreen ? (
        <TaskScreen 
          task={selectedTask} 
          onSave={handleSaveTask} 
          onBack={handleBackFromTask} 
        />
      ) : activeTab === 'tasks' ? (
        <TasksScreen />
      ) : activeTab === 'profile' ? (
        <ProfileScreen />
      ) : (
        <MainContent />
      )}

      {!showTaskScreen && <TabBar />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 10,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#aaa',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
    textTransform: 'uppercase',
    textAlign: 'left',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAll: {
    color: '#bb86fc',
    fontWeight: '600',
  },
  contentTabsContainer: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tabButtonsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tabButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#bb86fc',
  },
  tabButtonText: {
    color: '#aaa',
    fontWeight: '600',
  },
  activeTabButtonText: {
    color: '#bb86fc',
  },
  tabContent: {
    padding: 16,
  },
  projectCard: {
    backgroundColor: '#252525',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  projectMembers: {
    fontSize: 14,
    color: '#aaa',
  },
  goalCard: {
    backgroundColor: '#252525',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  goalDeadline: {
    fontSize: 14,
    color: '#aaa',
  },
  portfolioCard: {
    backgroundColor: '#252525',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  portfolioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  portfolioItems: {
    fontSize: 14,
    color: '#aaa',
  },
  portfolioUpdated: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    marginVertical: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#bb86fc',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'right',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  taskCheckbox: {
    marginRight: 12,
  },
  taskDetails: {
    flex: 1,
    marginRight: 12,
  },
  taskCategoryText: {
    fontSize: 12,
    color: '#bb86fc',
    marginBottom: 4,
  },
  taskTitleText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  taskProjectText: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 4,
  },
  taskDateText: {
    fontSize: 12,
    color: '#aaa',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  taskCategory: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  categoryCount: {
    fontSize: 16,
    color: '#aaa',
  },
  addSectionButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  addSectionButtonText: {
    color: '#bb86fc',
    fontWeight: 'bold',
  },
  newTaskButton: {
    backgroundColor: '#bb86fc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  newTaskButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  searchContainer: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 16,
    paddingBottom: 80,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    marginLeft: 10,
    fontSize: 16,
  },
  searchContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchPlaceholder: {
    color: '#aaa',
    fontSize: 16,
  },
  inboxContainer: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 16,
    paddingBottom: 80,
  },
  inboxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  inboxTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 16,
  },
  inboxContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  inboxMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  inboxMessageText: {
    flex: 1,
    color: '#fff',
    marginLeft: 12,
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: '#bb86fc',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  retryButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  taskScreenContainer: {
    flex: 1,
    backgroundColor: '#121212',
    paddingBottom: 80,
  },
  taskScreenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  taskScreenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  saveButtonText: {
    color: '#bb86fc',
    fontWeight: 'bold',
    fontSize: 16,
  },
  taskScreenContent: {
    padding: 16,
  },
  taskTitleInput: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    marginBottom: 24,
  },
  taskSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 8,
  },
  taskInput: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
  },
  deleteTaskButton: {
    backgroundColor: '#ff4444',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  deleteTaskButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#1e1e1e',
    borderTopWidth: 1,
    borderTopColor: '#333',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    alignItems: 'center',
    padding: 8,
  },
  tabLabel: {
    fontSize: 10,
    color: '#aaa',
    marginTop: 4,
  },
  profileContainer: {
    flex: 1,
    backgroundColor: '#121212',
    paddingBottom: 80,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  profileAvatar: {
    marginBottom: 15,
  },
  profileTextContainer: {  // Add this missing style
    alignItems: 'center',
  },
  profileItemContent: {  // Add this missing style
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textAlign:'center',
  },
  profileEmail: {
    fontSize: 16,
    color: '#aaa',
    textAlign:'center',
  },
  profileSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingVertical: 10,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  itemText: {
    fontSize: 16,
    color: '#fff',
    textAlign:'left',
  },
  itemSubtext: {
  fontSize: 14,
  color: '#aaa',
  textAlign: 'left',
  marginTop: 4,
},
 itemActionText: {
  fontSize: 14,
  color: '#bb86fc',
  textAlign: 'left',
  marginTop: 4,
},
});

export default HomeScreen;