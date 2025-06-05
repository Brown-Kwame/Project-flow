import { Text, View, TouchableOpacity } from 'react-native';
import React from 'react';

const Index = () => {
  return (
    <View className="flex-1 bg-white justify-center items-center">
      <Text className="text-black text-lg mb-4">Welcome to the App</Text>
      <TouchableOpacity className="bg-blue-500 p-4 rounded" >
        <Text className="text-white">Go to Explore</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Index;