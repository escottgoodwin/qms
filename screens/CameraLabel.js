import React,{Component} from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity ,Image, Text, TextInput, View, ScrollView, Dimensions, AsyncStorage } from 'react-native'
import { RNCamera } from 'react-native-camera'
import fetch from 'node-fetch';
import { Icon } from 'react-native-elements'
import axios from 'axios'
import ImageResizer from 'react-native-image-resizer'
import RNFS from 'react-native-fs'

import { container, welcome, logo, input, preview, camera, progress, complete, photoError } from '../css'

import ButtonColor from '../components/ButtonColor'

import {PHOTO_LABEL_MUTATION} from '../ApolloQueries'

const uuidv4 = require('uuid/v4')

const getToken = async () => {
  const token = await AsyncStorage.getItem('AUTH_TOKEN')
  return token
}

const resizeBase64 = async (path) => {
  const newPath = path.replace('file://', '')
  const resizedImageUrl = await ImageResizer.createResizedImage(newPath, 800, 600, 'PNG', 80, 0, RNFS.DocumentDirectoryPath)
  const base64 = await RNFS.readFile(resizedImageUrl, 'base64')
  return base64
}


export default class CameraLabel extends Component {

  static navigationOptions = {
    title: 'Camera',
  }

  state = {
    label:'',
    isVisibleError: false,
    progressVisible:false,
    progress:0,
    message:'',
    completeVisible:false,
    token:''
  }

  componentDidMount = async () => {
    const token = await getToken()
    this.setState({token})
  }

  takePicture = async (label) => {

    if (this.state.label.length === 0 || !this.state.label.trim()) {
       this.setState({message:'Please enter a label',isVisibleError:true})
       return
    }

     if (this.camera) {

       const { navigation } = this.props
       const testId = navigation.getParam('testId', 'NO-ID')
       const options = { quality: .25, base64:true, doNotSave: true }
       const image = await this.camera.takePictureAsync(options)

       const sessionId = new Date().getTime()
       let base64Img = `data:image/jpg;base64,${image.base64}`

       //const resizedImage = await ImageResizer.createResizedImage(base64Img, 600, 800, 'PNG', 80, 0, RNFS.DocumentDirectoryPath)
       //console.log(resizedImage)

       //const base64Resized = await RNFS.readFile(resizedImage.uri, 'base64')

       //const base64Upload = `data:image/png;base64,${base64Resized}`

       let apiUrl = 'https://api.cloudinary.com/v1_1/dkucuwpta/image/upload'

       let data = {
         "file": base64Img,
         "upload_preset": "tx7xnbvf",
       }

       let axiosData = {
           url: apiUrl,
           method: 'post',
           headers: {
             'content-type': 'application/json'
           },
           data:{
             file: base64Img,
             upload_preset: "tx7xnbvf",
           },
           onUploadProgress: (p) => {
            this.setState({progress:p})
          }
        }

       //fetch(apiUrl, {
      //   body: JSON.stringify(data),
      //   headers: {
      //     'content-type': 'application/json'
      //   },
      //   method: 'POST',
      // })
       this.setState({progressVisible:true})
       axios({
           url: apiUrl,
           method: 'post',
           headers: {
             'content-type': 'application/json'
           },
           data:{
             file: base64Img,
             upload_preset: "tx7xnbvf",
           },
           onUploadProgress: (progressEvent) => {
            let percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total )
            this.setState({progress:percentCompleted})
          }
        })
       .then(response => {

           return axios({
              url: 'https://qbe1.herokuapp.com/',
              method: 'post',
              headers: {
                authorization: this.state.token ? `Bearer ${this.state.token}` : "",
              },
              data: {
                query: PHOTO_LABEL_MUTATION,
                variables: { link: response.data.secure_url, label: label, testId: testId }
              },
            })
       })
       .then(data => {
         const graphQLresponse = data.data.data.addLabeledPhoto
         this.setState({message:'Uploaded!', completeVisible:true, progress:0, progressVisible:false})
       })
       .catch(err=> {
         this.setState({message:'Unable to upload photo. Please try again.',isVisibleError:true})
       })

       this.setState({label:''})
     }
   }

  render() {

    const { navigation } = this.props
    const testId = navigation.getParam('testId', 'NO-ID')
    const { label, isVisibleError, progressVisible, progress, message, completeVisible, token  } = this.state

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

          }}
        >

        {isVisibleError &&
        <>
        <Text style={{color:'red', padding:20,fontSize:24}}>
        {message}
        </Text>

        <ButtonColor
        title="Dismiss"
        backgroundcolor="red"
        onpress={() => this.setState({isVisibleError:false})}
        />
        </>}

        {progressVisible &&
        <Text style={{color:'blue', padding:20,fontSize:24}}>
        {progress}%
        </Text>}

        {completeVisible ?
          <>
        <Text style={complete}>
          {message}
        </Text>

        <ButtonColor
        title="Take More"
        backgroundcolor="green"
        onpress={() => this.setState({completeVisible:false})}
        />

        <ButtonColor
        title="Test Photos"
        backgroundcolor="blue"
        onpress={() => this.props.navigation.navigate('TestDashboard',{testId:testId})}
        />
        </>
        :
        <>
       <TextInput
        placeholder='Label'
        style={styles.input}
        onChangeText={(text) => this.setState({label: text})}
        value={label}
        />

        <TouchableOpacity
         style={camera}
         onPress={() => this.takePicture(label)} >

        <Icon
          name='camera'
          type='font-awesome'
          color='red'
          size={36}
           />

          </TouchableOpacity>
        </>}

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
  preview,
  camera,
  progress,
  complete,
  photoError
})
