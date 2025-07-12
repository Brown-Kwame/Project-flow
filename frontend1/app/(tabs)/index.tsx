import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, useRouter } from 'expo-router';
import React, { useRef, useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Easing,
} from 'react-native';
import HomeCard from '../components/HomeCard';
import { useProjectContext } from '../context/ProjectContext';
import { useUser } from '../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BloomCard from '../components/BloomCard';

const CARD_COLORS = [
  { bg: '#f7faff', iconBg: '#668cff22', icon: '#668cff' },
  { bg: '#fff7f0', iconBg: '#ffb34722', icon: '#ffb347' },
  { bg: '#f0f7ff', iconBg: '#e600ac22', icon: '#e600ac' },
  { bg: '#f7fff7', iconBg: '#4caf5022', icon: '#4caf50' },
  { bg: '#fff0f7', iconBg: '#f20d6922', icon: '#f20d69' },
  { bg: '#f0f0ff', iconBg: '#b3000022', icon: '#b30000' },
  { bg: '#f0fff7', iconBg: '#00bfae22', icon: '#00bfae' },
];

const Index = () => {
  const router = useRouter();
  const { projects, streaks } = useProjectContext ? useProjectContext() : { projects: [], streaks: 0 };
  const { profile } = useUser ? useUser() : { profile: {} };
  type Task = { status?: string; [key: string]: any };
  const [tasks, setTasks] = useState<Task[]>([]);
  type Goal = { status?: string; [key: string]: any };
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
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
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, []);

  // Memoized summaries for performance
  const projectSummary = React.useMemo(() => {
    if (!projects) return 'No projects found.';
    return `${projects.length} projects, ${streaks} day streak`;
  }, [projects, streaks]);

  const taskSummary = React.useMemo(() => {
    if (!Array.isArray(tasks) || tasks.length === 0) return null;
    const done = tasks.filter((t) => t && t.status === 'Done').length;
    const overdue = tasks.filter((t) => t && t.status === 'Overdue').length;
    const due = tasks.filter((t) => t && t.status !== 'Done').length;
    return { total: tasks.length, done, overdue, due };
  }, [tasks]);

  const goalSummary = React.useMemo(() => {
    if (!Array.isArray(goals) || goals.length === 0) return null;
    const done = goals.filter((g) => g && g.status === 'Done').length;
    const due = goals.filter((g) => g && g.status !== 'Done').length;
    return { total: goals.length, done, due };
  }, [goals]);

  const dashboardSummary = React.useMemo(() => {
    return `Analytics for ${projects.length} projects. See trends, status, and more.`;
  }, [projects]);

  // Card data for each summary
  const bloomCards = [
    {
      title: 'Projects',
      subtitle: 'All your projects at a glance',
      iconName: 'group',
      onPress: () => router.push('/projects/Projects'),
    },
    {
      title: 'Tasks',
      subtitle: 'Your actionable items',
      iconName: 'check-square',
      onPress: () => router.push('/tasks/Tasks'),
    },
    {
      title: 'Dashboard',
      subtitle: 'Analytics & progress',
      iconName: 'line-chart',
      onPress: () => router.push('/dashboard/Dashboard'),
    },
    {
      title: 'Goals',
      subtitle: 'Set and track goals',
      iconName: 'flag',
      onPress: () => router.push('/Goals/Goals'),
    },
  ];

  // Animation states
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const headings = ["Start Something Great", "Let's get that project done."];
  const [displayedHeading, setDisplayedHeading] = useState('');
  const [headingIndex, setHeadingIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const current = headings[headingIndex];
    // Faster typing and deleting, longer pause at end
    const typingSpeed = 30;
    const deletingSpeed = 15;
    const pauseEnd = 600;
    const pauseSwitch = 200;
    if (!isDeleting && charIndex < current.length) {
      timeout = setTimeout(() => {
        setDisplayedHeading(current.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, typingSpeed);
    } else if (!isDeleting && charIndex === current.length) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseEnd);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplayedHeading(current.slice(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      }, deletingSpeed);
    } else if (isDeleting && charIndex === 0) {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setHeadingIndex((headingIndex + 1) % headings.length);
      }, pauseSwitch);
    }
    return () => {
      if (timeout !== undefined) clearTimeout(timeout);
    };
  }, [charIndex, isDeleting, headingIndex]);

  return (
    <View style={styles.container1}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Animated.View
          style={[
            styles.container2,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
            <Image
              source={require('../../assets/images/Icon.png')}
              style={{ width: 32, height: 32, marginRight: 12 }}
            />
            <Text style={styles.heading}>{displayedHeading}<Text style={{color:'#668cff'}}>|</Text></Text>
          </View>

          {/* Professional summary cards */}
          <View style={{ width: '100%', alignItems: 'center', marginBottom: 24 }}>
            {bloomCards.map((card) => (
              <BloomCard key={card.title} {...card} />
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: '#f7faff',
  },
  container2: {
    flex: 1,
    backgroundColor: 'transparent',
    marginTop: 50,
    marginLeft: 20,
    marginRight: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 16,
  },
  grid: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
});
