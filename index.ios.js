import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Navigator,
  ActivityIndicatorIOS
} from 'react-native';

var Login = require('./login');
var AuthService = require('./AuthService');
var AppContainer = require('./AppContainer');

class portfolio extends Component {

  constructor(props){
    super(props);
    this.state = {
      isLoggedIn: false,
      checkingAuth: true
    }
  }

  componentDidMount() {
    AuthService.getAuthInfo((err, authInfo)=> {
      this.setState({
        checkingAuth: false,
        isLoggedIn: authInfo != null
      })
    });
  }

  onLogin() {
    this.setState({isLoggedIn: true});
  }

  render() {
      if(this.state.checkingAuth){
        return (
          <View style={styles.container}>
            <ActivityIndicatorIOS 
              animating={true}
              size="large"
              style={styles.loader} />
          </View>
        )
      }
      if(this.state.isLoggedIn){
        return (
          <AppContainer />
        )
      }else{
        return (
          <Login onLogin={this.onLogin.bind(this)} />
        )
      }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    textAlign: 'center',
    fontSize: 20,
    margin: 10,
  },
  instruction:{
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
});

AppRegistry.registerComponent('portfolio', () => portfolio);
