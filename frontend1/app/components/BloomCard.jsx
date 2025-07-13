import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { useProjectContext } from '../context/ProjectContext';
import { useUser } from '../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const glowColors = {
  Projects: '#b3e5fc',
  Tasks: '#ffe082',
  Goals: '#c8e6c9',
  Dashboard: '#d1c4e9',
  Create: '#ffd6e0',
  Default: '#e0e7ff',
};

const BloomCard = ({
  title,
  subtitle,
  iconName,
  iconColor = '#00bfae',
  onPress,
}) => {
  // Fetch data from context and AsyncStorage
  const { projects } = useProjectContext ? useProjectContext() : { projects: [] };
  const { profile } = useUser ? useUser() : { profile: {} };
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const [tasksRaw, goalsRaw] = await Promise.all([
          AsyncStorage.getItem('asana_tasks'),
          AsyncStorage.getItem('asana_goals'),
        ]);
        if (mounted) {
          setTasks(tasksRaw ? JSON.parse(tasksRaw) : []);
          setGoals(goalsRaw ? JSON.parse(goalsRaw) : []);
        }
      } catch {
        if (mounted) {
          setTasks([]);
          setGoals([]);
        }
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, []);

  // Counting logic for each card type
  let completed = 0, overdue = 0, due = 0;
  if (title === 'Projects') {
    completed = projects.filter((p) => p.status === 'Done').length;
    due = projects.filter((p) => p.status !== 'Done').length;
  } else if (title === 'Tasks') {
    completed = tasks.filter((t) => t.status === 'Done').length;
    overdue = tasks.filter((t) => t.status === 'Overdue').length;
    due = tasks.filter((t) => t.status !== 'Done').length;
  } else if (title === 'Goals') {
    completed = goals.filter((g) => g.status === 'Done').length;
    due = goals.filter((g) => g.status !== 'Done').length;
  }

  const cardColors = {
    Projects: '#e3f2fd', // light blue
    Tasks: '#fff8e1',    // light yellow
    Goals: '#e8f5e9',    // light green
    Dashboard: '#ede7f6',// light purple
    Create: '#ffebee',   // light pink
    Default: '#f3f4f6',  // fallback gray
  };

  // Card glow color
  const glow = glowColors[title] || glowColors.Default;
  const cardBg = cardColors[title] || cardColors.Default;

  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, { shadowColor: glow, borderColor: glow, backgroundColor: cardBg }]} activeOpacity={0.9}>
      {/* Header */}
      <View style={styles.rowTop}>
        <View style={[styles.iconWrap, { backgroundColor: glow, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}> 
          <Text style={{
            fontSize: 22,
            fontWeight: 'bold',
            color: iconColor,
            textTransform: 'uppercase',
            marginRight: 4,
          }}>
            {title && title[0]}
          </Text>
        </View>
        <View style={styles.titleCol}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCol}>
          <FontAwesome name="check-circle" size={16} color="#4caf50" style={styles.statIcon} />
          <Text style={styles.statLabel}>Completed</Text>
          <Text style={styles.statValue}>{completed}</Text>
        </View>
        <View style={styles.statCol}>
          <FontAwesome name="exclamation-circle" size={16} color="#f57c00" style={styles.statIcon} />
          <Text style={styles.statLabel}>Overdue</Text>
          <Text style={styles.statValue}>{overdue}</Text>
        </View>
        <View style={styles.statCol}>
          <FontAwesome name="calendar" size={16} color="#668cff" style={styles.statIcon} />
          <Text style={styles.statLabel}>Due</Text>
          <Text style={styles.statValue}>{due}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BloomCard;

const styles = StyleSheet.create({
  card: {
    alignSelf: 'center',
    borderRadius: 20,
    padding: 20,
    marginVertical: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
    width: screenWidth - 32,
    borderWidth: 2,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  titleCol: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 15,
    color: '#555',
    marginBottom: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 2,
  },
  statIcon: {
    marginBottom: 2,
  },
});
