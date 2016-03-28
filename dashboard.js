'use strict'

var React = require('react-native');

var {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableHighlight,
  ActivityIndicatorIOS,
  ListView

} = React;

class Dashboard extends Component {
  constructor(props){
    super(props);

    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2
    });

    this.state = {
      dataSource: ds.cloneWithRows(['A', 'B', 'C'])
    }

  }

  renderRow(rowData){
    return <Text style={{
      color: '#333'
    }}>
      {rowData}
    </Text>
  }

  render(){
    return (
      <View style={{
        flex: 1,
        justifyContent: 'flex-start'
      }}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)} />
      </View>
    );
  }

}

module.exports = Dashboard;