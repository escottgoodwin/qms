import React from 'react'
import { StyleSheet, FlatList, Text, View, ScrollView, TouchableOpacity, AsyncStorage} from 'react-native'

import {TEST_QUESTIONS_QUERY} from '../ApolloQueries'
import ButtonColor from '../components/ButtonColor'
import QAList from '../components/QAList'
import Error from '../components/Error'
import TestHeader from '../components/TestHeader'

import { Query } from "react-apollo"

import { container, choice } from '../css'

import SpinnerLoading1 from '../components/SpinnerLoading1'

export default class AllQuestions extends React.Component {

  static navigationOptions = {
    title: 'All Questions',
  }

  componentDidMount = async () => {

    const testId = this.props.navigation.getParam('testId', 'NO-ID')

    try {
      const token = await AsyncStorage.getItem('AUTH_TOKEN')

      if (!token) {
        this.props.navigation.navigate('ReSignIn',{reDirectScreen:'AllQuestions',reDirectParams:{testId}})
      }
    }
    catch (error) {
      console.log(error)
    }

  }

  answerRandom = (questions) =>  {
    const randomInt = Math.floor(Math.random() * questions.length)
    const randomId = questions[randomInt].id
    this.props.navigation.navigate("AnswerQuestion",{questionId: randomId })
    }

  render() {

    const testId = this.props.navigation.getParam('testId', 'NO-ID')

    return (

      <Query query={TEST_QUESTIONS_QUERY} variables={{ testId: testId }}>
            {({ loading, error, data }) => {
              if (loading) return <SpinnerLoading1 />
              if (error) return <Error {...error}/>

              const testToRender = data.test

          return (
        <View style={styles.container}>
        <ScrollView >
          <TestHeader testId={testId}/>

          <View style={{padding:15,alignItems:'center'}}>
          <ButtonColor
          title="Answer Random Question"
          backgroundcolor="#003366"
          onpress={() => this.answerRandom(testToRender.questions)}
          />
          </View>

          <FlatList
          data={testToRender.questions}
          renderItem={
            ({ item, index }) => (
              <TouchableOpacity style={styles.choice}
              onPress={() => this.props.navigation.navigate('AnswerQuestion',{questionId:item.id })}>
               <Text style={{fontSize:18,marginBottom:3}} >
               {item.question}
               </Text>

              </TouchableOpacity>

            )
          }
          keyExtractor={item => item.id}
          />
          <View style={{margin:10}}>
          <ButtonColor
          title="Test Dashboard"
          backgroundcolor="#282828"
          onpress={() => this.props.navigation.navigate('TestDashboard',{ testId:testId })}
          />
          </View>
          </ScrollView >
        </View>
      )
    }}
    </Query>
    )
  }
}

const styles = StyleSheet.create({
  container,
  choice
})
