import React from 'react'
import { AsyncStorage, StyleSheet, Platform, Image, Text, Dimensions, View, ScrollView,TextInput,Alert} from 'react-native'
import { Button, Icon, Divider } from 'react-native-elements'

import { Query, Mutation } from "react-apollo"

import { container, question, panel } from '../css'

import QuestionChoices from '../components/QuestionChoices'
import ReviewChoice from '../components/ReviewChoice'

import {QUESTION_QUERY,
        SEND_QUESTION_MUTATION} from '../ApolloQueries'

import ButtonColor from '../components/ButtonColor'
import Choice from '../components/Choice'
import SpinnerLoading1 from '../components/SpinnerLoading1'
import Error from '../components/Error'

export default class ReviewQuestion extends React.Component {

  static navigationOptions = {
    title: 'Review Question',
  }

  state ={
    graphQLError: '',
    isVisibleGraph:false,
    networkError:'',
    isVisibleNet:false,
  }

  componentDidMount = async () => {

    const { navigation } = this.props

    const newQuestionId = navigation.getParam('newQuestionId', 'NO-ID')
    const oldQuestionId = navigation.getParam('oldQuestionId', 'NO-ID')
    const testId = navigation.getParam('testId', 'NO-ID')
    try {
      const token = await AsyncStorage.getItem('AUTH_TOKEN')

      if (!token) {
        this.props.navigation.navigate('ReSignIn',{reDirectScreen:'CreateQuestion1',reDirectParams:{newQuestionId,oldQuestionId,testId}})
      }
    }
    catch (error) {
      console.log(error)
    }

  }

  render() {

    const { navigation } = this.props

    const {graphQLError, networkError, isVisibleNet, isVisibleGraph} = this.state

    return (

      <ScrollView >
      <View style={styles.container}>
      <Query query={QUESTION_QUERY} variables={{ questionId: newQuestionId }} fetchPolicy="cache-and-network">
            {({ loading, error, data }) => {
              if (loading) return <SpinnerLoading1 />
              if (error) return <Error {...error} />

              const questionToRender = data.question

          return (
            <>
            <Text key={questionToRender.test.course.name} style={styles.welcome}>
            {questionToRender.test.course.name} - {questionToRender.test.course.institution.name}
            </Text>

            <Text key={questionToRender.test.subject} style={styles.welcome}>
            {questionToRender.test.subject} - {questionToRender.test.testNumber}
            </Text>

            <Image key={questionToRender.panel.link} source={{uri: questionToRender.panel.link }} style={styles.panel} />

            <View key={questionToRender.test.testNumber} style={styles.question}>
              <Text key={questionToRender.question} >
                {questionToRender.question}
              </Text>
            </View>

            {
              questionToRender.choices.map(choice =>
              <ReviewChoice key={choice.id} {...choice} />
              )
            }
            </>
          )
          }}
          </Query>

          {isVisibleGraph && <ErrorMutation error={this.state.graphQLError} />}

          {isVisibleNet && <ErrorMutation error={this.state.networkError} />}

             <Mutation
                 mutation={SEND_QUESTION_MUTATION}
                 variables={{
                   questionId: newQuestionId,
                   testId: testId
                 }}
                 onCompleted={data => this._confirm(data)}
                 onError={error => this._error (error)}
               >
                 {mutation => (
                   <ButtonColor
                   title="Send Question"
                   backgroundcolor="#282828"
                   onpress={mutation}
                   />
                 )}
               </Mutation>

           <ButtonColor
           title="Edit"
           backgroundcolor="#282828"
           onpress={() => this.props.navigation.navigate('EditQuestion',{ questionId: newQuestionId })}
           />

          </View>
      </ScrollView>
    )
  }

  _error = async error => {

      const gerrorMessage = error.graphQLErrors.map((err,i) => err.message)
      this.setState({ isVisibleGraph: true, graphQLError: gerrorMessage})

      error.networkError &&
        this.setState({ isVisibleNet: true, networkError: error.networkError.message})

  }

  _confirm = (data) => {
    const { id,question } = data.sendQuestion
    const { navigation } = this.props
    const oldQuestionId = navigation.getParam('oldQuestionId', 'NO-ID')

    this.props.navigation.navigate('AnswerQuestion',{ questionId: oldQuestionId })
    }
}

const styles = StyleSheet.create({
  container,
  question,
  panel
})
