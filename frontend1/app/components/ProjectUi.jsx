import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ProjectUi = ({head,subhead1,subhead2,subhead3,styles}) => {
  return (
    <View>
      <Text>ProjectUi</Text>
      <View>
        <Text style={styles.text}>{head}</Text>
      </View>
      <View style={styles.container3}>
        <View>
           <Text>
            {subhead1}
           </Text>
        </View>
         <View>
           <Text style={styles}>
            {subhead2}
           </Text>
        </View>
         <View>
           <Text>
            {subhead3}
           </Text>
        </View>
        
      </View>
    </View>
  )
}

export default ProjectUi

const styles = StyleSheet.create({
  container1:{
    flex: 1,
    backgroundColor:'white',
   
  }
  ,
  uis: {
    gap: 24,
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  container2: {
    flex: 1,
    backgroundColor:'white',
   marginTop: 50,
   marginLeft: 20,
  },
  btn:{
    backgroundColor: '#668cff',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    width: 200,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent:'space-around',
    
    color:'white'
    ,fontSize:30,
    marginLeft:20
  },
  texticon:{
    fontSize:30,
    marginLeft:20,
    flexDirection: 'row',
    gap: 10,
    justifyContent:'space-between',
  },
  container3:{
    flexDirection: 'column' ,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    padding: 10,

  },
   container4:{
    marginTop:'40%',
    flexDirection: 'column' ,
   
    marginLeft: 20,
    marginRight: 20,
    padding: 10,
    gap: 15,

  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
     marginLeft:25
  },
  subheading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',}
  ,
  text:
  {fontSize:30,
    marginLeft:20
   
  },icon:{
 marginRight: 15,
 padding:10,
 borderRadius:100,
  
  },
  sliderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 250,
    height: '100%',
    backgroundColor: 'white',
    zIndex: 100,
    elevation: 10,
  },
})