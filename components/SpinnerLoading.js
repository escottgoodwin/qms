import React from 'react'
import { View,StyleSheet,Text,ActivityIndicator } from 'react-native'
import ContentLoader from 'rn-content-loader';


const SpinnerLoading = () => (

      <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      </View>

    )

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e4f1fe',
    padding:25,

  }
})

export default SpinnerLoading
