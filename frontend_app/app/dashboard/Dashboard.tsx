import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import { useProjectContext } from '../context/ProjectContext';

const screenWidth = Dimensions.get('window').width;

const Dashboard = () => {
  const { projects, loading } = useProjectContext();

  // Example chart data (replace with real analytics if available)
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [5, 8, 6, 10, 12, 9],
        color: () => '#668cff',
        strokeWidth: 2,
      },
    ],
  };

  const barData = {
    labels: ['Active', 'Planning', 'Done', 'On Hold'],
    datasets: [
      {
        data: [
          projects.filter((p) => p.status === 'Active').length,
          projects.filter((p) => p.status === 'Planning').length,
          projects.filter((p) => p.status === 'Done').length,
          projects.filter((p) => p.status === 'On Hold').length,
        ],
      },
    ],
  };

  const pieData = [
    {
      name: 'Active',
      count: projects.filter((p) => p.status === 'Active').length,
      color: '#668cff',
      legendFontColor: '#222',
      legendFontSize: 14,
    },
    {
      name: 'Planning',
      count: projects.filter((p) => p.status === 'Planning').length,
      color: '#ffb347',
      legendFontColor: '#222',
      legendFontSize: 14,
    },
    {
      name: 'Done',
      count: projects.filter((p) => p.status === 'Done').length,
      color: '#4caf50',
      legendFontColor: '#222',
      legendFontSize: 14,
    },
    {
      name: 'On Hold',
      count: projects.filter((p) => p.status === 'On Hold').length,
      color: '#f57c00',
      legendFontColor: '#222',
      legendFontSize: 14,
    },
  ].filter((d) => d.count > 0);

  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Dashboard</Text>
      {/* Removed banner image for a cleaner, modern dashboard */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Overview</Text>
        <Text style={styles.stat}>{projects.length}</Text>
        <Text style={styles.statLabel}>Total Projects</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity (Demo)</Text>
        <LineChart
          data={chartData}
          width={screenWidth - 32}
          height={180}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          onDataPointClick={(data: { value: number }) => setSelectedValue(data.value)}
        />
        {selectedValue !== null && (
          <Text style={styles.selectedValue}>Selected: {selectedValue}</Text>
        )}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Status Distribution</Text>
        <BarChart
          data={{
            labels: barData.labels,
            datasets: [
              {
                data: barData.datasets[0].data,
                colors: [
                  (opacity = 1) => `rgba(51, 102, 255, ${opacity})`, // Active - vivid blue
                  (opacity = 1) => `rgba(255, 153, 0, ${opacity})`,  // Planning - vivid orange
                  (opacity = 1) => `rgba(56, 203, 93, ${opacity})`,  // Done - vivid green
                  (opacity = 1) => `rgba(255, 87, 34, ${opacity})`,  // On Hold - vivid orange-red
                ],
              },
            ],
          }}
          width={screenWidth - 32}
          height={180}
          chartConfig={chartConfig}
          style={styles.chart}
          fromZero
          yAxisLabel={''}
          yAxisSuffix={''}
          flatColor={false}
          withCustomBarColorFromData={true}
          showBarTops={true}
          segments={4}
          propsForBars={{
            strokeWidth: 4,
            stroke: 'url(#barGlowGradient)',
            // fallback for each bar, will be overridden by custom SVG gradient below
          }}
          renderBar={({ x, y, width, height, index, value }) => {
            // Custom rendering for each bar to add a glow effect
            const barColors = [
              '#3366ff', // Active
              '#ff9900', // Planning
              '#38cb5d', // Done
              '#ff5722', // On Hold
            ];
            const glowColors = [
              'rgba(51,102,255,0.45)',
              'rgba(255,153,0,0.45)',
              'rgba(56,203,93,0.45)',
              'rgba(255,87,34,0.45)',
            ];
            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={barColors[index]}
                  stroke={glowColors[index]}
                  strokeWidth={8}
                  rx={6}
                  style={{ filter: 'drop-shadow(0 0 8px ' + glowColors[index] + ')' }}
                />
              </g>
            );
          }}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Status Pie</Text>
        <PieChart
          data={pieData.map((d) => ({
            name: d.name,
            population: d.count,
            color: d.color,
            legendFontColor: d.legendFontColor,
            legendFontSize: d.legendFontSize,
          }))}
          width={screenWidth - 32}
          height={180}
          chartConfig={chartConfig}
          accessor={'population'}
          backgroundColor={'transparent'}
          paddingLeft={'15'}
          absolute
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Projects</Text>
        {projects.slice(0, 3).map((project) => (
          <View key={project.id} style={styles.projectCard}>
            <Text style={styles.projectName}>{project.name}</Text>
            <Text style={{ fontSize: 14, color: '#668cff' }}>{project.status}</Text>
          </View>
        ))}
        {loading && <Text style={{ color: '#888', marginTop: 8 }}>Loading...</Text>}
      </View>
    </ScrollView>
  );
};

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
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 40,
    marginBottom: 16,
  },
  section: {
    backgroundColor: '#f7faff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#668cff',
    marginBottom: 8,
  },
  stat: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 16,
    color: '#888',
  },
  chart: {
    marginTop: 8,
    borderRadius: 12,
  },
  selectedValue: {
    color: '#668cff',
    fontWeight: 'bold',
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
  },
  projectCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
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
  },
  projectStatus: {
    fontSize: 14,
    color: '#668cff',
  },
  loading: {
    color: '#888',
    marginTop: 8,
  },
});

export default Dashboard;
