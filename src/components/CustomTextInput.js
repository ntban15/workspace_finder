import React from 'react';
import { View, TextInput, Platform, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  inputContainer: {
    borderRadius: 5,
    alignItems: 'stretch',
  },
  inputContainerIos: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'stretch',
  },
});

const isIos = Platform.OS === 'ios';

export default class CustomTextInput extends React.PureComponent {
  static propTypes = {
    highlightColor: PropTypes.string,
    highlightTextColor: PropTypes.string,
    placeholder: PropTypes.string,
    secureTextEntry: PropTypes.bool,
    width: PropTypes.number,
    onChangeText: PropTypes.func,
  };

  static defaultProps = {
    highlightColor: 'black',
    highlightTextColor: 'white',
    placeholder: 'TextInput',
    secureTextEntry: false,
    width: 50,
    onChangeText: () => {},
  };

  state = {
    isFocus: false,
    text: '',
  };

  render() {
    const {
      highlightColor,
      highlightTextColor,
      placeholder,
      secureTextEntry,
      width,
      onChangeText,
    } = this.props;

    return (
      <View
        style={[
          isIos ? styles.inputContainerIos : styles.inputContainer,
          { backgroundColor: this.state.isFocus ? highlightColor : 'white', width },
        ]}
      >
        <TextInput
          style={{ color: this.state.isFocus ? highlightTextColor : 'black' }}
          onChangeText={(text) => {
            this.setState({ text });
            onChangeText(text);
          }}
          value={this.state.text}
          multiline={false}
          placeholder={placeholder}
          placeholderTextColor={this.state.isFocus ? highlightTextColor : 'grey'}
          secureTextEntry={secureTextEntry}
          selectionColor={this.state.isFocus ? highlightTextColor : 'black'}
          onFocus={() => this.setState({ isFocus: true })}
          onBlur={() => this.setState({ isFocus: false })}
          underlineColorAndroid={this.state.isFocus ? highlightColor : 'white'}
          ref={(ref) => {
            this.passwordRef = ref;
          }}
        />
      </View>
    );
  }
}
