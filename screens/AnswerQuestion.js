import React from 'react'
import { StyleSheet, Image, Text, View, ScrollView, TextInput, FlatList, TouchableOpacity, Dimensions} from 'react-native'
import { Button, Card } from 'react-native-elements'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button'

import { Query, Mutation } from "react-apollo"

import { container, welcome, radioForm, question1 } from '../css'

import {ANSWER_QUESTION_QUERY,
        ANSWER_QUESTION_MUTATION} from '../ApolloQueries'

import ButtonColor from '../components/ButtonColor'
import SpinnerLoading1 from '../components/SpinnerLoading1'
import Error from '../components/Error'
import ErrorMutation from '../components/ErrorMutation'
import TestHeader from '../components/TestHeader'

export default class AnswerQuestion extends React.Component {

  static navigationOptions = {
    title: 'Answer Question',
  }

  componentDidMount = async () => {

    const questionId = this.props.navigation.getParam('questionId', 'NO-ID')

    try {
      const token = await AsyncStorage.getItem('AUTH_TOKEN')

      if (!token) {
        this.props.navigation.navigate('ReSignIn',{reDirectScreen:'AnswerQuestion',reDirectParams:{questionId}})
      }
    }
    catch (error) {
      console.log(error)
    }

  }

  state = {
          answerChoiceId: '',
          chosenLabel:'',
          graphQLError: '',
          isVisibleGraph:false,
          networkError:'',
          isVisibleNet:false,
      }

_onSelect = ( item ) => {
  this.setState({
    answerChoiceId:item.value,
    chosenLabel:item.label,
  })
}


  render() {
    const { navigation } = this.props

    const questionId = navigation.getParam('questionId', 'NO-ID')

    const {graphQLError, networkError, isVisibleNet, isVisibleGraph} = this.state

    return (
      <View style={styles.container}>
      <ScrollView >

      <Query query={ANSWER_QUESTION_QUERY} variables={{ questionId: questionId }}>
            {({ loading, error, data }) => {
              if (loading) return <SpinnerLoading1 />
              if (error) return <Error {...error}/>

              const questionToRender = data.question
              const checkboxes = questionToRender.choices.map(choice => ({'value':choice.id, 'label':choice.choice}))


          return (
            <>
            <TestHeader testId={questionToRender.test.id}/>

            <View style={styles.question1}>
            <Text style={styles.welcome}>
              {questionToRender.question}
            </Text>
            </View>


            <View style={styles.radioForm}>
            <RadioForm
              radio_props={checkboxes}
              initial={-1}
              onPress={(value) => {this.setState({answerChoiceId:value})}}
            />
            </View>
            </>
            )

          }}
          </Query>

          {isVisibleGraph && <ErrorMutation error={this.state.graphQLError} />}

          {isVisibleNet && <ErrorMutation error={this.state.networkError} />}


             <Mutation
                 mutation={ANSWER_QUESTION_MUTATION}
                 variables={{
                   questionId: questionId,
                   answerChoiceId: this.state.answerChoiceId
                 }}
                 onCompleted={data => this._confirm(data)}
                 onError={error => this._error (error)}
               >
                 {mutation => (
                   <ButtonColor
                   title="Submit Answer"
                   backgroundcolor="#282828"
                   onpress={mutation}
                   />
                 )}
               </Mutation>

      </ScrollView>
      </View>
    )
  }

  _error = async error => {


      const gerrorMessage = error.graphQLErrors.map((err,i) => err.message)
      this.setState({ isVisibleGraph: true, graphQLError: gerrorMessage})

      error.networkError &&
        this.setState({ isVisibleNet: true, networkError: error.networkError.message})

  }

  _confirm = (data) => {
    const { id } = data.addAnswer
    this.props.navigation.navigate('QuestionAnswered',{ answerId: id })
    }

}

const styles = StyleSheet.create({
  container,
  radioForm,
  question1,
  welcome
})
