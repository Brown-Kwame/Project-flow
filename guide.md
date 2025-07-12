import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-charts-wrapper';
import { useProjectContext } from '../context/ProjectContext';

const screenWidth = Dimensions.get('window').width;

const Dashboard = () => {
  const { projects, loading } = useProjectContext();

  const projectStats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'Active').length,
    planning: projects.filter(p => p.status === 'Planning').length,
    done: projects.filter(p => p.status === 'Done').length,
    hold: projects.filter(p => p.status === 'On Hold').length,
  };

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
            dataSets: [{
              values: [5, 8, 6, 10, 12, 9],
              label: 'Activity',
              config: {
                color: processColor('#668cff'),
                drawCircles: true,
                lineWidth: 2,
              },
            }],
          }}
          chartDescription={{ text: '' }}
          xAxis={{ valueFormatter: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], position: 'BOTTOM' }}
          yAxis={{ left: { drawGridLines: false } }}
          legend={{ enabled: false }}
        />
      </View>

      {/* Bar Chart */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Status Overview</Text>
        <BarChart
          style={styles.chart}
          data={{
            dataSets: [{
              values: [projectStats.active, projectStats.planning, projectStats.done, projectStats.hold],
              label: 'Projects',
              config: {
                colors: [
                  processColor('#00c851'),
                  processColor('#ffbb33'),
                  processColor('#33b5e5'),
                  processColor('#ff4444'),
                ],
              },
            }],
            config: {
              barWidth: 0.5,
            },
          }}
          xAxis={{
            valueFormatter: ['Active', 'Planning', 'Done', 'Hold'],
            granularityEnabled: true,
            granularity: 1,
            position: 'BOTTOM',
          }}
          legend={{ enabled: false }}
          chartDescription={{ text: '' }}
          yAxis={{ left: { drawGridLines: false } }}
        />
      </View>

      {/* Pie Chart */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Distribution</Text>
        <PieChart
          style={styles.pieChart}
          data={{
            dataSets: [{
              values: [
                { value: projectStats.active, label: 'Active' },
                { value: projectStats.planning, label: 'Planning' },
                { value: projectStats.done, label: 'Done' },
                { value: projectStats.hold, label: 'On Hold' },
              ],
              label: '',
              config: {
                colors: [
                  processColor('#00c851'),
                  processColor('#ffbb33'),
                  processColor('#33b5e5'),
                  processColor('#ff4444'),
                ],
                valueTextSize: 12,
                valueTextColor: processColor('#333'),
                sliceSpace: 4,
                selectionShift: 13,
              },
            }],
          }}
          legend={{
            enabled: true,
            textSize: 12,
            form: 'CIRCLE',
            horizontalAlignment: 'CENTER',
          }}
          chartDescription={{ text: '' }}
        />
      </View>
    </ScrollView>
  );
};

// Individual stat card
const StatCard = ({ label, value, color }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const processColor = (color) => {
  const { processColor } = require('react-native');
  return processColor(color);
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