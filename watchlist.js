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
  ListView,
  ActivityIndicatorIOS
} from 'react-native';  


class Watchlist extends Component {
  constructor(props) {
    super(props)
  }

  render(){
    return (
      <React.NavigatorIOS
        style={styles.wrapper}
        barTintColor="#48BBEC"
        initialRoute={{
          title: 'Watchlist',
          component: WatchlistInner,
          passProps: {info: this.props.info}
        }} />
    )
  }
}

class WatchlistInner extends Component {
	constructor(props) {
		super(props);
		
		this.state ={
			dataSource: new ListView.DataSource({
			rowHasChanged: (r1,r2) => r1 != r2
		}),
			loaded: false

		};
	}
	renderRow(rowData){
		return (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center',
        borderColor: '#D7D7D7',
        borderBottomWidth: 1,


      }}>
      <Text style={{
				color: '#333',
				backgroundColor:'#fff',
				alignSelf: 'center'
			}}>
			{rowData[0]} 
			</Text>
      <Text style={{
        color: '#333',
        backgroundColor:'#fff',
        left: 25
      }}>
      {rowData[1]} 
      </Text>
      <Text style={{
        color: '#00cc00',
        backgroundColor:'#fff',
        left: 50
      }}>
      {rowData[2]} 
      </Text>
      <Text style={{
        color: '#ff3300',
        backgroundColor:'#fff',
        left: 60
      }}>
      {rowData[3]}
      </Text>
      </View>
      )
		}
	

	render() {
		return (
          <View style ={{
            flex:1,
            justifyContent: 'flex-start',
            paddingTop: 75,
            paddingBottom: 100

          }}>

             <ListView
               dataSource={this.state.dataSource}
               renderRow={this.renderRow.bind(this)} />
          </View>
			)
	}

	componentDidMount(){
		this._onPressButton();
	}

	_onPressButton(){
		
		fetch('https://portfolioio.herokuapp.com/api/watchlist/' + this.props.info.userId
			, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'GET'
       }
      )
      .then((response)=> { 
        var datas =[];
        response.json()
          .then((data)=>{
            console.log(data);
            for(var key in data){
              datas.push(key)
            }
              var list ='';
              for(var i=0; i<datas.length; i++){
                list+=datas[i] + '+';
              }
              list= list.slice(0,-1);

              fetch('http://finance.yahoo.com/d/quotes.csv?s=' + list + '&f=sac1p2',{
                method: 'GET'
              }
              )
              .then((response) => {

                var results =[];
                var stocks =[];
                var final = [];
                
                var ask = response._bodyText.toString().split('\n');
                ask.forEach(function(item){
                    results.push(item.split(','))
                })

                  results.forEach(function(stocks){
                    stocks.forEach(function(stock){
                    var result1 = stock.replace(/\"/g,'');
                    if(result1.match(/^[A-Z]*$/)){
                      result1 = result1
                    }
                  else if(/[\%]/.test(result1)){
                    
                    var res = result1.replace(/\%/,'')
                    var sign = res[0];
                    var decimal = res.substr(1)
                    var ans = parseFloat(decimal).toFixed(2)
                    var final = sign + ans.toString()
                    result1=final.concat('%')
                  }
                  else{
                    var other = parseFloat(result1).toFixed(2);
                    result1 = other.toString()
                  }
                    stocks.push(result1)
                  })
                  final.push(stocks);
                  stocks=[]
                  
                  })
                  var finalfinal= [];
                  var final2;
                  final.forEach(function(stock){
                    final2 = stock.slice(4);
                    console.log(final2,'finalll');
                    finalfinal.push(final2)

                  })
                  finalfinal.pop()

                  
                  this.setState({dataSource: this.state.dataSource.cloneWithRows(finalfinal)})

                console.log(this.state.dataSource,'ressppp')
              })

              
              response.json();
            })            
          })
       //  var da = JSON.parse(response._bodyText);
       //  console.log(da,'da')
      
        //this.setState({dataSource: this.state.dataSource.cloneWithRows(datas)})

      //   var list ='';
      //   for(var i=0; i<datas.length; i++){
      //     list+=datas[i] + '+';
      //   }
      //   list= list.slice(0,-1);

      //   fetch('http://finance.yahoo.com/d/quotes.csv?s=' + list + '&f=sac1p2',{
      //   	method: 'GET'
      //   }
      //   )
      //   .then((response) => {

      //   	var results =[];
      //   	var stocks =[];
      //   	var final = [];
        	
      //   	var ask = response._bodyText.toString().split('\n');
      //   	ask.forEach(function(item){
      //         results.push(item.split(','))
      //   	})

      //       results.forEach(function(stocks){
      //       	stocks.forEach(function(stock){
      //         var result1 = stock.replace(/\"/g,'');
      //         if(result1.match(/^[A-Z]*$/)){
      //         	result1 = result1
      //         }
	     //      else if(/[\%]/.test(result1)){
	            
	     //        var res = result1.replace(/\%/,'')
	     //        var sign = res[0];
	     //        var decimal = res.substr(1)
	     //        var ans = parseFloat(decimal).toFixed(2)
	     //        var final = sign + ans.toString()
	     //        result1=final.concat('%')
	     //      }
	     //      else{
	     //      	var other = parseFloat(result1).toFixed(2);
	     //      	result1 = other.toString()
	     //      }
      //         stocks.push(result1)
      //       })
      //       final.push(stocks);
      //       stocks=[]
            
      //       })
      //       var finalfinal= [];
      //       var final2;
      //       final.forEach(function(stock){
      //       	final2 = stock.slice(4);
      //       	console.log(final2,'finalll');
      //       	finalfinal.push(final2)

      //       })
      //       finalfinal.pop()

            
      //       this.setState({dataSource: this.state.dataSource.cloneWithRows(finalfinal)})

      //   	console.log(this.state.dataSource,'ressppp')
      //   })

        
      //   response.json();
      // })
      // .then((responseData)=>{
      //   console.log(responseData,'ressss');
      //   //this.setState({dataSource: this.state.dataSource.cloneWithRows(responseData)});
      // })
	}


}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  container: {
    backgroundColor: '#F5FCFF',
    flex: 1,
    paddingTop:100,
    alignItems: 'center',
    padding:10
  },

  header: {
  	alignItems: 'center',
  	justifyContent: 'center',
  	backgroundColor: '#48BBEC',
  	fontSize: 20
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
  }
  // positive: {
  //   color: green
  // },
  // negative: {
  //   color: red
  // }

});

module.exports = Watchlist;