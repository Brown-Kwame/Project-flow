import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useState, useContext } from 'react';
import { useColorScheme as useSystemColorScheme, ScrollView, Text, TouchableOpacity, View, Modal, TextInput, FlatList, Alert, Platform, ToastAndroid } from 'react-native';
import { Colors } from '@/constants/Colors';
import * as Calendar from 'expo-calendar';

import * as Contacts from 'expo-contacts';
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { ThemeContext } from './_layout';

const Explore = () => {
  const { setTheme, theme } = useContext(ThemeContext);
  const systemColorScheme = useSystemColorScheme();
  const router = useRouter();
  // Invite modal state
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [inviteInput, setInviteInput] = useState('');
  const [invitees, setInvitees] = useState<string[]>([]);
  // Theme modal state
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  // Language modal state
  // DND modal state
  const [dndModalVisible, setDndModalVisible] = useState(false);
  const [pushModalVisible, setPushModalVisible] = useState(false);
  // Push notification modal state
  // Unread counts for notification sections
  const [unreadDirect, setUnreadDirect] = useState(0);
  const [unreadMentions, setUnreadMentions] = useState(0);
  const [unreadAll, setUnreadAll] = useState(0);
  // Account details modal state
  const [accountModalVisible, setAccountModalVisible] = useState(false);

  // Sample user details (replace with real data)
  const userDetails = {
    name: 'Screw Yt18',
    email: 'screw.yt18@gmail.com',
    joined: '2025-06-01',
  };

  // Fetch unread counts from AsyncStorage (simulate)
  React.useEffect(() => {
    const fetchUnread = async () => {
      try {
        const inbox = await AsyncStorage.getItem('asana_inbox');
        if (inbox) {
          const messages = JSON.parse(inbox);
          setUnreadDirect(messages.filter((m: any) => m.user !== 'You').length);
        } else {
          setUnreadDirect(3);
        }
        // Simulate mentions & all activity
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
  // Licenses modal state

  // Handler: Invite
  const handleInvite = () => setInviteModalVisible(true);
  const handleSendInvite = () => {
    if (!inviteInput.trim()) {
      Alert.alert('No information provided', 'Please provide at least one piece of information.');
      return;
    }
    setInvitees([...invitees, inviteInput.trim()]);
    setInviteInput('');
    Alert.alert('Invite sent', 'Invitee added to My workspace.');
  };
  // Handler: Pick contact from device
  const handlePickContact = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Cannot access contacts without permission.');
      return;
    }
    const { data } = await Contacts.presentFormAsync();
    if (data && data.length > 0) {
      const contact = data[0];
      let email = '';
      if (contact.emails && contact.emails.length > 0) {
        email = contact.emails[0].email;
      } else if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
        email = contact.phoneNumbers[0].number;
      }
      if (email) {
        setInvitees([...invitees, email]);
        Alert.alert('Invite sent', `${email} added to My workspace.`);
      } else {
        Alert.alert('No email or phone', 'Selected contact has no email or phone number.');
      }
    }
  };

  // Handler: Billing
  const handleBilling = () => router.push('/(auth)/Billing');

  // Handler: DND
  const handleDND = () => setDndModalVisible(true);

  // DND actions
  const handleDndHour = async () => {
    setDndModalVisible(false);
    Alert.alert('DND Set', 'You will be reminded in 1 hour.');
  };
  const handleDndTomorrow = async () => {
    setDndModalVisible(false);
    Alert.alert('DND Set', 'You will be reminded tomorrow at 9am.');
  };
  const handleDndCalendar = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Cannot access calendar without permission.');
      return;
    }
    // Open the default calendar app (best effort, as Expo cannot open calendar picker directly)
    if (Platform.OS === 'ios') {
      Linking.openURL('calshow://');
    } else {
      Linking.openURL('content://com.android.calendar/time/');
    }
    setDndModalVisible(false);
  };

  // Handler: Push notifications
  const handlePush = () => setPushModalVisible(true);

  // Handler: Android guide
  const handleAndroidGuide = () => Linking.openURL('https://your-app-website.com');

  // Handler: Contact support
  const handleContactSupport = () => Linking.openURL('https://your-app-website.com/help-center');

  // Handler: Display setting
  const handleTheme = () => setThemeModalVisible(true);
  const handleThemeSelect = (selected: string) => {
    setTheme(selected);
    setThemeModalVisible(false);
  };

  // Determine colors based on theme selection
  let colorMode: 'light' | 'dark' = 'light';
  if (theme === 'dark') colorMode = 'dark';
  else if (theme === 'system') colorMode = systemColorScheme === 'dark' ? 'dark' : 'light';
  const themeColors = Colors[colorMode];

  // Handler: Language

  // Handler: Privacy Policy
  const handlePrivacy = () => Linking.openURL('https://your-app-website.com/privacy');

  // Handler: Terms of Service
  const handleTerms = () => Linking.openURL('https://your-app-website.com/terms');

  // Handler: Licenses

  // Handler: App version
  const handleAppVersion = () => {
    Clipboard.setStringAsync('8.54.5 (8540500)');
    if (Platform.OS === 'android') ToastAndroid.show('Version copied!', ToastAndroid.SHORT);
    else Alert.alert('Copied', 'Version copied to clipboard.');
  };
  // Removed unused profile state
  // Removed unused editName state
  // Card and title colors for light/dark theme
  const cardBg = colorMode === 'light' ? '#fff' : themeColors.background;
  const cardText = colorMode === 'light' ? '#11181C' : themeColors.text;
  const titleColor = colorMode === 'light' ? '#687076' : themeColors.icon;

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      {/* Top right user initials icon */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 32, marginBottom: 8 }}>
        <Text style={{ color: cardText, fontWeight: 'bold', fontSize: 30, letterSpacing: 0.2 }}>Account</Text>
        <TouchableOpacity onPress={() => setAccountModalVisible(true)}>
          <View style={{ backgroundColor: themeColors.tint, borderRadius: 16, width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: themeColors.background, shadowColor: themeColors.tint, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 }}>
            <Text style={{ color: themeColors.background, fontWeight: 'bold', fontSize: 16 }}>SY</Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* All cards scrollable, organizations title starts at top */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 0, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Organizations Section */}
        <View>
          <Text style={{ color: titleColor, fontWeight: '600', fontSize: 15, marginBottom: 8 }}>Organizations</Text>
          <View style={{ backgroundColor: cardBg, borderRadius: 12, marginBottom: 24, padding: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <FontAwesome name="building" size={20} color={cardText} style={{ marginRight: 14 }} />
                <View style={{ flexShrink: 1 }}>
                  <Text style={{ color: cardText, fontSize: 17, fontWeight: '700', marginBottom: 2 }}>My workspace</Text>
                  <Text style={{ color: titleColor, fontSize: 14 }} numberOfLines={1}>screw.yt18@gmail.com</Text>
                </View>
              </View>
              <TouchableOpacity
                style={{ backgroundColor: '#668cff', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center', height: 32, minWidth: 70 }}
                onPress={handleInvite}
              >
                <Text style={{ color: cardBg, fontWeight: 'bold', fontSize: 15, textAlign: 'center', letterSpacing: 0.5 }}>Invite</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* Plan Section */}
        <View>
          <Text style={{ color: titleColor, fontWeight: '600', fontSize: 15, marginBottom: 8 }}>Plan</Text>
          <TouchableOpacity onPress={handleBilling} activeOpacity={0.8} style={{ backgroundColor: cardBg, borderRadius: 12, marginBottom: 24, padding: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome name="users" size={20} color={cardText} style={{ marginRight: 14 }} />
              <View>
                <Text style={{ color: cardText, fontSize: 17, fontWeight: '700', marginBottom: 2 }}>Asana Personal</Text>
                <Text style={{ color: titleColor, fontSize: 14 }} numberOfLines={1}>10 seats</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {/* Notifications Section */}
        <View>
          <Text style={{ color: titleColor, fontWeight: '600', fontSize: 15, marginBottom: 8 }}>Notifications</Text>
          <View style={{ backgroundColor: cardBg, borderRadius: 12, marginBottom: 24, padding: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }}>
            <TouchableOpacity onPress={handleDND} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <FontAwesome name="bed" size={20} color={cardText} style={{ marginRight: 14 }} />
              <Text style={{ color: cardText, fontSize: 16, fontWeight: '600', flex: 1 }}>Do not disturb</Text>
              <Text style={{ color: titleColor, fontSize: 14 }}>Off</Text>
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: '#3a3b3c', marginVertical: 6, alignSelf: 'stretch', width: '100%' }} />
            <TouchableOpacity onPress={handlePush} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome name="bell" size={20} color={cardText} style={{ marginRight: 14 }} />
              <Text style={{ color: cardText, fontSize: 16, fontWeight: '600', flex: 1 }}>Push notifications</Text>
              <Text style={{ color: titleColor, fontSize: 14 }}>Manage</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Support Section */}
        <View>
          <Text style={{ color: titleColor, fontWeight: '600', fontSize: 15, marginBottom: 8 }}>Support</Text>
          <View style={{ backgroundColor: cardBg, borderRadius: 12, marginBottom: 24, padding: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }}>
            <TouchableOpacity onPress={handleAndroidGuide} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <FontAwesome name="info-circle" size={20} color={cardText} style={{ marginRight: 14 }} />
              <Text style={{ color: cardText, fontSize: 16, fontWeight: '600', flex: 1 }}>Android guide</Text>
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: '#3a3b3c', marginVertical: 6, alignSelf: 'stretch', width: '100%' }} />
            <TouchableOpacity onPress={handleContactSupport} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome name="question-circle" size={20} color={cardText} style={{ marginRight: 14 }} />
              <Text style={{ color: cardText, fontSize: 16, fontWeight: '600', flex: 1 }}>Contact support</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* App Section */}
        <View>
          <Text style={{ color: titleColor, fontWeight: '600', fontSize: 15, marginBottom: 8 }}>App</Text>
          <View style={{ backgroundColor: cardBg, borderRadius: 12, marginBottom: 24, padding: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }}>
            <TouchableOpacity onPress={handleTheme} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <FontAwesome name="moon-o" size={20} color={cardText} style={{ marginRight: 14 }} />
              <Text style={{ color: cardText, fontSize: 16, fontWeight: '600', flex: 1 }}>Display setting</Text>
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: '#3a3b3c', marginVertical: 6, alignSelf: 'stretch', width: '100%' }} />
            <TouchableOpacity onPress={handlePrivacy} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <FontAwesome name="eye" size={20} color={cardText} style={{ marginRight: 14 }} />
              <Text style={{ color: cardText, fontSize: 16, fontWeight: '600', flex: 1 }}>Privacy policy</Text>
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: '#3a3b3c', marginVertical: 6, alignSelf: 'stretch', width: '100%' }} />
            <TouchableOpacity onPress={handleTerms} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <FontAwesome name="cogs" size={20} color={cardText} style={{ marginRight: 14 }} />
              <Text style={{ color: cardText, fontSize: 16, fontWeight: '600', flex: 1 }}>Terms of service</Text>
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: '#3a3b3c', marginVertical: 6, alignSelf: 'stretch', width: '100%' }} />
            <TouchableOpacity onPress={handleAppVersion} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <FontAwesome name="mobile" size={20} color={cardText} style={{ marginRight: 14 }} />
              <Text style={{ color: cardText, fontSize: 16, fontWeight: '600', flex: 1 }}>App version</Text>
              <Text style={{ color: titleColor, fontSize: 14, marginLeft: 8 }}>8.54.5 (8540500)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* Invite Modal */}
      <Modal visible={inviteModalVisible} animationType="slide" transparent onRequestClose={() => setInviteModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: '#000a', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#23252b', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, minHeight: 320 }}>
            <View>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Invite to My workspace</Text>
              <TextInput
                placeholder="Enter email or contact"
                placeholderTextColor="#b0b3b8"
                value={inviteInput}
                onChangeText={setInviteInput}
                style={{ backgroundColor: '#181a20', color: '#fff', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16 }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={{ backgroundColor: '#3a3b3c', borderRadius: 16, paddingVertical: 10, alignItems: 'center', marginBottom: 12 }}
                onPress={handlePickContact}
              >
                <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Pick from Contacts</Text>
              </TouchableOpacity>
              <FlatList
                data={invitees}
                keyExtractor={(item, idx) => item + idx}
                renderItem={({ item }) => (
                  <View><Text style={{ color: '#b0b3b8', fontSize: 15, marginBottom: 4 }}>{item || ''}</Text></View>
                )}
                ListEmptyComponent={<View><Text style={{ color: '#b0b3b8', fontSize: 15, marginBottom: 4 }}>No invitees yet.</Text></View>}
                style={{ maxHeight: 80, marginBottom: 16 }}
              />
              <TouchableOpacity
                style={{ backgroundColor: '#668cff', borderRadius: 24, paddingVertical: 12, alignItems: 'center', marginTop: 8 }}
                onPress={handleSendInvite}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 17 }}>Send Invite</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setInviteModalVisible(false)} style={{ alignItems: 'center', marginTop: 16 }}>
                <Text style={{ color: '#b0b3b8', fontSize: 15 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* DND Modal */}
      <Modal visible={dndModalVisible} animationType="slide" transparent onRequestClose={() => setDndModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: '#000a', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#23252b', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, minHeight: 220 }}>
            <View>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Do Not Disturb</Text>
              <Text style={{ color: '#b0b3b8', fontSize: 15, marginBottom: 8 }}>Pause notifications for:</Text>
              <TouchableOpacity onPress={handleDndHour} style={{ backgroundColor: '#181a20', borderRadius: 8, padding: 12, marginBottom: 8 }}>
                <Text style={{ color: '#fff', fontSize: 16 }}>1 hour</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDndTomorrow} style={{ backgroundColor: '#181a20', borderRadius: 8, padding: 12, marginBottom: 8 }}>
                <Text style={{ color: '#fff', fontSize: 16 }}>Until tomorrow</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDndCalendar} style={{ backgroundColor: '#181a20', borderRadius: 8, padding: 12, marginBottom: 8 }}>
                <Text style={{ color: '#fff', fontSize: 16 }}>Pick date from calendar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setDndModalVisible(false)} style={{ alignItems: 'center', marginTop: 16 }}>
                <Text style={{ color: '#b0b3b8', fontSize: 15 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Push Notifications Modal */}
      <Modal visible={pushModalVisible} animationType="slide" transparent onRequestClose={() => setPushModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: '#000a', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#23252b', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, minHeight: 220 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Push Notifications</Text>
            <TouchableOpacity style={{ backgroundColor: '#181a20', borderRadius: 8, padding: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center' }} onPress={() => { setPushModalVisible(false); router.push('/inbox/Inbox?section=mentions'); }}>
              <Text style={{ color: '#fff', fontSize: 16, flex: 1 }}>Mentions & Activity</Text>
              {unreadMentions > 0 && (
                <View style={{ backgroundColor: '#ff4d4d', borderRadius: 8, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', marginLeft: 8, paddingHorizontal: 3 }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>{unreadMentions}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: '#181a20', borderRadius: 8, padding: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center' }} onPress={() => { setPushModalVisible(false); router.push('/inbox/Inbox?section=direct-messages'); }}>
              <Text style={{ color: '#fff', fontSize: 16, flex: 1 }}>Direct messages</Text>
              {unreadDirect > 0 && (
                <View style={{ backgroundColor: '#ff4d4d', borderRadius: 8, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', marginLeft: 8, paddingHorizontal: 3 }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>{unreadDirect}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: '#181a20', borderRadius: 8, padding: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center' }} onPress={() => { setPushModalVisible(false); router.push('/inbox/Inbox?section=all-activity'); }}>
              <Text style={{ color: '#fff', fontSize: 16, flex: 1 }}>All activity</Text>
              {unreadAll > 0 && (
                <View style={{ backgroundColor: '#ff4d4d', borderRadius: 8, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', marginLeft: 8, paddingHorizontal: 3 }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>{unreadAll}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPushModalVisible(false)} style={{ alignItems: 'center', marginTop: 16 }}>
              <Text style={{ color: '#b0b3b8', fontSize: 15 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Theme Modal */}
      <Modal visible={themeModalVisible} animationType="slide" transparent onRequestClose={() => setThemeModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: '#000a', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#23252b', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, minHeight: 220 }}>
            <View>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Select Theme</Text>
            </View>
            <TouchableOpacity onPress={() => handleThemeSelect('light')} style={{ backgroundColor: '#181a20', borderRadius: 8, padding: 12, marginBottom: 8 }}>
              <Text style={{ color: '#fff', fontSize: 16 }}>Light</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleThemeSelect('dark')} style={{ backgroundColor: '#181a20', borderRadius: 8, padding: 12, marginBottom: 8 }}>
              <Text style={{ color: '#fff', fontSize: 16 }}>Dark</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleThemeSelect('system')} style={{ backgroundColor: '#181a20', borderRadius: 8, padding: 12, marginBottom: 8 }}>
              <Text style={{ color: '#fff', fontSize: 16 }}>System Default</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setThemeModalVisible(false)} style={{ alignItems: 'center', marginTop: 16 }}>
              <Text style={{ color: '#b0b3b8', fontSize: 15 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Account Details Modal */}
      <Modal visible={accountModalVisible} animationType="slide" transparent onRequestClose={() => setAccountModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: '#000a', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 24, minWidth: 320, alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 22, marginBottom: 12, color: '#222' }}>Account Details</Text>
            <Text style={{ fontSize: 16, marginBottom: 8 }}>Name: {userDetails.name}</Text>
            <Text style={{ fontSize: 16, marginBottom: 8 }}>Email: {userDetails.email}</Text>
            <Text style={{ fontSize: 16, marginBottom: 8 }}>Joined: {userDetails.joined}</Text>
            <TouchableOpacity onPress={() => setAccountModalVisible(false)} style={{ marginTop: 16 }}>
              <Text style={{ color: '#668cff', fontWeight: 'bold', fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default Explore;
