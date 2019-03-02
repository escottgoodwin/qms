import React from 'react'
import { AsyncStorage, StyleSheet, Image, Text, View, ScrollView } from 'react-native'
import { Button } from 'react-native-elements'
import { Query, Mutation } from "react-apollo"
import { execute, makePromise } from 'apollo-link'
import { HttpLink } from 'apollo-boost'
import gql from "graphql-tag";
import fetch from 'node-fetch'
import firebase from 'react-native-firebase';
import type { Notification, NotificationOpen } from 'react-native-firebase';

import ButtonColor from '../components/ButtonColor'
import DashboardHeader from '../components/DashboardHeader'
import Courses from '../components/Courses'
import SpinnerLoading from '../components/SpinnerLoading'
import Error from '../components/Error'

const COURSE_QUERY = gql`
query UserQuery($userid: ID!) {
  user(id: $userid){
    id
    firstName
    lastName
    invitesSentTo{
      id
      course{
        id
        courseNumber
        name
        time
        teachers{
          firstName
          lastName
        }
        institution{
          name
        }
      }
    }
    studentCourses{
      id
      name
      time
      deleted
      institution{
        name
      }
      teachers{
        firstName
        lastName
      }
      tests{
        id
      }
    }
  }
}
`;

var LOGOUT_MUTATION = gql`
    mutation {
      logout{
        authMsg
        user{
          online
          firstName
          lastName
        }
      }
    }
  `
  const STORE_TOKEN = gql`
  mutation StoreToken($pushToken:String!){
    updateUser(pushToken:$pushToken){
      id
      pushToken
    }
  }
  `

  const removeToken = async () => {
    await AsyncStorage.removeItem('USERID')
    return
  }

class StudentDashboard extends React.Component {


    state = {
      userid: '',
      nofitication:{}
    };

  static navigationOptions = {
    title: 'Student Dashboard',
    headerLeft: null
  }

  componentDidMount = async () => {
    const userid = await AsyncStorage.getItem('USERID')
    this.setState({userid})
  }


 render() {
   const userid = this.state.userid
    return (
      <View style={styles.container}>
      <ScrollView>

          <Query query={COURSE_QUERY} variables={{ userid: userid }}>
                {({ loading, error, data }) => {
                  if (loading) return <SpinnerLoading />
                  if (error) return <Error {...error}/>

                  const userToRender = data.user
                  const fullName = userToRender.firstName + ' ' + userToRender.lastName
                  const studentCourses = userToRender.studentCourses.filter(course => !course.deleted)


                  return (
                      <>
                    <DashboardHeader
                    name={fullName}
                    image='../assets/RNFirebase.png'
                    />

                    <Courses
                    classes={studentCourses}
                    navigation={this.props.navigation}
                        />

                    <View style={{margin:10}}>
                    <Mutation
                        mutation={LOGOUT_MUTATION}
                        variables={{ userId:userid }}
                        onCompleted={data => this._confirm(data)}
                      >
                        {mutation => (

                          <ButtonColor
                          title="Sign Out"
                          backgroundcolor="#282828"
                          onpress={mutation}
                          />

                        )}
                      </Mutation>
                      </View>

                    </>
                      )
                    }}
            </Query>

      </ScrollView>
      </View>
    );

  }
 _confirm = (data) => {
    const { user, authMsg } = data.logout
    removeToken()
    this.props.navigation.navigate('SignOut',{ authMsg: authMsg })
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e4f1fe',
  }
});

export default StudentDashboard
