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
var MakeTrade = require('./maketrade')

//initial route setup
class Trade extends Component {
  constructor(props) {
    super(props)
  }

  render(){
    return (
      <React.NavigatorIOS
        style={styles.wrapper}
        initialRoute={{
          title: 'Trades',
          component: TradeInner,
          passProps: {info: this.props.info}
        }} />
    )
  }
}

class TradeInner extends Component {
  constructor(props){
    super(props);

    //this.authorize = true;

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    // console.log(this.props.info,'******')

    this.state = {
      dataSource: ds.cloneWithRows([''])
    };

  }

  componentDidMount(){
    this.fetchLeagues();
  }

  // add in parameter for userID to pass into body:userID as a url param
  fetchLeagues(){

    var url = 'https://portfolioio.herokuapp.com/api/leagues/userleague';

    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: this.props.info.userId
      })
    })
      .then((response) => response.json())
      .then((data)=> {
        console.log('THIS IS THE DATA!!!!!', data)
        console.log('these are the props', this.props.info)
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
    console.log(rowData);
    console.log('LEAGUE ID:', rowData.leagueId)
    // this.setState({ isLoading: false });

    this.props.navigator.push({
      title: rowData.leaguename,
      component: MakeTrade,
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
        <Text>{rowData.leaguename}</Text>
      </View>
      </TouchableHighlight>
    );

  }

  render(){

    return (
      <View style={styles.container}>
        <Text style={styles.leaguePageHeader}>MY LEAGUES</Text>
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
    borderBottomWidth: 1
  }
});

module.exports = Trade;