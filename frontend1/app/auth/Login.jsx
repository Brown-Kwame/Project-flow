// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';

// export default function LoginScreen() {
//   const [showPassword, setShowPassword] = useState(false);

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Logo */}
//   <Image
//   source={require('../../assets/images/Letter-A-logo-design-in-flat-design-on-transparent-background-PNG-removebg-preview.png')}
//   style={styles.logo}
//   resizeMode="contain"
// />
      
//       <Text style={styles.brand}>asana</Text>

//       {/* Welcome */}
//       <Text style={styles.welcome}>Welcome to Asana</Text>
//       <Text style={styles.subtitle}>To get started, please sign in</Text>

//       {/* Section Title */}
//       <Text style={styles.sectionTitle}>Log in to your account</Text>
//       <Text style={styles.sectionSubtitle}>Welcome back! Select method to log in:</Text>

//       {/* Social Buttons */}
//       <View style={styles.socialRow}>
//   <TouchableOpacity style={styles.socialBtn}>
//     <Image
//   source={require('../../assets/images/png-transparent-google-logo-google-search-meng-meng-company-text-logo-thumbnail-removebg-preview.png')}
//   style={styles.socialIcon}
// />
//     <Text style={styles.socialText}>Google</Text>
//   </TouchableOpacity>
//   <TouchableOpacity style={styles.socialBtn}>
//     <Image
//       source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png' }}
//       style={styles.socialIcon}
//     />
//     <Text style={styles.socialText}>Facebook</Text>
//   </TouchableOpacity>
// </View>

//       <View style={styles.dividerRow}>
//         <View style={styles.divider} />
//         <Text style={styles.dividerText}>or continue with email</Text>
//         <View style={styles.divider} />
//       </View>

//       {/* Email Input */}
//       <View style={styles.inputRow}>
//         <Text style={styles.inputIcon}>✉️</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Email"
//           placeholderTextColor="#888"
//         />
//       </View>

//       {/* Password Input */}
//       <View style={styles.inputRow}>
//         <Text style={styles.inputIcon}>🔒</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           placeholderTextColor="#888"
//           secureTextEntry={!showPassword}
//         />
//         <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//           <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Links */}
//       <View style={styles.linksRow}>
//         <TouchableOpacity>
//           <Text style={styles.link}>Remember me</Text>
//         </TouchableOpacity>
//         <TouchableOpacity>
//           <Text style={styles.link}>Forgot Password?</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Login Button */}
//       <TouchableOpacity style={styles.loginBtn}>
//         <Text style={styles.loginBtnText}>Log in</Text>
//       </TouchableOpacity>

//       {/* Signup Link */}
//       <Text style={styles.signupText}>
//         Don’t have an account?{' '}
//         <Text style={styles.signupLink}>Create an account</Text>
//       </Text>

//       {/* Terms */}
//       <Text style={styles.terms}>
//         By signing up, I agree to the Asana Privacy policy and{'\n'}
//         <Text style={{ textDecorationLine: 'underline' }}>Terms of Services</Text>
//       </Text>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#e6eaff',
//     alignItems: 'center',
//     padding: 20,
//     justifyContent: 'center',
//   },
//   logo: {
//     width: 70,
//     height: 70,
//     marginBottom: 0,
//   },
//   brand: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#c0392b',
//     marginBottom: 10,
//     marginTop: -10,
//     letterSpacing: 1,
//   },
//   welcome: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginTop: 10,
//     color: '#222',
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#444',
//     marginBottom: 10,
//     textAlign: 'center',
//     textDecorationLine: 'underline',
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 10,
//     color: '#222',
//     textAlign: 'center',
//     textDecorationLine: 'underline',
//   },
//   sectionSubtitle: {
//     fontSize: 13,
//     color: '#444',
//     marginBottom: 14,
//     textAlign: 'center',
//   },
//   socialRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 12,
//     gap: 10,
//   },
//   socialBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f6f6fa',
//     borderRadius: 8,
//     paddingVertical: 8,
//     paddingHorizontal: 18,
//     marginHorizontal: 5,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//   },
//   socialIcon: {
//     width: 22,
//     height: 22,
//     marginRight: 8,
//   },
//   socialText: {
//     fontSize: 15,
//     color: '#222',
//     fontWeight: '500',
//   },
//   dividerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 10,
//     width: '100%',
//     justifyContent: 'center',
//   },
//   divider: {
//     flex: 1,
//     height: 1,
//     backgroundColor: '#bbb',
//     marginHorizontal: 8,
//   },
//   dividerText: {
//     color: '#888',
//     fontSize: 13,
//   },
//   inputRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#dde3fa',
//     borderRadius: 8,
//     marginBottom: 12,
//     paddingHorizontal: 12,
//     width: '100%',
//     maxWidth: 350,
//     height: 48,
//   },
//   inputIcon: {
//     fontSize: 18,
//     marginRight: 8,
//     color: '#888',
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: '#222',
//   },
//   eyeIcon: {
//     fontSize: 18,
//     marginLeft: 8,
//     color: '#888',
//   },
//   linksRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     maxWidth: 350,
//     marginBottom: 10,
//   },
//   link: {
//     color: '#2563EB',
//     fontSize: 13,
//     textDecorationLine: 'underline',
//   },
//   loginBtn: {
//     backgroundColor: '#2563EB',
//     borderRadius: 8,
//     paddingVertical: 14,
//     width: '100%',
//     maxWidth: 350,
//     alignItems: 'center',
//     marginTop: 6,
//     marginBottom: 10,
//   },
//   loginBtnText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   signupText: {
//     color: '#222',
//     fontSize: 13,
//     marginTop: 4,
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   signupLink: {
//     color: '#2563EB',
//     textDecorationLine: 'underline',
//     fontWeight: 'bold',
//   },
//   terms: {
//     color: '#444',
//     fontSize: 11,
//     textAlign: 'center',
//     marginTop: 10,
//   },
// });

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const login = () => {
  return (
    <View>
      <Text>login</Text>
    </View>
  )
}

export default login

const styles = StyleSheet.create({})