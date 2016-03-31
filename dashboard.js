'use strict'

import React, {
  AppRegistry,
  Component,
  Image,
  StyleSheet,
  Text,
  ListView,
  View,
  ActivityIndicatorIOS,
  TouchableHighlight,

} from 'react-native';

// var League = require('./league');
var Quote = require('./quote');
var UserStocks = require('./userstocks')

//initial route setup
class Dashboard extends Component {
  constructor(props) {
    super(props)
  }

  render(){
    return (
      <React.NavigatorIOS
        style={styles.wrapper}
        barTintColor="#48BBEC"
        initialRoute={{
          title: this.props.info.username+"'s Leagues",
          component: DashboardInner,
          passProps: {info: this.props.info}
        }} />
    )
  }
}

class DashboardInner extends Component {
  constructor(props){
    super(props);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      dataSource: ds.cloneWithRows([''])
    };

  }

  componentDidMount(){
    this.fetchLeagues();
    console.log('userInfo', this.props.info.username)
  }


  fetchLeagues(){

    var url = 'https://portfolioio.herokuapp.com/api/leagues/userleague';

    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token' : this.props.info.token
      },
      body: JSON.stringify({
        userId: this.props.info.userId
      })
    })
      .then((response) => response.json())
      .then((data)=> {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          dataSource: ds.cloneWithRows(data),
            showProgress: false
        })
      })
      .catch(err => err)
      .done();
  }

  getUser() {
    var url = 'https://portfolioio.herokuapp.com/api/users/getuser'
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token' : this.props.info.token
      },
      body: JSON.stringify({
        userId: this.props.info.userId
      })
    })
    .then((response) => response.json())
    .then((data)=>{
      console.log('USER INFO --->', data)
    })
  }

  pressRow(rowData){

    this.props.navigator.push({
      title: rowData.leaguename,
      component: UserStocks,
      passProps: {leagueId: rowData.leagueId, userId: this.props.info.userId, username: this.props.info.username}
    });
  }

  renderRow(rowData){
    return (
      <TouchableHighlight
        onPress={()=> this.pressRow(rowData)}
        underlayColor='#ddd'
      >
      <View style={styles.league}>
        <View >
          <Text style={styles.leaguetext}>{rowData.leaguename}</Text>
          <View>
            <Text>Balance: ${rowData.balance} </Text>
            <Text>Portfolio Value: ${rowData.portfolioValue} </Text>
            <Text>Num of Trades: {rowData.numOfTrades} </Text>
          </View>
        </View>
        <View style={styles.imageWrapper}>
          <Image style={styles.arrow} source={require('./arrow.png')} />
        </View>
      </View> 
      </TouchableHighlight>
    );

  }

  render(){

    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
        />
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#F5FCFF'
  },
  row: {
    flexDirection: 'row'
  },
  leaguePageHeader: {
    textAlign: 'left',
    fontSize: 40
  },
  wrapper: {
    flex: 1
  },
  league: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 10,
    borderColor: '#bdbdbd',
    borderBottomWidth: 1
  },
  leaguetext: {
    flex:1,
    fontWeight: 'bold',
    fontSize: 20
  },
  imageWrapper:{

  },
  arrow: {
    width: 50,
    height: 50
  }
});

module.exports = Dashboard;