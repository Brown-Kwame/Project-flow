import React from 'react'
import { Image, ScrollView, Text, View, TouchableOpacity } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';

const Mainindex = () => {
  const router = useRouter();
  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', padding: 16 }}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/Inbox')} style={{ backgroundColor: '#f5f5f5', borderRadius: 24, padding: 8, elevation: 2 }}>
          <FontAwesome name="bell" size={32} color="#668cff" />
        </TouchableOpacity>
      </View>
      <Image source={require('../../assets/images/home2.webp')} style={{ width: '100%', height: 200, borderRadius: 16, marginBottom: 24 }} resizeMode="cover" />
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/Inbox')} style={{ backgroundColor: '#f5f5f5', borderRadius: 32, padding: 16, elevation: 4 }}>
          <FontAwesome name="bell" size={48} color="#668cff" />
        </TouchableOpacity>
        <Text style={{ marginTop: 8, fontSize: 16, color: '#222' }}>View your notifications</Text>
      </View>
      <View style={{ margin: 16 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#222' }}>
          Welcome to Asana Home
        </Text>
      </View>
      <View style={{ marginHorizontal: 16 }}>
        <Text style={{ fontSize: 18, color: '#444' }}>
          Your project management at a glance. Use the menu to access Projects, Tasks, Goals, and more.
        </Text>
      </View>
      <Image source={require('../../assets/images/dashboard1.png')} style={{ width: '100%', height: 160, borderRadius: 16, margin: 24 }} resizeMode="cover" />
    </ScrollView>
  )
}

export default Mainindex

