import React from 'react'
import TouchID from 'react-native-touch-id';
import { AsyncStorage, KeyboardAvoidingView, StyleSheet, Image, Text, View, TextInput } from 'react-native'
import { Mutation } from "react-apollo"
import { execute, makePromise } from 'apollo-link'
import fetch from 'node-fetch';
import HttpLink from 'apollo-link-http'
import firebase from 'react-native-firebase'

import { container, input, logo } from '../css'

import {LOGIN_MUTATION} from '../ApolloQueries'

import ButtonColor from '../components/ButtonColor'
import ErrorMutation from '../components/ErrorMutation'


const touchIdLogin = () => {
  TouchID.authenticate('Login with your fingerprint').then(success => {
        // if login is successful and users want to enable Touch ID login
    const email = AsyncStorage.getItem('EMAIL', email)
    const password = AsyncStorage.getItem('PASSWORD', password)

      const uri = 'https://quandria-be.herokuapp.com/'
      const link = new HttpLink({ uri, fetch })
      const operation = {
        query: LOGIN_MUTATION,
        variables: { email, password } //optional
      }
      // apollo login
      makePromise(execute(link, operation))
        .then(data => {
          const { token, user } = data.mobileLogin
          const userid = user.id
          const newToken = AsyncStorage.setItem('AUTH_TOKEN', token)
          const user1 = AsyncStorage.setItem('USERID', userid)

          if (user.role === 'STUDENT') {
            this.props.navigation.navigate('StudentDashboard')
          } else {
            authMsg = 'If you are a teacher or adminstrator, please login with your teacher app.'
            this.setState({authMsg:authMsg, isVisibleAuth:true})
          }
        }
        )
        .catch(error =>
          this.setState({
          isVisibleTID: true,
          touchIdError: 'You could not login with TouchId. Please login with your email and password'
         }))
     })
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
       networkError:'',
       isVisibleNet:false,
       isVisibleAuth:false,
       touchIdError:'',
       isVisibleTID: false,
       authMsg:'',
       pushToken:'',
     }


  render() {

    const { email, password, graphQLError, networkError, authMsg, touchIdError, isVisibleNet, isVisibleGraph, isVisibleAuth, isVisibleTID,  pushToken } = this.state

    return (
      <KeyboardAvoidingView
      style={styles.container}
      behavior="padding" >

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

          <ButtonColor
          title="Login with TouchID"
          backgroundcolor="#282828"
          onpress={touchIdLogin}
          />

      {isVisibleGraph && <ErrorMutation error={this.state.graphQLError} />}

      {isVisibleNet && <ErrorMutation error={this.state.networkError} />}

      {isVisibleAuth && <ErrorMutation error={this.state.authMsg} />}

      {isVisibleTID && <ErrorMutation error={this.state.touchIdError} />}

      <Image source={require('../assets/quandria_welcome.png')} style={[styles.logo]}/>

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
    const { email, password } = this.state

    const userid = user.id
    const newToken = await AsyncStorage.setItem('AUTH_TOKEN', token)
    const user1 = await AsyncStorage.setItem('USERID', userid)

    const email1 = await AsyncStorage.setItem('EMAIL', email)
    const password1 = await AsyncStorage.setItem('PASSWORD', password)

    if (user.role === 'STUDENT') {
      this.props.navigation.navigate('StudentDashboard')
    } else {
      authMsg = 'If you are a teacher or adminstrator, please login with your teacher app.'
      this.setState({authMsg:authMsg, isVisibleAuth:true})
    }
  }
}

const styles = StyleSheet.create({
  container,
  input,
  logo
})
