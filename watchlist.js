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
		super(props);
		
		
		this.state ={
			dataSource: new ListView.DataSource({
			rowHasChanged: (r1,r2) => r1 != r2
		}),
			loaded: false

		};
	}
	renderRow(rowData){
		return <Text style={{
				color: '#333',
				backgroundColor:'#fff',
				alignSelf: 'center'
			}}>
			{rowData}
			</Text>
		}
	

	render() {
		return (
          <View style ={{
            flex:1,
            justifyContent: 'flex-start',
            paddingTop: 100

          }}>
          <TouchableHighlight style={styles.button}> 
                    
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
		console.log('hi')
		//fetch leaderboard
		fetch('https://portfolioio.herokuapp.com/api/watchlist/12'
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
        	console.log(finalfinal,'ressppp')
        })

        
        response.json();
      })
      // .then((responseData)=>{
      //   console.log(responseData,'ressss');
      //   //this.setState({dataSource: this.state.dataSource.cloneWithRows(responseData)});
      // })
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
});

module.exports = Watchlist;