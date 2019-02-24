import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView, TouchableOpacity,FlatList} from 'react-native';
import { Button, Card } from 'react-native-elements'
import { Query } from "react-apollo";
import gql from "graphql-tag";

import TestList from '../components/TestList'
import ButtonColor from '../components/ButtonColor'
import Error from '../components/Error'
import SpinnerLoading from '../components/SpinnerLoading'

const COURSE_QUERY = gql`
query CourseQuery($courseid:ID!){
  course(id:$courseid){
    id
    name
    courseNumber
    time
    institution{
      name
    }
    tests{
      id
      subject
      deleted
      testNumber
      release
      testDate
      questions{
        id
        challenges{
          challenge
        }
        questionAnswers{
        answer{
          choice
          correct
        }
      }
      }
      panels{
        id
      }
    }
  }
}
`

export default class CourseDashboard extends React.Component {

  static navigationOptions = {
    title: 'Tests',
  };

  render() {
    const { navigation } = this.props;
    const courseId = navigation.getParam('courseId', 'NO-ID')

    return (
      <ScrollView contentContainerStyle={styles.container}>
      <Query query={COURSE_QUERY} variables={{ courseid: courseId }}>
            {({ loading, error, data }) => {
              if (loading) return <SpinnerLoading />
              if (error) return <Error {...error}/>

              const courseToRender = data.course
              const tests1 = courseToRender.tests.filter(test => !test.deleted)

          return (
          <>
          <Text style={styles.welcome}>
            {courseToRender.name} - {courseToRender.courseNumber}
          </Text>

          <TestList tests={tests1} coursename={courseToRender.name}  navigation={this.props.navigation} />

          <ButtonColor
          title="Dashboard"
          backgroundcolor="#003366"
          onpress={() => this.props.navigation.navigate('StudentDashboard')}
          />

          <ButtonColor
          title="Create Question"
          backgroundcolor="#003366"
          onpress={() => this.props.navigation.navigate("CreateQuestion",{questionId: 'cjrpjxb4t005808805z0b7w7e'})}
          />

          </>
              )
            }}
          </Query>



      </ScrollView>
    );
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
    margin: 10,
  }
});
