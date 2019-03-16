import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { Button } from 'react-native-elements'
import { Query } from "react-apollo"
import dateFormat from 'dateformat'

import { container, welcome } from '../css'

import {TEST_QUERY} from '../ApolloQueries'

import SpinnerLoading1 from '../components/SpinnerLoading1'
import TestCard from '../components/TestCard'
import ButtonColor from '../components/ButtonColor'
import AnsweredStats from '../components/AnsweredStats'
import QuestionStats from '../components/QuestionStats'
import TestHeader from '../components/TestHeader'
import Error from '../components/Error'

export default class TestDashboard extends React.Component {

  static navigationOptions = {
    title: 'Test',
  }

  componentDidMount = async () => {

    const testId = this.props.navigation.getParam('testId', 'NO-ID')
    try {
      const token = await AsyncStorage.getItem('AUTH_TOKEN')

      if (!token) {
        this.props.navigation.navigate('ReSignIn',{reDirectScreen:'TestDashboard',reDirectParams:{testId}})
      }
    }
    catch (error) {
      console.log(error)
    }

  }

  render() {
    const { navigation } = this.props

    const testId = navigation.getParam('testId', 'NO-ID')

    return (
      <View style={styles.container}>
      <ScrollView>
      <Query query={TEST_QUERY} variables={{ test_id: testId }}>
            {({ loading, error, data }) => {
              if (loading) return <SpinnerLoading1  />
              if (error) return <Error {...error}/>

              const testToRender = data.test

          return (
          <>
          <TestHeader testId={testId}/>
          <Text style={styles.welcome}>
            { dateFormat(testToRender.testDate, "dddd, mmmm dS, yyyy") }
          </Text>
          <ScrollView>

          <AnsweredStats navigation={this.props.navigation} testId={testId} />

          <QuestionStats navigation={this.props.navigation} testId={testId} />

          </ScrollView>
          <View style={{margin:10}}>
            <ButtonColor
            title="All Questions"
            backgroundcolor="#1abc9c"
            onpress={() => this.props.navigation.navigate('AllQuestions',{testId:testToRender.id})}
            />
            </View>

          <View style={{margin:10}}>
          <ButtonColor
          title="Dashboard"
          backgroundcolor="#003366"
          onpress={() => this.props.navigation.navigate('StudentDashboard')}
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
  welcome
})
