import React from 'react';
import { AsyncStorage, KeyboardAvoidingView, StyleSheet, Platform, Image, Text, View, ScrollView,TextInput,Alert } from 'react-native';
import { Button, Input, Icon, Overlay } from 'react-native-elements'
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import firebase from 'react-native-firebase';
import type { Notification, NotificationOpen } from 'react-native-firebase';

import ButtonColor from '../components/ButtonColor'
import SignInHeader from '../components/SignInHeader'
import NewQuestionModal from '../components/NewQuestionModal'

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!, $pushToken: String) {
    mobileLogin(email: $email, password: $password, pushToken: $pushToken) {
      token
      user{
        id
        firstName
        lastName
        role
      }
    }
  }
`

const setToken = async (newToken) => {
  const token = await AsyncStorage.setItem('AUTH_TOKEN', newToken)
  return token
}

const setUserId = async (userid) => {
  const user1 = await AsyncStorage.setItem('USERID', userid)
  return user1
}

export default class SignIn extends React.Component {

  componentDidMount = async () => {

        const fcmToken = await firebase.messaging().getToken()
        this.setState({pushToken:fcmToken})

      }

  static navigationOptions = {
    title: 'Sign In',
  }

     state = {
       email: '',
       password: '',
       graphQLError: '',
       isVisibleGraph:false,
       networkError:false,
       isVisibleNet:false,
       pushToken:'',
       isVisible:false
     }


  render() {

    const { email, password, graphQLError, networkError, isVisibleNet, isVisibleGraph, pushToken } = this.state

    return (
      <KeyboardAvoidingView
      style={styles.container}
      behavior="padding" >

      <SignInHeader
      title='Quandria Sign In'
      />
      

      <View>
      {isVisibleGraph &&
        <View style={styles.warning}>
        <Icon
        name='exclamation-triangle'
        type='font-awesome'
        color='#bb6a6a' />
        <Text style={styles.messages}>
         {graphQLError}
         </Text>
        </View>
      }

      {isVisibleNet &&
        <View style={styles.warning}>
        <Text style={styles.messages}>{networkError}</Text>
        </View>
      }
      </View>

    <TextInput
     placeholder='Email'
     style={styles.input}
     onChangeText={(text) => this.setState({email:text})}
     value={email}
     autoCapitalize='none'
     keyboardType='email-address'
     />

     <TextInput
      placeholder='Password'
      style={styles.input}
      onChangeText={(text) => this.setState({password:text})}
      value={password}
      autoCapitalize='none'
      secureTextEntry={true}
      />
      <View style={{margin:10}}>
      <Mutation
          mutation={LOGIN_MUTATION}
          variables={{ email:email, password:password, pushToken: this.state.pushToken }}
          onCompleted={data => this._confirm(data)}
          onError={error => this._error (error)}
        >
          {mutation => (
            <ButtonColor
            title="Login with Email"
            backgroundcolor="#003366"
            onpress={mutation}
            />
          )}
        </Mutation>
        </View>

      </KeyboardAvoidingView>
    )
  }

  _error = async error => {

      const gerrorMessage = error.graphQLErrors.map((err,i) => err.message)
      this.setState({ isVisibleGraph: true, graphQLError: gerrorMessage})

      error.networkError &&
        this.setState({ isVisibleNet: true, networkError: error.networkError.message})

  }

  _confirm = async data => {

    const { token, user } = data.mobileLogin
    const userid = user.id

    setToken(token)
    setUserId(userid)

    if (user.role === 'STUDENT') {
      this.props.navigation.navigate('StudentDashboard')
    } else {
      authMsg = 'If you are a teacher or adminstrator, please login with your teacher app.'
      this.props.navigation.navigate('NotAuthorized',{authMsg:authMsg})
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#e4f1fe',
  },
  input:{
    fontSize:18,
    height: 50,
    width: '80%',
    backgroundColor:'white',
    borderRadius: 5,
    margin:10,
    paddingLeft:20
  },
  button:{
    height: 50,
    width: '85%',
    borderRadius: 10,
    margin:10,
  },
  messages: {
    padding:15,
    fontSize:18,
    color:'#bb6a6a'
  },
  warning: {
    backgroundColor:'#fff6f6',
    borderRadius: 5,
    borderColor:'#bb6a6a',
    borderWidth:1,
    width: 300,
    padding:5,
    flexDirection:'row',
    alignItems: 'center',
    textAlign:'center',
    padding:5
  }
});
