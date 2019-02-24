import React from 'react';
import { StyleSheet, Platform, FlatList, Image, TouchableOpacity, Text, View, ScrollView,TextInput,Alert} from 'react-native';

import { Query } from "react-apollo";
import gql from "graphql-tag";
const moment = require('moment')

import SpinnerLoading from '../components/SpinnerLoading'
import Error from '../components/Error'


const TEST_HEADER_QUERY = gql`
query TestHeaderQuery($testId:ID!){
  test(id:$testId){
    id
    subject
    testNumber
    testDate
    course{
      id
      name
      courseNumber
    }
}
}
`

export default class TestHeader extends React.Component {

  render() {

    const { navigation } = this.props

    return(
      <Query query={TEST_HEADER_QUERY} variables={{ testId: this.props.testId }}>
            {({ loading, error, data }) => {
              if (loading) return <SpinnerLoading />
              if (error) return <Error {...error}/>

              const testToRender = data.test

          return (
            <View>
            <Text style={styles.welcome}>
              {testToRender.course.name} - {testToRender.course.courseNumber}
            </Text>

            <Text style={styles.welcome}>
              {testToRender.subject} - {testToRender.testNumber}
            </Text>
            </View>

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
    margin: 7,
  },
});
