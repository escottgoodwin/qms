import React from 'react'
import { AsyncStorage, StyleSheet, Text, View, ScrollView } from 'react-native'
import { Query } from "react-apollo"

import { container, welcome } from '../css'


import {COURSE_QUERY} from '../ApolloQueries'

import TestList from '../components/TestList'
import ButtonColor from '../components/ButtonColor'
import Error from '../components/Error'
import SpinnerLoading1 from '../components/SpinnerLoading1'

export default class CourseDashboard1 extends React.Component {

  static navigationOptions = {
    title: 'Tests',
  }

  componentDidMount = async () => {

    const courseId = this.props.navigation.getParam('courseId', 'NO-ID')

    try {
    const token = await AsyncStorage.getItem('AUTH_TOKEN')

    if (!token) {
      this.props.navigation.navigate('ReSignIn',{reDirectScreen:'CourseDashboard',reDirectParams:{courseId}})
    }
  }
  catch (error) {
    console.log(error)
  }

  }


  render() {
    const { navigation } = this.props
    const courseId = navigation.getParam('courseId', 'NO-ID')

    return (
      <ScrollView contentContainerStyle={styles.container}>

      <Query query={COURSE_QUERY} variables={{ courseid: courseId }} >
            {({ loading, error, data }) => {
              if (loading) return <SpinnerLoading1 />
              if (error) return <Error {...error}/>

              const courseToRender = data.course
              const tests1 = courseToRender.tests.filter(test => !test.deleted)

          return (
          <>
          <Text style={styles.welcome}>
            {courseToRender.name} - {courseToRender.courseNumber}
          </Text>

          <TestList tests={tests1} coursename={courseToRender.name}  navigation={this.props.navigation} />

          <View style={{margin:10}}>

          </View>
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
