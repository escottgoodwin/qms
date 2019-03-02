import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView, TextInput, Alert} from 'react-native';
import { Button } from 'react-native-elements'

import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";

import ButtonColor from '../components/ButtonColor'
import Choice from '../components/Choice'
import SpinnerLoading from '../components/SpinnerLoading'
import Error from '../components/Error'
import TestHeader from '../components/TestHeader'

const CREATE_QUESTION_QUERY = gql`
query CreateQuestionQuery($questionId:ID!){
  question(id:$questionId){
    id
    question
    sentPanel{
      link
      id
    }
    test{
      id
      subject
      testDate
      testNumber
      course{
        name
        institution{
          name
        }
      }
    }
  }
}
`

const CREATE_QUESTION_MUTATION = gql`
mutation CreateQuestion(
  $question: String!,
  $testId:ID!,
  $panelId:ID!,
  $choice1:String!,
  $choiceCorrect1: Boolean!,
  $choice2:String!,
  $choiceCorrect2: Boolean!,
  $choice3:String!,
  $choiceCorrect3: Boolean!,
  $choice4:String!,
  $choiceCorrect4: Boolean!,
  ){
    createQuestion(
      question: $question,
      testId:$testId,
      panelId:$panelId,
      choice1: $choice1,
      choiceCorrect1: $choiceCorrect1,
      choice2: $choice2,
      choiceCorrect2: $choiceCorrect2,
      choice3: $choice3,
      choiceCorrect3: $choiceCorrect3,
      choice4: $choice4,
      choiceCorrect4: $choiceCorrect4,
    ){
        id
        test{
          id
        }
      }
    }
  `

export default class CreateQuestion extends React.Component {

  static navigationOptions = {
    title: 'Create Question',
  };

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
    isVisible: false,
    errorMessage:''
  };

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
    isVisible,
    errorMessage
    } = this.state

    return(
      <View style={styles.container}>
      <ScrollView >
      <Query query={CREATE_QUESTION_QUERY} variables={{ questionId: questionId1 }}>
            {({ loading, error, data }) => {
              if (loading) return <SpinnerLoading />
              if (error) return <Error {...error} />

              const questionToRender = data.question

          return (
            <>
            <TestHeader testId={questionToRender.test.id}/>

            <Text style={styles.welcome}>
              {this.state.question}
            </Text>

            <Image style={{margin:10,width:'90%'}} key={questionToRender.sentPanel.link} source={{uri: questionToRender.sentPanel.link }} style={styles.logo} />
            <View style={{margin:10}}>
            <TextInput
              placeholder='Question'
              style={styles.question}
              onChangeText={(text) => this.setState({question: text})}
              multiline={true}
              numberOfLines={4}
              value={this.state.question}
             />
             </View>

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

             <View>
             {isVisible &&
               <>
               <Text style={styles.messages}>Something is wrong!</Text>
               <Text style={styles.messages}>{errorMessage}</Text>
               </>

             }
             </View>

             <View style={{margin:10}}>
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

            <View style={{margin:10}}>
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
      //this.props.navigation.navigate('Error',{error: JSON.stringify(error)})
      //const errorMessage = error.graphQLErrors.map((err,i) => err.message)
      const errorMessage = error.graphQLErrors.map((err,i) => err.message)

      this.setState({ isVisible: true, errorMessage})
  }


  _confirm = (data) => {
    const { id, test } = data.createQuestion
    const { navigation } = this.props;
    this.props.navigation.navigate('ReviewQuestion',{ newQuestionId: id, oldQuestionId: questionId1, testId: test.id })
    }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e4f1fe',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 5,
  },
  messages: {
    padding:30,
    fontSize:18,
    textAlign:'center',
    color:'red'
  },
  logo: {
    height: 220,
    marginBottom: 15,
    marginTop: 15,
    width: 350,
  },
  choices:{
    flexDirection:"row",
    justifyContent: 'center',
    alignItems: 'center',
  },
  choicetext:{
    fontWeight:'bold',
    fontSize:18,
    color:'#484848'
  },
  question:{
    height: 80,
    width: 300,
    backgroundColor:'white',
    borderRadius: 10,
    margin:5,
    padding:10
  },
  input:{
    height: 40,
    width: 250,
    backgroundColor:'white',
    borderRadius: 10,
    margin:5,
    padding:10
  },
  messages: {
    padding:30,
    fontSize:18,
    textAlign:'center',
    color:'red'
  },
  answer:{
    height: 40,
    width: 100,
    backgroundColor:'white',
    borderRadius: 10,
    margin:5,
    padding:10
  }
});
