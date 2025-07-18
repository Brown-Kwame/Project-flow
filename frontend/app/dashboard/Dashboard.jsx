import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, processColor } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useProjectContext } from '../context/ProjectContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

const Dashboard = () => {
  const { projects, loading } = useProjectContext();
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

  const projectStats = useMemo(() => ({
    total: projects.length,
    active: projects.filter(p => p.status === 'Active').length,
    planning: projects.filter(p => p.status === 'Planning').length,
    done: projects.filter(p => p.status === 'Done').length,
    hold: projects.filter(p => p.status === 'On Hold').length,
  }), [projects]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>📊 Dashboard</Text>
      {/* Project Summary Stats */}
      <View style={styles.row}>
        <StatCard label="Total Projects" value={projectStats.total} color="#668cff" />
        <StatCard label="Active" value={projectStats.active} color="#00c851" />
        <StatCard label="Planning" value={projectStats.planning} color="#ffbb33" />
        <StatCard label="Done" value={projectStats.done} color="#33b5e5" />
      </View>
      {/* Line Chart */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Activity Trend</Text>
        <LineChart
          style={styles.chart}
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
      {/* Bar Chart */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Status Overview</Text>
        <BarChart
          style={styles.chart}
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
          yAxisLabel={''}
          yAxisSuffix={''}
          flatColor={false}
          withCustomBarColorFromData={true}
          showBarTops={true}
          segments={4}
        />
      </View>
      {/* Pie Chart */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Distribution</Text>
        <PieChart
          style={styles.pieChart}
          data={[
            { name: 'Active', population: projectStats.active, color: '#00c851', legendFontColor: '#222', legendFontSize: 14 },
            { name: 'Planning', population: projectStats.planning, color: '#ffbb33', legendFontColor: '#222', legendFontSize: 14 },
            { name: 'Done', population: projectStats.done, color: '#33b5e5', legendFontColor: '#222', legendFontSize: 14 },
            { name: 'Hold', population: projectStats.hold, color: '#ff4444', legendFontColor: '#222', legendFontSize: 14 },
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
  <View style={[styles.statCard, { borderLeftColor: color }]}> 
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const chartConfig = {
  backgroundGradientFrom: '#f7faff',
  backgroundGradientTo: '#f7faff',
  color: (opacity = 1) => `rgba(102, 140, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(34, 34, 34, ${opacity})`,
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#668cff',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fc',
    padding: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '48%',
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 5,
    elevation: 3,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 12,
  },
  chart: {
    height: 220,
    width: '100%',
  },
  pieChart: {
    height: 250,
    width: '100%',
  },
});

export default Dashboard;
