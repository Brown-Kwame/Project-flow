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

const CARD_COLORS = [
  { bg: '#f7faff', iconBg: '#668cff22', icon: '#668cff' },
  { bg: '#fff7f0', iconBg: '#ffb34722', icon: '#ffb347' },
  { bg: '#f0f7ff', iconBg: '#e600ac22', icon: '#e600ac' },
  { bg: '#f7fff7', iconBg: '#4caf5022', icon: '#4caf50' },
  { bg: '#fff0f7', iconBg: '#f20d6922', icon: '#f20d69' },
  { bg: '#f0f0ff', iconBg: '#b3000022', icon: '#b30000' },
  { bg: '#f0fff7', iconBg: '#00bfae22', icon: '#00bfae' },
];

const cardData = [
  {
    title: 'Projects',
    subtitle: 'Manage all your projects',
    icon: 'group',
    color: CARD_COLORS[0],
    link: '/projects/Projects',
  },
  {
    title: 'Tasks',
    subtitle: 'View and update your tasks',
    icon: 'check-square',
    color: CARD_COLORS[1],
    link: '/tasks/Tasks',
  },
  {
    title: 'Dashboard',
    subtitle: 'Analytics & progress',
    icon: 'line-chart',
    color: CARD_COLORS[2],
    link: '/dashboard/Dashboard',
  },
  {
    title: 'Goals',
    subtitle: 'Set and track goals',
    icon: 'flag',
    color: CARD_COLORS[3],
    link: '/Goals/Goals',
  },
  {
    title: 'Billing',
    subtitle: 'Manage your plan',
    icon: 'money',
    color: CARD_COLORS[4],
    link: '/(auth)/Billing',
  },
  {
    title: 'Inbox',
    subtitle: 'Team chat & comments',
    icon: 'inbox',
    color: CARD_COLORS[5],
    link: '/inbox/Inbox',
  },
  {
    title: 'Create',
    subtitle: 'Add new project or task',
    icon: 'plus',
    color: CARD_COLORS[6],
    link: '/creator/Create',
  },
];

const Index = () => {
  const router = useRouter();

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

  const numColumns = Dimensions.get('window').width > 600 ? 3 : 2;
  const rows = [];
  for (let i = 0; i < cardData.length; i += numColumns) {
    rows.push(cardData.slice(i, i + numColumns));
  }

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
            <Text style={styles.heading}>Pro Team</Text>
          </View>

          <View style={styles.grid}>
            {rows.map((row, i) => (
              <View style={styles.row} key={i}>
                {row.map((card) => (
                  <Link href={card.link as any} asChild key={card.title}>
                    <HomeCard
                      title={card.title}
                      subtitle={card.subtitle}
                      icon={card.icon}
                      color={card.color}
                      onPress={() => router.push(card.link as any)}
                    />
                  </Link>
                ))}
              </View>
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
