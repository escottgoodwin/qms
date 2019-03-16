import React from 'react'
import { StyleSheet, Image, Text, View, ScrollView, TextInput, AsyncStorage } from 'react-native'

import { Query, Mutation } from "react-apollo"

import { container, welcome, button, question } from '../css'

import {CREATE_QUESTION_QUERY,CREATE_QUESTION_MUTATION} from '../ApolloQueries'

import ButtonColor from '../components/ButtonColor'
import Choice from '../components/Choice'
import SpinnerLoading1 from '../components/SpinnerLoading1'
import Error from '../components/Error'
import ErrorMutation from '../components/ErrorMutation'
import TestHeader from '../components/TestHeader'

export default class CreateQuestion extends React.Component {

  static navigationOptions = {
    title: 'Create Question',
  }

  componentDidMount = async () => {

    const questionId1 = this.props.navigation.getParam('questionId1', 'NO-ID')
    try {
      const token = await AsyncStorage.getItem('AUTH_TOKEN')

      if (!token) {
        this.props.navigation.navigate('ReSignIn',{reDirectScreen:'CreateQuestion1',reDirectParams:{questionId1}})
      }
    }
    catch (error) {
      console.log(error)
    }

  }


  state = {
    testId:'',
    panelId:'',
    question:'',
    choice1:'',
    choiceCorrect1:false,
    choice2:'',
    choiceCorrect2:false,
    choice3:'',
    choiceCorrect3:false,
    choice4:'',
    choiceCorrect4:false,
    graphQLError: '',
    isVisibleGraph:false,
    networkError:'',
    isVisibleNet:false,
    questionId1:''
  }

  render(){
    const { navigation } = this.props
    const questionId1 = this.props.navigation.getParam('questionId1', 'NO-ID')

    const {
    question,
    choice1,
    choiceCorrect1,
    choice2,
    choiceCorrect2,
    choice3,
    choiceCorrect3,
    choice4,
    choiceCorrect4,
    graphQLError,
    networkError,
    isVisibleNet,
    isVisibleGraph
    } = this.state


    return(
      <View style={styles.container}>
      <ScrollView >
      <Query query={CREATE_QUESTION_QUERY} variables={{ questionId: questionId1 }}>
            {({ loading, error, data }) => {
              if (loading) return <SpinnerLoading1 />
              if (error) return <Error {...error} />

              const questionToRender = data.question

          return (
            <>
            <TestHeader testId={questionToRender.test.id}/>
            <View style={{padding:5}}>
            <Text style={styles.welcome}>
              Create Question
            </Text>
            <Image source={{uri: questionToRender.sentPanel.link }} style={{ margin:10, width:'95%',height:200, resizeMode: "contain",}} />
            </View>

            <View style={{padding:5}}>
            <TextInput
              placeholder='Question'
              style={styles.question}
              onChangeText={(text) => this.setState({question: text})}
              multiline={true}
              numberOfLines={4}
              value={this.state.question}
             />
             </View>

             <View style={{padding:5}}>
             <Choice
             changetext={(text) => this.setState({choice1:text})}
             changecheck={() => this.setState({
               choiceCorrect1:true,
               choiceCorrect2:false,
               choiceCorrect3:false,
               choiceCorrect4:false
             })}
             choiceValue={this.state.choice1}
             choiceCorrect={this.state.choiceCorrect1}
             placeholder='Choice 1'
             />

             <Choice
             changetext={(text) => this.setState({choice2:text})}
             changecheck={() => this.setState({
               choiceCorrect1:false,
               choiceCorrect2:true,
               choiceCorrect3:false,
               choiceCorrect4:false
             })}
             choiceValue={this.state.choice2}
             choiceCorrect={this.state.choiceCorrect2}
             placeholder='Choice 2'
             />

             <Choice
             changetext={(text) => this.setState({choice3:text})}
             changecheck={() => this.setState({
               choiceCorrect1:false,
               choiceCorrect2:false,
               choiceCorrect3:true,
               choiceCorrect4:false
             })}
             choiceValue={this.state.choice3}
             choiceCorrect={this.state.choiceCorrect3}
             placeholder='Choice 3'
             />

             <Choice
             changetext={(text) => this.setState({choice4:text})}
             changecheck={() => this.setState({
               choiceCorrect1:false,
               choiceCorrect2:false,
               choiceCorrect3:false,
               choiceCorrect4:true
             })}
             choiceValue={this.state.choice4}
             choiceCorrect={this.state.choiceCorrect4}
             placeholder='Choice 4'
             />
              </View>

              {isVisibleGraph && <ErrorMutation error={this.state.graphQLError} />}

              {isVisibleNet && <ErrorMutation error={this.state.networkError} />}

             <View style={styles.button} >
             <Mutation
                 mutation={CREATE_QUESTION_MUTATION}
                 variables={{
                   testId: questionToRender.test.id,
                   panelId: questionToRender.sentPanel.id,
                   question: question,
                   choice1: choice1,
                   choice2: choice2,
                   choice3: choice3,
                   choice4: choice4,
                   choiceCorrect1: choiceCorrect1,
                   choiceCorrect2: choiceCorrect2,
                   choiceCorrect3: choiceCorrect3,
                   choiceCorrect4: choiceCorrect4,
                 }}
                 onCompleted={data => this._confirm(data)}
                 onError={error => this._error (error)}
               >
                 {mutation => (

                  <ButtonColor
                   title="Review"
                   backgroundcolor="#282828"
                   onpress={mutation}
                   />
                 )}
               </Mutation>
               </View>

               <View style={styles.button} >

             <ButtonColor
             title="Cancel"
             backgroundcolor="#282828"
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

  _error = async error => {

      const gerrorMessage = error.graphQLErrors.map((err,i) => err.message)
      this.setState({ isVisibleGraph: true, graphQLError: gerrorMessage})

      error.networkError &&
        this.setState({ isVisibleNet: true, networkError: error.networkError.message})

  }

  _confirm = (data) => {
    const { id, test } = data.createQuestion
    const { navigation } = this.props
    this.props.navigation.navigate('ReviewQuestion',{ newQuestionId: id, oldQuestionId: questionId1, testId: test.id })
    }

}

const styles = StyleSheet.create({
  container,
  welcome,
  button,
  question
})
