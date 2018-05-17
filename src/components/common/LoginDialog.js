import React from 'react';
import { View, Image, TouchableWithoutFeedback, Text, StyleSheet, Dimensions } from 'react-native';

import CustomTextInput from './CustomTextInput';

import { MAIN_HIGHLIGHT_COLOR } from '../../constants/colors';

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 25,
    elevation: 1,
  },
  btnContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
  },
  cancelTextStyle: {
    color: 'grey',
    fontSize: 15,
  },
  okTextStyle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: MAIN_HIGHLIGHT_COLOR,
  },
  introImageStyle: {
    width: 200,
    height: 100,
    marginTop: 10,
    marginBottom: 10,
  },
  introTextStyle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: MAIN_HIGHLIGHT_COLOR,
  },
});

const friendsImg = require('../../assets/images/friends.png');

class LoginDialog extends React.Component {
  state = {
    visible: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.visible !== this.state.visible;
  }

  handleCancel = () => {
    // this.emailRef.clear();
    // this.passwordRef.clear();
    this.onCancel();
    this.setState({ visible: false });
  };

  handleConfirm = () => {
    // this.emailRef.clear();
    // this.passwordRef.clear();
    this.onConfirm(this.email, this.password);
    this.setState({ visible: false });
  };

  show = (onCancel, onConfirm) => {
    this.onCancel = onCancel;
    this.onConfirm = onConfirm;
    this.setState({ visible: true });
  };

  render() {
    const { width, height } = Dimensions.get('window');
    const {
      outerContainer, innerContainer, btnContainer, cancelTextStyle, okTextStyle,
    } = styles;

    if (this.state.visible) {
      return (
        <View style={[outerContainer, { width, height }]}>
          <TouchableWithoutFeedback onPress={this.handleCancel}>
            <View style={[outerContainer, { width, height }]} />
          </TouchableWithoutFeedback>
          <View style={innerContainer}>
            <Text style={styles.introTextStyle}>Đăng nhập để kết nối</Text>

            <Image style={styles.introImageStyle} resizeMode="cover" source={friendsImg} />

            <CustomTextInput
              width={300}
              placeholder="Email"
              highlightColor={MAIN_HIGHLIGHT_COLOR}
              highlightTextColor="white"
              onChangeText={(email) => {
                this.email = email;
              }}
            />

            <CustomTextInput
              width={300}
              placeholder="Password"
              secureTextEntry
              highlightColor={MAIN_HIGHLIGHT_COLOR}
              highlightTextColor="white"
              onChangeText={(password) => {
                this.password = password;
              }}
            />
            <View style={btnContainer}>
              <Text style={cancelTextStyle} onPress={this.handleCancel}>
                Cancel
              </Text>
              <Text style={okTextStyle} onPress={this.handleConfirm}>
                Login
              </Text>
            </View>
          </View>
        </View>
      );
    }
    return <View />;
  }
}

export default LoginDialog;
