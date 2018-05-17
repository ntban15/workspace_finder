/* eslint react/prop-types: 0 */

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import LoadingSpinner from '../components/common/LoadingSpinner';
import LoginDialog from '../components/common/LoginDialog';

import { requestLogin, passOnboard } from '../actions';

import { FRIENDS_SCREEN } from '../constants/screens';
import { MAIN_HIGHLIGHT_COLOR } from '../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appNameStyle: {
    fontSize: 45,
    fontWeight: 'bold',
    color: MAIN_HIGHLIGHT_COLOR,
  },
  skipLoginStyle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'grey',
  },
  btnContainer: {
    marginTop: 30,
    marginBottom: 20,
    zIndex: -1,
  },
});

class OnboardScreen extends React.Component {
  componentDidUpdate() {
    const { isLoggedIn, onboard, navigation } = this.props;
    if (isLoggedIn || onboard) {
      navigation.navigate(FRIENDS_SCREEN);
    }
  }

  handleLoginPress = () => {
    this.loginDialogRef.show(
      () => {},
      (email, password) => {
        this.props.login(email, password);
      },
    );
  };

  render() {
    const {
      isLoggingIn, isLoggedIn, onboard, skipLogin,
    } = this.props;
    if (!isLoggingIn && !isLoggedIn && !onboard) {
      return (
        <View style={styles.container}>
          <Text style={styles.appNameStyle}>New friends!</Text>
          <View style={styles.btnContainer}>
            <Button
              color={MAIN_HIGHLIGHT_COLOR}
              title="Đăng nhập"
              onPress={this.handleLoginPress}
            />
          </View>
          <Text style={styles.skipLoginStyle} onPress={() => skipLogin()}>
            Để lúc khác
          </Text>
          <LoginDialog
            ref={(ref) => {
              this.loginDialogRef = ref;
            }}
          />
        </View>
      );
    }
    return <LoadingSpinner size="large" color={MAIN_HIGHLIGHT_COLOR} />;
  }
}

const mapStateToProps = state => ({
  isLoggingIn: state.login.isLoggingIn,
  isLoggedIn: state.login.isLoggedIn,
  onboard: state.onboard,
});

const mapDispatchToProps = dispatch => ({
  login: (email, password) => dispatch(requestLogin(email, password)),
  skipLogin: () => dispatch(passOnboard()),
});

export default connect(mapStateToProps, mapDispatchToProps)(OnboardScreen);
