import React,{Component} from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity ,Image, Text, TextInput, View, ScrollView, Dimensions, AsyncStorage } from 'react-native'
import { RNCamera } from 'react-native-camera'
import fetch from 'node-fetch';
import { Icon } from 'react-native-elements'
import axios from 'axios'
const uuidv4 = require('uuid/v4');

import { container, welcome, logo, input } from '../css'

import ButtonColor from '../components/ButtonColor'

import {PHOTO_LABEL_MUTATION} from '../ApolloQueries'

const getToken = async () => {
  const token = await AsyncStorage.getItem('AUTH_TOKEN')
  return token
}

export default class CameraLabels2 extends Component {

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
    completeVisible:''
  }

 takePicture = async () => {

    if (this.camera) {
      const { navigation } = this.props
      const testId = navigation.getParam('testId', 'NO-ID')
      const options = { quality: 0.25, base64: true }
      const image = await this.camera.takePictureAsync(options)

      const sessionId = new Date().getTime()

      let base64Img = `data:image/jpg;base64,${image.base64}`

      //Add your cloud name
      let apiUrl = 'https://api.cloudinary.com/v1_1/dkucuwpta/image/upload';

      let data = {
        "file": base64Img,
        "upload_preset": "tx7xnbvf",
      }

      fetch(apiUrl, {
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json'
        },
        method: 'POST',
      }).then(async r => {
          let data = await r.json()
          console.log(data.secure_url)
          const token = await getToken()

          axios({
             url: 'https://qbe1.herokuapp.com/',
             method: 'post',
             headers: {
               authorization: this.props.token ? `Bearer ${this.props.token}` : "",
             },
             data: {
               query: PHOTO_LABEL_MUTATION,
               variables: { link: data.secure_url, label: this.state.label, testId: testId }

               }
           }).then(result => {
             let grapqhql_resp = result.request.response
             let panels = JSON.parse(grapqhql_resp)
             that.setState({message:'Uploaded!',completeVisible:true})
           })
           .catch(err=>console.log(err)
           this.setState({photoError:'Could not upload image. Try again.',isVisibleError:true})
         )
      })
      .catch(err=>console.log(err)
      this.setState({photoError:'Could not upload image. Try again.',isVisibleError:true})
    )

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

        {completeVisible &&
        <Text style={{color:'green'}}>
        Uploaded! Upload more? Image List?
        </Text>
        }

        <Text style={{color:'red'}}>
        Camera Label 2
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
