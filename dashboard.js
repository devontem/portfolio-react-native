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
          title: 'My Leagues',
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
        style={styles.cross}
      >
      <View style={styles.league}>
        <Text style={styles.leaguetext} >{rowData.leaguename}</Text>
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
    marginTop: 50,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  leaguePageHeader: {
    color: 'green',
    fontSize: 25
  },
  wrapper: {
    flex: 1
  },
  league: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    borderColor: '#D7D7D7',
    borderBottomWidth: 1,
  },
  leaguetext: {
    flex:1,
    fontSize:15
  },
});

module.exports = Dashboard;