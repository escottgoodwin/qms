import React,{Component} from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity ,Image, Text, TextInput, View, ScrollView, Dimensions, AsyncStorage } from 'react-native'
import { RNCamera } from 'react-native-camera'
import fetch from 'node-fetch';
import { Icon, Button } from 'react-native-elements'
import axios from 'axios'
const uuidv4 = require('uuid/v4');

import { container, welcome, logo, input } from '../css'

import ButtonColor from '../components/ButtonColor'

import {PHOTO_LABEL_MUTATION} from '../ApolloQueries'

const getToken = async () => {
  const token = await AsyncStorage.getItem('AUTH_TOKEN')
  return token
}

export default class CameraLabel extends Component {

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
    completeVisible:false,
    token:''
  }

  componentDidMount = async () => {
    const token = await getToken()
    this.setState({token})
  }

 takePicture = async (label) => {

    if (this.camera) {

      const { navigation } = this.props
      const testId = navigation.getParam('testId', 'NO-ID')
      const options = { quality: .25, base64: true }
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

          console.log(this.state.token)
          console.log('label',label)
          axios({
             url: 'https://qbe1.herokuapp.com/',
             method: 'post',
             headers: {
               authorization: this.state.token ? `Bearer ${this.state.token}` : "",
             },
             data: {
               query: PHOTO_LABEL_MUTATION,
               variables: { link: data.secure_url, label: label, testId: testId }
               }
           })
           .then(data => {
             const graphQLresponse = data.data.data.addLabeledPhoto
             this.setState({message:'Uploaded!',completeVisible:true})
           })
           .catch(err => { console.log(err) })
      })
      .catch(err=> {console.log(err)

    })

      this.setState({label:''})

  }
}

  render() {
    const { navigation } = this.props
    const testId = navigation.getParam('testId', 'NO-ID')
    const { label, isVisibleError, photoError, progressVisible, progress, completeVisible, token  } = this.state

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
          <>
        <Text style={{color:'green',fontSize:24,padding:20}}>
        {this.state.message}
        </Text>
        <View style={{padding:20}}>
        <Button
          raised
          title='Take More'
          buttonStyle={{
          backgroundColor: 'red',
          height: 45,
          borderColor: "transparent",
          borderRadius: 10,
          }}
          onPress={() => this.setState({completeVisible:false})}
        />
        </View>

        <View style={{padding:20}}>
        <Button
          raised
          title='Test Photos'
          buttonStyle={{
          backgroundColor: 'blue',
          height: 45,
          borderColor: "transparent",
          borderRadius: 10,
          }}
          onPress={() => this.props.navigation.navigate('TestDashboard',{testId:testId})}
        />
        </View>
        </>

        }

       <TextInput
        placeholder='Label'
        style={styles.input}
        onChangeText={(text) => this.setState({label: text})}
        value={label}
        />

        <TouchableOpacity
        style={{borderRadius:50,borderColor:'red',borderWidth:4,padding:10, margin:10}}
        onPress={() => this.takePicture(label)} >

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
