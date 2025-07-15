import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

// Define types for project and context
interface Project {
  id: string;
  name: string;
  status?: string;
  description?: string;
  owner?: string;
  assignee?: string;
}

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  error: string | null;
  streaks: number;
  lastStreakDate: string | null;
  fetchProjects: () => void;
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  updateStreaks: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProjectContext must be used within a ProjectProvider');
  return context;
};

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streaks, setStreaks] = useState(0);
  const [lastStreakDate, setLastStreakDate] = useState<string | null>(null);
  const STREAKS_KEY = 'asana_project_streaks';
  const LAST_STREAK_DATE_KEY = 'asana_last_streak_date';

  // Example API endpoint (replace with a suitable free API if needed)
  const API_URL = 'https://64a6e4e7096b3f0fcc80e6e2.mockapi.io/api/v1/projects';

  // Load streaks from AsyncStorage
  useEffect(() => {
    (async () => {
      const streakVal = await AsyncStorage.getItem(STREAKS_KEY);
      const lastDate = await AsyncStorage.getItem(LAST_STREAK_DATE_KEY);
      if (streakVal) setStreaks(Number(streakVal));
      if (lastDate) setLastStreakDate(lastDate);
    })();
  }, []);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setProjects(response.data);
    } catch (err: any) {
      // Fallback demo data if API fails
      setProjects([
        { id: '1', name: 'Demo Project', status: 'Active', description: 'Demo description', owner: 'Demo Owner', assignee: 'James' },
        { id: '2', name: 'Sample Project', status: 'Planning', description: 'Sample description', owner: 'Sample Owner', assignee: 'Sarah' }
      ]);
      setError('Could not fetch from API, showing demo data.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addProject = useCallback(async (project: Omit<Project, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(API_URL, project);
      if (response.data && response.data.id) {
        setProjects(prev => [...prev, response.data]);
      } else {
        // fallback: fetch all
        await fetchProjects();
      }
    } catch (err: any) {
      setError(err.message || 'Error adding project');
      // fallback: add locally for demo
      setProjects(prev => [...prev, { ...project, id: (Date.now() + Math.random()).toString() }]);
    } finally {
      setLoading(false);
    }
  }, [fetchProjects]);

  const updateProject = useCallback(async (id: string, updates: Partial<Project>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${API_URL}/${id}`, updates);
      if (response.data && response.data.id) {
        setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      } else {
        await fetchProjects();
      }
    } catch (err: any) {
      setError(err.message || 'Error updating project');
      // fallback: update locally for demo
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    } finally {
      setLoading(false);
    }
  }, [fetchProjects]);

  const deleteProject = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/${id}`);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error deleting project');
      // fallback: delete locally for demo
      setProjects(prev => prev.filter(p => p.id !== id));
    } finally {
      setLoading(false);
    }
  }, [fetchProjects]);

  // Update streaks if a project is marked as 'Done' today
  const updateStreaks = useCallback(async () => {
    const today = new Date().toISOString().slice(0, 10);
    if (lastStreakDate === today) return; // Already counted today
    // Check if any project was marked as 'Done' today
    const doneToday = projects.some(p => p.status === 'Done');
    if (doneToday) {
      let newStreak = streaks;
      if (lastStreakDate) {
        const prev = new Date(lastStreakDate);
        const diff = (new Date(today).getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
        if (diff === 1) newStreak += 1;
        else if (diff > 1) newStreak = 1;
      } else {
        newStreak = 1;
      }
      setStreaks(newStreak);
      setLastStreakDate(today);
      await AsyncStorage.setItem(STREAKS_KEY, String(newStreak));
      await AsyncStorage.setItem(LAST_STREAK_DATE_KEY, today);
    }
  }, [projects, lastStreakDate, streaks]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <ProjectContext.Provider value={{ projects, loading, error, streaks, lastStreakDate, fetchProjects, addProject, updateProject, deleteProject, updateStreaks }}>
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectProvider;
