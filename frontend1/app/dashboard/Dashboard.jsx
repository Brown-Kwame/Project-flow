import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useProjectContext } from '../context/ProjectContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';

const screenWidth = Dimensions.get('window').width;

const Dashboard = () => {
  const { projects } = useProjectContext();
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const { colorScheme } = useColorScheme();

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

  const projectStats = useMemo(() => ({
    total: projects.length,
    active: projects.filter(p => p.status === 'Active').length,
    planning: projects.filter(p => p.status === 'Planning').length,
    done: projects.filter(p => p.status === 'Done').length,
    hold: projects.filter(p => p.status === 'On Hold').length,
  }), [projects]);

  const chartConfig = useMemo(() => ({
    backgroundGradientFrom: colorScheme === 'dark' ? '#1f2937' : '#f7faff',
    backgroundGradientTo: colorScheme === 'dark' ? '#1f2937' : '#f7faff',
    color: (opacity = 1) => `rgba(102, 140, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(${colorScheme === 'dark' ? '255,255,255' : '34,34,34'}, ${opacity})`,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#668cff',
    },
  }), [colorScheme]);

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900 px-4 py-4">
      <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">📊 Dashboard</Text>

      <View className="flex-row flex-wrap justify-between mb-4">
        <StatCard label="Total Projects" value={projectStats.total} color="border-l-[#668cff]" />
        <StatCard label="Active" value={projectStats.active} color="border-l-[#00c851]" />
        <StatCard label="Planning" value={projectStats.planning} color="border-l-[#ffbb33]" />
        <StatCard label="Done" value={projectStats.done} color="border-l-[#33b5e5]" />
      </View>

      <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-6 shadow">
        <Text className="text-lg font-bold text-gray-800 dark:text-white mb-3">Activity Trend</Text>
        <LineChart
          style={{ borderRadius: 16 }}
          data={{
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              data: [5, 8, 6, 10, 12, 9],
              color: () => '#668cff',
              strokeWidth: 2,
            }],
          }}
          width={screenWidth - 32}
          height={180}
          chartConfig={chartConfig}
          bezier
        />
      </View>

      <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-6 shadow">
        <Text className="text-lg font-bold text-gray-800 dark:text-white mb-3">Status Overview</Text>
        <BarChart
          style={{ borderRadius: 16 }}
          data={{
            labels: ['Active', 'Planning', 'Done', 'Hold'],
            datasets: [{
              data: [projectStats.active, projectStats.planning, projectStats.done, projectStats.hold],
              colors: [
                (opacity = 1) => `rgba(0,200,81,${opacity})`,
                (opacity = 1) => `rgba(255,187,51,${opacity})`,
                (opacity = 1) => `rgba(51,181,229,${opacity})`,
                (opacity = 1) => `rgba(255,68,68,${opacity})`,
              ],
            }],
          }}
          width={screenWidth - 32}
          height={180}
          chartConfig={chartConfig}
          fromZero
          withCustomBarColorFromData={true}
          showBarTops={true}
          segments={4}
        />
      </View>

      <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-6 shadow">
        <Text className="text-lg font-bold text-gray-800 dark:text-white mb-3">Distribution</Text>
        <PieChart
          data={[
            { name: 'Active', population: projectStats.active, color: '#00c851', legendFontColor: '#fff', legendFontSize: 14 },
            { name: 'Planning', population: projectStats.planning, color: '#ffbb33', legendFontColor: '#fff', legendFontSize: 14 },
            { name: 'Done', population: projectStats.done, color: '#33b5e5', legendFontColor: '#fff', legendFontSize: 14 },
            { name: 'Hold', population: projectStats.hold, color: '#ff4444', legendFontColor: '#fff', legendFontSize: 14 },
          ].filter(d => d.population > 0)}
          width={screenWidth - 32}
          height={180}
          chartConfig={chartConfig}
          accessor={'population'}
          backgroundColor={'transparent'}
          paddingLeft={'15'}
          absolute
        />
      </View>
    </ScrollView>
  );
};

const StatCard = ({ label, value, color }) => (
  <View className={`bg-white dark:bg-gray-800 rounded-xl w-[48%] p-4 mb-3 border-l-4 shadow ${color}`}>
    <Text className="text-xl font-bold text-gray-800 dark:text-white">{value}</Text>
    <Text className="text-sm text-gray-500 dark:text-gray-300 mt-1">{label}</Text>
  </View>
);

export default Dashboard;
