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
        barTintColor= '#48BBEC'
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
				backgroundColor:'#F5FCFF',
				textAlign: 'center',
        flex: 1
        
			}}>
			{rowData[0]} 
			</Text>
      <Text style={{
        color: '#333',
        backgroundColor:'#F5FCFF',
        flex: 1,
        textAlign: 'center'
      }}>
      {rowData[1]} 
      </Text>
      <Text style={
        color(rowData[2])
        
      }>
      {rowData[2]} 
      </Text>
      <Text style={
        percent(rowData[2])
      }>
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
          <TouchableHighlight style={styles.button} onPress={this._onPressButton.bind(this)}> 
                    
            <Text style={styles.buttonText}>Watchlist</Text>

            
         </TouchableHighlight>
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
		console.log(this.props.info,'hi')
		
		fetch('https://portfolioio.herokuapp.com/api/watchlist/' + this.props.info.userId
			, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
         method: 'GET',
        
       }
      )
      .then((response)=> { 
      	var datas =[]
        var da = JSON.parse(response._bodyText);
        console.log(da,'da')
        for(var key in da){
          datas.push(key)
        }
        
        //this.setState({dataSource: this.state.dataSource.cloneWithRows(datas)})
        console.log(datas,'data')
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
      // .then((responseData)=>{
      //   console.log(responseData,'ressss');
      //   //this.setState({dataSource: this.state.dataSource.cloneWithRows(responseData)});
      // })
	}


}

function color(number) {
  number = parseFloat(number)
  console.log(typeof number, '&&&&&')
  if(number >= 0){
  return {
    color: '#00cc00',
    backgroundColor: '#F5FCFF',
    flex: 1,
    textAlign: 'center'
  }
}
  if(number < 0){
    return {
      color: '#ff3300',
      backgroundColor: '#F5FCFF',
      flex: 1,
      textAlign: 'center'
    }
  }
}
function percent (number) {
  number = parseFloat(number)
  console.log(typeof number, '&&&&&')
  if(number >= 0){
  return {
    color: '#00cc00',
    backgroundColor: '#F5FCFF',
    flex: 1,
    textAlign: 'center'
  }
}
  if(number < 0){
    return {
      color: '#ff3300',
      backgroundColor: '#F5FCFF',
      flex: 1,
    textAlign: 'center'
    }
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
  wrapper:{
    flex:1
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