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
  TouchableHighlight
} from 'react-native';

// var League = require('./league');


class Dashboard extends Component {
  constructor(props){
    super(props);

    //this.authorize = true;

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

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
        userId: 13
      })
    })
      .then((response) => response.json())
      .then((data)=> {
        console.log('THIS IS THE DATA!!!!!', data)
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
    // add rest of code to access each league
    // var league = rowData;

    // this.props.navigator.push({
    //   title: "League",
    //   component: LeagueView,
    //   passProps: {league: leagueId}
    // });
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
  league: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    borderColor: '#D7D7D7',
    borderBottomWidth: 1
  }
});

module.exports = Dashboard;