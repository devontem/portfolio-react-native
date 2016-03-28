'use strict';

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableHighlight,
  ActivityIndicatorIOS
} from 'react-native';

import buffer, {} from 'buffer';


class Login extends Component {
  constructor(props){
    super(props);

    this.state = {
      showProgress: false
    }
  }

  render() {
    var errorCtrl = <View />;

    if(!this.state.success && this.state.nouser){
      errorCtrl = <Text style = {styles.error}>
        No user found!
        </Text>
    }

    if(!this.state.success && this.state.badpassword){
      errorCtrl = <Text style = {styles.error}>
        That username and password combination did not work
        </Text>
    }

    if(!this.state.success && this.state.unknownError){
      errorCtrl = <Text style={styles.error}>
        We experienced an unexpected issue
        </Text>
    }

    return (
      <View style={styles.container}>
        <Image style={styles.logo}
         source={require('./moneylogo.png')}/>
         <Text style={styles.heading}>Portfol.IO</Text>
         <TextInput onChangeText={(text)=> this.setState({username: text})}
                    style={styles.input}
                    placeholder="Username"></TextInput>
         <TextInput onChangeText={(text)=> this.setState({password: text})}
                    style={styles.input}
                    secureTextEntry = {true}
                    placeholder="Password"></TextInput>
         <TouchableHighlight
                    onPress={this.onLoginPressed.bind(this)}
                    style={styles.button}>
            <Text style={styles.buttonText}>Log in</Text>

         </TouchableHighlight>

         {errorCtrl}

         <ActivityIndicatorIOS
          animating={this.state.showProgress}
          size="large" />
      </View>
      );
    }

  onLoginPressed(){

    this.setState({showProgress: true});

    var authService = require('./AuthService');
    authService.login({
      email: this.state.username,
      password: this.state.password
    }, (results)=>{
      this.setState(Object.assign({
        showProgress: false
      },results));
      if(results.success && this.props.onLogin){
        this.props.getuserinfo(results);
        this.props.onLogin();
      }
    });
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
    flex: 1,
    paddingTop:100,
    alignItems: 'center',
    padding:10
  },
  logo: {
    width: 66,
    height: 55
  },
  heading:{
    fontSize: 50,
    marginTop: 10
  },
  input:{
    height:50,
    marginTop:10,
    padding:4,
    fontSize: 18,
    borderWidth:1,
    borderColor: '#48bbec'
  },
  button:{
    height: 50,
    backgroundColor: '#48BBEC',
    alignSelf: 'stretch',
    marginTop: 10,
    justifyContent: 'center',
  },
  buttonText:{
    fontSize: 22,
    color: '#FFF',
    alignSelf: 'center'
  },
  loader:{
    marginTop:20
  },
  error:{
    color: 'red',
    paddingTop: 10
  }
});

module.exports = Login;