import React from 'react'
import { StyleSheet, Platform, FlatList, Image, Text, View, ScrollView, TouchableOpacity} from 'react-native'
import { Button, Card, Icon } from 'react-native-elements'

import { Query } from "react-apollo"

import { container, welcome, choice1, question, button } from '../css'

import {ANSWERED_QUESTION_QUERY} from '../ApolloQueries'

import ButtonColor from '../components/ButtonColor'
import AnsweredChoice from '../components/AnsweredChoice'
import SpinnerLoading1 from '../components/SpinnerLoading1'
import Error from '../components/Error'
import QAList from '../components/QAList'
import TestHeader from '../components/TestHeader'

export default class QuestionAnswered extends React.Component {

  static navigationOptions = {
    title: 'Questions Answered',
  }

  componentDidMount = async () => {

    const answerId = this.props.navigation.getParam('answerId', 'NO-ID')

    try {
      const token = await AsyncStorage.getItem('AUTH_TOKEN')

      if (!token) {
        this.props.navigation.navigate('ReSignIn',{reDirectScreen:'QuestionAnswered',reDirectParams:{answerId}})
      }
    }
    catch (error) {
      console.log(error)
    }

  }

  render() {
    const { navigation } = this.props

    const answerId = navigation.getParam('answerId', 'NO-ID')

    return (
      <ScrollView >
      <View style={styles.container}>
      <Query query={ANSWERED_QUESTION_QUERY} variables={{ answerId: answerId }}>
            {({ loading, error, data }) => {
              if (loading) return <SpinnerLoading1 />
              if (error) return <Error {...error}/>

              const answerToRender = data.answer

          return (
            <>
            <TestHeader testId={answerToRender.question.test.id}/>

            {answerToRender.answer.correct ?
              <>
              <Text style={styles.welcome}>
              You got it right!
              </Text>
              <View style={styles.choice1}>
              <Icon
                name='check-square'
                type='font-awesome'
                color='#4AC948'
                 />
              <Text style={styles.welcome}>
              {answerToRender.answer.choice}
              </Text>
              </View>
              </>
              :
              <>
              <Text style={styles.welcome}>
              You got it wrong.
              </Text>
              <View style={styles.choice1}>
              <Icon
                name='times-circle'
                type='font-awesome'
                color='#ff0000'
                 />
              <Text style={styles.welcome}>
              {answerToRender.answer.choice}
              </Text>
              </View>
              </>
            }

            <Text style={styles.question}>
              {answerToRender.question.question}
            </Text>

            <FlatList
            data={answerToRender.question.choices}
            renderItem={
              ({ item, index }) => (
                <AnsweredChoice key={item.id} {...item} />
              )
            }
            keyExtractor={item => item.id}
          />

           <ButtonColor
           title="Challenge Answer"
           backgroundcolor="#282828"
           onpress={() => this.props.navigation.navigate('ChallengeDashboard',{ answerId: answerToRender.id,questionId:answerToRender.question.id })}
           />

          <ButtonColor
          title="Test Dashboard"
          backgroundcolor="#282828"
          onpress={() => this.props.navigation.navigate('TestDashboard',{ testId:answerToRender.question.test.id })}
          />

          </>
        )
        }}
        </Query>

          </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container,
  choice1,
  question,
  welcome
})
