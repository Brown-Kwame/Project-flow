import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Alert, Modal } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons, FontAwesome, Feather, Ionicons } from '@expo/vector-icons';
import idcLogo from '../../assets/images/idcLogo.png';
import Forrester from '../../assets/images/ForresterLogo.png';
import Gartner from '../../assets/images/GartnerLogo.png';
const translations = {
  en: {
    brand: 'asana',
    tagline: 'Platform for teams to manage and streamline work, ultimately enabling them to achieve their goals more efficiently.',
    seeHow: 'See how it works',
    collaborators: 'Our Trusted Partners',
    contactUs: 'Contact Us',
    sendMsg: 'Send us a message',
    send: 'Send Message',
    sitemap: 'Sitemap',
    workMgmt: 'Asana Work Management',
    basics: 'Asana Basics',
    pricing: 'Asana Pricing',
    desktop: 'Asana Desktop/App',
    premium: 'Asana Premium',
    using: 'Using Asana',
    terms: 'Terms and Privacy',
    help: 'Help Center',
    community: 'Community',
    blog: 'Blog',
    copyright: '© 2025 Asana, Inc.',
    searchPlaceholder: 'Type to search...',
    aiTitle: 'See how Asana keeps your work moving across use cases',
    aiText: 'Let Asana AI handle work for you and surface the full context of your business—anytime, anywhere. Connect your goals to the work that helps achieve them, and supercharge your work with a working strategy for your company.',
    readMore: 'Read More',
    gartner: 'Gartner',
    idc: 'IDC',
    forrester: 'Forrester',
    yourName: 'Your name',
    yourEmail: 'Your email',
    english: 'English',
    french: 'Français',
  },
  fr: {
    brand: 'asana',
    tagline: 'Plateforme pour les équipes afin de gérer et rationaliser le travail, leur permettant ainsi d\'atteindre leurs objectifs plus efficacement.',
    seeHow: 'Voir comment ça marche',
    collaborators: 'Nos Partenaires de Confiance',
    contactUs: 'Contactez-nous',
    sendMsg: 'Envoyez-nous un message',
    send: 'Envoyer le message',
    sitemap: 'Plan du site',
    workMgmt: 'Gestion du travail Asana',
    basics: 'Notions de base Asana',
    pricing: 'Tarifs Asana',
    desktop: 'Asana Desktop/App',
    premium: 'Asana Premium',
    using: 'Utiliser Asana',
    terms: 'Conditions et confidentialité',
    help: 'Centre d\'aide',
    community: 'Communauté',
    blog: 'Blog',
    copyright: '© 2025 Asana, Inc.',
    searchPlaceholder: 'Tapez pour rechercher...',
    aiTitle: 'Découvrez comment Asana fait avancer votre travail',
    aiText: 'Laissez Asana AI gérer le travail pour vous et fournir le contexte complet de votre entreprise à tout moment, n\'importe où. Reliez vos objectifs au travail qui aide à les atteindre et dynamisez votre entreprise avec une stratégie efficace.',
    readMore: 'En savoir plus',
    gartner: 'Gartner',
    idc: 'IDC',
    forrester: 'Forrester',
    yourName: 'Votre nom',
    yourEmail: 'Votre email',
    english: 'Anglais',
    french: 'Français',
  },
};

