import React from 'react'
import { AsyncStorage, StyleSheet, FlatList, Text, View, ScrollView, TouchableOpacity} from 'react-native'
import { Divider } from 'react-native-elements'

import ButtonColor from '../components/ButtonColor'
import QAList from '../components/QAList'
import TestHeader from '../components/TestHeader'

import { Query } from "react-apollo"

import { container, welcome, choice, correct, incorrect, instructions, button } from '../css'

import {
        USER_ANSWERS_QUERY,
        USER_ANSWERED_QUERY
       } from '../ApolloQueries'

import SpinnerLoading1 from '../components/SpinnerLoading1'
import Error from '../components/Error'

export default class UserAnswer extends React.Component {

  static navigationOptions = {
    title: 'Your Answers',
  }

  state = {
    challenge:'',
    isVisible: false,
    errorMessage:''
  }

  componentDidMount = async () => {

    const testId = this.props.navigation.getParam('testId', 'NO-ID')
    try {
      const token = await AsyncStorage.getItem('AUTH_TOKEN')

      if (!token) {
        this.props.navigation.navigate('ReSignIn',{reDirectScreen:'UserAnswers',reDirectParams:{testId}})
      }
    }
    catch (error) {
      console.log(error)
    }

  }

  render() {

    const testId = this.props.navigation.getParam('testId', 'NO-ID')

    return (


        <View style={styles.container}>
        <ScrollView >

          <TestHeader testId={testId} />

          <Text style={styles.welcome}>Your Answers</Text>

          <Query query={USER_ANSWERED_QUERY} variables={{ testId: testId }}>
                {({ loading, error, data }) => {
                  if (loading) return <Loading1 />
                  if (error) return <Error {...error}/>

                  const userAnsweredStats = data.userAnsweredStats

              return (

          <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',margin:10,padding:10,borderRadius:5,backgroundColor:'white'}}>
          <Text style={styles.instructions}>Total: {userAnsweredStats.total} </Text>
          <Text style={styles.instructions}>Correct: {userAnsweredStats.totalCorrect} </Text>
          <Text style={styles.instructions}>{Math.round(userAnsweredStats.percentCorrect*100)}% </Text>
          </View >

          )
        }}
        </Query>

        <Query query={USER_ANSWERS_QUERY} variables={{ testId: testId }}>
              {({ loading, error, data }) => {
                if (loading) return <SpinnerLoading1 />
                if (error) return <Error {...error}/>

                const answersToRender = data.userAnswers

            return (

          <FlatList
          data={answersToRender}
          renderItem={
            ({ item, index }) => (
              <View style={styles.choice} >
               <Text style={{fontSize:16,margin:10}}>
                {item.question.question}
               </Text>

               <Divider style={{ backgroundColor: '#D3D3D3' }} />

               {item.answerCorrect ?
                 <Text style={styles.correct}>{item.answer.choice}</Text>
                 :
                 <Text style={styles.incorrect}>{item.answer.choice}</Text>}
               </View>
            )
          }
          keyExtractor={item => item.id}
        />
          )
        }}
        </Query>

          <View style={button} >
          <ButtonColor
          title="Test Dashboard"
          backgroundcolor="lightgreen"
          onpress={() => this.props.navigation.navigate('TestDashboard',{ testId:testId })}
          />
          </View>

          </ScrollView >
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container,
  choice,
  correct,
  incorrect,
  welcome,
  instructions
})
