import React,{Component} from 'react'
import RNFetchBlob from 'rn-fetch-blob'
import { KeyboardAvoidingView, StyleSheet, TouchableOpacity ,Image, Text, TextInput, View, ScrollView, Dimensions, AsyncStorage } from 'react-native'
import { RNCamera } from 'react-native-camera'
import { Icon } from 'react-native-elements'
import axios from 'axios'

import { container, welcome, logo, input } from '../css'

import ButtonColor from '../components/ButtonColor'

import {PHOTO_LABEL_MUTATION} from '../ApolloQueries'

const getToken = async () => {
  const token = await AsyncStorage.getItem('AUTH_TOKEN')
  return token
}

export default class CameraLabels extends Component {

  static navigationOptions = {
    title: 'Camera',
  }

  state = {
    label:''
  }

 takePicture = async () => {

    if (this.camera) {
      const { navigation } = this.props
      const testId = navigation.getParam('testId', 'NO-ID')
      const options = { quality: 0.5 }
      const image = await this.camera.takePictureAsync(options)
      const uri = image.uri

      const cloudinary = await RNFetchBlob.fetch('POST', `https://api.cloudinary.com/v1_1/dkucuwpta/image/upload`, {
      'Content-Type': 'multipart/form-data'
      }, [
        {name: 'file', filename: image.name, type: image.type, data: RNFetchBlob.wrap(image.uri)},
        {name: 'upload_preset', data: 'tx7xnbvf'}
      ])

      console.log(cloudinary)

      const data = cloudinary.data
      const fileURL = cloudinary.secure_url // You should store this URL for future references in your app

      const token = getToken()
      axios({
        url: 'https://qbe1.herokuapp.com/',
        method: 'post',
        headers: {
          authorization: this.props.token ? `Bearer ${token}` : "",
        },
        data: {
          query: PHOTO_LABEL_MUTATION,
            variables: {testId:testId, link:fileURL, label: this.state.label}
          }

      }).then(result => {
        let grapqhql_resp = result.request.response
        console.log(grapqhql_resp)
      })

      this.setState({label:''})

  }
}

  render() {
    const { navigation } = this.props
    const { label } = this.state


    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">

      <RNCamera
          ref={ref => {
            this.camera = ref
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={'We need your permission to use your camera phone'}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
            console.log(barcodes)
          }}
        >

       <TextInput
        placeholder='Label'
        style={styles.input}
        onChangeText={(text) => this.setState({label:text})}
        value={label}
        />

        <TouchableOpacity
        style={{borderRadius:50,borderColor:'red',borderWidth:4,padding:10, margin:10}}
        onPress={() => this.takePicture()} >

        <Icon
          name='camera'
          type='font-awesome'
          color='red'
          size={36}
           />

          </TouchableOpacity>
        </RNCamera>


       </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container,
  logo,
  welcome,
  input,
  preview: {
   flex: 1,
   justifyContent: 'flex-end',
   alignItems: 'center',
   height: '100%',
   width: '100%'
 },
})
