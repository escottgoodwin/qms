import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import { Button, Card } from 'react-native-elements'
import { Query } from "react-apollo";
import gql from "graphql-tag";
import SpinnerLoading from '../components/SpinnerLoading'

const USER_ANSWERED_QUERY = gql`
query UserAnsweredStats($testId:ID!){
  userAnsweredStats(testId:$testId){
    total
    totalCorrect
    percentCorrect
  }
}
`

export default class AnsweredStats extends React.Component {

  render() {

    return(

      <Query query={USER_ANSWERED_QUERY} variables={{ testId: this.props.testId }}>
            {({ loading, error, data }) => {
              if (loading) return <SpinnerLoading />
              if (error) return <Text>{JSON.stringify(error)}</Text>

              const userAnsweredStats = data.userAnsweredStats

          return (

      <TouchableOpacity style={{margin:10}} onPress={() => this.props.navigation.navigate('UserAnswers',{testId:this.props.testId})} >
      <Card title='Your Answers' containerStyle={{width: "90%"}}>
      <Text style={styles.instructions}>Questions Total: {userAnsweredStats.total} </Text>
      <Text style={styles.instructions}>Correct: {userAnsweredStats.totalCorrect} </Text>
      <Text style={styles.instructions}>Percent: {Math.round(userAnsweredStats.percentCorrect*100)}% </Text>
      </Card >
      </TouchableOpacity>

      )
    }}
    </Query>


    )
  }
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    fontSize:18
  }

});
