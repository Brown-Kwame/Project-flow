import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Modal,
  TextInput,
  Alert,
  TouchableOpacity,
  ScrollView,
  FlatList,
  useColorScheme,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useUser } from '../context/UserContext';
import { supabase } from '../../lib/supabase';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const Explore = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const { profile, logout } = useUser();

  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [inviteInput, setInviteInput] = useState('');
  const [invitees, setInvitees] = useState<string[]>([]);
  const [dndModalVisible, setDndModalVisible] = useState(false);
  const [pushModalVisible, setPushModalVisible] = useState(false);
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [unreadDirect, setUnreadDirect] = useState(0);
  const [unreadMentions, setUnreadMentions] = useState(0);
  const [unreadAll, setUnreadAll] = useState(0);

  const [showPlan, setShowPlan] = useState(true);
  const [showAppInfo, setShowAppInfo] = useState(true);
  const [showTerms, setShowTerms] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const inbox = await AsyncStorage.getItem('asana_inbox');
        if (inbox) {
          const messages = JSON.parse(inbox);
          setUnreadDirect(messages.filter((m: any) => m.user !== 'You').length);
        } else {
          setUnreadDirect(3);
        }
        setUnreadMentions(2);
        setUnreadAll(5);
      } catch {
        setUnreadDirect(3);
        setUnreadMentions(2);
        setUnreadAll(5);
      }
    };
    fetchUnread();
  }, []);

  const handleInvite = () => setInviteModalVisible(true);

  const handleSendInvite = () => {
    if (!inviteInput.trim()) {
      Alert.alert('Input required', 'Please enter an email or phone number.');
      return;
    }
    setInvitees([...invitees, inviteInput.trim()]);
    setInviteInput('');
    Alert.alert('Invite sent', 'Invitee added to My workspace.');
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      await logout();
      router.replace('/(auth)/Signin');
    } catch (e) {
      const errorMessage =
        typeof e === 'object' && e !== null && 'message' in e
          ? (e as { message?: string }).message
          : undefined;
      Alert.alert('Logout failed', errorMessage || 'Please try again.');
    }
  };

  const toggleSection = (section: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    switch (section) {
      case 'plan':
        setShowPlan((prev) => !prev);
        break;
      case 'app':
        setShowAppInfo((prev) => !prev);
        break;
      case 'terms':
        setShowTerms((prev) => !prev);
        break;
      case 'language':
        setShowLanguage((prev) => !prev);
        break;
    }
  };

  return (
    <View className={`${isDark ? 'bg-black' : 'bg-white'} flex-1`}>
      <View className="flex-row items-center justify-between px-5 pt-8 mb-2">
        <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>Account</Text>
        <TouchableOpacity onPress={() => setAccountModalVisible(true)}>
          <View className="bg-blue-500 rounded-full w-9 h-9 items-center justify-center border-2 border-white">
            <Text className="text-white font-bold text-sm">SY</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView className="px-5 pb-10" showsVerticalScrollIndicator={false}>
        {/* Organizations */}
        <View className="mb-6">
          <Text className={`mb-2 font-semibold ${isDark ? 'text-neutral-400' : 'text-neutral-700'}`}>Organizations</Text>
          <View className={`rounded-xl p-4 shadow-md ${isDark ? 'bg-neutral-800' : 'bg-white'}`}>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <FontAwesome name="building" size={20} color={isDark ? '#fff' : '#000'} />
                <View className="ml-4 flex-1">
                  <Text className={`text-base font-bold ${isDark ? 'text-white' : 'text-black'}`}>My workspace</Text>
                  <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>{profile.email}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={handleInvite} className="bg-blue-500 rounded-md px-4 py-1 h-8 justify-center">
                <Text className="text-white font-bold text-sm">Invite</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Notifications */}
        <View className="mb-6">
          <Text className={`mb-2 font-semibold ${isDark ? 'text-neutral-400' : 'text-neutral-700'}`}>Notifications</Text>
          <View className={`rounded-xl p-4 shadow-md ${isDark ? 'bg-neutral-800' : 'bg-white'}`}>
            <TouchableOpacity onPress={() => setDndModalVisible(true)} className="flex-row items-center mb-4">
              <FontAwesome name="bed" size={20} color={isDark ? '#fff' : '#000'} />
              <Text className={`ml-4 flex-1 font-semibold ${isDark ? 'text-white' : 'text-black'}`}>Do not disturb</Text>
              <Text className="text-sm text-gray-400">Off</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPushModalVisible(true)} className="flex-row items-center mb-4">
              <FontAwesome name="bell" size={20} color={isDark ? '#fff' : '#000'} />
              <Text className={`ml-4 flex-1 font-semibold ${isDark ? 'text-white' : 'text-black'}`}>Push notifications</Text>
              <Text className="text-sm text-gray-400">Manage</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} className="mt-4 bg-red-600 py-3 rounded-lg">
              <Text className="text-white text-center font-bold">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info Collapsible */}
        <View className={`rounded-xl p-4 shadow-md ${isDark ? 'bg-neutral-800' : 'bg-white'}`}>
          {[
            { title: 'Plan', show: showPlan, toggle: () => toggleSection('plan'), content: 'Free Plan - Enjoy while it lasts' },
            { title: 'App Info', show: showAppInfo, toggle: () => toggleSection('app'), content: 'Version: 1.00' },
            {
              title: 'Terms of Service',
              show: showTerms,
              toggle: () => toggleSection('terms'),
              content:
                'By using this app, you agree to our Terms and Conditions. This includes our data policy and user agreement. We reserve the right to update our terms without prior notice.',
            },
            { title: 'Language', show: showLanguage, toggle: () => toggleSection('language'), content: 'English' },
          ].map(({ title, show, toggle, content }) => (
            <View key={title} className="mb-3">
              <TouchableOpacity onPress={toggle} className="flex-row justify-between items-center mb-1">
                <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>{title}</Text>
                <FontAwesome name={show ? 'angle-up' : 'angle-down'} size={20} color={isDark ? '#ccc' : '#333'} />
              </TouchableOpacity>
              {show && <Text className={`text-lg ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>{content}</Text>}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Invite Modal */}
      <Modal visible={inviteModalVisible} animationType="slide" transparent onRequestClose={() => setInviteModalVisible(false)}>
        <View className="flex-1 bg-black/70 justify-end">
          <View className="bg-neutral-900 p-6 rounded-t-2xl min-h-[300px]">
            <Text className="text-white font-bold text-lg mb-4">Invite to My workspace</Text>
            <TextInput
              placeholder="Enter email or number"
              placeholderTextColor="#ccc"
              value={inviteInput}
              onChangeText={setInviteInput}
              className="bg-neutral-800 text-white rounded-lg p-3 mb-4"
            />
            <FlatList
              data={invitees}
              keyExtractor={(item, idx) => item + idx}
              renderItem={({ item }) => <Text className="text-neutral-300 text-sm">{item}</Text>}
              ListEmptyComponent={<Text className="text-neutral-500 text-sm">No invitees yet.</Text>}
              className="mb-4 max-h-20"
            />
            <TouchableOpacity onPress={handleSendInvite} className="bg-blue-500 rounded-full py-3 items-center">
              <Text className="text-white font-bold text-base">Send Invite</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setInviteModalVisible(false)} className="items-center mt-4">
              <Text className="text-neutral-400">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Account Modal */}
      <Modal visible={accountModalVisible} animationType="slide" transparent onRequestClose={() => setAccountModalVisible(false)}>
        <View className="flex-1 bg-black/70 justify-center items-center">
          <View className="bg-white p-6 rounded-2xl w-[85%] items-center">
            <Text className="text-lg font-bold mb-2">Account Details</Text>
            <Text className="text-base mb-1">Name: {profile.name}</Text>
            <Text className="text-base mb-2">Email: {profile.email}</Text>
            <TouchableOpacity onPress={() => setAccountModalVisible(false)} className="mt-4">
              <Text className="text-blue-500 font-bold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Explore;
