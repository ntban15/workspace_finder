/* eslint react/prop-types: 0 */

import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import LoadingSpinner from '../components/common/LoadingSpinner';

import { MAIN_SCREEN, ONBOARD_SCREEN } from '../constants/screens';
import { MAIN_HIGHLIGHT_COLOR } from '../constants/colors';

class AuthLoadingScreen extends React.Component {
  componentDidMount() {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        unsubscribe();
        this.props.navigation.navigate(MAIN_SCREEN);
      } else if (!this.props.onboard) {
        unsubscribe();
        this.props.navigation.navigate(ONBOARD_SCREEN);
      } else {
        unsubscribe();
        this.props.navigation.navigate(MAIN_SCREEN);
      }
    });
  }

  render() {
    return <LoadingSpinner color={MAIN_HIGHLIGHT_COLOR} />;
  }
}

const mapStateToProps = state => ({
  onboard: state.onboard,
});

export default connect(mapStateToProps)(AuthLoadingScreen);
