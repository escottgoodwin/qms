import React from 'react'
import { AsyncStorage, StyleSheet, FlatList, Text, View, ScrollView, TouchableOpacity} from 'react-native'
import { Query } from "react-apollo"

import { container, welcome, instructions, button } from '../css'

import {USER_QUESTIONS_QUERY,
        USER_QUESTION_STATS_QUERY} from '../ApolloQueries'

import ButtonColor from '../components/ButtonColor'
import QAList from '../components/QAList'
import TestHeader from '../components/TestHeader'
import UserQuestionItem from '../components/UserQuestionItem'
import SpinnerLoading1 from '../components/SpinnerLoading1'
import Error from '../components/Error'

export default class UserQs extends React.Component {

  static navigationOptions = {
    title: 'Your Questions',
  }

  componentDidMount = async () => {

    const testId = this.props.navigation.getParam('testId', 'NO-ID')
    try {
      const token = await AsyncStorage.getItem('AUTH_TOKEN')

      if (!token) {
        this.props.navigation.navigate('ReSignIn',{reDirectScreen:'UserQs',reDirectParams:{testId}})
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

          <Text style={styles.welcome}>Your Questions</Text>

          <Query query={USER_QUESTION_STATS_QUERY} variables={{ testId: testId }} fetchPolicy="cache-and-network">
                {({ loading, error, data }) => {
                  if (loading) return <SpinnerLoading1  />
                  if (error) return <Error {...error}/>

                  const userQuestionStats = data.userQuestionStats

              return (
          <>
          <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',borderRadius:5,margin:10,padding:10,backgroundColor:'white'}}>

          <Text style={styles.instructions}>Questions : {userQuestionStats.totalQuestions} </Text>
          <Text style={styles.instructions}>Answers: {userQuestionStats.answers} </Text>
          </View >

          <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',borderRadius:5,margin:10,padding:10,backgroundColor:'white'}}>
          <Text style={styles.instructions}>Correct: {userQuestionStats.totalCorrect} </Text>
          <Text style={styles.instructions}>Percent: {Math.round(userQuestionStats.percentCorrect*100)}% </Text>

          </View >
          </>
          )
        }}
        </Query>

        <Query query={USER_QUESTIONS_QUERY} variables={{ testId: testId }} fetchPolicy="cache-and-network">
              {({ loading, error, data }) => {
                if (loading) return <SpinnerLoading1 />
                if (error) return <Error {...error}/>

                const userQuestions = data.userQuestions

            return (

          <FlatList
          data={userQuestions}
          renderItem={
            ({ item, index }) => (
              <UserQuestionItem {...item} />
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
          backgroundcolor="#282828"
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
  welcome,
  instructions
})
