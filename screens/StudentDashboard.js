import React from 'react'
import { AsyncStorage, StyleSheet, Image, Text, View, ScrollView } from 'react-native'
import { Query, Mutation } from "react-apollo"
import { container, button } from '../css'

import {
        USER_COURSE_QUERY,
        LOGOUT_MUTATION,
        STORE_TOKEN
        } from '../ApolloQueries'

import ButtonColor from '../components/ButtonColor'
import DashboardHeader from '../components/DashboardHeader'
import Courses from '../components/Courses'
import SpinnerLoading1 from '../components/SpinnerLoading1'
import Error from '../components/Error'

  const removeToken = async () => {
    await AsyncStorage.removeItem('USERID')
    await AsyncStorage.removeItem('AUTH_TOKEN')

    return
  }

class StudentDashboard extends React.Component {


    state = {
      userid: '',
      graphQLError: '',
      isVisibleGraph:false,
      networkError:'',
      isVisibleNet:false,
    }

  static navigationOptions = {
    title: 'Student Dashboard',
    headerLeft: null
  }

  componentDidMount = async () => {
    try {
    const userid = await AsyncStorage.getItem('USERID')
    if (!token) {
      this.props.navigation.navigate('ReSignIn',{reDirectScreen:'StudentDashboard',reDirectParams:{userId:''}})
    }
  }
  catch (error) {
    console.log(error)
  }
  this.setState({userid})
  }


 render() {

   const { userid, challenge, graphQLError, networkError, isVisibleNet, isVisibleGraph } = this.state

    return (
      <View style={styles.container}>
      <ScrollView>

          <Query query={USER_COURSE_QUERY} variables={{ userid: userid }}>
                {({ loading, error, data }) => {
                  if (loading) return <SpinnerLoading1 />
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

                    {isVisibleGraph && <ErrorMutation error={this.state.graphQLError} />}

                    {isVisibleNet && <ErrorMutation error={this.state.networkError} />}

                    <View style={button}>
                    <ButtonColor
                    title="Create Question"
                    backgroundcolor="#282828"
                    onpress={() => this.props.navigation.navigate('CreateQuestion1',{ questionId1: 'cjrr2i2im00490859c72hsk2x' })}
                    />
                      </View>

                    <View style={{padding:15}}>
                    <Mutation
                        mutation={LOGOUT_MUTATION}
                        variables={{ userId:userid }}
                        onCompleted={data => this._confirm(data)}
                        onError={error => this._error (error)}
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
    )

  }

  _error = async error => {

      const gerrorMessage = error.graphQLErrors.map((err,i) => err.message)
      this.setState({ isVisibleGraph: true, graphQLError: gerrorMessage})

      error.networkError &&
        this.setState({ isVisibleNet: true, networkError: error.networkError.message})

  }

 _confirm = (data) => {
    const { user, authMsg } = data.logout
    removeToken()
    this.props.navigation.navigate('SignOut',{ authMsg: authMsg })
    }
}

const styles = StyleSheet.create({
  container
})

export default StudentDashboard
