import React from 'react'
import { StyleSheet, ScrollView } from 'react-native'

import { Query } from "react-apollo"

import { container } from '../css'

import {EDIT_QUESTION_QUERY} from '../ApolloQueries'

import ButtonColor from '../components/ButtonColor'
import SpinnerLoading1 from '../components/SpinnerLoading1'
import Error from '../components/Error'
import EditQuestionForm from '../components/EditQuestionForm'

export default class EditQuestion extends React.Component {

  static navigationOptions = {
    title: 'Edit Question',
  }

  componentDidMount = async () => {

    const questionId = this.props.navigation.getParam('questionId', 'NO-ID')

    try {
      const token = await AsyncStorage.getItem('AUTH_TOKEN')

      if (!token) {
        this.props.navigation.navigate('ReSignIn',{reDirectScreen:'EditQuestion',reDirectParams:{questionId}})
      }
    }
    catch (error) {
      console.log(error)
    }

  }

  render(){
    const { navigation } = this.props

    const questionId = navigation.getParam('questionId', 'NO-ID')

    return(
      <ScrollView contentContainerStyle={styles.container}>
      <Query query={EDIT_QUESTION_QUERY} variables={{ questionId: questionId }}>
            {({ loading, error, data }) => {
              if (loading) return <SpinnerLoading1 />
              if (error) return <Error {...error}/>

              const questionToRender = data.question

          return (
            <>
            <EditQuestionForm navigation={navigation} question={questionToRender}/>

             <ButtonColor
             title="Cancel"
             backgroundcolor="#282828"
             onpress={() => this.props.navigation.navigate('StudentDashboard')}
             />
             </>
           )
         }}
         </Query>
      </ScrollView>
    )
  }
}


const styles = StyleSheet.create({
  container
})
