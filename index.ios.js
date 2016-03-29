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

var UserStocks = require('./userstocks');
var MakeTrade = require('./maketrade')
var AuthService = require('./AuthService');
var AppContainer = require('./AppContainer');
var Dashboard = require('./dashboard');
var Quote = require('./quote');



//var Login = require('./login');
var Leaderboard = require('./watchlist');



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

  getuserinfo(user) {
    this.setState({userinfo: user});
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
          <AppContainer info={this.state.userinfo} />
        )
      }else{
        return (
          <Login onLogin={this.onLogin.bind(this)} getuserinfo={this.getuserinfo.bind(this)} />
        )
      }




    // return (
    //   <View style = {styles.container}>
        
    //     <Leaderboard />
    //   </View>
    //   // <View style = {styles.container}>
      
    //   // </View>
    // );


    return (
      <View style = {styles.container}>

    // return (
    //   <View style = {styles.container}>

        
    //     <Leaderboard />
    //   </View>
      // <View style = {styles.container}>
      
      // </View>
    //);



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
