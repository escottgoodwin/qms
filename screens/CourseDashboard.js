import React from 'react'
import { AsyncStorage, StyleSheet, Text, View, ScrollView } from 'react-native'
import { Query } from "react-apollo"

import { container, welcome } from '../css'

import {COURSE_QUERY} from '../ApolloQueries'

import TestList from '../components/TestList'
import ButtonColor from '../components/ButtonColor'
import Error from '../components/Error'
import SpinnerLoading1 from '../components/SpinnerLoading1'

export default class CourseDashboard extends React.Component {

  static navigationOptions = {
    title: 'Course',
  }


  render() {
    const { navigation } = this.props
    const courseId = navigation.getParam('courseId', 'NO-ID')

    return (
      <ScrollView contentContainerStyle={styles.container}>

      <Query query={COURSE_QUERY} variables={{ courseid: courseId }} fetchPolicy="cache-and-network">
            {({ loading, error, data }) => {
              if (loading) return <SpinnerLoading1 />
              if (error) return <Error {...error}/>

              const courseToRender = data.course
              const tests1 = courseToRender.tests.filter(test => !test.deleted)

          return (

          <>


          <Text style={styles.welcome} >
            Test
          </Text>
          </>

        )
      }}
      </Query>

          



      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container,
  welcome
})
