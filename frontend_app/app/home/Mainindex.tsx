import React from 'react'
import { Image, ScrollView, StyleSheet, Text } from 'react-native'

const Mainindex = () => {
  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <Image source={require('../../assets/images/home2.webp')} style={{ width: '100%', height: 200, borderRadius: 16, marginBottom: 24 }} resizeMode="cover" />
      <Text style={{ fontSize: 28, fontWeight: 'bold', margin: 16, color: '#222' }}>Welcome to Asana Home</Text>
      <Text style={{ fontSize: 18, marginHorizontal: 16, color: '#444' }}>Your project management at a glance. Use the menu to access Projects, Tasks, Goals, and more.</Text>
      <Image source={require('../../assets/images/dashboard1.png')} style={{ width: '100%', height: 160, borderRadius: 16, margin: 24 }} resizeMode="cover" />
    </ScrollView>
  )
}

export default Mainindex

const styles = StyleSheet.create({})