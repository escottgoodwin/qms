import React from 'react';
import { Dimensions,View } from 'react-native';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements'

const ButtonColor = (props) =>
<Button
raised
  title={props.title}
  buttonStyle={{
  backgroundColor: props.backgroundcolor,
  width: Dimensions.get('window').width * .8,
  height: 45,
  borderColor: "transparent",
  borderWidth: 0,
  borderRadius: 10,
  }}
  onPress={props.onpress}
/>

ButtonColor.propTypes = {
  title: PropTypes.string.isRequired,
  backgroundcolor: PropTypes.string.isRequired,
  onpress: PropTypes.func.isRequired
};

export default ButtonColor
