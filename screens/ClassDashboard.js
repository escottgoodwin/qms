import React from 'react'
import { AsyncStorage, StyleSheet, Text, View, ScrollView } from 'react-native'
import { Query } from "react-apollo"
import gql from "graphql-tag";

import { container, welcome } from '../css'

import {COURSE_QUERY} from '../ApolloQueries'

const COURSEA_QUERY = gql`
query CourseQuery($courseid:ID!){
  course(id:$courseid){
    id
    name
    courseNumber
  }
}
`

import TestList from '../components/TestList'
import ButtonColor from '../components/ButtonColor'
import Error from '../components/Error'
import SpinnerLoading1 from '../components/SpinnerLoading1'

export default class CourseDashboard1 extends React.Component {

  static navigationOptions = {
    title: 'Course',
  }


  render() {
    const { navigation } = this.props
    const courseId = navigation.getParam('courseId', 'NO-ID')

    return (
      <View style={styles.container}>
      <ScrollView >

      <Query query={COURSE_QUERY} variables={{ courseid: courseId }} >
            {({ loading, error, data }) => {
              if (loading) return <SpinnerLoading1 />
              if (error) return <Error {...error}/>

              const { name, courseNumber,  tests } = data.course
              const tests1 = tests.filter(test => !test.deleted)

          return (
          <>
          <Text style={styles.welcome}>
            {name} - {courseNumber}
          </Text>

          <View style={{margin:10}}>

          <TestList tests={tests1} coursename={name}  navigation={this.props.navigation} />

          </View>

          <View style={{padding:15,alignItems:'center'}}>

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
