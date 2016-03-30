'use strict'

import React, {
  AppRegistry,
  Component,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicatorIOS,
  TouchableHighlight
} from 'react-native';

// var League = require('./league');


class Quote extends Component {
  constructor(props){
    super(props);

    this.state = {
      stock: null,
      change: null,
      percentChange: null,
      symbol: null,
      ask: null,
      close: null,
      open:null,
      yrTarget:null,
      vol:null,
      avgVol:null,
      mrktCap:null,
      yield: null,
      pe: null,
      name: null,
      searchString: null,
      isLoading: false,
      gotResult: false
    };

    //this.authorize = true;

  }


  componentDidMount(){
    this.fetchStock();
  }

  fetchStock(query){

    var url = 'https://portfolioio.herokuapp.com/api/stocks/' + query;


    fetch(url)
      .then((response) => response.json())
      .then((stock)=> {
        this.setState({
          stock: stock,
          change: 'Price Change: ' + stock.Change,
          percentChange: 'Percent Change: ' + stock.PercentChange,
          symbol: stock.symbol.toUpperCase(),
          ask: 'Ask Price: ' + stock.Ask,
          close: 'Close Price: ' + stock.close,
          open: 'Open Price: + ' + stock.open,
          yrTarget:'Year Target: ' + stock.yrTarget,
          vol: 'Vol: ' + stock.vol,
          avgVol: 'Avg Vol: ' + stock.avgVol,
          mrktCap: 'Mkt Cap: ' + stock.marktCap,
          yield: 'Yield: ' + stock.yield,
          pe: 'PE Ratio: ' + stock.pe,
          name: stock.Name,
          isLoading: false
        })
      })
      .catch(err => err)
      .done();
  }

  onSearchTextChanged(event){
    this.setState({searchString: event.nativeEvent.text})
  }

  _executeQuery(query) {
    this.setState({ isLoading: true });
  }

  onSearchPressed() {
    var query = this.fetchStock(this.state.searchString)
    this._executeQuery(query);
  }

  onWatchPressed() {

    var symbol = this.state.symbol;
    var user = JSON.parse(this.props.info.userId);
    var url = 'https://portfolioio.herokuapp.com/api/watchlist';

    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symbol: symbol,
        userid: user
      })
    })
      .then((response) => console.log(response))
      .catch(err => err)
      .done();

  }


  render(){

    var spinner = this.state.isLoading ?
      ( <ActivityIndicatorIOS
          hidden='true'
          size='large'/> ) :
      ( <View/>);

    var showQuote = this.state.name ?

      (

        <View style={styles.quoteDisplay}>
          <Text style={styles.stockName}>{this.state.name} | {this.state.symbol}</Text>
          <Text style={styles.stockAsk}>{this.state.ask}</Text>
          <Text style={styles.stockAsk}>{this.state.change}</Text>
          <Text style={styles.stockAsk}>{this.state.percentChange}</Text>

          <Text style={styles.stockAsk}>{this.state.open}</Text>
          <Text style={styles.stockAsk}>{this.state.close}</Text>
          <Text style={styles.stockAsk}>{this.state.target}</Text>

          <Text style={styles.stockAsk}>{this.state.vol}</Text>
          <Text style={styles.stockAsk}>{this.state.avgVol}</Text>
          <Text style={styles.stockAsk}>{this.state.mrktCap}</Text>

          <Text style={styles.stockAsk}>{this.state.yield}</Text>
          <Text style={styles.stockAsk}>{this.state.pe}</Text>

          <TouchableHighlight
              style={styles.watch}
              onPress={this.onWatchPressed.bind(this)}
              underlayColor='#99d9f4'
          >
            <Text style={styles.buttonText}>Watch Stock</Text>
          </TouchableHighlight>
        </View>

      ) : (<View/>)



    return (
      <View style={styles.container}>
        <Text style={styles.description}>Get Quote</Text>

        <View style={styles.flowRight}>
          <TextInput
            style={styles.searchInput}
            value={this.state.searchString}
            onChange={this.onSearchTextChanged.bind(this)}
            placeholder='enter symbol'/>
          <TouchableHighlight
              style={styles.button}
              underlayColor='#99d9f4'
              onPress={this.onSearchPressed.bind(this)}
          >
            <Text style={styles.buttonText}>Search</Text>
          </TouchableHighlight>
        </View>

          {spinner}
          {showQuote}
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: 'center'
  },
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565',
  },
  quoteDisplay: {
    marginTop: 20,
    marginBottom: 25,
    alignSelf: 'stretch'
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  searchInput: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC'
  },
  stockName: {
    color: '#000',
    fontSize: 25,
    flex: 1,
    padding: 5
  },
  stockSymbol: {
    color: '#000',
    fontSize: 14,
    flex: 1,
  },
  stockAsk: {
    color: '#000',
    fontSize: 16,
    flex: 1,
    padding: 2
  },
  watch: {
    marginTop: 20,
    height: 36,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});

module.exports = Quote;