export default function AuthScreen() {
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const t = translations[lang];
  const [showLangModal, setShowLangModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleNotification = () => {
    Alert.alert('Notifications', 'You have no notifications at the moment.');
  };

  const handleSeeHow = () => {
    router.push('/(auth)/Billing');
  };

  const handlePremiumPress = () => {
    router.push('/(auth)/Billing');
  };

  return (
    <ScrollView style={[styles.scroll, isDarkMode ? styles.darkBackground : styles.lightBackground]} contentContainerStyle={styles.container}>
      <Modal visible={showLangModal} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowLangModal(false)} activeOpacity={1}>
          <View style={[styles.languageList, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
            <TouchableOpacity
              style={styles.languageItem}
              onPress={() => {
                setLang('en');
                setShowLangModal(false);
              }}
            >
              <Text style={[styles.languageText, { color: isDarkMode ? '#fff' : '#000' }]}>{translations.en.english}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.languageItem}
              onPress={() => {
                setLang('fr');
                setShowLangModal(false);
              }}
            >
              <Text style={[styles.languageText, { color: isDarkMode ? '#fff' : '#000' }]}>{translations.fr.french}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.header}>
        <View style={styles.leftIcons}>
          <TouchableOpacity onPress={toggleDarkMode}>
            <Ionicons 
              name={isDarkMode ? 'moon' : 'sunny'} 
              size={24} 
              color="#FF6B6B" 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNotification} style={{ marginLeft: 15 }}>
            <MaterialIcons name="notifications" size={24} color="#FF6B6B" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowSearch(true)} style={{ marginLeft: 15 }}>
            <Feather name="search" size={22} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => router.push('/(auth)/CreateAccount')} style={styles.logoBrand}>
          <FontAwesome name="user-circle" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      {showSearch && (
        <View style={[styles.searchBarContainer, { backgroundColor: isDarkMode ? '#444' : '#222' }]}>
          <TextInput
            style={[styles.searchInput, { color: isDarkMode ? '#fff' : '#000' }]}
            placeholder={t.searchPlaceholder}
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
            placeholderTextColor={isDarkMode ? '#999' : '#ccc'}
          />
          <TouchableOpacity onPress={() => setShowSearch(false)}>
            <Feather name="x" size={22} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      )}

      <Text style={[styles.tagline, { color: isDarkMode ? '#fff' : '#000' }]}>{t.tagline}</Text>

      <TouchableOpacity style={styles.ctaButton} onPress={handleSeeHow}>
        <Text style={styles.ctaButtonText}>{t.seeHow}</Text>
      </TouchableOpacity>

      <View style={styles.imagesRow}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/1181355/pexels-photo-1181355.jpeg?auto=compress&w=200' }}
          style={styles.rowImage}
        />
        <Image
          source={{ uri: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&w=200' }}
          style={styles.rowImage}
        />
      </View>

      <View style={[styles.section, { backgroundColor: isDarkMode ? '#333' : '#f9f9f9' }]}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#222' }]}>{t.aiTitle}</Text>
        <Text style={[styles.sectionText, { color: isDarkMode ? '#fff' : '#444' }]}>{t.aiText}</Text>
        <TouchableOpacity style={styles.readMoreButton} onPress={() => Alert.alert(t.readMore, t.aiText)}>
          <Text style={styles.readMoreText}>{t.readMore}</Text>
        </TouchableOpacity>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/11035371/pexels-photo-11035371.jpeg?auto=compress&w=300' }}
          style={styles.aiImage}
        />
      </View>

      <View style={[styles.collabBox, { backgroundColor: isDarkMode ? '#444' : '#f2f2f2' }]}>
        <Text style={[styles.collabTitle, { color: isDarkMode ? '#fff' : '#FF6B6B' }]}>{t.collaborators}</Text>
        <View style={styles.collabContainer}>
          <View style={styles.sponsorItem}>
            <Image 
              source={Gartner}
              style={styles.sponsorLogo}
            />
           
          </View>
          <View style={styles.sponsorItem}>
            <Image 
      source={idcLogo}
      style={styles.sponsorLogo}
    />
           
          </View>
          <View style={styles.sponsorItem}>
            <Image 
              source={Forrester}
              style={styles.sponsorLogo}
            />
            
          </View>
        </View>
      </View>

      <View style={[styles.footer, { backgroundColor: isDarkMode ? '#333' : '#f2f2f2' }]}>
        <View style={styles.footerCol}>
          <Text style={[styles.footerTitle, { color: isDarkMode ? '#fff' : '#FF6B6B' }]}>{t.contactUs}</Text>
          <Text style={styles.footerLabel}>{t.sendMsg}</Text>
          <TextInput 
            style={[styles.footerInput, { backgroundColor: isDarkMode ? '#444' : '#fff', color: isDarkMode ? '#fff' : '#000' }]} 
            placeholder={t.yourName} 
            placeholderTextColor="#999"
          />
          <TextInput 
            style={[styles.footerInput, { backgroundColor: isDarkMode ? '#444' : '#fff', color: isDarkMode ? '#fff' : '#000' }]} 
            placeholder={t.yourEmail} 
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => Alert.alert(t.send, 'Your message has been sent!')}
          >
            <Text style={styles.footerButtonText}>{t.send}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerCol}>
          <Text style={[styles.footerTitle, { color: isDarkMode ? '#fff' : '#FF6B6B' }]}>{t.sitemap}</Text>
          <Text style={[styles.footerLink, { color: isDarkMode ? '#fff' : '#444' }]}>{t.workMgmt}</Text>
          <Text style={[styles.footerLink, { color: isDarkMode ? '#fff' : '#444' }]}>{t.basics}</Text>
          <Text style={[styles.footerLink, { color: isDarkMode ? '#fff' : '#444' }]}>{t.pricing}</Text>
          <Text style={[styles.footerLink, { color: isDarkMode ? '#fff' : '#444' }]}>{t.desktop}</Text>
          <TouchableOpacity onPress={handlePremiumPress}>
            <Text style={[styles.footerLink, styles.premiumLink]}>{t.premium}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerCol}>
          <Text style={[styles.footerTitle, { color: isDarkMode ? '#fff' : '#FF6B6B' }]}>{t.using}</Text>
          <Text style={[styles.footerLink, { color: isDarkMode ? '#fff' : '#444' }]}>{t.terms}</Text>
          <Text style={[styles.footerLink, { color: isDarkMode ? '#fff' : '#444' }]}>{t.help}</Text>
          <Text style={[styles.footerLink, { color: isDarkMode ? '#fff' : '#444' }]}>{t.community}</Text>
          <Text style={[styles.footerLink, { color: isDarkMode ? '#fff' : '#444' }]}>{t.blog}</Text>
        </View>
      </View>

      <View style={styles.socialRow}>
        <TouchableOpacity onPress={() => setShowLangModal(true)}>
          <MaterialIcons name="language" size={24} color="#FF6B6B" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="facebook" size={24} color="#FF6B6B" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="twitter" size={24} color="#FF6B6B" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="youtube-play" size={24} color="#FF6B6B" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="instagram" size={24} color="#FF6B6B" />
        </TouchableOpacity>
        <Text style={[styles.languageLabel, { color: isDarkMode ? '#fff' : '#FF6B6B' }]}>{lang === 'en' ? t.english : t.french}</Text>
      </View>
      <Text style={[styles.copyright, { color: isDarkMode ? '#aaa' : '#555' }]}>{t.copyright}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  darkBackground: {
    backgroundColor: '#121212',
  },
  lightBackground: {
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 24,
    marginBottom: 8,
  },
  leftIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
    gap: 8,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 5,
    width: '90%',
    alignSelf: 'center',
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  tagline: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 10,
    marginHorizontal: 20,
  },
  ctaButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginBottom: 16,
    alignSelf: 'center',
  },
  ctaButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imagesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 10,
  },
  rowImage: {
    width: 110,
    height: 70,
    borderRadius: 8,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '92%',
    alignSelf: 'center',
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionText: {
    fontSize: 13,
    marginBottom: 8,
    textAlign: 'center',
  },
  readMoreButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    alignSelf: 'center',
    marginBottom: 10,
  },
  readMoreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  aiImage: {
    width: '100%',
    height: 110,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'center',
  },
  collabBox: {
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 30,
    width: '90%',
    alignSelf: 'center',
    elevation: 3,
  },
  collabTitle: {
    fontWeight: 'bold',
    fontSize: 30,
    marginBottom: 20,
    textAlign: 'center',
  },
  collabContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 20,
  },
  sponsorItem: {
    alignItems: 'center',
    minWidth: 100,
  },

  sponsorLogo: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 8,
   
  },

  collabText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222', // Default color for light theme
    textAlign: 'center',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    width: '96%',
    alignSelf: 'center',
    gap: 10,
    backgroundColor: '#f2f2f2', // Light theme background
  },

  footerCol: {
    flex: 1,
    marginHorizontal: 6,
  },

  footerTitle: {
    color: '#FF6B6B', // Title color remains the same
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 6,
  },

  footerLabel: {
    color: '#333', // Default color for light theme
  },

  footerInput: {
    backgroundColor: '#f2f2f2', // Light theme background
    color: '#000', // Text color for light theme
    borderRadius: 5,
    padding: 8,
    marginVertical: 4,
  },

  footerButton: {
    backgroundColor: '#FF6B6B', // Button color remains the same
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 4,
  },

  footerButtonText: {
    color: '#fff', // Button text color remains the same
    fontWeight: 'bold',
    fontSize: 10,
  },

  footerLink: {
    color: '#444', // Default color for light theme
  },

  premiumLink: {
    color: '#FF6B6B', // Premium link color remains the same
    fontWeight: 'bold',
  },

  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
    gap: 16,
  },

  languageLabel: {
    fontSize: 14,
    color: '#FF6B6B', // Language label color remains the same
    marginLeft: 8,
  },

  copyright: {
    color: '#555', // Default color for light theme
  },

  // Dark theme styles
  darkFooter: {
    backgroundColor: '#2a2a2a', // Dark theme background
  },

  darkFooterLabel: {
    color: '#ddd', // Text color for dark theme
  },

  darkFooterInput: {
    backgroundColor: '#444', // Dark theme background
    color: '#fff', // Text color for dark theme
  },

  darkCollabText: {
    color: '#fff', // Text color for dark theme
  },

  darkCopyright: {
    color: '#aaa', // Lighter color for dark theme
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  languageList: {
    borderRadius: 8,
    padding: 10,
    minWidth: 180,
    elevation: 5,
  },

  languageItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  languageText: {
    fontSize: 16,
    color: '#111', // Default color for light theme
  },
});
