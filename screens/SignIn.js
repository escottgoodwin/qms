import React from 'react';
import { AsyncStorage, KeyboardAvoidingView, StyleSheet, Platform, Image, Text, View, ScrollView,TextInput,Alert } from 'react-native';
import { Button, Input, Icon, Overlay } from 'react-native-elements'
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import fetch from 'node-fetch'
import firebase from 'react-native-firebase';
import type { Notification, NotificationOpen } from 'react-native-firebase';

import ButtonColor from '../components/ButtonColor'
import SignInHeader from '../components/SignInHeader'

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
        console.log('mounted')
        const fcmToken = await firebase.messaging().getToken()
        this.setState({pushToken:fcmToken})

        this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
            alert(notification)
          })
        this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
          alert(notification)
        })
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
        <>
        <Text style={styles.messages}>Something is wrong!</Text>
        <Text style={styles.messages}>{graphQLError}</Text>
        </>

      }

      {isVisibleNet &&
        <>
        <Text style={styles.messages}>Something is wrong!</Text>
        <Text style={styles.messages}>{networkError}</Text>
        </>

      }
      </View>

    <TextInput
     placeholder='Email'
     style={styles.button}
     onChangeText={(text) => this.setState({email:text})}
     value={email}
     autoCapitalize='none'
     keyboardType='email-address'
     />

     <TextInput
      placeholder='Password'
      style={styles.button}
      onChangeText={(text) => this.setState({password:text})}
      value={password}
      autoCapitalize='none'
      />

      <ButtonColor
      title="Loading"
      backgroundcolor="#003366"
      onpress={() => this.props.navigation.navigate("QuestionsLoader")}
      />

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
  button:
  {
    height: 50,
    width: 300,
    backgroundColor:'white',
    borderRadius: 15,
    margin:10,
    paddingLeft:20
  },
  messages: {
    padding:30,
    fontSize:18,
    textAlign:'center',
    color:'red'
  },
});
