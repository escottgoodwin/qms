import React from 'react'
import { StyleSheet, FlatList, Text, View, ScrollView, Image, TouchableOpacity, AsyncStorage} from 'react-native'

import {TEST_PANEL_STATS_QUERY} from '../ApolloQueries'
import ButtonColor from '../components/ButtonColor'
import QAList from '../components/QAList'
import Error from '../components/Error'
import TestHeader from '../components/TestHeader'

import { Query } from "react-apollo"

import { container, choice } from '../css'

import SpinnerLoading1 from '../components/SpinnerLoading1'

export default class AllPhotos extends React.Component {

  static navigationOptions = {
    title: 'Test Photos',
  }

  componentDidMount = async () => {

    const testId = this.props.navigation.getParam('testId', 'NO-ID')

    try {
      const token = await AsyncStorage.getItem('AUTH_TOKEN')

      if (!token) {
        this.props.navigation.navigate('ReSignIn',{reDirectScreen:'AllPhotos',reDirectParams:{testId}})
      }
    }
    catch (error) {
      console.log(error)
    }

  }

  render() {

    const testId = this.props.navigation.getParam('testId', 'NO-ID')

    return (

      <Query query={TEST_PANEL_STATS_QUERY} variables={{ testId: testId }} fetchPolicy="cache-and-network">
            {({ loading, error, data }) => {
              if (loading) return <SpinnerLoading1 />
              if (error) return <Error {...error}/>

              const panelStats = data.testPanelStats

          return (
        <View style={styles.container}>
        <ScrollView >
          <TestHeader testId={testId}/>

          <View style={{margin:10}}>
          <ButtonColor
          title="Add Photos"
          backgroundcolor="#282828"
          onpress={() => this.props.navigation.navigate('CameraLabel',{ testId:testId })}
          />
          </View>

          <FlatList
          data={panelStats}
          renderItem={
            ({ item, index }) => (
              <TouchableOpacity style={styles.choice}
              onPress={() => this.props.navigation.navigate('Photo',{photoId:item.id })}>
              <Image key={item.id} source={{uri: item.panelLink }} style={{ height:210}} />
              {item.question.length>0 &&
                <Text style={{fontSize:18,marginBottom:3,marginTop:5,textAlign: 'center',}} >
                 {item.question}
                </Text>
              }


              </TouchableOpacity>

            )
          }
          keyExtractor={item => item.id}
          />

          <View style={{margin:10}}>
          <ButtonColor
          title="Add Photos"
          backgroundcolor="#282828"
          onpress={() => this.props.navigation.navigate('CameraLabel',{ testId:testId })}
          />
          </View>

          <View style={{margin:10}}>
          <ButtonColor
          title="Test Dashboard"
          backgroundcolor="#282828"
          onpress={() => this.props.navigation.navigate('TestDashboard',{ testId:testId })}
          />
          </View>
          </ScrollView >
        </View>
      )
    }}
    </Query>
    )
  }
}

const styles = StyleSheet.create({
  container,
  choice
})
