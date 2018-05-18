/* eslint react/prop-types: 0 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import Filter from '../components/friendsScreenComponents/Filter';
import FriendListView from '../components/friendsScreenComponents/FriendListView';
import Footer from '../components/friendsScreenComponents/Footer';

import LoadingSpinner from '../components/common/LoadingSpinner';
import LoginDialog from '../components/common/LoginDialog';
import Header from '../components/common/Header';

import { setFilter, requestLogin, requestLogout } from '../actions';

import { FILTER_MODE_NEW_FRIENDS, FILTER_MODE_MY_FRIENDS } from '../constants/strings';
import { SWIPE_HOTGIRL_SCREEN } from '../constants/screens';
import { MAIN_HIGHLIGHT_COLOR } from '../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
  },
  logoutBtnStyle: {
    fontSize: 15,
    color: MAIN_HIGHLIGHT_COLOR,
  },
});

class FriendsScreen extends React.Component {
  handleNavigateHotgirls = () => {
    if (this.props.isLoggedIn) {
      this.props.navigation.navigate(SWIPE_HOTGIRL_SCREEN);
    } else {
      this.loginDialogRef.show(() => {}, (email, password) => this.props.login(email, password));
    }
  };

  renderRegisterButton = () => {
    if (!this.props.isLoggedIn) {
      return (
        <Footer
          backgroundColor={MAIN_HIGHLIGHT_COLOR}
          textColor="white"
          text="ĐĂNG NHẬP ĐỂ KẾT BẠN VỚI MỌI NGUỜI"
          onPress={() => {
            this.loginDialogRef.show(
              () => {},
              (email, password) => this.props.login(email, password),
            );
          }}
        />
      );
    }
    return <View />;
  };

  renderLogoutButton = () => {
    if (this.props.isLoggedIn) {
      return (
        <Text style={styles.logoutBtnStyle} onPress={() => this.props.logout()}>
          Logout
        </Text>
      );
    }
    return null;
  };

  render() {
    const { isLoggingIn, setFilterAction, filter } = this.props;
    const filterOptions = [
      { id: FILTER_MODE_NEW_FRIENDS, text: 'Bạn mới' },
      { id: FILTER_MODE_MY_FRIENDS, text: 'Bạn của tôi' },
    ];
    if (!isLoggingIn) {
      return (
        <View style={styles.container}>
          <Header headerText="New friends" onHeaderButtonPress={this.handleNavigateHotgirls} />
          <View style={styles.optionsContainer}>
            <Filter options={filterOptions} selected={filter} onSelectionChange={setFilterAction} />
            {this.renderLogoutButton()}
          </View>
          <FriendListView />
          {this.renderRegisterButton()}
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
  filter: state.filter,
});

const mapDispatchToProps = dispatch => ({
  setFilterAction: mode => dispatch(setFilter(mode)),
  login: (email, password) => dispatch(requestLogin(email, password)),
  logout: () => dispatch(requestLogout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(FriendsScreen);
