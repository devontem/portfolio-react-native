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
      showProgress: false,
    }

    this.authorize = false;

  }



  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.logo}
         source={require('./money.png')}/>
         <Text style={styles.heading}>Portfol.IO</Text>
         <TextInput onChangeText={(text)=> this.setState({username: text})}
                    style={styles.input}
                    placeholder="Username"></TextInput>
         <TextInput onChangeText={(text)=> this.setState({password: text})}
                    style={styles.input}
                    secureTextEntry="true"
                    placeholder="Password"></TextInput>
         <TouchableHighlight 
                    onPress={this.onLoginPressed.bind(this)}
                    style={styles.button}>
            <Text style={styles.buttonText}>Log in</Text>
            
         </TouchableHighlight>
         <Text> {this.authorize ? 'LOGGED IN':'Not logged in'}</Text>
         <ActivityIndicatorIOS
          animating={this.state.showProgress}
          size="large" />
      </View>
      );
    }

  onLoginPressed(){
    console.log('Attempting to log in with username' + this.state.username);
    this.setState({showProgress: true});

    var b = new buffer.Buffer(this.state.username + ':' + this.state.password);
    var encodedAuth = b.toString('base64');
//https://api.github.com/user
    var data = {
               email: this.state.username,
               password: this.state.password,
                }

    fetch('https://portfolioio.herokuapp.com/api/users/signin', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
      })
      .then((response)=>{
        console.log(response.json(),'******');
        this.authorize = true;
        return response.json();
      })
      .then((results)=>{
        console.log(results);
        this.setState({showProgress: false});
      })
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
  }
});

module.exports = Login;