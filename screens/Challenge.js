import React from 'react'
import { StyleSheet, Platform, FlatList, Image, Text, View, ScrollView,TextInput,Alert,Dimensions} from 'react-native'
import { Button,Card } from 'react-native-elements'
const moment = require('moment')

import { Query } from "react-apollo"
import {CHALLENGE_QUERY} from '../ApolloQueries'

import { container, welcome, challenge } from '../css'

import ButtonColor from '../components/ButtonColor'
import SpinnerLoading1 from '../components/SpinnerLoading1'
import QAList from '../components/QAList'
import Error from '../components/Error'
import ChallengeChat from '../components/ChallengeChat'

export default class Challenge extends React.Component {

  static navigationOptions = {
    title: 'Question Challenge'
  }

  state = {
    challenge:'',
    isVisible: false,
    errorMessage:''
  }

  componentDidMount = async () => {

    const challengeId = this.props.navigation.getParam('challengeId', 'NO-ID')

    try {
      const token = await AsyncStorage.getItem('AUTH_TOKEN')

      if (!token) {
        this.props.navigation.navigate('ReSignIn',{reDirectScreen:'Challenge',reDirectParams:{challengeId}})
      }
    }
    catch (error) {
      console.log(error)
    }

  }

  render() {
    const { navigation } = this.props

    const challengeId = navigation.getParam('challengeId', 'NO-ID')

    const { isVisible, errorMessage } = this.state

    return (
      <View style={styles.container}>
      <ScrollView>

      <Query query={CHALLENGE_QUERY} variables={{ challengeId: challengeId }}>
            {({ loading, error, data }) => {
              if (loading) return <SpinnerLoading1 />
              if (error) return <Error {...error}/>

              const challenge = data.challenge

          return (
            <>
            <Text style={styles.welcome}>
            {challenge.answer.answer.question.test.subject} - {challenge.answer.answer.question.test.testNumber}
            </Text>

            <Text style={styles.challenge}>
                Correct: {challenge.answer.answer.question.choices.filter(choice => choice.correct)[0].choice}
            </Text>

            <Text style={styles.challenge}>
              Your Choice: {challenge.answer.answer.choice}
            </Text>

            <Image key={challenge.answer.answer.question.panel.link} source={{uri: challenge.answer.answer.question.panel.link }} style={{ height:210}} />

            <Text style={styles.challenge}>
              Challenge: {challenge.challenge}
            </Text>

            <ChallengeChat navigation={navigation} challengeId={challengeId} />

            <View style={{padding:15}}>
             <ButtonColor
             title="Cancel"
             backgroundcolor="#282828"
             onpress={() => navigation.navigate('TestDashboard',{ testId: challenge.answer.answer.question.test.id })}
             />
            </View>
            </>
      )
      }}
      </Query>


      </ScrollView>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container,
  challenge,
  welcome
})
