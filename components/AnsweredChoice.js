import React from 'react';
import { StyleSheet, Text, View, TextInput, Dimensions,  } from 'react-native';
import PropTypes from 'prop-types';
import { Button, Icon, Divider } from 'react-native-elements'

const AnsweredChoice = (props) =>

  <View style={styles.choice}>
  {props.correct ?
    <Icon
      name='check-square'
      type='font-awesome'
      color='#4AC948'
       />
       :
       <Icon
         name='times-circle'
         type='font-awesome'
         color='#ff0000'
          />
  }

  <Text style={{padding:10}} >
    {props.choice}
  </Text>

  </View>

const styles = StyleSheet.create({
  choice:{
    flexDirection:"row",
    alignItems: 'center',
    backgroundColor:'white',
    padding:10,
    margin:10,
    borderRadius: 5,
    minWidth:'85%'
  },
  choicetext:{
    fontWeight:'bold',
    fontSize:18,
    color:'#484848'
  },
  input:{
    height: 40,
    width: Dimensions.get('window').width * .75,
    backgroundColor:'white',
    borderRadius: 10,
    margin:5,
    padding:10
  },
});

export default AnsweredChoice
