/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Navigator
} from 'react-native';

var Login = require('./login');
var UserStocks = require('./userstocks');
var MakeTrade = require('./maketrade')

class portfolio extends Component {
  render() {
    return (
      <View style={styles.container}>
        <MakeTrade />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('portfolio', () => portfolio);
