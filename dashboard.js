'use strict'

import React, {
  AppRegistry,
  Component,
  Image,
  StyleSheet,
  Text,
  ListView,
  View,
  ActivityIndicatorIOS
} from 'react-native';


class Dashboard extends Component {
  constructor(props){
    super(props);

    //this.authorize = true;

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      dataSource: ds.cloneWithRows(['League 1', 'League 2', 'League 3', 'League 4', 'League 5'])
    };

  }

  // componentDidMount(){
  //   this.fetchLeagues();
  // }

  // fetchLeagues(){

  //   var url = 'https://portfolioio.herokuapp.com/api/users';

  //   fetch(url)
  //     .then((response)=> response.json())
  //     .then(function(data){
  //       console.log('THIS IS THE DATA!!!!!', data)
  //     })
  //     .then((data)=> {
  //       this.setState({
  //         dataSource: this.state.dataSource
  //             .cloneWithRows(data),
  //           showProgress: false
  //       })
  //     })
  //     .done();
  // }

  renderRow(rowData){
    return (
      <View style={styles.league}>
        <Text>{rowData}</Text>
      </View>
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