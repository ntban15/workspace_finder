import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LoadingSpinner from '../components/common/LoadingSpinner';
import LoginDialog from '../components/common/LoginDialog';

import { requestLogin, passOnboard } from '../actions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appNameStyle: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#0054A5',
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
  static propTypes = {
    isLoggingIn: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    onboard: PropTypes.bool.isRequired,
    login: PropTypes.func.isRequired,
    skipLogin: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
  };

  componentDidMount() {
    const { isLoggedIn, onboard, navigation } = this.props;
    if (isLoggedIn || onboard) {
      navigation.navigate('FriendsScreen');
    }
  }

  componentDidUpdate() {
    const { isLoggedIn, onboard, navigation } = this.props;
    if (isLoggedIn || onboard) {
      navigation.navigate('FriendsScreen');
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
    const { isLoggingIn, skipLogin } = this.props;
    if (!isLoggingIn) {
      return (
        <View style={styles.container}>
          <Text style={styles.appNameStyle}>New friends!</Text>
          <View style={styles.btnContainer}>
            <Button color="#0054A5" title="Đăng nhập" onPress={this.handleLoginPress} />
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
    return <LoadingSpinner size="large" color="#0054A5" />;
  }
}

const mapStateToProps = state => ({
  isLoggingIn: state.login.isLoggingIn,
  isLoggedIn: state.login.token !== '',
  onboard: state.onboard,
});

const mapDispatchToProps = dispatch => ({
  login: (email, password) => dispatch(requestLogin(email, password)),
  skipLogin: () => dispatch(passOnboard()),
});

export default connect(mapStateToProps, mapDispatchToProps)(OnboardScreen);
