import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Filter from '../components/Filter';
import FriendListContainer from './FriendListContainer';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import LoginDialog from '../components/LoginDialog';
import Header from '../components/Header';
import { setFilter, requestLogin } from '../actions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  filterContainer: {
    marginTop: 20,
    marginLeft: 15,
  },
});

class FriendsScreen extends React.Component {
  // static propTypes = {
  //   isLoggingIn: PropTypes.bool.isRequired,
  //   isLoggedIn: PropTypes.bool.isRequired,
  //   filter: PropTypes.string.isRequired,
  //   login: PropTypes.func.isRequired,
  //   navigation: PropTypes.shape({
  //     navigate: PropTypes.func.isRequired,
  //   }).isRequired,
  // };
  constructor(props) {
    super(props);
  }

  handleNavigateHotgirls = () => {
    this.props.navigation.navigate('HotgirlsScreen');
  };

  renderRegisterButton = (isLoggedIn, login) => {
    if (!isLoggedIn) {
      return (
        <Footer
          backgroundColor="#0054A5"
          textColor="white"
          text="ĐĂNG NHẬP ĐỂ KẾT BẠN VỚI MỌI NGUỜI"
          onPress={() => {
            this.loginDialogRef.show(() => {}, (email, password) => login(email, password));
          }}
        />
      );
    }
    return <View />;
  };

  render() {
    const {
      isLoggingIn, isLoggedIn, setFilterAction, filter, login,
    } = this.props;
    const filterOptions = [
      { id: 'NEW_FRIENDS', text: 'Bạn mới' },
      { id: 'MY_FRIENDS', text: 'Bạn của tôi' },
    ];
    if (!isLoggingIn) {
      return (
        <View style={styles.container}>
          <Header headerText="New friends" onHeaderButtonPress={this.handleNavigateHotgirls} />
          <View style={styles.filterContainer}>
            <Filter options={filterOptions} selected={filter} onSelectionChange={setFilterAction} />
          </View>
          <FriendListContainer />
          {this.renderRegisterButton(isLoggedIn, login)}
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
  filter: state.filter,
});

const mapDispatchToProps = dispatch => ({
  setFilterAction: mode => dispatch(setFilter(mode)),
  login: () => dispatch(requestLogin()),
});

export default connect(mapStateToProps, mapDispatchToProps)(FriendsScreen);
