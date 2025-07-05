import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Alert, Modal, } from 'react-native';
import { ImageBackground } from 'react-native';

import { router } from 'expo-router';
import { MaterialIcons, FontAwesome, Feather, Ionicons, AntDesign } from '@expo/vector-icons';

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
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Modal visible={showLangModal} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowLangModal(false)} activeOpacity={1}>
          <View style={styles.languageList}>
            <TouchableOpacity
              style={styles.languageItem}
              onPress={() => {
                setLang('en');
                setShowLangModal(false);
              }}
            >
              <Text style={styles.languageText}>{translations.en.english}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.languageItem}
              onPress={() => {
                setLang('fr');
                setShowLangModal(false);
              }}
            >
              <Text style={styles.languageText}>{translations.fr.french}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.header}>
        <View style={styles.leftIcons}>
          <TouchableOpacity onPress={handleNotification}>
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
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={t.searchPlaceholder}
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
            placeholderTextColor="#999"
          />
          <TouchableOpacity onPress={() => setShowSearch(false)}>
            <Feather name="x" size={22} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      )}



      <Text style={styles.tagline}>{t.tagline}</Text>

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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.aiTitle}</Text>
        <Text style={styles.sectionText}>{t.aiText}</Text>
        <TouchableOpacity style={styles.readMoreButton} onPress={() => Alert.alert(t.readMore, t.aiText)}>
          <Text style={styles.readMoreText}>{t.readMore}</Text>
        </TouchableOpacity>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/11035371/pexels-photo-11035371.jpeg?auto=compress&w=300' }}
          style={styles.aiImage}
        />
      </View>

      <View style={styles.collabBox}>
        <Text style={styles.collabTitle}>{t.collaborators}</Text>
        <View style={styles.collabContainer}>
          <View style={styles.sponsorItem}>
            <Image 
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Gartner_Logo.svg/1200px-Gartner_Logo.svg.png' }}
              style={styles.sponsorLogo}
            />
            <Text style={styles.collabText}>{t.gartner}</Text>
          </View>
          <View style={styles.sponsorItem}>
            <Image 
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IDC_logo.svg/1200px-IDC_logo.svg.png' }}
              style={styles.sponsorLogo}
            />
            <Text style={styles.collabText}>{t.idc}</Text>
          </View>
          <View style={styles.sponsorItem}>
            <Image 
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Forrester_logo.svg/1200px-Forrester_logo.svg.png' }}
              style={styles.sponsorLogo}
            />
            <Text style={styles.collabText}>{t.forrester}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerCol}>
          <Text style={styles.footerTitle}>{t.contactUs}</Text>
          <Text style={styles.footerLabel}>{t.sendMsg}</Text>
          <TextInput 
            style={styles.footerInput} 
            placeholder={t.yourName} 
            placeholderTextColor="#999"
          />
          <TextInput 
            style={styles.footerInput} 
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
          <Text style={styles.footerTitle}>{t.sitemap}</Text>
          <Text style={styles.footerLink}>{t.workMgmt}</Text>
          <Text style={styles.footerLink}>{t.basics}</Text>
          <Text style={styles.footerLink}>{t.pricing}</Text>
          <Text style={styles.footerLink}>{t.desktop}</Text>
          <TouchableOpacity onPress={handlePremiumPress}>
            <Text style={[styles.footerLink, styles.premiumLink]}>{t.premium}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerCol}>
          <Text style={styles.footerTitle}>{t.using}</Text>
          <Text style={styles.footerLink}>{t.terms}</Text>
          <Text style={styles.footerLink}>{t.help}</Text>
          <Text style={styles.footerLink}>{t.community}</Text>
          <Text style={styles.footerLink}>{t.blog}</Text>
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
        <Text style={styles.languageLabel}>{lang === 'en' ? t.english : t.french}</Text>
      </View>
      <Text style={styles.copyright}>{t.copyright}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: '#fff' },
container: {
  alignItems: 'center',
  paddingBottom: 40,
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
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
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
    color: '#fff',
    paddingVertical: 8,
    backgroundColor: '#222',
  },
  logoBrand: {
  flexDirection: 'row',       // Align logo and text horizontally
  alignItems: 'center',      // Center vertically
  marginBottom: 20,
  marginTop: 10,
  gap: 8,                    // Adds space between logo and text
},
logo: {
  width: 50,
  height: 50,
  // marginBottom: -15,       // Remove this if it was forcing overlap
},
brand: {
  fontSize: 28,
  fontWeight: 'bold',
  color: '#FF6B6B',
  letterSpacing: 1,
  marginLeft: 8,             // Explicit spacing (alternative to `gap`)
},
  tagline: {
    fontSize: 13,
    color: '#333',
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
    marginHorizontal: 4,
  },
  section: {
    backgroundColor: '#f9f9f9',
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
    color: '#fff',
    textAlign: 'center',
  },
  sectionText: {
    fontSize: 13,
    color: '#444',
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
    backgroundColor: '#f2f2f2',
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
    fontSize: 22,
    color: '#FF6B6B',
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
    marginBottom: 10,
  },
  collabText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    width: '96%',
    alignSelf: 'center',
    gap: 10,
  },
  footerCol: {
    flex: 1,
    marginHorizontal: 6,
  },
  footerTitle: {
    color: '#FF6B6B',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 6,
  },
 footerLabel: {
  color: '#333', // was '#ddd'
},
 footerInput: {
  backgroundColor: '#f2f2f2', // was '#333'
  color: '#000',              // was '#fff'
},
  footerButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  footerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  footerLink: {
  color: '#444', // was '#ddd'
},
  premiumLink: {
    color: '#FF6B6B',
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
    color: '#FF6B6B',
    marginLeft: 8,
  },
 copyright: {
  color: '#555', // was '#999'
},

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageList: {
    backgroundColor: '#fff',
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
    color: '#111',
  },
});