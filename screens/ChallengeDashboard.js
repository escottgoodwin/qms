import React from 'react'
import { AsyncStorage, StyleSheet, Image, Text, View, ScrollView, TextInput } from 'react-native'
const moment = require('moment')

import { Query, Mutation } from "react-apollo"

import { container, welcome, choice, question, panel, input, button } from '../css'

import {CHALLENGE_ANSWER_QUERY,
        CREATE_CHALLENGE_MUTATION} from '../ApolloQueries'

import ButtonColor from '../components/ButtonColor'
import SpinnerLoading1 from '../components/SpinnerLoading1'
import QAList from '../components/QAList'
import ChallengeList from '../components/ChallengeList'
import Error from '../components/Error'
import TestHeader from '../components/TestHeader'

export default class ChallengeDashboard extends React.Component {

  static navigationOptions = {
    title: 'Challenge Answer'
  }

    state = {
      challenge:'',
      graphQLError: '',
      isVisibleGraph:false,
      networkError:'',
      isVisibleNet:false,
    }

    componentDidMount = async () => {

      const answerId = this.props.navigation.getParam('answerId', 'NO-ID')
      const questionId = this.props.navigation.getParam('questionId', 'NO-ID')

      try {
        const token = await AsyncStorage.getItem('AUTH_TOKEN')

        if (!token) {
          this.props.navigation.navigate('ReSignIn',{reDirectScreen:'ChallengeDashboard',reDirectParams:{answerId,questionId}})
        }
      }
      catch (error) {
        console.log(error)
      }

    }

  render() {
    const { navigation } = this.props
    const { challenge, graphQLError, networkError, isVisibleNet, isVisibleGraph } = this.state

    const answerId = this.props.navigation.getParam('answerId', 'NO-ID')
    const questionId = this.props.navigation.getParam('questionId', 'NO-ID')

    return (
      <View style={styles.container}>
      <ScrollView >

        <Query query={CHALLENGE_ANSWER_QUERY} variables={{ questionId: questionId }} fetchPolicy="cache-and-network">
              {({ loading, error, data }) => {
                if (loading) return <SpinnerLoading1 />
                if (error) return <Error {...error}/>

                const questionToRender = data.answers.answers[0]

            return (
              <>
              <TestHeader testId={questionToRender.question.test.id}/>

              <Text style={styles.choice}>
                {questionToRender.question.question}
              </Text>

              <Text style={styles.choice}>
                Correct: {questionToRender.question.choices.filter(choice => choice.correct)[0].choice}
              </Text>

              <Text style={styles.choice}>
                Your Choice: {questionToRender.answer.choice}
              </Text>

              <Image key={questionToRender.question.panel.link} source={{uri: questionToRender.question.panel.link }} style={styles.logo} />

        <TextInput
          placeholder='Challenge Question'
          style={{height: 80,width: 320, backgroundColor:'white',borderRadius: 10,borderColor: 'darkgrey',margin:5,padding:10}}
          onChangeText={(text) => this.setState({challenge:text})}
          multiline={true}
          numberOfLines={4}
          value={this.state.challenge}
         />

         {isVisibleGraph && <ErrorMutation error={this.state.graphQLError} />}

         {isVisibleNet && <ErrorMutation error={this.state.networkError} />}


         <Mutation
             mutation={CREATE_CHALLENGE_MUTATION}
             variables={{
               challenge: challenge,
               answerId: answerId
             }}
             onCompleted={data => this._confirm(data)}
             onError={error => this._error (error)}
           >
             {mutation => (

               <View style={button} >

               <ButtonColor
               title="Submit Challenge"
               backgroundcolor="#282828"
               onpress={mutation}
               />

               </View>

             )}
           </Mutation>


         <Text style={styles.welcome}>
           Other Challenges of this Question
         </Text>

         <ChallengeList navigation={this.props.navigation} questionToRender={questionToRender} />

         <View style={button} >
         <ButtonColor
         title="Cancel"
         backgroundcolor="#282828"
         onpress={() => this.props.navigation.navigate('TestDashboard',{ testId: questionToRender.question.test.id })}
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

  _error = async error => {

      const gerrorMessage = error.graphQLErrors.map((err,i) => err.message)
      this.setState({ isVisibleGraph: true, graphQLError: gerrorMessage})

      error.networkError &&
        this.setState({ isVisibleNet: true, networkError: error.networkError.message})

  }

  _confirm = (data) => {
    const { id } = data.addChallenge
    this.props.navigation.navigate('Challenge',{ challengeId: id })
    }
}

const styles = StyleSheet.create({
  container,
  choice,
  question,
  welcome,
  panel,
  input
})
