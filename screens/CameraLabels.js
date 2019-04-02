import React,{Component} from 'react'
import RNFetchBlob from 'rn-fetch-blob'
import { KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity ,Image, Text, TextInput, View, ScrollView, Dimensions, AsyncStorage } from 'react-native'
import { RNCamera } from 'react-native-camera'
import { execute, makePromise } from 'apollo-link'
import fetch from 'node-fetch';
import {HttpLink} from 'apollo-link-http'
import { Icon } from 'react-native-elements'
import axios from 'axios'
import firebase from 'react-native-firebase';
const uuidv4 = require('uuid/v4');

import { container, welcome, logo, input } from '../css'

import ButtonColor from '../components/ButtonColor'

import {PHOTO_LABEL_MUTATION} from '../ApolloQueries'

const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

export default class CameraLabels extends Component {

  static navigationOptions = {
    title: 'Camera',
  }

  state = {
    label:'',
    isVisibleError: false,
    photoError: '',
    progressVisible:false,
    progress:0,
    message:'',
    downloadUrl:''
  }

  uploadImage(uri, mime = 'application/octet-stream') {
    return new Promise((resolve, reject) => {
      const uploadUri = uri.replace('file://', '')
      let uploadBlob = null

      const imageRef = firebase.storage().ref('images').child('image_001')

      fs.readFile(uploadUri, 'base64')
        .then((data) => {
          return Blob.build(data, { type: `${mime};BASE64` })
        })
        .then((blob) => {
          uploadBlob = blob

          const imageId = uuidv4()
          const fileName = imageId
          const ref = firebase.storage().ref('testpanels').child(fileName)
          return imageRef.put(blob, { contentType: mime })

        })
        .then(() => {
          uploadBlob.close()
          return imageRef.getDownloadURL()
        })
        .then((url) => {
          resolve(url)
        })
        .catch((error) => {
          reject(error)
      })
    })
  }

 takePicture = async () => {

    if (this.camera) {
      const { navigation } = this.props
      const testId = navigation.getParam('testId', 'NO-ID')
      const options = { quality: 0.25, base64: true }
      const image = await this.camera.takePictureAsync(options)


      const storage = firebase.storage();
      const sessionId = new Date().getTime();
      firebase.storage()
        .ref('testpanels')
        .child(`${sessionId}`)
        .putFile(image.uri)
        .then(uploadedFile => {
           const fbUrl =  uploadedFile.getDownloadURL()
            const operation = {
              query: PHOTO_LABEL_MUTATION,
              variables: { link:fbUrl, label: this.state.label, testId: testId }
            }

            makePromise(execute(link, operation))
              .then(data => {
                console.log(data)
                this.setState({message:"Uploaded!"})
            //    this.props.navigation.navigate('TestDashboard',{ testId: testId })
              })
              .catch(error => {
                console.log(error)
                this.setState({
                isVisibleError: true,
                photoError: 'Photo could not be processed. Try again.'
              })
            })
          })
        .catch(err => {
          console.log('error',err)
        });

      this.setState({label:''})

  }
}

  render() {
    const { navigation } = this.props
    const { label, isVisibleError, photoError, progressVisible, progress  } = this.state

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
        {isVisibleError &&
        <Text style={{color:'red'}}>
        {this.state.photoError}
        </Text>
        }

        {progressVisible &&
        <Text style={{color:'green'}}>
        {this.state.progress}%
        </Text>
        }

        <Text style={{color:'red'}}>
        Camera Label 1
        </Text>

       <TextInput
        placeholder='Label'
        style={styles.input}
        onChangeText={(text) => this.setState({label: text})}
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
