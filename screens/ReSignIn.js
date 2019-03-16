import React from 'react'
import { AsyncStorage, KeyboardAvoidingView, StyleSheet, Platform, Image, Text, View, ScrollView,TextInput,Alert } from 'react-native'
import { Button, Input, Icon, Overlay, Divider } from 'react-native-elements'
import { Mutation } from "react-apollo"
import firebase from 'react-native-firebase'
import type { Notification, NotificationOpen } from 'react-native-firebase'

import { container, input } from '../css'

import {LOGIN_MUTATION} from '../ApolloQueries'

import ButtonColor from '../components/ButtonColor'
import SignInHeader from '../components/SignInHeader'
import NewQuestionModal from '../components/NewQuestionModal'
import ErrorMutation from '../components/ErrorMutation'

export default class ReSignIn extends React.Component {

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
       authMsg:'',
       pushToken:'',
     }


  render() {

    const { email, password, graphQLError, networkError, authMsg, isVisibleNet, isVisibleGraph, isVisibleAuth, pushToken } = this.state

    return (
      <KeyboardAvoidingView
      style={styles.container}
      behavior="padding" >

      <SignInHeader
      title='Quandria Sign In'
      />

      {isVisibleGraph && <ErrorMutation error={this.state.graphQLError} />}

      {isVisibleNet && <ErrorMutation error={this.state.networkError} />}

      {isVisibleAuth && <ErrorMutation error={this.state.authMsg} />}

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

      <View style={{padding:15}}>
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

    const newToken = await AsyncStorage.setItem('AUTH_TOKEN', token)
    const user1 = await AsyncStorage.setItem('USERID', userid)

    const reDirectScreen = this.props.navigation.getParam('reDirectScreen', 'NO-ID')
    const reDirectParams = this.props.navigation.getParam('reDirectParams', 'NO-ID')

    if (user.role === 'STUDENT') {
      this.props.navigation.navigate(reDirectScreen,reDirectParams)
    } else {
      authMsg = 'If you are a teacher or adminstrator, please login with your teacher app.'
      this.setState({authMsg:authMsg, isVisibleAuth:true})
    }
  }
}

const styles = StyleSheet.create({
  container,
  input
})
