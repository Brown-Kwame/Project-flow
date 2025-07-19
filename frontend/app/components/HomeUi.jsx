import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
function HomeUi({ Mainhead, head, subhead, btn,icon }) {
  return (
    <View style={styles.container1}>
      {/* Main Heading */}
      <Text style={styles.mainHeading}>{Mainhead}</Text>
      {/* Card Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{head}  
              <FontAwesome name={icon}  size={30} style={{margin:20}}/>
     </Text>
                  
        <Text style={styles.cardSubtitle}>{subhead}</Text>
        <Text>

        </Text>
        <TouchableOpacity style={styles.btnContainer}>
          <Text style={styles.btn}>{btn}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default HomeUi

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: 'yellow',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
    paddingVertical: 30,
    paddingHorizontal: 10,
    justifyContent: 'flex-start',
  },
  mainHeading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  card: {
    backgroundColor: 'white',
   
    
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: 'black',
    marginBottom: 8,
    justifyContent:'space-between',
    flexDirection:'row'
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#444',
    marginBottom: 18,
  },
  btnContainer: {
    alignItems: 'flex-end',
  },
  btn: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 20,
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
})